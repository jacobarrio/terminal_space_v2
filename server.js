const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

// GNews API configurations
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || 'your-gnews-api-key-here';
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

// Helper function to safely decode base64 URLs
const safeBase64Decode = (str) => {
  try {
    // Replace URL-safe chars and add padding if needed
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return Buffer.from(paddedBase64, 'base64').toString();
  } catch (error) {
    console.error('Base64 decoding error:', error);
    return str; // Return original string if decoding fails
  }
};

// Make sure all API routes are defined before the catch-all route

// Route to fetch news articles from GNews API
app.get('/api/news', async (req, res) => {
  try {
    const { category = 'general', count = 10, lang = 'en' } = req.query;
    
    // Map our category names to GNews API topics if needed
    // GNews API supports: breaking-news, world, nation, business, technology, entertainment, sports, science, health
    let topic = category;
    
    // If category is 'politics', we need to use a special search query since GNews doesn't have a direct politics topic
    if (category === 'politics') {
      // Use the search endpoint instead with a politics-related query
      const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
        params: {
          token: GNEWS_API_KEY,
          lang,
          q: 'politics OR government OR election',
          max: count
        }
      });
      
      res.json(response.data);
      return;
    }
    
    // For all other standard categories, use the top-headlines endpoint
    const response = await axios.get(`${GNEWS_BASE_URL}/top-headlines`, {
      params: {
        token: GNEWS_API_KEY,
        lang,
        topic,
        max: count
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch news articles',
      details: error.message 
    });
  }
});

// Route to get article by ID from GNews
app.get('/api/news/:articleId', async (req, res) => {
  try {
    let articleId = req.params.articleId;
    
    console.log('Article ID received:', articleId);
    
    if (!articleId) {
      console.log('No article ID provided');
      return res.status(400).json({ error: 'Article ID is required' });
    }
    
    // Try to decode the base64 encoded URL
    let originalUrl;
    try {
      originalUrl = safeBase64Decode(articleId);
      console.log('Decoded URL:', originalUrl);
    } catch (error) {
      console.error('Failed to decode article ID:', error);
      return res.status(400).json({ error: 'Invalid article ID format' });
    }
    
    // Extract meaningful search terms from the URL
    let searchTerms = [];
    try {
      if (originalUrl.startsWith('http')) {
        const url = new URL(originalUrl);
        
        // Extract meaningful terms from the path
        const pathSegments = url.pathname.split('/').filter(segment => 
          segment.length > 3 && 
          !segment.match(/^\d+$/) && // Skip numeric segments
          !['www', 'com', 'org', 'net'].includes(segment) // Skip common TLDs
        );
        
        // Get words from path segments
        pathSegments.forEach(segment => {
          // Split by non-alphanumeric characters and filter out short terms
          const words = segment.split(/[^a-zA-Z0-9]/).filter(word => word.length > 3);
          searchTerms.push(...words);
        });
        
        // If we couldn't extract good terms from the path, use the hostname
        if (searchTerms.length === 0) {
          const domain = url.hostname.replace(/^www\./, '').split('.')[0];
          if (domain.length > 3) {
            searchTerms.push(domain);
          }
        }
      }
    } catch (e) {
      console.log('URL parsing failed:', e.message);
    }
    
    // If we couldn't extract search terms, use a fallback approach
    if (searchTerms.length === 0) {
      // Try to extract any words from the URL
      const words = originalUrl.match(/[a-zA-Z]{4,}/g);
      searchTerms = words || ['news'];
    }
    
    // Limit to the most relevant terms (avoid using the entire path which can cause API errors)
    searchTerms = searchTerms.slice(0, 3);
    const searchQuery = searchTerms.join(' ');
    
    console.log('Using search query:', searchQuery);
    
    try {
      // Fetch articles based on the extracted search terms
      const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
        params: {
          token: GNEWS_API_KEY,
          q: searchQuery,
          lang: 'en',
          max: 5 // Get a few results to increase chances of finding a matching article
        }
      });
      
      if (response.data.articles && response.data.articles.length > 0) {
        console.log('Found articles:', response.data.articles.length);
        
        // Try to find the exact article if possible by comparing URLs
        const exactMatch = response.data.articles.find(article => {
          const articleUrl = article.url || '';
          return originalUrl.includes(articleUrl) || articleUrl.includes(originalUrl);
        });
        
        if (exactMatch) {
          console.log('Found exact match article:', exactMatch.title);
          return res.json(exactMatch);
        }
        
        // Otherwise return the first result
        console.log('Using first result article:', response.data.articles[0].title);
        res.json(response.data.articles[0]);
      } else {
        console.log('No articles found for search query:', searchQuery);
        
        // Try a more general query as fallback
        const fallbackResponse = await axios.get(`${GNEWS_BASE_URL}/top-headlines`, {
          params: {
            token: GNEWS_API_KEY,
            lang: 'en',
            max: 1
          }
        });
        
        if (fallbackResponse.data.articles && fallbackResponse.data.articles.length > 0) {
          console.log('Using fallback top headline article');
          res.json(fallbackResponse.data.articles[0]);
        } else {
          res.status(404).json({ error: 'No articles found' });
        }
      }
    } catch (apiError) {
      console.error('GNews API error:', apiError.message);
      
      // Try a more general endpoint as fallback
      try {
        console.log('Trying fallback to top headlines');
        const fallbackResponse = await axios.get(`${GNEWS_BASE_URL}/top-headlines`, {
          params: {
            token: GNEWS_API_KEY,
            lang: 'en',
            max: 1
          }
        });
        
        if (fallbackResponse.data.articles && fallbackResponse.data.articles.length > 0) {
          console.log('Using fallback top headline article');
          res.json(fallbackResponse.data.articles[0]);
        } else {
          res.status(404).json({ error: 'No articles found' });
        }
      } catch (fallbackError) {
        console.error('Fallback API error:', fallbackError.message);
        res.status(502).json({ 
          error: 'Failed to retrieve articles from news service',
          details: fallbackError.message 
        });
      }
    }
  } catch (error) {
    console.error('Error in article retrieval process:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch article',
      details: error.message 
    });
  }
});

