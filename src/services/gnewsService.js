/**
 * Service for interacting with the GNews API through our backend proxy
 */

// Helper function for making API requests
const fetchData = async (endpoint, params = {}) => {
  try {
    // Build query string from params
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `Server responded with status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

/**
 * Fetch top news articles by category
 * @param {string} category - News category (e.g., 'general', 'technology', 'sports')
 * @param {number} count - Number of articles to retrieve
 * @returns {Promise<Object>} - GNews API response
 */
export const fetchTopNews = async (category = 'general', count = 10) => {
  return fetchData('/api/news', { category, count });
};

/**
 * Search for news articles by keyword
 * @param {string} query - Search keywords
 * @param {number} count - Number of articles to retrieve
 * @returns {Promise<Object>} - GNews API response
 */
export const searchNews = async (query, count = 10) => {
  return fetchData('/api/search', { query, count });
};

/**
 * Get a specific article by its ID (which is actually its URL)
 * @param {string} id - Article identifier (URL)
 * @returns {Promise<Object>} - Article data
 */
export const getArticleById = async (id) => {
  // In a real app, we'd have a proper ID system
  // For this prototype, we're using the URL as the ID
  try {
    // With our new base64 encoding strategy, we don't need to re-encode the ID
    // It's already in a URL-safe format
    const response = await fetch(`/api/news/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Server responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to get article: ${error.message}`);
    throw error;
  }
};
