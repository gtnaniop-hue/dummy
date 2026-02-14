/**
 * Toast notification system for Calorie Tracker
 */

const NOTIFICATION_THRESHOLDS = {
    WARNING: 80,
    ALERT: 100
};

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type: 'success', 'warning', or 'danger'
 * @param {number} duration - Duration in milliseconds (default 5000)
 */
export function showToast(message, type = 'success', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.error('Toast container not found');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getIconForType(type);
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification">&times;</button>
    `;
    
    container.appendChild(toast);

    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // Auto-dismiss after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

/**
 * Remove a toast notification with animation
 * @param {HTMLElement} toast - The toast element to remove
 */
function removeToast(toast) {
    if (!toast.parentElement) return;
    
    toast.style.animation = 'slideOut 0.3s ease';
    
    toast.addEventListener('animationend', () => {
        if (toast.parentElement) {
            toast.remove();
        }
    });
}

/**
 * Get icon for notification type
 * @param {string} type - Notification type
 * @returns {string} Icon emoji
 */
function getIconForType(type) {
    switch (type) {
        case 'success':
            return '✅';
        case 'warning':
            return '⚠️';
        case 'danger':
            return '🚨';
        default:
            return 'ℹ️';
    }
}

/**
 * Check calorie thresholds and show notifications if needed
 * @param {number} consumed - Calories consumed
 * @param {number} goal - Daily calorie goal
 * @param {string} dateStr - ISO date string
 * @param {Object} storage - Storage module with notification methods
 */
export function checkThresholds(consumed, goal, dateStr, storage) {
    const percentage = (consumed / goal) * 100;
    const settings = storage.getSettings();
    
    if (!settings.notificationsEnabled) {
        return;
    }

    // Check 80% warning threshold
    if (percentage >= NOTIFICATION_THRESHOLDS.WARNING && percentage < NOTIFICATION_THRESHOLDS.ALERT) {
        const notificationKey = '80%';
        if (!storage.hasNotificationBeenShown(dateStr, notificationKey)) {
            const remaining = Math.round(goal - consumed);
            showToast(
                `⚠️ You've reached ${Math.round(percentage)}% of your daily goal! ${remaining} calories remaining.`,
                'warning',
                6000
            );
            storage.markNotificationAsShown(dateStr, notificationKey);
        }
    }

    // Check 100% alert threshold
    if (percentage >= NOTIFICATION_THRESHOLDS.ALERT) {
        const notificationKey = '100%';
        if (!storage.hasNotificationBeenShown(dateStr, notificationKey)) {
            const over = Math.round(consumed - goal);
            if (over <= 0) {
                showToast(
                    `🎯 You've reached your daily goal of ${goal} calories!`,
                    'warning',
                    6000
                );
            } else {
                showToast(
                    `🚨 You've exceeded your daily goal by ${over} calories!`,
                    'danger',
                    6000
                );
            }
            storage.markNotificationAsShown(dateStr, notificationKey);
        }
    }
}

/**
 * Show success notification for adding food entry
 * @param {string} foodName - Name of the food
 * @param {number} calories - Calorie count
 */
export function showEntryAdded(foodName, calories) {
    showToast(`✅ ${foodName} (${calories} cal) added successfully!`, 'success', 3000);
}

/**
 * Show notification for entry update
 * @param {string} foodName - Name of the food
 */
export function showEntryUpdated(foodName) {
    showToast(`✅ ${foodName} updated successfully!`, 'success', 3000);
}

/**
 * Show notification for entry deletion
 * @param {string} foodName - Name of the food
 */
export function showEntryDeleted(foodName) {
    showToast(`🗑️ ${foodName} deleted.`, 'success', 3000);
}

/**
 * Show error notification
 * @param {string} message - Error message
 */
export function showError(message) {
    showToast(`❌ ${message}`, 'danger', 5000);
}

/**
 * Show settings saved notification
 */
export function showSettingsSaved() {
    showToast('✅ Settings saved successfully!', 'success', 3000);
}

/**
 * Clear all toast notifications
 */
export function clearAllToasts() {
    const container = document.getElementById('toastContainer');
    if (container) {
        container.innerHTML = '';
    }
}