// ===============================================
// Validation - חוקי ולידציה לטפסים
// ===============================================
const EMAIL_REGEX = /\S+@\S+\.\S+/;
const PHONE_REGEX = /^05\d{8}$/;
const MIN_PASSWORD_LENGTH = 6;

export const validationRules = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
  },

  email: {
    required: 'Email is required',
    pattern: { value: EMAIL_REGEX, message: 'Email is invalid' },
  },

  phone: {
    required: 'Phone is required',
    pattern: { value: PHONE_REGEX, message: 'Phone must be Israeli format (05XXXXXXXXX)' },
    setValueAs: (v: string) => v.replace(/[-\s]/g, ''),
  },

  password: {
    required: 'Password is required',
    minLength: { value: MIN_PASSWORD_LENGTH, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
  },

  confirmPassword: (passwordValue: string) => ({
    required: 'Please confirm your password',
    validate: (val: string) => val === passwordValue || 'Passwords do not match',
  }),

  recipeName: {
    required: 'Recipe name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
  },

  description: {
    required: 'Description is required',
    minLength: { value: 10, message: 'Description must be at least 10 characters' },
  },
};

/**
 * ולידציה פשוטה בלי React Hook Form
 */
export const validate = {
  isEmail: (email: string) => EMAIL_REGEX.test(email),
  isPhone: (phone: string) => PHONE_REGEX.test(phone.replace(/[-\s]/g, '')),
  isUrl: (url: string) => { try { new URL(url); return true; } catch { return false; } },
  isNotEmpty: (val: string) => val.trim().length > 0,
};