/**
 * UI rendering and updates for Calorie Tracker
 */

import {
    formatDate,
    calculatePercentage,
    sanitize,
    formatTime,
    getCurrentTime
} from './utils.js';

import { getCalorieGoal, getSettings } from './storage.js';

/**
 * Update the current date display
 * @param {Date} date - The date to display
 */
export function updateDateDisplay(date) {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = formatDate(date);
    }
}

/**
 * Update the dashboard statistics
 * @param {number} consumed - Calories consumed
 * @param {number} goal - Daily calorie goal
 */
export function updateDashboardStats(consumed, goal) {
    const goalElement = document.getElementById('dailyGoal');
    const consumedElement = document.getElementById('caloriesConsumed');
    const percentageElement = document.getElementById('caloriePercentage');
    const remainingElement = document.getElementById('caloriesRemaining');
    const progressFill = document.getElementById('progressFill');

    if (goalElement) goalElement.textContent = goal;
    if (consumedElement) consumedElement.textContent = consumed;
    if (percentageElement) {
        const percentage = calculatePercentage(consumed, goal);
        percentageElement.textContent = `${percentage}%`;

        // Update color based on percentage
        percentageElement.classList.remove('warning', 'danger');
        if (consumedElement) {
            consumedElement.classList.remove('warning', 'danger');
        }

        if (percentage >= 80 && percentage < 100) {
            percentageElement.classList.add('warning');
            if (consumedElement) consumedElement.classList.add('warning');
        } else if (percentage >= 100) {
            percentageElement.classList.add('danger');
            if (consumedElement) consumedElement.classList.add('danger');
        }
    }
    
    if (remainingElement) {
        const remaining = Math.max(0, goal - consumed);
        remainingElement.textContent = remaining;
    }

    // Update progress bar
    if (progressFill) {
        const percentage = calculatePercentage(consumed, goal);
        progressFill.style.width = `${percentage}%`;
        progressFill.classList.remove('warning', 'danger');
        
        if (percentage >= 80 && percentage < 100) {
            progressFill.classList.add('warning');
        } else if (percentage >= 100) {
            progressFill.classList.add('danger');
        }
    }
}

/**
 * Render the meals list
 * @param {Array} entries - Array of food entries
 * @param {Function} onEdit - Callback for edit action
 * @param {Function} onDelete - Callback for delete action
 */
export function renderMealsList(entries, onEdit, onDelete) {
    const mealsList = document.getElementById('mealsList');
    if (!mealsList) return;

    if (entries.length === 0) {
        mealsList.innerHTML = '<p class="empty-state">No entries yet. Add your first meal above!</p>';
        return;
    }

    // Sort entries by time
    const sortedEntries = [...entries].sort((a, b) => a.time.localeCompare(b.time));

    mealsList.innerHTML = sortedEntries.map(entry => `
        <div class="meal-item" data-id="${entry.id}">
            <div class="meal-info">
                <div class="meal-name">${sanitize(entry.name)}</div>
                <div class="meal-details">${formatTime(entry.time)}</div>
            </div>
            <span class="meal-calories">${entry.calories} cal</span>
            <div class="meal-actions">
                <button class="edit-btn" data-id="${entry.id}" aria-label="Edit ${sanitize(entry.name)}">Edit</button>
                <button class="delete-btn" data-id="${entry.id}" aria-label="Delete ${sanitize(entry.name)}">Delete</button>
            </div>
        </div>
    `).join('');

    // Add event listeners
    mealsList.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            onEdit(btn.dataset.id);
        });
    });

    mealsList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            onDelete(btn.dataset.id);
        });
    });
}

/**
 * Update the weekly summary
 * @param {Array} entries - Food entries for the week
 * @param {number} goal - Daily calorie goal
 */