// Route to summarize article content with OpenAI
app.post('/api/summarize', async (req, res) => {
  try {
    const { content, title } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Article content is required' });
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert journalist and content summarizer. Provide a concise, informative summary of the news article that captures the key information."
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${content}\n\nPlease summarize this news article in a concise way, keeping all important information and key points.`
        }
      ],
      max_tokens: 500,
    });

    res.json({ 
      summary: response.choices[0].message.content.trim()
    });
  } catch (error) {
    console.error('Error summarizing article:', error.message);
    res.status(500).json({ 
      error: 'Failed to summarize article',
      details: error.message 
    });
  }
});

// Route to analyze article bias and tone with OpenAI
app.post('/api/analyze', async (req, res) => {
  try {
    const { content, title } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Article content is required' });
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at media analysis, capable of detecting bias, tone, and sentiment in news articles. Provide a detailed analysis in JSON format."
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${content}\n\nAnalyze this news article for: 
          1. Political bias (score from -5 to 5, where -5 is heavily left-leaning, 0 is neutral, and 5 is heavily right-leaning)
          2. Emotional tone (neutral, positive, negative, alarmist, etc.)
          3. Factual reporting (high, medium, low)
          4. Overall credibility assessment
          5. Key perspectives included or omitted
          
          Return the analysis in JSON format with the following structure:
          {
            "bias": {
              "score": number,
              "explanation": string
            },
            "tone": {
              "primary": string,
              "secondary": string,
              "explanation": string
            },
            "factualReporting": {
              "rating": string,
              "explanation": string
            },
            "credibility": {
              "rating": string,
              "explanation": string
            },
            "perspectives": {
              "included": string[],
              "potentiallyOmitted": string[]
            },
            "overallAssessment": string
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysisData = JSON.parse(response.choices[0].message.content);
    res.json(analysisData);
  } catch (error) {
    console.error('Error analyzing article:', error.message);
    res.status(500).json({ 
      error: 'Failed to analyze article',
      details: error.message 
    });
  }
});

// Route for article bias and tone analysis
app.post('/api/bias-tone', async (req, res) => {
  try {
    const { content, title } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Article content is required' });
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at political and media analysis. Your task is to classify news articles by their political leaning and tone."
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${content}\n\nPlease analyze this news article and determine:
          1. Political leaning (Left, Center-Left, Center, Center-Right, Right)
          2. Primary tone (Neutral, Positive, Negative, Emotional, Factual, Sarcastic, Alarming)
          3. Confidence in your assessment (0.0 to 1.0)
          
          Return only a JSON object with the following structure:
          {
            "politicalLeaning": string,
            "tone": string,
            "confidence": number,
            "explanation": string
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysisData = JSON.parse(response.choices[0].message.content);
    res.json(analysisData);
  } catch (error) {
    console.error('Error analyzing bias and tone:', error.message);
    res.status(500).json({ 
      error: 'Failed to analyze bias and tone',
      details: error.message 
    });
  }
});

// Route to compare multiple articles
app.post('/api/compare', async (req, res) => {
  try {
    const { articles } = req.body;
    
    if (!articles || !Array.isArray(articles) || articles.length < 2) {
      return res.status(400).json({ 
        error: 'At least two articles are required for comparison' 
      });
    }

    // Format the articles for the API request
    const articlesFormatted = articles.map((article, index) => 
      `Article ${index + 1} Title: ${article.title}\nContent: ${article.content}\n\n`
    ).join('');

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at media analysis, capable of comparing how different news sources report on the same or similar topics. Provide a detailed comparison in JSON format."
        },
        {
          role: "user",
          content: `Compare the following news articles:\n\n${articlesFormatted}\n\nProvide a comparison analyzing:
          1. Key factual differences
          2. Differences in tone and framing
          3. Potential biases in each
          4. Different perspectives presented
          5. What information might be missing from each
          
          Return the analysis in JSON format with the following structure:
          {
            "factualDifferences": string,
            "toneComparison": string,
            "biasAssessment": string,
            "perspectiveDifferences": string,
            "informationGaps": string,
            "overallConclusion": string
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const comparisonData = JSON.parse(response.choices[0].message.content);
    res.json(comparisonData);
  } catch (error) {
    console.error('Error comparing articles:', error.message);
    res.status(500).json({ 
      error: 'Failed to compare articles',
      details: error.message 
    });
  }
});

// Route to search for news
app.get('/api/search', async (req, res) => {
  try {
    const { query, count = 10, lang = 'en' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
      params: {
        token: GNEWS_API_KEY,
        q: query,
        lang,
        max: count
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error searching news:', error.message);
    res.status(500).json({ 
      error: 'Failed to search news articles',
      details: error.message 
    });
  }
});

// Serve the React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
