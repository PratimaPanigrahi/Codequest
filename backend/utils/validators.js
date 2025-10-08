/**
 * Basic input validation utility functions
 */

/**
 * Checks if a string is a valid email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Checks if a password is strong
 * Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
 * @param {string} password
 * @returns {boolean}
 */
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

/**
 * Checks if a string is not empty
 * @param {string} value
 * @returns {boolean}
 */
export const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

/**
 * Checks if a number is within a range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export const isNumberInRange = (value, min, max) => {
  return typeof value === "number" && value >= min && value <= max;
};

/**
 * Checks if an array is not empty
 * @param {Array} arr
 * @returns {boolean}
 */
export const isNonEmptyArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};
