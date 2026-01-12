export const ValidationRules = {
  // Email validation
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    if (value.length > 254) return 'Email is too long';
    return null;
  },

  // Password validation
  password: (value, minLength = 6) => {
    if (!value) return 'Password is required';
    if (value.length < minLength) return `Password must be at least ${minLength} characters`;
    if (value.length > 128) return 'Password is too long';
    return null;
  },

  // Strong password validation
  strongPassword: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain number';
    if (!/[!@#$%^&*]/.test(value)) return 'Password must contain special character (!@#$%^&*)';
    return null;
  },

  // Username validation
  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 50) return 'Username is too long';
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Username can only contain letters, numbers, underscore, and hyphen';
    return null;
  },

  // Name validation
  name: (value) => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (value.length > 100) return 'Name is too long';
    if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return null;
  },

  // Phone number validation
  phone: (value) => {
    if (!value) return null; // Optional field
    const phoneRegex = /^[\d\s()+-]+$/;
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 10) return 'Phone number must have at least 10 digits';
    if (digitsOnly.length > 15) return 'Phone number is too long';
    return null;
  },

  // URL validation
  url: (value) => {
    if (!value) return null; // Optional field
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  // Recipe title validation
  recipeTitle: (value) => {
    if (!value) return 'Recipe title is required';
    if (value.length < 3) return 'Recipe title must be at least 3 characters';
    if (value.length > 200) return 'Recipe title is too long';
    return null;
  },

  // Recipe description validation
  recipeDescription: (value, minLength = 10, maxLength = 5000) => {
    if (!value) return 'Description is required';
    if (value.length < minLength) return `Description must be at least ${minLength} characters`;
    if (value.length > maxLength) return `Description cannot exceed ${maxLength} characters`;
    return null;
  }
};

// Validate entire form object
export const validateForm = (formData, schema) => {
  const errors = {};
  
  Object.entries(schema).forEach(([field, rule]) => {
    const value = formData[field] || '';
    const error = rule(value);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

// Validate password match
export const passwordsMatch = (password, confirmPassword) => {
  if (!password || !confirmPassword) return 'Both passwords are required';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

// Check for common weak passwords
export const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'password123', '111111', '1234567', 'admin', 'letmein'
  ];
  return commonPasswords.includes(password.toLowerCase());
};