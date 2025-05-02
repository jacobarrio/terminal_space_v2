/**
 * Service for interacting with OpenAI API through our backend proxy
 */

/**
 * Summarize an article using OpenAI
 * @param {string} content - The article content to summarize
 * @param {string} title - The title of the article
 * @returns {Promise<Object>} - Summary data
 */
export const summarizeArticle = async (content, title = '') => {
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        title
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Summarization failed: ${error.message}`);
    throw error;
  }
};

/**
 * Analyze an article for bias, tone, and factual reporting
 * @param {string} content - The article content to analyze
 * @param {string} title - The title of the article
 * @returns {Promise<Object>} - Analysis data including political leaning and tone
 */
export const analyzeArticle = async (content, title = '') => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        title,
        analysisType: 'comprehensive'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Store in localStorage for offline access
    if (data && typeof window !== 'undefined' && window.localStorage) {
      try {
        // Get existing analyses cache or create a new one
        const analysisCache = JSON.parse(localStorage.getItem('terminal_space_analyses') || '{}');
        
        // Create a hash/key of the content to use as identifier
        const contentKey = btoa(title + content.substring(0, 100)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        // Add this analysis to the cache
        analysisCache[contentKey] = {
          ...data,
          timestamp: Date.now()
        };
        
        // Store back in localStorage with 24-hour expiry check handled when reading
        localStorage.setItem('terminal_space_analyses', JSON.stringify(analysisCache));
      } catch (e) {
        console.error('Failed to cache analysis:', e);
      }
    }

    return data;
  } catch (error) {
    console.error(`Analysis failed: ${error.message}`);
    
    // Try to get cached analysis if available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const analysisCache = JSON.parse(localStorage.getItem('terminal_space_analyses') || '{}');
        const contentKey = btoa(title + content.substring(0, 100)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        if (analysisCache[contentKey]) {
          const cachedAnalysis = analysisCache[contentKey];
          // Check if the cache is less than 24 hours old
          if (Date.now() - cachedAnalysis.timestamp < 24 * 60 * 60 * 1000) {
            console.log('Using cached analysis');
            return cachedAnalysis;
          }
        }
      } catch (e) {
        console.error('Failed to retrieve cached analysis:', e);
      }
    }
    
    throw error;
  }
};

/**
 * Get a political leaning and tone analysis for an article
 * @param {string} content - The article content to analyze
 * @param {string} title - The title of the article
 * @returns {Promise<Object>} - Political leaning and tone analysis
 */
export const getBiasToneAnalysis = async (content, title = '') => {
  try {
    const response = await fetch('/api/bias-tone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        title
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Default analysis if API fails to return expected format
    if (!data.politicalLeaning || !data.tone) {
      return {
        politicalLeaning: 'Center',
        tone: 'Neutral',
        confidence: 0.5
      };
    }
    
    // Store in localStorage for offline access
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Get existing bias analyses cache or create a new one
        const biasCache = JSON.parse(localStorage.getItem('terminal_space_bias_analyses') || '{}');
        
        // Create a hash/key of the content to use as identifier
        const contentKey = btoa(title + content.substring(0, 100)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        // Add this analysis to the cache
        biasCache[contentKey] = {
          ...data,
          timestamp: Date.now()
        };
        
        // Store back in localStorage with 24-hour expiry check handled when reading
        localStorage.setItem('terminal_space_bias_analyses', JSON.stringify(biasCache));
      } catch (e) {
        console.error('Failed to cache bias analysis:', e);
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Bias/tone analysis failed: ${error.message}`);
    
    // Try to get cached analysis if available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const biasCache = JSON.parse(localStorage.getItem('terminal_space_bias_analyses') || '{}');
        const contentKey = btoa(title + content.substring(0, 100)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        if (biasCache[contentKey]) {
          const cachedAnalysis = biasCache[contentKey];
          // Check if the cache is less than 24 hours old
          if (Date.now() - cachedAnalysis.timestamp < 24 * 60 * 60 * 1000) {
            console.log('Using cached bias analysis');
            return cachedAnalysis;
          }
        }
      } catch (e) {
        console.error('Failed to retrieve cached bias analysis:', e);
      }
    }
    
    // Return a fallback if no cached data available
    return {
      politicalLeaning: 'Center',
      tone: 'Neutral',
      confidence: 0.5
    };
  }
};

/**
 * Compare multiple articles to analyze differences
 * @param {Array} articles - Array of article objects to compare
 * @returns {Promise<Object>} - Comparison data
 */
export const compareArticles = async (articles) => {
  try {
    const response = await fetch('/api/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articles
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Comparison failed: ${error.message}`);
    throw error;
  }
};
