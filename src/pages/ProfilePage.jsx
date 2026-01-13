import React from 'react';
import { RecipeCard } from '../components/RecipeCard';

export const ProfilePage = ({ 
  userName, 
  email, 
  isLoggedIn, 
  savedRecipes, 
  setCurrentPage, 
  onSelectRecipe, 
  onToggleSave, 
  onShare, 
  setShowAuthModal 
}) => {
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
        {isLoggedIn && savedRecipes.length > 0 ? (
          <div className="recipes-grid">
            {savedRecipes.map(recipe => (
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