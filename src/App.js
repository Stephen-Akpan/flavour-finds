import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, User, Plus, Clock, Signal, Star, Bookmark, Share2, X, ChevronLeft, Mail, Lock, Eye, EyeOff, Menu } from 'lucide-react';

// Recipe Database
const recipesDB = [
  {
    id: 1,
    title: "Mediterranean Quinoa Bowl",
    time: "25 min",
    difficulty: "Easy",
    rating: 4.8,
    reviews: 234,
    description: "A healthy and delicious bowl packed with fresh vegetables, quinoa, and a tangy lemon dressing.",
    badge: "Healthy",
    category: "lunch",
    mealTime: "lunch",
    cuisine: "Mediterranean",
    chef: "Moria Benzene",
    color1: "#4ECDC4",
    color2: "#06D6A0",
    ingredients: [
      "1 cup quinoa",
      "2 cups vegetable broth",
      "1 cucumber, diced",
      "2 tomatoes, diced",
      "1/2 red onion, sliced",
      "1/2 cup kalamata olives",
      "1/2 cup feta cheese",
      "1/4 cup olive oil",
      "2 tbsp lemon juice",
      "Fresh herbs (parsley, mint)"
    ],
    instructions: [
      "Rinse quinoa thoroughly under cold water",
      "Combine quinoa and vegetable broth in a pot, bring to boil",
      "Reduce heat, cover and simmer for 15 minutes until fluffy",
      "While quinoa cooks, prepare all vegetables",
      "Make dressing by whisking olive oil, lemon juice, salt and pepper",
      "Fluff cooked quinoa with a fork and let cool slightly",
      "Combine quinoa with vegetables in a large bowl",
      "Drizzle with dressing and toss gently",
      "Top with feta cheese and fresh herbs",
      "Serve immediately or refrigerate for later"
    ],
    servings: 4,
    calories: 320
  },
  {
    id: 2,
    title: "Classic Margherita Pizza",
    time: "40 min",
    difficulty: "Medium",
    rating: 4.9,
    reviews: 567,
    description: "Homemade pizza with fresh mozzarella, basil, and a perfectly crispy crust.",
    badge: "Popular",
    category: "dinner",
    mealTime: "dinner",
    cuisine: "Italian",
    chef: "Chef Antonio",
    color1: "#FF6B6B",
    color2: "#FF5252",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 packet active dry yeast",
      "1 tsp sugar",
      "1 tsp salt",
      "2 tbsp olive oil",
      "1 cup warm water",
      "1 cup tomato sauce",
      "8 oz fresh mozzarella",
      "Fresh basil leaves",
      "Extra virgin olive oil for drizzling"
    ],
    instructions: [
      "Dissolve yeast and sugar in warm water, let sit 5 minutes",
      "Mix flour and salt in a large bowl",
      "Add yeast mixture and olive oil, knead for 10 minutes",
      "Place dough in oiled bowl, cover and let rise 1 hour",
      "Preheat oven to 475°F with pizza stone if available",
      "Roll out dough on floured surface to 12-inch circle",
      "Spread tomato sauce evenly, leaving 1-inch border",
      "Tear mozzarella and distribute over sauce",
      "Bake for 12-15 minutes until crust is golden",
      "Remove from oven, add fresh basil and drizzle with olive oil"
    ],
    servings: 2,
    calories: 580
  },
  {
    id: 3,
    title: "Chocolate Lava Cake",
    time: "30 min",
    difficulty: "Medium",
    rating: 4.7,
    reviews: 892,
    description: "Decadent chocolate cake with a molten center, served with vanilla ice cream.",
    badge: "Dessert",
    category: "dessert",
    mealTime: "dessert",
    cuisine: "French",
    chef: "Moria Benzene",
    color1: "#8B4513",
    color2: "#654321",
    ingredients: [
      "4 oz dark chocolate",
      "1/2 cup butter",
      "2 eggs",
      "2 egg yolks",
      "1/4 cup sugar",
      "2 tbsp all-purpose flour",
      "Pinch of salt",
      "Butter for ramekins",
      "Cocoa powder for dusting",
      "Vanilla ice cream for serving"
    ],
    instructions: [
      "Preheat oven to 425°F",
      "Butter four 6-oz ramekins and dust with cocoa powder",
      "Melt chocolate and butter together in microwave, stir until smooth",
      "Whisk eggs, egg yolks, and sugar until thick and pale",
      "Fold melted chocolate into egg mixture",
      "Gently fold in flour and salt",
      "Divide batter among prepared ramekins",
      "Bake for 12-14 minutes until edges are firm but center jiggles",
      "Let cool for 1 minute",
      "Invert onto plates and serve immediately with ice cream"
    ],
    servings: 4,
    calories: 420
  },
  {
    id: 4,
    title: "Avocado Toast Deluxe",
    time: "10 min",
    difficulty: "Easy",
    rating: 4.5,
    reviews: 1234,
    description: "Creamy avocado on toasted sourdough with cherry tomatoes and poached egg.",
    badge: "Quick",
    category: "breakfast",
    mealTime: "breakfast",
    cuisine: "American",
    chef: "Chef Sarah",
    color1: "#06D6A0",
    color2: "#4ECDC4",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "2 eggs",
      "1 cup cherry tomatoes, halved",
      "2 tbsp olive oil",
      "1 clove garlic",
      "Red pepper flakes",
      "Salt and pepper to taste",
      "Fresh lemon juice",
      "Microgreens for garnish"
    ],
    instructions: [
      "Toast sourdough bread until golden and crispy",
      "Rub toasted bread with cut garlic clove",
      "Mash avocado with lemon juice, salt, and pepper",
      "Bring pot of water to gentle simmer for poaching eggs",
      "Crack eggs into small bowls, gently slide into simmering water",
      "Poach eggs for 3-4 minutes until whites are set",
      "Spread mashed avocado generously on toast",
      "Top with cherry tomatoes",
      "Place poached egg on top",
      "Garnish with red pepper flakes, microgreens, and drizzle of olive oil"
    ],
    servings: 2,
    calories: 380
  },
  {
    id: 5,
    title: "Thai Green Curry",
    time: "35 min",
    difficulty: "Medium",
    rating: 4.6,
    reviews: 445,
    description: "Aromatic Thai curry with coconut milk, vegetables, and your choice of protein.",
    badge: "Spicy",
    category: "dinner",
    mealTime: "dinner",
    cuisine: "Thai",
    chef: "Chef Somchai",
    color1: "#06D6A0",
    color2: "#4ECDC4",
    ingredients: [
      "2 tbsp green curry paste",
      "1 can (14 oz) coconut milk",
      "1 lb chicken breast, sliced",
      "1 bell pepper, sliced",
      "1 cup bamboo shoots",
      "1 cup baby corn",
      "2 tbsp fish sauce",
      "1 tbsp palm sugar",
      "Thai basil leaves",
      "Jasmine rice for serving"
    ],
    instructions: [
      "Heat oil in large pan or wok over medium-high heat",
      "Fry curry paste for 1-2 minutes until fragrant",
      "Add half the coconut milk, stir until combined",
      "Add chicken and cook until no longer pink",
      "Pour in remaining coconut milk",
      "Add bell pepper, bamboo shoots, and baby corn",
      "Season with fish sauce and palm sugar",
      "Simmer for 10-15 minutes until vegetables are tender",
      "Stir in Thai basil leaves",
      "Serve hot over jasmine rice"
    ],
    servings: 4,
    calories: 450
  },
  {
    id: 6,
    title: "Tacos al Pastor",
    time: "45 min",
    difficulty: "Medium",
    rating: 4.8,
    reviews: 678,
    description: "Traditional Mexican tacos with marinated pork, pineapple, and fresh cilantro.",
    badge: "Authentic",
    category: "dinner",
    mealTime: "dinner",
    cuisine: "Mexican",
    chef: "Chef Carlos",
    color1: "#FF6B6B",
    color2: "#FFD166",
    ingredients: [
      "2 lbs pork shoulder, thinly sliced",
      "3 dried guajillo chiles",
      "2 chipotle peppers",
      "1 cup pineapple juice",
      "4 cloves garlic",
      "2 tsp cumin",
      "1 tsp oregano",
      "Corn tortillas",
      "Fresh pineapple chunks",
      "Cilantro and onion for topping"
    ],
    instructions: [
      "Toast dried chiles in dry pan until fragrant",
      "Soak chiles in hot water for 15 minutes",
      "Blend chiles with pineapple juice, garlic, and spices",
      "Marinate pork in chile mixture for at least 2 hours",
      "Heat grill or large skillet over high heat",
      "Cook pork slices until caramelized and crispy",
      "Warm tortillas on griddle",
      "Grill pineapple chunks until charred",
      "Assemble tacos with pork, pineapple, cilantro, and onion",
      "Serve with lime wedges and salsa"
    ],
    servings: 6,
    calories: 420
  },
  {
    id: 7,
    title: "French Croissants",
    time: "3 hours",
    difficulty: "Hard",
    rating: 4.9,
    reviews: 234,
    description: "Buttery, flaky croissants made from scratch with layers of laminated dough.",
    badge: "Challenge",
    category: "breakfast",
    mealTime: "breakfast",
    cuisine: "French",
    chef: "Moria Benzene",
    color1: "#FFD166",
    color2: "#FF6B6B",
    ingredients: [
      "4 cups all-purpose flour",
      "1/3 cup sugar",
      "1 tbsp salt",
      "1 tbsp instant yeast",
      "1 1/4 cups milk",
      "1 1/2 cups cold butter",
      "1 egg for egg wash",
      "2 tbsp water"
    ],
    instructions: [
      "Mix flour, sugar, salt, yeast, and milk into dough",
      "Knead for 5 minutes, then refrigerate for 1 hour",
      "Roll dough into rectangle, place butter block in center",
      "Fold dough over butter, seal edges",
      "Roll out and perform three letter folds",
      "Refrigerate 30 minutes between each fold",
      "Roll dough to 1/4 inch thickness",
      "Cut into triangles and roll into croissant shape",
      "Let rise for 2 hours until doubled",
      "Brush with egg wash and bake at 400°F for 15-20 minutes"
    ],
    servings: 12,
    calories: 280
  },
  {
    id: 8,
    title: "Spaghetti Carbonara",
    time: "25 min",
    difficulty: "Easy",
    rating: 4.7,
    reviews: 1023,
    description: "Classic Roman pasta with eggs, pecorino cheese, and crispy guanciale.",
    badge: "Classic",
    category: "dinner",
    mealTime: "dinner",
    cuisine: "Italian",
    chef: "Chef Antonio",
    color1: "#FFD166",
    color2: "#4ECDC4",
    ingredients: [
      "1 lb spaghetti",
      "6 oz guanciale or pancetta",
      "4 large eggs",
      "1 cup pecorino romano",
      "Black pepper to taste",
      "Salt for pasta water"
    ],
    instructions: [
      "Bring large pot of salted water to boil",
      "Cook spaghetti until al dente",
      "Meanwhile, dice guanciale and cook until crispy",
      "Whisk eggs with grated pecorino and black pepper",
      "Reserve 1 cup pasta water, then drain pasta",
      "Remove pan from heat, add hot pasta to guanciale",
      "Quickly stir in egg mixture, adding pasta water as needed",
      "Toss vigorously to create creamy sauce",
      "Season with more black pepper",
      "Serve immediately with extra pecorino"
    ],
    servings: 4,
    calories: 520
  }
];

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
  const [filterType, setFilterType] = useState('all'); // For recommended page filters
  const [userName, setUserName] = useState('Food Lover');

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

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoized filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipesDB.filter(recipe =>
      recipe.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery]);

  const recommendedRecipes = useMemo(() => filteredRecipes.slice(0, 4), [filteredRecipes]);
  const mostUsedRecipes = useMemo(() => filteredRecipes.sort((a, b) => b.reviews - a.reviews).slice(0, 4), [filteredRecipes]);

  // Add useEffect for search navigation
  useEffect(() => {
    if (searchQuery.trim()) {
      setCurrentPage('search');
    }
  }, [searchQuery]);

  // Add useEffect for scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // useCallback for toggleSaveRecipe
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
    // Simple mock authentication
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

  // Get filtered recipes for recommended page
  const getFilteredRecommendations = () => {
    if (filterType === 'all') return recipesDB;
    if (filterType === 'breakfast' || filterType === 'lunch' || filterType === 'dinner' || filterType === 'dessert') {
      return recipesDB.filter(r => r.mealTime === filterType);
    }
    if (filterType === 'italian' || filterType === 'mexican' || filterType === 'thai' || filterType === 'french' || filterType === 'american' || filterType === 'mediterranean') {
      return recipesDB.filter(r => r.cuisine.toLowerCase() === filterType);
    }
    if (filterType === 'followed') {
      return recipesDB.filter(r => r.chef === 'Moria Benzene');
    }
    return recipesDB;
  };

  const handleShare = useCallback((recipe) => {
    const url = window.location.href; // Placeholder; in a real app, use recipe-specific URL
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

  const RecipeSVG = ({ color1, color2 }) => (
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

  const RecipeCard = React.memo(({ recipe }) => (
    <div 
      className="recipe-card"
      onClick={() => {
        setSelectedRecipe(recipe);
        setCurrentPage('recipe');
      }}
    >
      <div className="recipe-img">
        <RecipeSVG color1={recipe.color1} color2={recipe.color2} />
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
            <span>{recipe.rating}</span>
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

  const HomePage = () => (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Amazing <span>Recipes</span> From Around The World</h1>
          <p>Join our community of food lovers and explore thousands of recipes, cooking tips, and culinary inspiration for every occasion and skill level.</p>
          <button className="btn btn-primary" style={{ padding: '18px 38px', fontSize: '1.15rem' }}>
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
            { icon: '⚡', name: 'Quick Meals', filter: 'quick' }
          ].map((cat, idx) => (
            <div 
              key={idx} 
              className="category-card"
              onClick={() => {
                setFilterType(cat.filter);
                setCurrentPage('recommended');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setFilterType(cat.filter);
                  setCurrentPage('recommended');
                }
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
        <div className="recipes-grid">
          {recommendedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2 className="section-title">Most Used Recipes</h2>
          <a href="#" className="view-all">View All →</a>
        </div>
        <div className="recipes-grid">
          {mostUsedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Featured Chef of the Week</h2>
        <div className="featured-chef">
          <div className="chef-image">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="70" fill="#FFD166"/>
              <circle cx="70" cy="55" r="28" fill="#2D3047"/>
              <path d="M 70 83 C 45 83, 40 115, 70 115 C 100 115, 95 83, 70 83" fill="#2D3047"/>
              <circle cx="58" cy="48" r="5" fill="#FFF"/>
              <circle cx="82" cy="48" r="5" fill="#FFF"/>
              <rect x="50" y="25" width="40" height="15" fill="#FFF" rx="3"/>
              <rect x="45" y="115" width="50" height="12" fill="#4ECDC4" rx="6"/>
            </svg>
          </div>
          <div className="chef-info">
            <h3>Chef Moria Benzene</h3>
            <p>With over 15 years of experience in Mediterranean cuisine, Chef Moria shares her family recipes and innovative cooking techniques. Her recipes have been saved over 50,000 times by our community.</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setFilterType('followed');
                setCurrentPage('recommended');
              }}
            >
              View Chef's Recipes
            </button>
          </div>
        </div>
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
            <RecipeSVG color1={selectedRecipe.color1} color2={selectedRecipe.color2} />
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
                  <strong>{selectedRecipe.rating}</strong>
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
              <button className="btn btn-outline">
                <Share2 size={20} /> Share
              </button>
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
    const searchResults = recipesDB.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.chef.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="search-page">
        <div className="page-header">
          <h1>Search Recipes</h1>
          <p>Find your perfect recipe from our collection</p>
        </div>

        {searchQuery ? (
          <>
            <div className="search-results-header">
              <h2>Found {searchResults.length} recipe{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"</h2>
            </div>
            {searchResults.length > 0 ? (
              <div className="recipes-grid">
                {searchResults.map(recipe => (
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
              {['Italian', 'Mexican', 'Dessert', 'Quick Meals', 'Breakfast', 'Pasta', 'Tacos', 'Pizza'].map(tag => (
                <button 
                  key={tag}
                  className="search-tag"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <h2 style={{ marginTop: '50px' }}>All Recipes</h2>
            <div className="recipes-grid">
              {recipesDB.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const RecommendedPage = () => {
    const filteredRecipes = getFilteredRecommendations();

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
                🍳 Breakfast
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
                🍗 Dinner
              </button>
              <button 
                className={`filter-btn ${filterType === 'dessert' ? 'active' : ''}`}
                onClick={() => setFilterType('dessert')}
              >
                🍰 Dessert
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
              <button 
                className={`filter-btn ${filterType === 'mediterranean' ? 'active' : ''}`}
                onClick={() => setFilterType('mediterranean')}
              >
                🌊 Mediterranean
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3>By Chef</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'followed' ? 'active' : ''}`}
                onClick={() => setFilterType('followed')}
              >
                ⭐ Followed Chefs
              </button>
            </div>
          </div>
        </div>

        <div className="filtered-results">
          <h2>{filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? 's' : ''}</h2>
          <div className="recipes-grid">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ProfilePage = () => {
    const userSavedRecipes = recipesDB.filter(recipe => savedRecipes.includes(recipe.id));

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

  // Add loading state for page transitions
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200); // Simulate loading
    return () => clearTimeout(timer);
  }, [currentPage]);

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
          padding: 10px 0; /* Reduced from 15px 0 for more compact navbar */
          gap: 20px;
          position: relative;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px; /* Reduced gap */
          font-size: 1.6rem; /* Slightly smaller */
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
          padding: 6px 12px; /* Smaller padding */
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
          margin: 10px 0; /* Reduced from 20px 0 for less vertical space */
          max-width: 700px;
        }

        .search-bar input {
          flex: 1;
          padding: 14px 24px; /* Slightly smaller */
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

        .featured-chef {
          background: linear-gradient(135deg, var(--dark) 0%, #3A3E5C 100%);
          border-radius: 20px;
          padding: 50px;
          color: white;
          display: flex;
          align-items: center;
          gap: 50px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .chef-image {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 6px solid var(--primary);
          flex-shrink: 0;
        }

        .chef-info h3 {
          font-size: 2rem;
          margin-bottom: 15px;
        }

        .chef-info p {
          opacity: 0.95;
          margin-bottom: 25px;
          max-width: 700px;
          font-size: 1.1rem;
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

        /* Recipe Page Styles */
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

        /* Modal Styles */
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

        /* Responsive */
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

          .featured-chef {
            flex-direction: column;
            text-align: center;
            padding: 35px;
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

        /* New Pages Styles */
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
              <a onClick={() => setMobileMenuOpen(false)}>Categories</a>
              <a onClick={() => setMobileMenuOpen(false)}>Chefs</a>
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
                  <button className="btn btn-primary" onClick={() => {
                    alert('Add Recipe functionality coming soon!');
                    setMobileMenuOpen(false);
                  }}>
                    <Plus size={20} /> Add Recipe
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
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'recipe' && <RecipePage />}
            {currentPage === 'search' && <SearchPage />}
            {currentPage === 'recommended' && <RecommendedPage />}
            {currentPage === 'profile' && <ProfilePage />}
          </>
        )}
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