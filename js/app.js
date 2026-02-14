/**
 * Main application module for Calorie Tracker
 */

import {
    formatDate,
    dateToISO,
    addDays,
    getTodayISO,
    getCurrentTime,
    sanitize
} from './utils.js';

import {
    getCalorieGoal,
    setCalorieGoal,
    getFoodEntriesByDate,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    getTotalCaloriesForDate,
    getFoodEntriesInRange,
    hasNotificationBeenShown,
    markNotificationAsShown,
    getSettings,
    saveSettings,
    clearNotificationsForDate
} from './storage.js';

import {
    initChart,
    updateChart,
    getColorForPercentage
} from './chart.js';

import {
    showToast,
    checkThresholds,
    showEntryAdded,
    showEntryUpdated,
    showEntryDeleted,
    showError,
    showSettingsSaved
} from './notifications.js';

import {
    updateDateDisplay,
    updateDashboardStats,
    renderMealsList,
    updateWeeklySummary,
    openSettingsModal,
    closeSettingsModal,
    populateFormForEdit,
    resetForm,
    showFormError,
    clearFormErrors,
    validateForm
} from './ui.js';

// Application state
let currentDate = new Date();
let calorieChart = null;

/**
 * Initialize the application
 */
function init() {
    // Initialize chart
    calorieChart = initChart();
    
    // Set initial date
    currentDate = new Date();
    
    // Set current date display
    updateDateDisplay(currentDate);
    
    // Set default time in form
    const timeInput = document.getElementById('mealTime');
    if (timeInput) {
        timeInput.value = getCurrentTime();
    }
    
    // Load and display data
    loadAndDisplayData();
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Load and display data for the current date
 */
function loadAndDisplayData() {
    const dateStr = dateToISO(currentDate);
    const goal = getCalorieGoal();
    const entries = getFoodEntriesByDate(dateStr);
    const consumed = getTotalCaloriesForDate(dateStr);
    const percentage = calculatePercentage(consumed, goal);

    // Update dashboard
    updateDashboardStats(consumed, goal);
    
    // Update chart
    updateChart(consumed, goal, percentage);
    
    // Render meals list
    renderMealsList(entries, handleEdit, handleDelete);
    
    // Update weekly summary
    updateWeeklySummaryForCurrentDate();
    
    // Check for notifications (only if today)
    if (isToday(currentDate)) {
        checkThresholds(consumed, goal, dateStr, { hasNotificationBeenShown, markNotificationAsShown, getSettings });
    }
}

/**
 * Update weekly summary for the current date's week
 */
function updateWeeklySummaryForCurrentDate() {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = addDays(weekStart, 6);
    
    const entries = getFoodEntriesInRange(
        dateToISO(weekStart),
        dateToISO(weekEnd)
    );
    
    const goal = getCalorieGoal();
    updateWeeklySummary(entries, goal);
}

/**
 * Check if the given date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
function isToday(date) {
    return dateToISO(date) === getTodayISO();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Food form submission
    const foodForm = document.getElementById('foodForm');
    if (foodForm) {
        foodForm.addEventListener('submit', handleFormSubmit);
    }

    // Date navigation
    const prevDayBtn = document.getElementById('prevDay');
    const nextDayBtn = document.getElementById('nextDay');
    const todayBtn = document.getElementById('todayBtn');

    if (prevDayBtn) {
        prevDayBtn.addEventListener('click', () => navigateDay(-1));
    }
    if (nextDayBtn) {
        nextDayBtn.addEventListener('click', () => navigateDay(1));
    }
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            updateDateDisplay(currentDate);
            loadAndDisplayData();
        });
    }

    // Settings modal
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = document.querySelector('.close-btn');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const modal = document.getElementById('settingsModal');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettingsModal);
    }
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', closeSettingsModal);
    }
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', handleSaveSettings);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSettingsModal();
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSettingsModal();
        }
    });
}

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const foodNameInput = document.getElementById('foodName');
    const caloriesInput = document.getElementById('calories');
    const mealTimeInput = document.getElementById('mealTime');
    const submitBtn = e.target.querySelector('.submit-btn');

    const foodName = foodNameInput.value.trim();
    const calories = parseInt(caloriesInput.value, 10);
    const time = mealTimeInput.value;

    // Validate form
    const validation = validateForm(foodName, calories, time);
    if (!validation.isValid) {
        clearFormErrors();
        Object.entries(validation.errors).forEach(([field, message]) => {
            showFormError(field, message);
        });
        return;
    }

    clearFormErrors();

    const dateStr = dateToISO(currentDate);
    const editId = submitBtn.dataset.editId;

    try {
        if (editId) {
            // Update existing entry
            updateFoodEntry(editId, {
                name: foodName,
                calories: calories,
                time: time
            });
            showEntryUpdated(foodName);
        } else {
            // Add new entry
            addFoodEntry({
                name: foodName,
                calories: calories,
                time: time,
                date: dateStr
            });
            showEntryAdded(foodName, calories);
        }

        // Reset form
        resetForm();

        // Reload data
        loadAndDisplayData();

    } catch (error) {
        showError(error.message || 'Failed to save entry. Please try again.');
    }
}

/**
 * Handle edit action
 * @param {string} id - Entry ID to edit
 */
function handleEdit(id) {
    const dateStr = dateToISO(currentDate);
    const entries = getFoodEntriesByDate(dateStr);
    const entry = entries.find(e => e.id === id);

    if (entry) {
        populateFormForEdit(entry);
    }
}

/**
 * Handle delete action
 * @param {string} id - Entry ID to delete
 */
function handleDelete(id) {
    const dateStr = dateToISO(currentDate);
    const entries = getFoodEntriesByDate(dateStr);
    const entry = entries.find(e => e.id === id);

    if (entry && confirm(`Are you sure you want to delete "${entry.name}"?`)) {
        try {
            deleteFoodEntry(id);
            showEntryDeleted(entry.name);
            loadAndDisplayData();
        } catch (error) {
            showError('Failed to delete entry. Please try again.');
        }
    }
}

/**
 * Navigate to a different day
 * @param {number} days - Number of days to navigate (negative for past, positive for future)
 */
function navigateDay(days) {
    currentDate = addDays(currentDate, days);
    updateDateDisplay(currentDate);
    loadAndDisplayData();
}

/**
 * Handle save settings
 */
function handleSaveSettings() {
    const goalInput = document.getElementById('dailyGoalInput');
    const notificationsCheckbox = document.getElementById('notificationsEnabled');

    const newGoal = parseInt(goalInput.value, 10);
    const notificationsEnabled = notificationsCheckbox.checked;

    // Validate goal
    if (isNaN(newGoal) || newGoal < 500 || newGoal > 10000) {
        showFormError('dailyGoalInput', 'Please enter a goal between 500 and 10000 calories');
        return;
    }

    try {
        // Save settings
        setCalorieGoal(newGoal);
        saveSettings({ notificationsEnabled });

        // Reload data
        loadAndDisplayData();

        // Close modal
        closeSettingsModal();

        // Show success message
        showSettingsSaved();

    } catch (error) {
        showError(error.message || 'Failed to save settings. Please try again.');
    }
}

/**
 * Calculate percentage helper
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.min(100, Math.round((part / total) * 100));
}

/**
 * Get week start helper
 * @param {Date} date - Date
 * @returns {Date} Week start (Sunday)
 */
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}