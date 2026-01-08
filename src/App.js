import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, User, Plus, Clock, Signal, Star, Bookmark, Share2, X, ChevronLeft, Mail, Lock, Eye, EyeOff, Menu, Loader } from 'lucide-react';

// API Helper Functions
const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const mealDbAPI = {
  // Search meals by name
  searchByName: async (query) => {
    const response = await fetch(`${MEALDB_BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];
  },
  
  // Get meal by ID
  getMealById: async (id) => {
    const response = await fetch(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  },
  
  // Get random meals
  getRandomMeal: async () => {
    const response = await fetch(`${MEALDB_BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals[0];
  },
  
  // Get meals by category
  getByCategory: async (category) => {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
  },
  
  // Get meals by area (cuisine)
  getByArea: async (area) => {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals || [];
  },
  
  // List all categories
  getCategories: async () => {
    const response = await fetch(`${MEALDB_BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
  },
  
  // List all areas
  getAreas: async () => {
    const response = await fetch(`${MEALDB_BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals || [];
  }
};

// Transform MealDB data to app format
const transformMealToRecipe = (meal) => {
  if (!meal) return null;
  
  // Extract ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`.trim());
    }
  }
  
  // Split instructions into steps
  const instructions = meal.strInstructions
    ? meal.strInstructions.split(/\r?\n/).filter(step => step.trim().length > 0)
    : [];
  
  // Determine meal time category
  const category = meal.strCategory?.toLowerCase() || 'dinner';
  let mealTime = 'dinner';
  if (category.includes('breakfast')) mealTime = 'breakfast';
  else if (category.includes('dessert')) mealTime = 'dessert';
  
  // Generate colors based on category
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
    time: '30 min', // MealDB doesn't provide time, default value
    difficulty: 'Medium', // Default difficulty
    rating: 4.5 + Math.random() * 0.4, // Generate random rating 4.5-4.9
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
    servings: 4, // Default servings
    calories: 450, // Default calories
    thumbnail: meal.strMealThumb,
    youtubeLink: meal.strYouTube,
    source: meal.strSource
  };
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [userName, setUserName] = useState('Food Lover');
  
  // NEW: API state management
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load savedRecipes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedRecipes');
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  // Save savedRecipes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  // NEW: Load initial recipes on mount
  useEffect(() => {
    loadInitialRecipes();
    loadCategories();
  }, []);

  const loadInitialRecipes = async () => {
    setLoading(true);
    try {
      // Load random meals for recommended section
      const randomMeals = await Promise.all(
        Array(8).fill().map(() => mealDbAPI.getRandomMeal())
      );
      const transformedRecipes = randomMeals.map(transformMealToRecipe);
      setRecipes(transformedRecipes);
      setRecommendedRecipes(transformedRecipes.slice(0, 4));
    } catch (err) {
      setError('Failed to load recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await mealDbAPI.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // NEW: Search recipes from API
  const searchRecipes = async (query) => {
    if (!query.trim()) {
      loadInitialRecipes();
      return;
    }
    
    setLoading(true);
    try {
      const results = await mealDbAPI.searchByName(query);
      const transformedResults = results.map(transformMealToRecipe);
      setRecipes(transformedResults);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Load recipes by filter
  const loadRecipesByFilter = async (filter) => {
    setLoading(true);
    try {
      let meals = [];
      
      // Map filter types to MealDB categories/areas
      const categoryMap = {
        breakfast: 'Breakfast',
        dessert: 'Dessert',
        lunch: 'Beef', // MealDB doesn't have lunch, using Beef as substitute
        dinner: 'Chicken',
        vegetarian: 'Vegetarian'
      };
      
      const areaMap = {
        italian: 'Italian',
        mexican: 'Mexican',
        thai: 'Thai',
        french: 'French',
        american: 'American',
        mediterranean: 'Greek' // Using Greek for Mediterranean
      };
      
      if (filter === 'all') {
        // Load random meals
        const randomMeals = await Promise.all(
          Array(12).fill().map(() => mealDbAPI.getRandomMeal())
        );
        meals = randomMeals;
      } else if (categoryMap[filter]) {
        const results = await mealDbAPI.getByCategory(categoryMap[filter]);
        // Get full details for first 12 meals
        const detailPromises = results.slice(0, 12).map(m => mealDbAPI.getMealById(m.idMeal));
        meals = await Promise.all(detailPromises);
      } else if (areaMap[filter]) {
        const results = await mealDbAPI.getByArea(areaMap[filter]);
        // Get full details for first 12 meals
        const detailPromises = results.slice(0, 12).map(m => mealDbAPI.getMealById(m.idMeal));
        meals = await Promise.all(detailPromises);
      }
      
      const transformedMeals = meals.filter(m => m !== null).map(transformMealToRecipe);
      setRecipes(transformedMeals);
    } catch (err) {
      setError('Failed to load recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // NEW: Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      searchRecipes(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const mostUsedRecipes = useMemo(() => 
    recipes.sort((a, b) => b.reviews - a.reviews).slice(0, 4), 
    [recipes]
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      setCurrentPage('search');
    }
  }, [searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // NEW: Load recipes when filter changes
  useEffect(() => {
    if (currentPage === 'recommended') {
      loadRecipesByFilter(filterType);
    }
  }, [filterType]);

  const toggleSaveRecipe = useCallback((recipeId) => {
    setSavedRecipes(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setSavedRecipes([]);
    setCurrentPage('home');
  };

  const handleShare = useCallback((recipe) => {
    const url = recipe.source || window.location.href;
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
    }
  }, []);

  const RecipeSVG = ({ color1, color2, thumbnail }) => {
    // If thumbnail exists, use it as background
    if (thumbnail) {
      return (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      );
    }
    
    // Fallback to SVG
    return (
      <svg width="100%" height="100%" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad${color1}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color1, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color2, stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>
        <rect width="300" height="220" fill={`url(#grad${color1})`} />
        <circle cx="150" cy="110" r="60" fill={color1} opacity="0.6" />
        <circle cx="120" cy="90" r="30" fill={color2} opacity="0.5" />
        <circle cx="180" cy="130" r="35" fill={color1} opacity="0.4" />
        <path d="M 100 180 Q 150 160 200 180" stroke={color2} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  };

  const RecipeCard = React.memo(({ recipe }) => (
    <div 
      className="recipe-card"
      onClick={() => {
        setSelectedRecipe(recipe);
        setCurrentPage('recipe');
      }}
    >
      <div className="recipe-img">
        <RecipeSVG color1={recipe.color1} color2={recipe.color2} thumbnail={recipe.thumbnail} />
        <span className="recipe-badge">{recipe.badge}</span>
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-meta">
          <span className="flex items-center gap-1">
            <Clock size={16} /> {recipe.time}
          </span>
          <span className="flex items-center gap-1">
            <Signal size={16} /> {recipe.difficulty}
          </span>
        </div>
        <p className="recipe-desc">{recipe.description}</p>
        <div className="recipe-footer">
          <div className="recipe-rating">
            <Star size={16} fill="currentColor" />
            <span>{recipe.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--gray)', fontWeight: 'normal' }}>({recipe.reviews})</span>
          </div>
          <div className="recipe-actions">
            <button 
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (!isLoggedIn) {
                  setShowAuthModal(true);
                } else {
                  toggleSaveRecipe(recipe.id);
                }
              }}
              style={{
                background: savedRecipes.includes(recipe.id) ? 'var(--primary)' : '#F7F9FC',
                color: savedRecipes.includes(recipe.id) ? 'white' : 'var(--gray)'
              }}
            >
              <Bookmark size={18} fill={savedRecipes.includes(recipe.id) ? 'currentColor' : 'none'} />
            </button>
            <button 
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleShare(recipe);
              }}
              aria-label={`Share ${recipe.title}`}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  ));

  const LoadingSpinner = () => (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Loader size={48} className="spinner" style={{ color: 'var(--primary)' }} />
      <p style={{ marginTop: '20px', color: 'var(--gray)' }}>Loading delicious recipes...</p>
    </div>
  );

  const HomePage = () => (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Amazing <span>Recipes</span> From Around The World</h1>
          <p>Join our community of food lovers and explore thousands of recipes, cooking tips, and culinary inspiration for every occasion and skill level.</p>
          <button className="btn btn-primary" style={{ padding: '18px 38px', fontSize: '1.15rem' }}
            onClick={() => {
              setFilterType('all');
              setCurrentPage('recommended');
            }}>
            <span>🔥</span> Explore Trending Recipes
          </button>
        </div>
        <div className="hero-image">
          <svg width="450" height="450" viewBox="0 0 450 450" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="225" cy="380" rx="180" ry="30" fill="#E0E0E0" opacity="0.3"/>
            <circle cx="225" cy="200" r="150" fill="#FFE8E8"/>
            <ellipse cx="225" cy="200" rx="130" ry="125" fill="#FFF5F5"/>
            <circle cx="225" cy="170" r="70" fill="#FFD166"/>
            <ellipse cx="210" cy="160" rx="25" ry="20" fill="#FF6B6B" opacity="0.8"/>
            <ellipse cx="240" cy="165" rx="20" ry="18" fill="#4ECDC4" opacity="0.8"/>
            <ellipse cx="225" cy="185" rx="18" ry="15" fill="#06D6A0" opacity="0.8"/>
            <path d="M 180 220 Q 225 250 270 220" stroke="#2D3047" strokeWidth="6" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </section>

      <section>
        <h2 className="section-title">Browse by Category</h2>
        <div className="categories">
          {[
            { icon: '🍳', name: 'Breakfast', filter: 'breakfast' },
            { icon: '🍔', name: 'Lunch', filter: 'lunch' },
            { icon: '🍗', name: 'Dinner', filter: 'dinner' },
            { icon: '🍰', name: 'Desserts', filter: 'dessert' },
            { icon: '🥗', name: 'Vegetarian', filter: 'vegetarian' },
            { icon: '⚡', name: 'Quick Meals', filter: 'all' }
          ].map((cat, idx) => (
            <div 
              key={idx} 
              className="category-card"
              onClick={() => {
                setFilterType(cat.filter);
                setCurrentPage('recommended');
              }}
              tabIndex={0}
              role="button"
              aria-label={`Browse ${cat.name} recipes`}
            >
              <div className="category-icon" style={{ fontSize: '2.5rem' }}>{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2 className="section-title">Recommended For You</h2>
          <a 
            href="#" 
            className="view-all"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('recommended');
              setFilterType('all');
            }}
          >
            View All →
          </a>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="recipes-grid">
            {recommendedRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="section-header">
          <h2 className="section-title">Most Popular Recipes</h2>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="recipes-grid">
            {mostUsedRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </>
  );

  const RecipePage = () => {
    if (!selectedRecipe) return null;

    return (
      <div className="recipe-page">
        <button className="back-btn" onClick={() => setCurrentPage('home')}>
          <ChevronLeft size={20} /> Back to Recipes
        </button>

        <div className="recipe-header-section">
          <div className="recipe-hero-img">
            <RecipeSVG color1={selectedRecipe.color1} color2={selectedRecipe.color2} thumbnail={selectedRecipe.thumbnail} />
          </div>
          <div className="recipe-header-info">
            <span className="recipe-badge">{selectedRecipe.badge}</span>
            <h1>{selectedRecipe.title}</h1>
            <p className="recipe-description">{selectedRecipe.description}</p>
            
            <div className="recipe-stats">
              <div className="stat">
                <Clock size={24} />
                <div>
                  <strong>{selectedRecipe.time}</strong>
                  <span>Total Time</span>
                </div>
              </div>
              <div className="stat">
                <Signal size={24} />
                <div>
                  <strong>{selectedRecipe.difficulty}</strong>
                  <span>Difficulty</span>
                </div>
              </div>
              <div className="stat">
                <span style={{ fontSize: '24px' }}>🍽️</span>
                <div>
                  <strong>{selectedRecipe.servings} servings</strong>
                  <span>{selectedRecipe.calories} cal/serving</span>
                </div>
              </div>
              <div className="stat">
                <Star size={24} fill="#FFC107" color="#FFC107" />
                <div>
                  <strong>{selectedRecipe.rating.toFixed(1)}</strong>
                  <span>{selectedRecipe.reviews} reviews</span>
                </div>
              </div>
            </div>

            <div className="recipe-actions-bar">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowAuthModal(true);
                  } else {
                    toggleSaveRecipe(selectedRecipe.id);
                  }
                }}
              >
                <Bookmark size={20} fill={savedRecipes.includes(selectedRecipe.id) ? 'currentColor' : 'none'} />
                {savedRecipes.includes(selectedRecipe.id) ? 'Saved' : 'Save Recipe'}
              </button>
              <button className="btn btn-outline" onClick={() => handleShare(selectedRecipe)}>
                <Share2 size={20} /> Share
              </button>
              {selectedRecipe.youtubeLink && (
                <button className="btn btn-outline" onClick={() => window.open(selectedRecipe.youtubeLink, '_blank')}>
                  📺 Watch Video
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="recipe-details">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {selectedRecipe.ingredients.map((ingredient, idx) => (
                <li key={idx}>
                  <input type="checkbox" id={`ingredient-${idx}`} />
                  <label htmlFor={`ingredient-${idx}`}>{ingredient}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {selectedRecipe.instructions.map((instruction, idx) => (
                <li key={idx}>
                  <span className="step-number">{idx + 1}</span>
                  <p>{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  };

  const SearchPage = () => {
    return (
      <div className="search-page">
        <div className="page-header">
          <h1>Search Recipes</h1>
          <p>Find your perfect recipe from our collection</p>
        </div>

        {searchQuery ? (
          <>
            <div className="search-results-header">
              <h2>Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} for "{searchQuery}"</h2>
            </div>
            {loading ? <LoadingSpinner /> : recipes.length > 0 ? (
              <div className="recipes-grid">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No recipes found</h3>
                <p>Try searching for something else</p>
              </div>
            )}
          </>
        ) : (
          <div className="search-suggestions">
            <h2>Popular Searches</h2>
            <div className="search-tags">
              {['Chicken', 'Pasta', 'Dessert', 'Vegetarian', 'Soup', 'Beef', 'Seafood', 'Rice'].map(tag => (
                <button 
                  key={tag}
                  className="search-tag"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <h2 style={{ marginTop: '50px' }}>Trending Recipes</h2>
            {loading ? <LoadingSpinner /> : (
              <div className="recipes-grid">
                {recipes.slice(0, 8).map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const RecommendedPage = () => {
    return (
      <div className="recommended-page">
        <div className="page-header">
          <h1>Recommended Recipes</h1>
          <p>Discover recipes tailored to your taste</p>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <h3>By Meal Time</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filterType === 'breakfast' ? 'active' : ''}`}
                onClick={() => setFilterType('breakfast')}
              >
                🍳Breakfast
              </button>
              <button 
                className={`filter-btn ${filterType === 'lunch' ? 'active' : ''}`}
                onClick={() => setFilterType('lunch')}
              >
                🍔 Lunch
              </button>
              <button 
                className={`filter-btn ${filterType === 'dinner' ? 'active' : ''}`}
                onClick={() => setFilterType('dinner')}
              >
                🍗Dinner
              </button>
              <button 
                className={`filter-btn ${filterType === 'dessert' ? 'active' : ''}`}
                onClick={() => setFilterType('dessert')}
              >
                🍰Dessert
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3>By Cuisine</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'italian' ? 'active' : ''}`}
                onClick={() => setFilterType('italian')}
              >
                🇮🇹 Italian
              </button>
              <button 
                className={`filter-btn ${filterType === 'mexican' ? 'active' : ''}`}
                onClick={() => setFilterType('mexican')}
              >
                🇲🇽 Mexican
              </button>
              <button 
                className={`filter-btn ${filterType === 'thai' ? 'active' : ''}`}
                onClick={() => setFilterType('thai')}
              >
                🇹🇭 Thai
              </button>
              <button 
                className={`filter-btn ${filterType === 'french' ? 'active' : ''}`}
                onClick={() => setFilterType('french')}
              >
                🇫🇷 French
              </button>
              <button 
                className={`filter-btn ${filterType === 'american' ? 'active' : ''}`}
                onClick={() => setFilterType('american')}
              >
                🇺🇸 American
              </button>
            </div>
          </div>
        </div>

        <div className="filtered-results">
          <h2>{recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}</h2>
          {loading ? <LoadingSpinner /> : (
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ProfilePage = () => {
    const userSavedRecipes = recipes.filter(recipe => savedRecipes.includes(recipe.id));

    return (
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="60" fill="var(--primary)"/>
              <circle cx="60" cy="45" r="25" fill="#FFF"/>
              <path d="M 60 70 C 35 70, 30 100, 60 100 C 90 100, 85 70, 60 70" fill="#FFF"/>
            </svg>
          </div>
          <div className="profile-info">
            <h1>{userName}</h1>
            <p>{email || 'food.lover@email.com'}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <strong>{savedRecipes.length}</strong>
                <span>Saved Recipes</span>
              </div>
              <div className="stat-item">
                <strong>1</strong>
                <span>Followed Chefs</span>
              </div>
              <div className="stat-item">
                <strong>12</strong>
                <span>Recipes Cooked</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <h2>My Saved Recipes</h2>
          {isLoggedIn && userSavedRecipes.length > 0 ? (
            <div className="recipes-grid">
              {userSavedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : isLoggedIn ? (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <h3>No saved recipes yet</h3>
              <p>Start exploring and save your favorite recipes!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setCurrentPage('home')}
              >
                Browse Recipes
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔒</div>
              <h3>Sign in to see your saved recipes</h3>
              <p>Create an account to save and organize your favorite recipes</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AuthModal = React.memo(() => (
    <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowAuthModal(false)}>
          <X size={24} />
        </button>

        <h2>{authMode === 'signin' ? 'Welcome Back!' : 'Create Account'}</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>
          {authMode === 'signin' 
            ? 'Sign in to save recipes and access your collection' 
            : 'Join FlavorFinds to discover and save amazing recipes'}
        </p>

        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={20} />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
            {authMode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          {authMode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setAuthMode('signup')}>Sign Up</button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setAuthMode('signin')}>Sign In</button>
            </p>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <div className="app">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        :root {
          --primary: #FF6B6B;
          --secondary: #4ECDC4;
          --accent: #FFD166;
          --dark: #2D3047;
          --light: #F7F9FC;
          --gray: #6C757D;
          --success: #06D6A0;
        }

        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #F7F9FC 0%, #EDF2F7 100%);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          gap: 20px;
          position: relative;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--primary);
          cursor: pointer;
          z-index: 101;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: var(--dark);
          z-index: 101;
        }

        .nav-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--dark);
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .nav-links a:hover {
          color: var(--primary);
          background: rgba(255, 107, 107, 0.1);
        }

        .user-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .btn {
          padding: 12px 28px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary) 0%, #ff5252 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .btn-outline {
          background-color: transparent;
          border: 2px solid var(--primary);
          color: var(--primary);
        }

        .btn-outline:hover {
          background-color: var(--primary);
          color: white;
        }

        .search-bar {
          display: flex;
          margin: 10px 0;
          max-width: 700px;
        }

        .search-bar input {
          flex: 1;
          padding: 14px 24px;
          border: 3px solid #E9ECEF;
          border-radius: 50px 0 0 50px;
          font-size: 1rem;
          outline: none;
          background: white;
        }

        .search-bar input:focus {
          border-color: var(--primary);
        }

        .search-bar button {
          padding: 0 28px;
          background: linear-gradient(135deg, var(--primary) 0%, #ff5252 100%);
          color: white;
          border: none;
          border-radius: 0 50px 50px 0;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero {
          padding: 80px 0;
          display: flex;
          align-items: center;
          gap: 60px;
        }

        .hero-content {
          flex: 1;
        }

        .hero h1 {
          font-size: 4rem;
          line-height: 1.2;
          margin-bottom: 25px;
          color: var(--dark);
        }

        .hero h1 span {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          font-size: 1.25rem;
          color: var(--gray);
          margin-bottom: 35px;
          max-width: 600px;
        }

        .hero-image {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        section {
          margin-bottom: 100px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 2.5rem;
          color: var(--dark);
          position: relative;
          padding-bottom: 15px;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 80px;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 3px;
        }

        .view-all {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }

        .categories {
          display: flex;
          gap: 25px;
          overflow-x: auto;
          padding: 15px 0;
        }

        .category-card {
          min-width: 200px;
          background: white;
          border-radius: 20px;
          padding: 35px 25px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
          cursor: pointer;
        }

        .category-card:hover {
          transform: translateY(-10px);
          background: linear-gradient(135deg, var(--primary), #ff5252);
          color: white;
        }

        .category-icon {
          margin-bottom: 15px;
        }

        .category-name {
          font-weight: 600;
          font-size: 1.15rem;
        }

        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 35px;
        }

        .recipe-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
          cursor: pointer;
        }

        .recipe-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .recipe-img {
          height: 220px;
          width: 100%;
          position: relative;
        }

        .recipe-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, var(--accent), #FFE066);
          color: var(--dark);
          padding: 8px 18px;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 700;
          z-index: 2;
        }

        .recipe-content {
          padding: 25px;
        }

        .recipe-title {
          font-size: 1.4rem;
          margin-bottom: 12px;
          color: var(--dark);
          font-weight: 700;
        }

        .recipe-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          color: var(--gray);
          font-size: 0.95rem;
        }

        .recipe-desc {
          color: var(--gray);
          margin-bottom: 20px;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .recipe-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 2px solid #F0F0F0;
        }

        .recipe-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #FFC107;
          font-weight: 600;
        }

        .recipe-actions {
          display: flex;
          gap: 15px;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .gap-1 {
          gap: 0.25rem;
        }

        .recipe-page {
          padding: 40px 0;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
        }

        .back-btn:hover {
          transform: translateX(-5px);
        }

        .recipe-header-section {
          background: white;
          border-radius: 20px;
          padding: 50px;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }

        .recipe-hero-img {
          width: 100%;
          height: 400px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .recipe-header-info h1 {
          font-size: 3rem;
          margin: 15px 0 20px;
          color: var(--dark);
        }

        .recipe-description {
          font-size: 1.2rem;
          color: var(--gray);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .recipe-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
          margin-bottom: 35px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: var(--light);
          border-radius: 15px;
        }

        .stat strong {
          display: block;
          font-size: 1.1rem;
          color: var(--dark);
        }

        .stat span {
          font-size: 0.9rem;
          color: var(--gray);
        }

        .recipe-actions-bar {
          display: flex;
          gap: 15px;
        }

        .recipe-details {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 40px;
        }

        .ingredients-section,
        .instructions-section {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .ingredients-section h2,
        .instructions-section h2 {
          font-size: 2rem;
          margin-bottom: 25px;
          color: var(--dark);
        }

        .ingredients-list {
          list-style: none;
        }

        .ingredients-list li {
          padding: 15px;
          border-bottom: 1px solid #F0F0F0;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .ingredients-list input[type="checkbox"] {
          width: 22px;
          height: 22px;
          cursor: pointer;
          accent-color: var(--primary);
        }

        .ingredients-list label {
          font-size: 1.05rem;
          cursor: pointer;
          flex: 1;
        }

        .instructions-list {
          list-style: none;
          counter-reset: step-counter;
        }

        .instructions-list li {
          counter-increment: step-counter;
          margin-bottom: 30px;
          display: flex;
          gap: 20px;
        }

        .step-number {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, var(--primary), #ff5252);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .instructions-list p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--dark);
          flex: 1;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 25px;
          padding: 50px;
          max-width: 500px;
          width: 100%;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--light);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .modal-close:hover {
          background: var(--primary);
          color: white;
        }

        .modal-content h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: var(--dark);
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--dark);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon svg:first-child {
          position: absolute;
          left: 18px;
          color: var(--gray);
        }

        .input-with-icon input {
          width: 100%;
          padding: 16px 50px;
          border: 2px solid #E9ECEF;
          border-radius: 50px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s;
        }

        .input-with-icon input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 18px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray);
          padding: 8px;
          display: flex;
          align-items: center;
        }

        .auth-switch {
          margin-top: 25px;
          text-align: center;
          color: var(--gray);
        }

        .auth-switch button {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .page-header {
          text-align: center;
          padding: 60px 0 40px;
        }

        .page-header h1 {
          font-size: 3rem;
          color: var(--dark);
          margin-bottom: 15px;
        }

        .page-header p {
          font-size: 1.2rem;
          color: var(--gray);
        }

        .search-page, .recommended-page, .profile-page {
          padding: 40px 0;
        }

        .search-results-header h2 {
          font-size: 1.8rem;
          color: var(--dark);
          margin-bottom: 30px;
        }

        .no-results {
          text-align: center;
          padding: 80px 20px;
        }

        .no-results-icon {
          font-size: 5rem;
          margin-bottom: 20px;
        }

        .no-results h3 {
          font-size: 2rem;
          color: var(--dark);
          margin-bottom: 10px;
        }

        .search-suggestions h2 {
          font-size: 2rem;
          color: var(--dark);
          margin-bottom: 25px;
        }

        .search-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 50px;
        }

        .search-tag {
          padding: 12px 24px;
          background: white;
          border: 2px solid #E9ECEF;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .search-tag:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }

        .filter-section {
          background: white;
          padding: 40px;
          border-radius: 20px;
          margin-bottom: 50px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .filter-group {
          margin-bottom: 35px;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-group h3 {
          font-size: 1.3rem;
          color: var(--dark);
          margin-bottom: 15px;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-btn {
          padding: 12px 24px;
          background: var(--light);
          border: 2px solid transparent;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          color: var(--dark);
        }

        .filter-btn:hover {
          background: rgba(255, 107, 107, 0.1);
          color: var(--primary);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, var(--primary), #ff5252);
          color: white;
          border-color: var(--primary);
        }

        .filtered-results h2 {
          font-size: 1.8rem;
          color: var(--dark);
          margin-bottom: 30px;
        }

        .profile-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-header {
          background: white;
          border-radius: 20px;
          padding: 50px;
          margin-bottom: 50px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .profile-avatar {
          flex-shrink: 0;
        }

        .profile-info h1 {
          font-size: 2.5rem;
          color: var(--dark);
          margin-bottom: 10px;
        }

        .profile-info p {
          color: var(--gray);
          font-size: 1.1rem;
          margin-bottom: 30px;
        }

        .profile-stats {
          display: flex;
          gap: 40px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-item strong {
          display: block;
          font-size: 2rem;
          color: var(--primary);
          margin-bottom: 5px;
        }

        .stat-item span {
          color: var(--gray);
          font-size: 0.95rem;
        }

        .profile-content {
          background: white;
          border-radius: 20px;
          padding: 50px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .profile-content h2 {
          font-size: 2rem;
          color: var(--dark);
          margin-bottom: 30px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 2rem;
          color: var(--dark);
          margin-bottom: 15px;
        }

        .empty-state p {
          color: var(--gray);
          font-size: 1.1rem;
          margin-bottom: 30px;
        }

        @media (max-width: 1024px) {
          .hero {
            flex-direction: column;
            text-align: center;
          }

          .hero h1 {
            font-size: 3rem;
          }

          .recipe-header-section {
            grid-template-columns: 1fr;
          }

          .recipe-details {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }

          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            border-radius: 0 0 20px 20px;
            gap: 0;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.3s ease;
          }

          .nav-links.open {
            max-height: 400px;
            opacity: 1;
            padding: 20px;
          }

          .nav-links a {
            width: 100%;
            padding: 15px 20px;
            text-align: left;
            border-radius: 12px;
          }

          .navbar {
            flex-wrap: nowrap;
          }

          .user-actions {
            flex-direction: column;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            padding: 20px;
            border-radius: 0 0 20px 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            min-width: 200px;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.3s ease;
          }

          .user-actions.open {
            max-height: 300px;
            opacity: 1;
          }

          .user-actions .btn {
            width: 100%;
            justify-content: center;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .recipes-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }

          .section-title {
            font-size: 2rem;
          }

          .recipe-stats {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 35px 25px;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .hero h1 {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.7rem;
          }

          .recipe-header-info h1 {
            font-size: 2rem;
          }

          .recipe-actions-bar {
            flex-direction: column;
          }

          .ingredients-section,
          .instructions-section {
            padding: 25px;
          }

          .logo {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <header>
        <div className="container">
          <nav className="navbar">
            <div className="logo" onClick={() => setCurrentPage('home')}>
              <span>🍴</span>
              <span>FlavorFinds</span>
            </div>
            
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={28} />
            </button>

            <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
              <a onClick={() => {
                setCurrentPage('home');
                setMobileMenuOpen(false);
              }}>Home</a>
              <a onClick={() => {
                setCurrentPage('search');
                setMobileMenuOpen(false);
              }}>Search</a>
              <a onClick={() => {
                setCurrentPage('recommended');
                setFilterType('all');
                setMobileMenuOpen(false);
              }}>Recommended</a>
              {isLoggedIn && (
                <a onClick={() => {
                  setCurrentPage('profile');
                  setMobileMenuOpen(false);
                }}>Profile</a>
              )}
            </div>

            <div className={`user-actions ${mobileMenuOpen ? 'open' : ''}`}>
              {isLoggedIn ? (
                <>
                  <button className="btn btn-outline" onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline" onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}>
                    <User size={20} /> Sign In
                  </button>
                  <button className="btn btn-primary" onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}>
                    <Plus size={20} /> Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for recipes, ingredients, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setCurrentPage('search')}>
              <Search size={20} /> Search
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'recipe' && <RecipePage />}
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'recommended' && <RecommendedPage />}
        {currentPage === 'profile' && <ProfilePage />}
      </main>

      {showAuthModal && <AuthModal />}

      <footer style={{
        background: 'linear-gradient(135deg, var(--dark) 0%, #1a1d2e 100%)',
        color: 'white',
        padding: '70px 0 30px',
        marginTop: '100px'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '50px',
            marginBottom: '50px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '25px' }}>FlavorFinds</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
                Discover, cook, and share amazing recipes from around the world.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '25px' }}>Explore</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>All Recipes</a>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Trending</a>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Top Rated</a>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '25px' }}>Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Breakfast</a>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Dinner</a>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Desserts</a>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '25px' }}>Company</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>About Us</a>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Contact</a>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Privacy Policy</a>
              </div>
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            paddingTop: '35px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <p>&copy; 2024 FlavorFinds. All rights reserved. Made with ❤️ for food lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;