// Validation rules
export const validateRequired = (value) => {
  if (!value || value.trim() === '') {
    return 'This field is required';
  }
  return null;
};

export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (value) => {
  if (value.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(value)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(value)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validatePhone = (value) => {
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  if (!phoneRegex.test(value)) {
    return 'Please enter a valid Pakistani phone number';
  }
  return null;
};

export const validateMinLength = (value, min) => {
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return null;
};

export const validateMaxLength = (value, max) => {
  if (value.length > max) {
    return `Must be no more than ${max} characters`;
  }
  return null;
};
