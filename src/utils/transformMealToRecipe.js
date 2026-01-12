export const transformMealToRecipe = (meal, source = 'mealdb') => {
  if (!meal) return null;
  
  if (source === 'recipeapi') {
    return transformRecipeApiToRecipe(meal);
  }
  
   const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`.trim());
    }
  }
  
  const instructions = meal.strInstructions
    ? meal.strInstructions.split(/\r?\n/).filter(step => step.trim().length > 0)
    : [];
  
  const category = meal.strCategory?.toLowerCase() || 'dinner';
  let mealTime = 'dinner';
  if (category.includes('breakfast')) mealTime = 'breakfast';
  else if (category.includes('dessert')) mealTime = 'dessert';
  
  const colorMap = {
    breakfast: { color1: '#06D6A0', color2: '#4ECDC4' },
    dessert: { color1: '#8B4513', color2: '#654321' },
    seafood: { color1: '#4ECDC4', color2: '#06D6A0' },
    default: { color1: '#FF6B6B', color2: '#FF5252' }
  };
  
  const colors = colorMap[category] || colorMap.default;
  
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    time: '30 min',
    difficulty: 'Medium',
    rating: 4.5 + Math.random() * 0.4,
    reviews: Math.floor(Math.random() * 1000) + 100,
    description: meal.strInstructions?.substring(0, 150) + '...' || 'Delicious recipe',
    badge: meal.strCategory || 'Popular',
    category: mealTime,
    mealTime: mealTime,
    cuisine: meal.strArea || 'International',
    chef: 'Chef ' + (meal.strArea || 'International'),
    color1: colors.color1,
    color2: colors.color2,
    ingredients: ingredients,
    instructions: instructions,
    servings: 4,
    calories: 450,
    thumbnail: meal.strMealThumb,
    youtubeLink: meal.strYouTube,
    source: meal.strSource,
    _source: 'mealdb'
  };
};

// Transform Recipe API format to standardized format
const transformRecipeApiToRecipe = (recipe) => {
  // Parse ingredients and their measurements
  const ingredients = recipe.ingredients 
    ? recipe.ingredients.split('|').map(ing => ing.trim())
    : [];

  // Parse instructions
  const instructions = recipe.instructions
    ? recipe.instructions.split('.').filter(step => step.trim().length > 0).map(s => s.trim() + '.')
    : [];

  // Estimate difficulty based on ingredient count
  let difficulty = 'Easy';
  if (ingredients.length > 10) difficulty = 'Hard';
  else if (ingredients.length > 6) difficulty = 'Medium';

  return {
    id: recipe.title ? recipe.title.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36),
    title: recipe.title || 'Untitled Recipe',
    time: recipe.cook_time ? `${recipe.cook_time} min` : '30 min',
    difficulty: difficulty,
    rating: 4.0 + Math.random() * 0.9,
    reviews: Math.floor(Math.random() * 500) + 50,
    description: recipe.instructions?.substring(0, 150) + '...' || 'Delicious recipe from Recipe API',
    badge: 'Popular',
    category: 'dinner',
    mealTime: 'dinner',
    cuisine: 'International',
    chef: 'Chef International',
    color1: '#FF6B6B',
    color2: '#FF5252',
    ingredients: ingredients,
    instructions: instructions,
    servings: recipe.servings || 4,
    calories: recipe.calories || 450,
    thumbnail: null,
    youtubeLink: null,
    source: null,
    _source: 'recipeapi'
  };
};