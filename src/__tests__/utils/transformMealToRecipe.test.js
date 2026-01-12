import { transformMealToRecipe } from '../../utils/transformMealToRecipe';

describe('transformMealToRecipe', () => {
  const mockMealDBMeal = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strInstructions: 'Preheat oven. Mix ingredients. Bake. Serve hot.',
    strMealThumb: 'https://example.com/image.jpg',
    strYouTube: 'https://youtube.com/watch',
    strSource: 'https://example.com/recipe',
    strIngredient1: 'Chicken',
    strMeasure1: '500g',
    strIngredient2: 'Teriyaki Sauce',
    strMeasure2: '200ml'
  };

  test('should return null for null meal', () => {
    const result = transformMealToRecipe(null);
    expect(result).toBeNull();
  });

  test('should transform MealDB meal correctly', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(result).toBeDefined();
    expect(result.id).toBe('52772');
    expect(result.title).toBe('Teriyaki Chicken Casserole');
  });

  test('should extract ingredients with measurements', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(result.ingredients.length).toBeGreaterThan(0);
    expect(result.ingredients[0]).toContain('500g');
    expect(result.ingredients[0]).toContain('Chicken');
  });

  test('should parse instructions into array', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(Array.isArray(result.instructions)).toBe(true);
    expect(result.instructions.length).toBeGreaterThan(0);
  });

  test('should map category to meal time', () => {
    const breakfast = { ...mockMealDBMeal, strCategory: 'Breakfast' };
    const result = transformMealToRecipe(breakfast, 'mealdb');
    expect(result.mealTime).toBe('breakfast');
  });

  test('should set default meal time for unknown category', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(['breakfast', 'dessert', 'dinner']).toContain(result.mealTime);
  });

  test('should assign colors based on category', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(result.color1).toBeDefined();
    expect(result.color2).toBeDefined();
    expect(result.color1).toMatch(/^#[0-9A-F]{6}$/i);
  });

  test('should set default values for missing fields', () => {
    const minimal = {
      idMeal: '123',
      strMeal: 'Test Meal'
    };
    const result = transformMealToRecipe(minimal, 'mealdb');
    expect(result.time).toBe('30 min');
    expect(result.difficulty).toBe('Medium');
    expect(result.servings).toBe(4);
    expect(result.calories).toBe(450);
  });

  test('should include thumbnail image', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(result.thumbnail).toBe(mockMealDBMeal.strMealThumb);
  });

  test('should include YouTube link', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(result.youtubeLink).toBe(mockMealDBMeal.strYouTube);
  });

  test('should include source link', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(result.source).toBe(mockMealDBMeal.strSource);
  });

  test('should generate rating between 4.5 and 4.9', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(result.rating).toBeGreaterThanOrEqual(4.5);
    expect(result.rating).toBeLessThanOrEqual(4.9);
  });

  test('should handle empty ingredients list', () => {
    const meal = { ...mockMealDBMeal, strIngredient1: null };
    const result = transformMealToRecipe(meal, 'mealdb');
    expect(Array.isArray(result.ingredients)).toBe(true);
  });

  test('should handle missing instructions', () => {
    const meal = { ...mockMealDBMeal, strInstructions: null };
    const result = transformMealToRecipe(meal, 'mealdb');
    expect(Array.isArray(result.instructions)).toBe(true);
  });

  test('should mark source as mealdb', () => {
    const result = transformMealToRecipe(mockMealDBMeal, 'mealdb');
    expect(result._source).toBe('mealdb');
  });
});
