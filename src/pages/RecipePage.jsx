import React from 'react';
import { ChevronLeft, Clock, Signal, Star, Bookmark, Share2 } from 'lucide-react';
import { RecipeSVG } from '../components/RecipeSVG';

export const RecipePage = ({ 
  selectedRecipe, 
  savedRecipes, 
  isLoggedIn, 
  setCurrentPage, 
  onToggleSave, 
  onShare, 
  setShowAuthModal 
}) => {
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
                  onToggleSave(selectedRecipe.id);
                }
              }}
            >
              <Bookmark size={20} fill={savedRecipes.includes(selectedRecipe.id) ? 'currentColor' : 'none'} />
              {savedRecipes.includes(selectedRecipe.id) ? 'Saved' : 'Save Recipe'}
            </button>
            <button className="btn btn-outline" onClick={() => onShare(selectedRecipe)}>
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