export function updateWeeklySummary(entries, goal) {
    const avgElement = document.getElementById('weeklyAverage');
    const totalElement = document.getElementById('weeklyTotal');
    const daysUnderElement = document.getElementById('daysUnderGoal');

    if (!avgElement || !totalElement || !daysUnderElement) return;

    // Group entries by date
    const entriesByDate = {};
    entries.forEach(entry => {
        if (!entriesByDate[entry.date]) {
            entriesByDate[entry.date] = 0;
        }
        entriesByDate[entry.date] += entry.calories;
    });

    const dailyTotals = Object.values(entriesByDate);
    const weeklyTotal = dailyTotals.reduce((sum, total) => sum + total, 0);
    const avgDaily = dailyTotals.length > 0 ? Math.round(weeklyTotal / 7) : 0;
    const daysUnderGoal = dailyTotals.filter(total => total < goal).length;

    avgElement.textContent = avgDaily;
    totalElement.textContent = weeklyTotal;
    daysUnderElement.textContent = daysUnderGoal;
}

/**
 * Open the settings modal
 */
export function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const goalInput = document.getElementById('dailyGoalInput');
    const notificationsCheckbox = document.getElementById('notificationsEnabled');

    if (modal) {
        modal.classList.add('active');
    }

    // Load current settings
    if (goalInput) {
        goalInput.value = getCalorieGoal();
    }
    if (notificationsCheckbox) {
        const settings = getSettings();
        notificationsCheckbox.checked = settings.notificationsEnabled;
    }
}

/**
 * Close the settings modal
 */
export function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Populate the form with entry data for editing
 * @param {Object} entry - The food entry
 */
export function populateFormForEdit(entry) {
    const foodNameInput = document.getElementById('foodName');
    const caloriesInput = document.getElementById('calories');
    const mealTimeInput = document.getElementById('mealTime');
    const submitBtn = document.querySelector('#foodForm .submit-btn');

    if (foodNameInput) {
        foodNameInput.value = entry.name;
        foodNameInput.focus();
    }
    if (caloriesInput) {
        caloriesInput.value = entry.calories;
    }
    if (mealTimeInput) {
        mealTimeInput.value = entry.time;
    }
    if (submitBtn) {
        submitBtn.textContent = 'Update Entry';
        submitBtn.dataset.editId = entry.id;
    }
}

/**
 * Reset the form to default state
 */
export function resetForm() {
    const form = document.getElementById('foodForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    form.reset();
    
    // Set default time to current time
    const mealTimeInput = document.getElementById('mealTime');
    if (mealTimeInput) {
        mealTimeInput.value = getCurrentTime();
    }

    if (submitBtn) {
        submitBtn.textContent = 'Add Entry';
        delete submitBtn.dataset.editId;
    }

    // Clear any error messages
    clearFormErrors();
}

/**
 * Show form validation error
 * @param {string} field - Field name
 * @param {string} message - Error message
 */
export function showFormError(field, message) {
    const input = document.getElementById(field);
    const errorElement = document.getElementById(`${field}Error`);
    
    if (input) {
        input.classList.add('error');
    }
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clear all form errors
 */
export function clearFormErrors() {
    const inputs = document.querySelectorAll('.form-group input');
    const errors = document.querySelectorAll('.error-message');
    
    inputs.forEach(input => input.classList.remove('error'));
    errors.forEach(error => error.textContent = '');
}

/**
 * Validate form input
 * @param {string} foodName - Food name
 * @param {number} calories - Calorie count
 * @param {string} time - Time string
 * @returns {Object} Validation result with isValid and errors
 */
export function validateForm(foodName, calories, time) {
    const errors = {};
    let isValid = true;

    if (!foodName || foodName.trim().length === 0) {
        errors.foodName = 'Please enter a food name';
        isValid = false;
    } else if (foodName.length > 100) {
        errors.foodName = 'Food name must be less than 100 characters';
        isValid = false;
    }

    if (!calories || calories <= 0) {
        errors.calories = 'Please enter a valid calorie amount';
        isValid = false;
    } else if (calories > 10000) {
        errors.calories = 'Calorie amount seems too high. Please verify.';
        isValid = false;
    }

    if (!time || time.trim().length === 0) {
        errors.time = 'Please enter a time';
        isValid = false;
    }

    return { isValid, errors };
}

/**
 * Set loading state on a button
 * @param {HTMLElement} button - The button element
 * @param {boolean} isLoading - Loading state
 * @param {string} originalText - Original button text
 */
export function setButtonLoading(button, isLoading, originalText) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Loading...';
    } else {
        button.disabled = false;
        button.textContent = originalText || button.dataset.originalText || 'Submit';
    }
}
