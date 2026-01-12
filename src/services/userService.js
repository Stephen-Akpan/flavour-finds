import { sanitizeInput } from '../utils/validation';

const USER_STORAGE_KEY = 'flavorfinds_user';
const USERS_STORAGE_KEY = 'flavorfinds_users';
const SESSION_STORAGE_KEY = 'flavorfinds_session';

export const UserService = {
  // Register new user
  register: (email, password, username = '') => {
    try {
      // Get existing users
      const existingUsers = UserService.getAllUsers();
      
      // Check if user already exists
      if (existingUsers.some(u => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: sanitizeInput(email),
        username: sanitizeInput(username) || email.split('@')[0],
        password: btoa(password), // Basic encoding (NOT secure - use backend in production)
        createdAt: new Date().toISOString(),
        savedRecipes: [],
        preferences: {
          theme: 'light',
          notifications: true
        }
      };

      // Save user
      existingUsers.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));

      return { success: true, user: newUser };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'Failed to register user' };
    }
  },

  // Login user
  login: (email, password) => {
    try {
      const users = UserService.getAllUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Verify password
      if (btoa(password) !== user.password) {
        return { success: false, error: 'Invalid password' };
      }

      // Create session
      const session = {
        userId: user.id,
        email: user.email,
        username: user.username,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
        ...user,
        lastLogin: new Date().toISOString()
      }));

      return { success: true, user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Failed to login' };
    }
  },

  // Logout user
  logout: () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, error: 'Failed to logout' };
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userJson = localStorage.getItem(USER_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (err) {
      console.error('Get user error:', err);
      return null;
    }
  },

  // Get all users
  getAllUsers: () => {
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (err) {
      console.error('Get users error:', err);
      return [];
    }
  },

  // Update user profile
  updateProfile: (userId, updates) => {
    try {
      const users = UserService.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      users[userIndex] = updatedUser;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Update profile error:', err);
      return { success: false, error: 'Failed to update profile' };
    }
  },

  // Save recipe for user
  saveRecipe: (userId, recipeId) => {
    try {
      const users = UserService.getAllUsers();
      const user = users.find(u => u.id === userId);

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (!user.savedRecipes.includes(recipeId)) {
        user.savedRecipes.push(recipeId);
      }

      const userIndex = users.findIndex(u => u.id === userId);
      users[userIndex] = user;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      return { success: true, user };
    } catch (err) {
      console.error('Save recipe error:', err);
      return { success: false, error: 'Failed to save recipe' };
    }
  },

  // Remove saved recipe
  removeSavedRecipe: (userId, recipeId) => {
    try {
      const users = UserService.getAllUsers();
      const user = users.find(u => u.id === userId);

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      user.savedRecipes = user.savedRecipes.filter(id => id !== recipeId);

      const userIndex = users.findIndex(u => u.id === userId);
      users[userIndex] = user;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      return { success: true, user };
    } catch (err) {
      console.error('Remove recipe error:', err);
      return { success: false, error: 'Failed to remove recipe' };
    }
  },

  // Check if session is valid
  isSessionValid: () => {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      return session !== null;
    } catch {
      return false;
    }
  },

  // Get user saved recipes
  getSavedRecipes: (userId) => {
    try {
      const users = UserService.getAllUsers();
      const user = users.find(u => u.id === userId);
      return user ? user.savedRecipes : [];
    } catch {
      return [];
    }
  }
};