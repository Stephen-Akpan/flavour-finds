import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { ValidationRules, validateForm, passwordsMatch, isCommonPassword, sanitizeInput } from '../utils/validation';
import { UserService } from '../services/userService';

export const AuthModal = React.memo(({ 
  authMode, 
  setAuthMode, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  showPassword, 
  setShowPassword, 
  onSubmit, 
  onClose,
  onLoginSuccess
}) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateAuthForm = () => {
    const newErrors = {};
    setFormError('');

    // Email validation
    const emailError = ValidationRules.email(email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = ValidationRules.password(password, 6);
    if (passwordError) newErrors.password = passwordError;

    if (authMode === 'signup') {
      // Username validation
      const usernameError = ValidationRules.username(username);
      if (usernameError) newErrors.username = usernameError;

      // Confirm password validation
      const confirmError = passwordsMatch(password, confirmPassword);
      if (confirmError) newErrors.confirmPassword = confirmError;

      // Common password check
      if (isCommonPassword(password)) {
        newErrors.password = 'Password is too common. Please choose a stronger password';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAuthForm()) {
      return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      let result;

      if (authMode === 'signin') {
        // Login
        result = UserService.login(email, password);
      } else {
        // Register
        result = UserService.register(email, password, username);
      }

      if (result.success) {
        setSuccessMessage(authMode === 'signin' ? 'Login successful!' : 'Account created successfully!');
        
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setErrors({});

        // Call parent callback
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }

        // Close modal after brief delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFormError(result.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>{authMode === 'signin' ? 'Welcome Back!' : 'Create Account'}</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>
          {authMode === 'signin' 
            ? 'Sign in to save recipes and access your collection' 
            : 'Join FlavorFinds to discover and save amazing recipes'}
        </p>

        {formError && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            background: '#ffe0e0',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            color: '#c92a2a',
            fontSize: '0.9rem'
          }}>
            {formError}
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            background: '#d3f9d8',
            border: '1px solid #06d6a0',
            borderRadius: '8px',
            color: '#2b8a3e',
            fontSize: '0.9rem'
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAuthSubmit}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label>Username</label>
              <div className="input-with-icon">
                <User size={20} />
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => {
                    setUsername(sanitizeInput(e.target.value));
                    setErrors({ ...errors, username: '' });
                  }}
                />
              </div>
              {errors.username && (
                <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '5px' }}>
                  {errors.username}
                </p>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={20} />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.toLowerCase());
                  setErrors({ ...errors, email: '' });
                }}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '5px' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: '' });
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '5px' }}>
                {errors.password}
              </p>
            )}
          </div>

          {authMode === 'signup' && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '5px' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '20px', opacity: isLoading ? 0.6 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          {authMode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => {
                setAuthMode('signup');
                setErrors({});
                setFormError('');
              }}>Sign Up</button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => {
                setAuthMode('signin');
                setErrors({});
                setFormError('');
              }}>Sign In</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
});