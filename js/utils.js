/**
 * Utility functions for the Calorie Tracker app
 */

/**
 * Format a date as a readable string (e.g., "Monday, January 15, 2024")
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get the current date as an ISO string (YYYY-MM-DD)
 * @returns {string} ISO date string
 */
export function getTodayISO() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get an ISO date string for a specific date
 * @param {Date} date - The date to convert
 * @returns {string} ISO date string
 */
export function dateToISO(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Add days to a date
 * @param {Date} date - The base date
 * @param {number} days - Number of days to add (negative to subtract)
 * @returns {Date} New date
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are same day
 */
export function isSameDay(date1, date2) {
    return dateToISO(date1) === dateToISO(date2);
}

/**
 * Get the start of the week (Sunday) for a given date
 * @param {Date} date - The date
 * @returns {Date} Start of the week
 */
export function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Calculate percentage
 * @param {number} part - The part value
 * @param {number} total - The total value
 * @returns {number} Percentage (0-100)
 */
export function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.min(100, Math.round((part / total) * 100));
}

/**
 * Format a time string for display
 * @param {string} timeStr - Time in HH:MM format
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
export function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Get the current time in HH:MM format
 * @returns {string} Current time
 */
export function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Clone an object deeply
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}