import React from 'react';
import { HeroImage } from '../components/HeroImage';
import { RecipeCard } from '../components/RecipeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { mealCategories } from '../constants/categoryMaps';

export const HomePage = ({ 
  recommendedRecipes, 
  mostUsedRecipes, 
  loading, 
  savedRecipes, 
  isLoggedIn, 
  setCurrentPage, 
  setFilterType, 
  onSelectRecipe, 
  onToggleSave, 
  onShare, 
  setShowAuthModal 
}) => (
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
        <HeroImage />
      </div>
    </section>

    <section>
      <h2 className="section-title">Browse by Category</h2>
      <div className="categories">
        {mealCategories.map((cat, idx) => (
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
    </section>

    <section>
      <div className="section-header">
        <h2 className="section-title">Most Popular Recipes</h2>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="recipes-grid">
          {mostUsedRecipes.map(recipe => (
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
    </section>
  </>
);