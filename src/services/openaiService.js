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
 * @returns {Promise<Object>} - Analysis data
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
        title
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Analysis failed: ${error.message}`);
    throw error;
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
