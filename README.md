# FlavorFinds 🍴

**A Modern Recipe Discovery & Sharing Web Application**

> U24 Aerospace Department - Software Design Assignment
> 
> Course: Software Design | Lecturer: [Lecturer Name]
> 
> Submission Date: [Date] | Project Status: ✅ Complete

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Component Architecture](#component-architecture)
- [Key Functionalities](#key-functionalities)
- [Future Enhancements](#future-enhancements)
- [Team Members](#team-members)
- [License](#license)

---

## 🎯 Overview

**FlavorFinds** is a modern, full-featured recipe discovery and sharing application built with React. It enables users to explore thousands of recipes from around the world, search by ingredients or cuisine, save favorites, and share recipes with friends. The application integrates with the TheMealDB API to provide a comprehensive database of global recipes.

This project demonstrates:
- Modern React architecture with component-based design
- API integration and data transformation
- State management with React Hooks
- Responsive UI/UX design principles
- Local storage persistence
- Mobile-first responsive design

---

## ✨ Features

### Core Features

✅ **Recipe Discovery**
- Browse trending recipes with curated recommendations
- Filter recipes by meal time (Breakfast, Lunch, Dinner, Dessert)
- Filter recipes by cuisine (Italian, Mexican, Thai, French, American)
- Category-based browsing for quick access

✅ **Search Functionality**
- Real-time recipe search with debounced queries
- Popular search suggestions
- Search results filtering and display
- No-results fallback with helpful suggestions

✅ **Recipe Details**
- Comprehensive recipe information display
- Ingredient lists with measurements
- Step-by-step cooking instructions
- Nutritional information (servings, calories)
- Difficulty level and time estimates
- Rating and review statistics
- YouTube video links (when available)

✅ **User Authentication**
- Sign in / Sign up modal functionality
- Password visibility toggle
- Form validation
- User profile management

✅ **Save & Personalization**
- Save favorite recipes (requires login)
- Persistent storage using localStorage
- Personal recipe collection in profile
- Quick access to saved recipes

✅ **Social Features**
- Share recipes via native share API
- Fallback link copying for unsupported browsers
- Social metadata in share dialogs

✅ **Responsive Design**
- Mobile-first approach
- Tablet optimization
- Desktop experience
- Hamburger menu for mobile navigation
- Collapsible navigation menus

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library and framework
- **React Hooks** - State management (useState, useEffect, useCallback, useMemo)
- **Lucide React** - Icon library
- **CSS3** - Styling with CSS variables and media queries

### API & Data
- **TheMealDB API** - Recipe database and content
- **REST API** - Data fetching and integration
- **LocalStorage API** - Client-side data persistence

### Development & Tools
- **Create React App** - Project scaffolding
- **Node.js/npm** - Package management

---

## 📁 Project Structure

```
/my-app
├── node_modules
├── public
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
└── src
    ├── api
    │   └── mealdb.js
    ├── components
    │   ├── Auth
    │   │   ├── LoginForm.js
    │   │   └── SignupForm.js
    │   ├── Common
    │   │   ├── Footer.js
    │   │   └── Header.js
    │   ├── Home
    │   │   ├── FeaturedRecipes.js
    │   │   └── SearchBar.js
    │   ├── Recipe
    │   │   ├── RecipeDetails.js
    │   │   └── RecipeList.js
    │   └── User
    │       └── Profile.js
    ├── context
    │   └── AuthContext.js
    ├── hooks
    │   └── useAuth.js
    ├── pages
    │   ├── HomePage.js
    │   ├── LoginPage.js
    │   ├── NotFoundPage.js
    │   └── RecipePage.js
    ├── styles
    │   ├── App.css
    │   ├── index.css
    │   └── variables.css
    ├── utils
    │   └── helpers.js
    ├── App.js
    ├── index.js
    └── serviceWorker.js
```

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/flavorfinds.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd flavorfinds
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser and visit** [http://localhost:3000](http://localhost:3000)

---

## 🎮 Usage

- **Explore Recipes**: Browse the home page to discover trending recipes.
- **Search Recipes**: Use the search bar to find recipes by ingredients or cuisine.
- **View Recipe Details**: Click on a recipe to see its details, including ingredients, instructions, and nutritional information.
- **User Authentication**: Sign up or log in to save your favorite recipes.
- **Profile Management**: Access your profile to manage saved recipes and account settings.

---

## 🌐 API Integration

**FlavorFinds** integrates with the **TheMealDB API** and **Recipe-API** to fetch and display recipe data. The API provides endpoints for:
- Searching recipes by name or ingredient
- Fetching recipe details by ID
- Browsing recipes by category or cuisine

API calls are made from the frontend using the Fetch API, and data is managed using React state and effects.

---

## 🧩 Component Architecture

The application is built using a component-based architecture. Key components include:
- **App**: The root component that wraps the entire application.
- **Header**: Displays the navigation and branding.
- **Footer**: Shows copyright and links.
- **HomePage**: The landing page that displays featured recipes and search bar.
- **RecipePage**: Displays detailed information about a specific recipe.
- **LoginPage**: User login and authentication.
- **Profile**: User profile and saved recipes management.

Components are organized by feature and functionality, making it easy to maintain and extend the application.

---

## 🔑 Key Functionalities

- **Responsive Navigation**: Collapsible and expandable navigation menus for mobile and desktop.
- **Debounced Search**: Optimized search input with reduced API calls.
- **Local Storage Persistence**: Saved recipes are stored in the browser's local storage for offline access.
- **User Authentication**: Secure sign-up and login with form validation and error handling.
- **Dynamic Routing**: Seamless navigation between home, recipe details, login, and profile pages.

---

## ⏭️ Future Enhancements

- Implement user roles and permissions (admin, user, guest)
- Add recipe creation and editing capabilities for users
- Integrate additional APIs for extended recipe data and cooking tips
- Enhance search functionality with advanced filters and sorting options
- Improve mobile responsiveness and performance optimizations

---

## 👥 Team Members

- **[Your Name]** - Frontend Developer, UI/UX Designer
- **[Teammate Name]** - Backend Developer, API Integration
- **[Teammate Name]** - QA Tester, Documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Your Name]
