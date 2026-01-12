import React from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const SearchPage = ({ 
  searchQuery, 
  recipes, 
  loading, 
  savedRecipes, 
  isLoggedIn, 
  onSelectRecipe, 
  onToggleSave, 
  onShare, 
  setShowAuthModal, 
  setSearchQuery 
}) => {
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
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  savedRecipes={savedRecipes}
                  isLoggedIn={isLoggedIn}
                  onSelectRecipe={onSelectRecipe}
                  onToggleSave={onToggleSave}
                  onShare={onShare}
                  setShowAuthModal={setShowAuthModal}
                />
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
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  savedRecipes={savedRecipes}
                  isLoggedIn={isLoggedIn}
                  onSelectRecipe={onSelectRecipe}
                  onToggleSave={onToggleSave}
                  onShare={onShare}
                  setShowAuthModal={setShowAuthModal}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};