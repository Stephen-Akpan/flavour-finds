import { mealDbAPI } from './mealDbAPI';
import { recipeApiAPI } from './recipeApiAPI';

export const UnifiedAPI = {
  // Configuration for API sources
  sources: {
    mealdb: true,
    recipeapi: false // Set to true to enable
  },

  // Search recipes from one or both sources
  searchByName: async (query, { useMealDB = true, useRecipeAPI = false } = {}) => {
    const results = [];

    if (useMealDB) {
      try {
        const mealDbResults = await mealDbAPI.searchByName(query);
        results.push({
          source: 'mealdb',
          data: mealDbResults
        });
      } catch (err) {
        console.error('MealDB search error:', err);
      }
    }

    if (useRecipeAPI) {
      try {
        const recipeApiResults = await recipeApiAPI.searchByName(query);
        results.push({
          source: 'recipeapi',
          data: recipeApiResults
        });
      } catch (err) {
        console.error('Recipe API search error:', err);
      }
    }

    return results;
  },

  // Merge results from both sources
  searchByNameMerged: async (query, { useMealDB = true, useRecipeAPI = false } = {}) => {
    const allResults = await UnifiedAPI.searchByName(query, { useMealDB, useRecipeAPI });
    const mergedData = [];

    allResults.forEach(result => {
      mergedData.push(...result.data.map(item => ({
        ...item,
        _source: result.source
      })));
    });

    return mergedData;
  },

  // Get random meals from primary source
  getRandomMeal: async () => {
    try {
      return await mealDbAPI.getRandomMeal();
    } catch (err) {
      console.error('Error getting random meal:', err);
      return null;
    }
  },

  // Get meal by ID
  getMealById: async (id) => {
    try {
      return await mealDbAPI.getMealById(id);
    } catch (err) {
      console.error('Error getting meal by ID:', err);
      return null;
    }
  },

  // Get by category
  getByCategory: async (category) => {
    try {
      return await mealDbAPI.getByCategory(category);
    } catch (err) {
      console.error('Error getting by category:', err);
      return [];
    }
  },

  // Get by area
  getByArea: async (area) => {
    try {
      return await mealDbAPI.getByArea(area);
    } catch (err) {
      console.error('Error getting by area:', err);
      return [];
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      return await mealDbAPI.getCategories();
    } catch (err) {
      console.error('Error getting categories:', err);
      return [];
    }
  },

  // Get areas
  getAreas: async () => {
    try {
      return await mealDbAPI.getAreas();
    } catch (err) {
      console.error('Error getting areas:', err);
      return [];
    }
  },

  // Toggle API sources
  setSource: (source, enabled) => {
    if (source === 'mealdb' || source === 'recipeapi') {
      UnifiedAPI.sources[source] = enabled;
    }
  },

  // Get active sources
  getActiveSources: () => {
    return Object.entries(UnifiedAPI.sources)
      .filter(([_, enabled]) => enabled)
      .map(([source, _]) => source);
  }
};