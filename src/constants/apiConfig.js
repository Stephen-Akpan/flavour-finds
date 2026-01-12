export const API_CONFIG = {
  // Recipe API Configuration
  RECIPE_API: {
    BASE_URL: 'https://api.api-ninjas.com/v1/recipe',
    API_KEY: process.env.REACT_APP_RECIPE_API_KEY || 'LIdEdyTuFPXVUKkfh87HI2WR15m0921Wpj8p5Ggi',
    ENABLED: false // Set to true to enable Recipe API
  },

  // MealDB Configuration
  MEALDB: {
    BASE_URL: 'https://www.themealdb.com/api/json/v1/1',
    ENABLED: true // Always enabled as primary source
  },

  // Default source when both are available
  DEFAULT_SOURCE: 'mealdb', // 'mealdb', 'recipeapi', or 'both'

  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 10000,

  // Cache duration in minutes
  CACHE_DURATION: 60
};