import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, User, Plus, Menu } from 'lucide-react';

import { UnifiedAPI } from './api/unifiedAPI';
import { mealDbAPI } from './api/mealDbAPI';
import { transformMealToRecipe } from './utils/transformMealToRecipe';
import { categoryMap, areaMap } from './constants/categoryMaps';
import { UserService } from './services/userService';

import { HomePage } from './pages/HomePage';
import { RecipePage } from './pages/RecipePage';
import { SearchPage } from './pages/SearchPage';
import { RecommendedPage } from './pages/RecommendedPage';
import { ProfilePage } from './pages/ProfilePage';

import { AuthModal } from './components/AuthModal';

import './styles/App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [userName, setUserName] = useState('Food Lover');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [apiSource, setApiSource] = useState('both');
  const [useUnifiedAPI, setUseUnifiedAPI] = useState(false);
  const [categories, setCategories] = useState([]);

  // Check for existing session on mount
  useEffect(() => {
    const user = UserService.getCurrentUser();
    if (user && UserService.isSessionValid()) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setUserName(user.username || 'Food Lover');
      setSavedRecipes(user.savedRecipes || []);
    } else {
      // Fallback to localStorage for backward compatibility
      const saved = localStorage.getItem('savedRecipes');
      if (saved) {
        setSavedRecipes(JSON.parse(saved));
      }
    }
  }, []);

  // Persist saved recipes for logged-in users
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      UserService.saveRecipe(currentUser.id, null); // Trigger persistence
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    } else {
      // Persist for non-logged-in users
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
  }, [savedRecipes, isLoggedIn, currentUser]);

  useEffect(() => {
    const saved = localStorage.getItem('savedRecipes');
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    loadInitialRecipes();
    loadCategories();
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setUserName(user.username || 'Food Lover');
    setSavedRecipes(user.savedRecipes || []);
  };

   const loadInitialRecipes = async () => {
    setLoading(true);
    try {
      let transformedRecipes = [];

      if (useUnifiedAPI && apiSource === 'both') {
        // Load from both sources
        const randomMeals = await Promise.all(
          Array(4).fill().map(() => mealDbAPI.getRandomMeal())
        );
        const mealDbTransformed = randomMeals.map(meal => transformMealToRecipe(meal, 'mealdb'));
        
        // Combine with Recipe API if enabled
        transformedRecipes = mealDbTransformed;
      } else {
        // Load only from MealDB
        const randomMeals = await Promise.all(
          Array(8).fill().map(() => mealDbAPI.getRandomMeal())
        );
        transformedRecipes = randomMeals.map(meal => transformMealToRecipe(meal, 'mealdb'));
      }

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

  const searchRecipes = async (query) => {
    if (!query.trim()) {
      loadInitialRecipes();
      return;
    }
    
    setLoading(true);
    try {
      let results = [];

      if (useUnifiedAPI) {
        // Use unified API with selected sources
        const useMealDB = apiSource === 'mealdb' || apiSource === 'both';
        const useRecipeAPI = apiSource === 'recipeapi' || apiSource === 'both';

        results = await UnifiedAPI.searchByNameMerged(query, {
          useMealDB,
          useRecipeAPI
        });
      } else {
        // Use only MealDB
        results = await mealDbAPI.searchByName(query);
      }

      const transformedResults = results.map(recipe => {
        const source = recipe._source || 'mealdb';
        return transformMealToRecipe(recipe, source);
      });

      setRecipes(transformedResults);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipesByFilter = async (filter) => {
    setLoading(true);
    try {
      let meals = [];
      
      if (filter === 'all') {
        const randomMeals = await Promise.all(
          Array(12).fill().map(() => mealDbAPI.getRandomMeal())
        );
        meals = randomMeals;
      } else if (categoryMap[filter]) {
        const results = await mealDbAPI.getByCategory(categoryMap[filter]);
        const detailPromises = results.slice(0, 12).map(m => mealDbAPI.getMealById(m.idMeal));
        meals = await Promise.all(detailPromises);
      } else if (areaMap[filter]) {
        const results = await mealDbAPI.getByArea(areaMap[filter]);
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

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    const result = UserService.logout();
    if (result.success) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setSavedRecipes([]);
      setUserName('Food Lover');
      setCurrentPage('home');
    }
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

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setCurrentPage('recipe');
  };

  return (
    <div className="app">
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
        {currentPage === 'home' && <HomePage 
          recommendedRecipes={recommendedRecipes}
          mostUsedRecipes={mostUsedRecipes}
          loading={loading}
          savedRecipes={savedRecipes}
          isLoggedIn={isLoggedIn}
          setCurrentPage={setCurrentPage}
          setFilterType={setFilterType}
          onSelectRecipe={handleSelectRecipe}
          onToggleSave={toggleSaveRecipe}
          onShare={handleShare}
          setShowAuthModal={setShowAuthModal}
        />}
        {currentPage === 'recipe' && <RecipePage 
          selectedRecipe={selectedRecipe}
          savedRecipes={savedRecipes}
          isLoggedIn={isLoggedIn}
          setCurrentPage={setCurrentPage}
          onToggleSave={toggleSaveRecipe}
          onShare={handleShare}
          setShowAuthModal={setShowAuthModal}
        />}
        {currentPage === 'search' && <SearchPage 
          searchQuery={searchQuery}
          recipes={recipes}
          loading={loading}
          savedRecipes={savedRecipes}
          isLoggedIn={isLoggedIn}
          onSelectRecipe={handleSelectRecipe}
          onToggleSave={toggleSaveRecipe}
          onShare={handleShare}
          setShowAuthModal={setShowAuthModal}
          setSearchQuery={setSearchQuery}
        />}
        {currentPage === 'recommended' && <RecommendedPage 
          filterType={filterType}
          setFilterType={setFilterType}
          recipes={recipes}
          loading={loading}
          savedRecipes={savedRecipes}
          isLoggedIn={isLoggedIn}
          onSelectRecipe={handleSelectRecipe}
          onToggleSave={toggleSaveRecipe}
          onShare={handleShare}
          setShowAuthModal={setShowAuthModal}
        />}
        {currentPage === 'profile' && <ProfilePage 
          userName={userName}
          email={email}
          isLoggedIn={isLoggedIn}
          savedRecipes={savedRecipes}
          recipes={recipes}
          setCurrentPage={setCurrentPage}
          onSelectRecipe={handleSelectRecipe}
          onToggleSave={toggleSaveRecipe}
          onShare={handleShare}
          setShowAuthModal={setShowAuthModal}
        />}
      </main>

      {showAuthModal && <AuthModal 
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={handleAuthSubmit}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />}

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