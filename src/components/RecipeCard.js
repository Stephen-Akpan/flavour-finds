import React from 'react';
import { Bookmark, Share2 } from 'lucide-react';

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

export default RecipeCard;
