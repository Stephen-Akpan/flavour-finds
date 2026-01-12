const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const mealDbAPI = {
  searchByName: async (query) => {
    const response = await fetch(`${MEALDB_BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];
  },
  
  getMealById: async (id) => {
    const response = await fetch(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  },
  
  getRandomMeal: async () => {
    const response = await fetch(`${MEALDB_BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals[0];
  },
  
  getByCategory: async (category) => {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
  },
  
  getByArea: async (area) => {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals || [];
  },
  
  getCategories: async () => {
    const response = await fetch(`${MEALDB_BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
  },
  
  getAreas: async () => {
    const response = await fetch(`${MEALDB_BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals || [];
  }
};