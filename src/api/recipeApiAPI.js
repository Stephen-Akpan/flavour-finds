const RECIPE_API_BASE_URL = 'https://api.api-ninjas.com/v1/recipe';
const RECIPE_API_KEY = 'LIdEdyTuFPXVUKkfh87HI2WR15m0921Wpj8p5Ggi';

export const recipeApiAPI = {
  // Search recipes by name
  searchByName: async (query) => {
    try {
      const response = await fetch(
        `${RECIPE_API_BASE_URL}?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'X-Api-Key': RECIPE_API_KEY
          }
        }
      );
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Recipe API search error:', err);
      return [];
    }
  },

  // Search by ingredient
  searchByIngredient: async (ingredient) => {
    try {
      const response = await fetch(
        `${RECIPE_API_BASE_URL}?query=${encodeURIComponent(ingredient)}`,
        {
          headers: {
            'X-Api-Key': RECIPE_API_KEY
          }
        }
      );
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Recipe API ingredient search error:', err);
      return [];
    }
  }
};