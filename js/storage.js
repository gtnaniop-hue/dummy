/**
 * LocalStorage management for Calorie Tracker
 */

const STORAGE_KEYS = {
    CALORIE_GOAL: 'calorieGoal',
    FOOD_ENTRIES: 'foodEntries',
    NOTIFICATIONS_SHOWN: 'notificationsShown',
    SETTINGS: 'settings'
};

const DEFAULT_GOAL = 2000;

/**
 * Get the daily calorie goal from localStorage
 * @returns {number} The daily calorie goal
 */
export function getCalorieGoal() {
    try {
        const goal = localStorage.getItem(STORAGE_KEYS.CALORIE_GOAL);
        return goal ? parseInt(goal, 10) : DEFAULT_GOAL;
    } catch (error) {
        console.error('Error reading calorie goal:', error);
        return DEFAULT_GOAL;
    }
}

/**
 * Set the daily calorie goal
 * @param {number} goal - The goal to set
 */
export function setCalorieGoal(goal) {
    try {
        localStorage.setItem(STORAGE_KEYS.CALORIE_GOAL, goal.toString());
    } catch (error) {
        console.error('Error saving calorie goal:', error);
        throw new Error('Failed to save calorie goal. Storage may be full.');
    }
}

/**
 * Get all food entries from localStorage
 * @returns {Array} Array of food entries
 */
export function getAllFoodEntries() {
    try {
        const entries = localStorage.getItem(STORAGE_KEYS.FOOD_ENTRIES);
        return entries ? JSON.parse(entries) : [];
    } catch (error) {
        console.error('Error reading food entries:', error);
        return [];
    }
}

/**
 * Save all food entries to localStorage
 * @param {Array} entries - Array of food entries to save
 */
export function saveAllFoodEntries(entries) {
    try {
        localStorage.setItem(STORAGE_KEYS.FOOD_ENTRIES, JSON.stringify(entries));
    } catch (error) {
        console.error('Error saving food entries:', error);
        throw new Error('Failed to save food entries. Storage may be full.');
    }
}

/**
 * Get food entries for a specific date
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {Array} Array of food entries for the date
 */
export function getFoodEntriesByDate(dateStr) {
    const allEntries = getAllFoodEntries();
    return allEntries.filter(entry => entry.date === dateStr);
}

/**
 * Add a new food entry
 * @param {Object} entry - Food entry object
 * @returns {Object} The saved entry with ID
 */
export function addFoodEntry(entry) {
    try {
        const entries = getAllFoodEntries();
        const newEntry = {
            ...entry,
            id: generateId(),
            createdAt: new Date().toISOString()
        };
        entries.push(newEntry);
        saveAllFoodEntries(entries);
        return newEntry;
    } catch (error) {
        console.error('Error adding food entry:', error);
        throw error;
    }
}

/**
 * Update an existing food entry
 * @param {string} id - Entry ID to update
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated entry or null if not found
 */
export function updateFoodEntry(id, updates) {
    try {
        const entries = getAllFoodEntries();
        const index = entries.findIndex(entry => entry.id === id);
        
        if (index === -1) {
            return null;
        }
        
        entries[index] = {
            ...entries[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        saveAllFoodEntries(entries);
        return entries[index];
    } catch (error) {
        console.error('Error updating food entry:', error);
        throw error;
    }
}

/**
 * Delete a food entry
 * @param {string} id - Entry ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteFoodEntry(id) {
    try {
        const entries = getAllFoodEntries();
        const filtered = entries.filter(entry => entry.id !== id);
        
        if (filtered.length === entries.length) {
            return false;
        }
        
        saveAllFoodEntries(filtered);
        return true;
    } catch (error) {
        console.error('Error deleting food entry:', error);
        throw error;
    }
}

/**
 * Get the total calories for a specific date
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {number} Total calories for the date
 */
export function getTotalCaloriesForDate(dateStr) {
    const entries = getFoodEntriesByDate(dateStr);
    return entries.reduce((sum, entry) => sum + entry.calories, 0);
}

/**
 * Get food entries for a date range
 * @param {string} startDate - ISO date string (YYYY-MM-DD)
 * @param {string} endDate - ISO date string (YYYY-MM-DD)
 * @returns {Array} Array of food entries in the range
 */
export function getFoodEntriesInRange(startDate, endDate) {
    const allEntries = getAllFoodEntries();
    return allEntries.filter(entry => {
        return entry.date >= startDate && entry.date <= endDate;
    });
}

/**
 * Get notification status for a specific date and threshold
 * @param {string} dateStr - ISO date string
 * @param {string} threshold - Threshold type ('80%' or '100%')
 * @returns {boolean} True if notification has been shown
 */
export function hasNotificationBeenShown(dateStr, threshold) {
    try {
        const shown = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_SHOWN);
        const notifications = shown ? JSON.parse(shown) : {};
        return notifications[`${dateStr}-${threshold}`] || false;
    } catch (error) {
        console.error('Error reading notification status:', error);
        return false;
    }
}

/**
 * Mark a notification as shown for a specific date and threshold
 * @param {string} dateStr - ISO date string
 * @param {string} threshold - Threshold type
 */
export function markNotificationAsShown(dateStr, threshold) {
    try {
        const shown = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_SHOWN);
        const notifications = shown ? JSON.parse(shown) : {};
        notifications[`${dateStr}-${threshold}`] = true;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_SHOWN, JSON.stringify(notifications));
    } catch (error) {
        console.error('Error saving notification status:', error);
    }
}

/**
 * Clear notifications for a specific date (call when date changes)
 * @param {string} dateStr - ISO date string
 */
export function clearNotificationsForDate(dateStr) {
    try {
        const shown = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_SHOWN);
        if (!shown) return;
        
        const notifications = JSON.parse(shown);
        const keysToDelete = Object.keys(notifications).filter(key => key.startsWith(dateStr));
        
        keysToDelete.forEach(key => {
            delete notifications[key];
        });
        
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_SHOWN, JSON.stringify(notifications));
    } catch (error) {
        console.error('Error clearing notifications:', error);
    }
}

/**
 * Get settings from localStorage
 * @returns {Object} Settings object
 */
export function getSettings() {
    try {
        const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : { notificationsEnabled: true };
    } catch (error) {
        console.error('Error reading settings:', error);
        return { notificationsEnabled: true };
    }
}

/**
 * Save settings to localStorage
 * @param {Object} settings - Settings object to save
 */
export function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
        throw new Error('Failed to save settings. Storage may be full.');
    }
}

/**
 * Clear all data (for testing or reset)
 */
export function clearAllData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}