import React from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RecommendedPage = ({ 
  filterType, 
  setFilterType, 
  recipes, 
  loading, 
  savedRecipes, 
  isLoggedIn, 
  onSelectRecipe, 
  onToggleSave, 
  onShare, 
  setShowAuthModal 
}) => {
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
            {[
              { label: 'All', value: 'all' },
              { label: '🍳Breakfast', value: 'breakfast' },
              { label: '🍔 Lunch', value: 'lunch' },
              { label: '🍗Dinner', value: 'dinner' },
              { label: '🍰Dessert', value: 'dessert' }
            ].map(btn => (
              <button 
                key={btn.value}
                className={`filter-btn ${filterType === btn.value ? 'active' : ''}`}
                onClick={() => setFilterType(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>By Cuisine</h3>
          <div className="filter-buttons">
            {[
              { label: '🇮🇹 Italian', value: 'italian' },
              { label: '🇲🇽 Mexican', value: 'mexican' },
              { label: '🇹🇭 Thai', value: 'thai' },
              { label: '🇫🇷 French', value: 'french' },
              { label: '🇺🇸 American', value: 'american' }
            ].map(btn => (
              <button 
                key={btn.value}
                className={`filter-btn ${filterType === btn.value ? 'active' : ''}`}
                onClick={() => setFilterType(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filtered-results">
        <h2>{recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}</h2>
        {loading ? <LoadingSpinner /> : (
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
        )}
      </div>
    </div>
  );
};