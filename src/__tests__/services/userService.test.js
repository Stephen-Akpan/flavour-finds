import { UserService } from '../../services/userService';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('UserService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('register', () => {
    test('should register new user successfully', () => {
      const result = UserService.register('test@example.com', 'Password123');
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    test('should prevent duplicate email registration', () => {
      UserService.register('test@example.com', 'Password123');
      const result = UserService.register('test@example.com', 'Different123');
      expect(result.success).toBe(false);
      expect(result.error).toContain('already registered');
    });

    test('should create user with username', () => {
      const result = UserService.register('test@example.com', 'Password123', 'testuser');
      expect(result.user.username).toBe('testuser');
    });

    test('should generate default username from email if not provided', () => {
      const result = UserService.register('test@example.com', 'Password123');
      expect(result.user.username).toBe('test');
    });

    test('should create empty saved recipes array', () => {
      const result = UserService.register('test@example.com', 'Password123');
      expect(Array.isArray(result.user.savedRecipes)).toBe(true);
      expect(result.user.savedRecipes.length).toBe(0);
    });

    test('should set creation timestamp', () => {
      const result = UserService.register('test@example.com', 'Password123');
      expect(result.user.createdAt).toBeDefined();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      UserService.register('test@example.com', 'Password123', 'testuser');
    });

    test('should login with correct credentials', () => {
      const result = UserService.login('test@example.com', 'Password123');
      expect(result.success).toBe(true);
      expect(result.user.email).toBe('test@example.com');
    });

    test('should reject non-existent user', () => {
      const result = UserService.login('nonexistent@example.com', 'Password123');
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should reject incorrect password', () => {
      const result = UserService.login('test@example.com', 'WrongPassword');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid password');
    });

    test('should create session on successful login', () => {
      UserService.login('test@example.com', 'Password123');
      expect(UserService.isSessionValid()).toBe(true);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      UserService.register('test@example.com', 'Password123');
      UserService.login('test@example.com', 'Password123');
    });

    test('should logout successfully', () => {
      const result = UserService.logout();
      expect(result.success).toBe(true);
    });

    test('should invalidate session after logout', () => {
      UserService.logout();
      expect(UserService.isSessionValid()).toBe(false);
    });

    test('should clear user data after logout', () => {
      UserService.logout();
      expect(UserService.getCurrentUser()).toBeNull();
    });
  });

  describe('saveRecipe', () => {
    let userId;

    beforeEach(() => {
      const result = UserService.register('test@example.com', 'Password123');
      userId = result.user.id;
    });

    test('should save recipe for user', () => {
      const result = UserService.saveRecipe(userId, 'recipe123');
      expect(result.success).toBe(true);
      expect(result.user.savedRecipes).toContain('recipe123');
    });

    test('should not duplicate saved recipes', () => {
      UserService.saveRecipe(userId, 'recipe123');
      UserService.saveRecipe(userId, 'recipe123');
      const user = UserService.getCurrentUser();
      expect(user.savedRecipes.filter(r => r === 'recipe123').length).toBe(1);
    });

    test('should reject non-existent user', () => {
      const result = UserService.saveRecipe('invalid-id', 'recipe123');
      expect(result.success).toBe(false);
    });
  });

  describe('removeSavedRecipe', () => {
    let userId;

    beforeEach(() => {
      const result = UserService.register('test@example.com', 'Password123');
      userId = result.user.id;
      UserService.saveRecipe(userId, 'recipe123');
    });

    test('should remove saved recipe', () => {
      const result = UserService.removeSavedRecipe(userId, 'recipe123');
      expect(result.success).toBe(true);
      expect(result.user.savedRecipes).not.toContain('recipe123');
    });

    test('should not error when removing non-existent recipe', () => {
      const result = UserService.removeSavedRecipe(userId, 'nonexistent');
      expect(result.success).toBe(true);
    });
  });

  describe('updateProfile', () => {
    let userId;

    beforeEach(() => {
      const result = UserService.register('test@example.com', 'Password123', 'testuser');
      userId = result.user.id;
    });

    test('should update user profile', () => {
      const result = UserService.updateProfile(userId, {
        username: 'newusername'
      });
      expect(result.success).toBe(true);
      expect(result.user.username).toBe('newusername');
    });

    test('should update saved recipes', () => {
      const result = UserService.updateProfile(userId, {
        savedRecipes: ['recipe1', 'recipe2']
      });
      expect(result.user.savedRecipes).toEqual(['recipe1', 'recipe2']);
    });

    test('should set updated timestamp', () => {
      const result = UserService.updateProfile(userId, { username: 'new' });
      expect(result.user.updatedAt).toBeDefined();
    });

    test('should reject non-existent user', () => {
      const result = UserService.updateProfile('invalid-id', { username: 'new' });
      expect(result.success).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    test('should return null when no user logged in', () => {
      const user = UserService.getCurrentUser();
      expect(user).toBeNull();
    });

    test('should return current logged in user', () => {
      const registered = UserService.register('test@example.com', 'Password123');
      UserService.login('test@example.com', 'Password123');
      const current = UserService.getCurrentUser();
      expect(current.id).toBe(registered.user.id);
    });
  });

  describe('isSessionValid', () => {
    test('should return false when no session', () => {
      expect(UserService.isSessionValid()).toBe(false);
    });

    test('should return true when session exists', () => {
      UserService.register('test@example.com', 'Password123');
      UserService.login('test@example.com', 'Password123');
      expect(UserService.isSessionValid()).toBe(true);
    });
  });
});
