import { ValidationRules, validateForm, sanitizeInput, passwordsMatch, isCommonPassword } from '../../utils/validation';

describe('ValidationRules', () => {
  describe('email validation', () => {
    test('should accept valid email', () => {
      const result = ValidationRules.email('test@example.com');
      expect(result).toBeNull();
    });

    test('should reject email without @', () => {
      const result = ValidationRules.email('testexample.com');
      expect(result).not.toBeNull();
      expect(result).toContain('valid email');
    });

    test('should reject email without domain', () => {
      const result = ValidationRules.email('test@.com');
      expect(result).not.toBeNull();
    });

    test('should reject empty email', () => {
      const result = ValidationRules.email('');
      expect(result).not.toBeNull();
      expect(result).toContain('required');
    });

    test('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(255) + '@test.com';
      const result = ValidationRules.email(longEmail);
      expect(result).not.toBeNull();
    });
  });

  describe('password validation', () => {
    test('should accept valid password', () => {
      const result = ValidationRules.password('password123');
      expect(result).toBeNull();
    });

    test('should reject empty password', () => {
      const result = ValidationRules.password('');
      expect(result).not.toBeNull();
      expect(result).toContain('required');
    });

    test('should reject password shorter than minimum', () => {
      const result = ValidationRules.password('pass', 6);
      expect(result).not.toBeNull();
      expect(result).toContain('at least 6');
    });

    test('should reject password longer than maximum', () => {
      const longPass = 'a'.repeat(129);
      const result = ValidationRules.password(longPass);
      expect(result).not.toBeNull();
    });
  });

  describe('strong password validation', () => {
    test('should accept strong password', () => {
      const result = ValidationRules.strongPassword('StrongPass123!');
      expect(result).toBeNull();
    });

    test('should reject password without uppercase', () => {
      const result = ValidationRules.strongPassword('strongpass123!');
      expect(result).not.toBeNull();
      expect(result).toContain('uppercase');
    });

    test('should reject password without lowercase', () => {
      const result = ValidationRules.strongPassword('STRONGPASS123!');
      expect(result).not.toBeNull();
      expect(result).toContain('lowercase');
    });

    test('should reject password without number', () => {
      const result = ValidationRules.strongPassword('StrongPass!');
      expect(result).not.toBeNull();
      expect(result).toContain('number');
    });

    test('should reject password without special character', () => {
      const result = ValidationRules.strongPassword('StrongPass123');
      expect(result).not.toBeNull();
      expect(result).toContain('special character');
    });

    test('should reject password shorter than 8 characters', () => {
      const result = ValidationRules.strongPassword('Pass1!');
      expect(result).not.toBeNull();
      expect(result).toContain('8 characters');
    });
  });

  describe('username validation', () => {
    test('should accept valid username', () => {
      const result = ValidationRules.username('user123');
      expect(result).toBeNull();
    });

    test('should reject username with special characters', () => {
      const result = ValidationRules.username('user@name');
      expect(result).not.toBeNull();
    });

    test('should reject username shorter than 3 characters', () => {
      const result = ValidationRules.username('ab');
      expect(result).not.toBeNull();
      expect(result).toContain('3 characters');
    });

    test('should accept username with underscore and hyphen', () => {
      const result = ValidationRules.username('user_name-123');
      expect(result).toBeNull();
    });
  });
});

describe('sanitizeInput', () => {
  test('should sanitize XSS attempt with script tag', () => {
    const input = '<script>alert("xss")</script>';
    const result = sanitizeInput(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  test('should sanitize HTML special characters', () => {
    const input = '<div>Test & "quotes"</div>';
    const result = sanitizeInput(input);
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
    expect(result).toContain('&quot;');
  });

  test('should trim whitespace', () => {
    const input = '  test  ';
    const result = sanitizeInput(input);
    expect(result).toBe('test');
  });

  test('should return non-string input unchanged', () => {
    const input = 123;
    const result = sanitizeInput(input);
    expect(result).toBe(123);
  });
});

describe('passwordsMatch', () => {
  test('should accept matching passwords', () => {
    const result = passwordsMatch('password123', 'password123');
    expect(result).toBeNull();
  });

  test('should reject mismatched passwords', () => {
    const result = passwordsMatch('password123', 'different123');
    expect(result).not.toBeNull();
    expect(result).toContain('do not match');
  });

  test('should reject if one password is empty', () => {
    const result = passwordsMatch('password123', '');
    expect(result).not.toBeNull();
  });
});

describe('isCommonPassword', () => {
  test('should detect common password', () => {
    const result = isCommonPassword('password');
    expect(result).toBe(true);
  });

  test('should detect common password case-insensitive', () => {
    const result = isCommonPassword('PASSWORD');
    expect(result).toBe(true);
  });

  test('should reject uncommon password', () => {
    const result = isCommonPassword('XyZ9#mK$vL2');
    expect(result).toBe(false);
  });
});

describe('validateForm', () => {
  test('should validate entire form successfully', () => {
    const formData = {
      email: 'test@example.com',
      username: 'testuser'
    };
    const schema = {
      email: ValidationRules.email,
      username: ValidationRules.username
    };
    const result = validateForm(formData, schema);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  test('should return errors for invalid form data', () => {
    const formData = {
      email: 'invalid',
      username: 'ab'
    };
    const schema = {
      email: ValidationRules.email,
      username: ValidationRules.username
    };
    const result = validateForm(formData, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).not.toBeNull();
    expect(result.errors.username).not.toBeNull();
  });
});
