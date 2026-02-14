/**
 * Chart.js integration for Calorie Tracker
 */

let calorieChart = null;

/**
 * Initialize the calorie progress chart
 * @returns {Chart} The chart instance
 */
export function initChart() {
    const ctx = document.getElementById('calorieChart');
    
    if (!ctx) {
        console.error('Chart canvas not found');
        return null;
    }

    calorieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Consumed', 'Remaining'],
            datasets: [{
                data: [0, 2000],
                backgroundColor: [
                    '#4CAF50',
                    '#E0E0E0'
                ],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const label = context.label;
                            return `${label}: ${value} calories`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });

    return calorieChart;
}

/**
 * Update the chart with new data
 * @param {number} consumed - Calories consumed
 * @param {number} goal - Daily calorie goal
 * @param {number} percentage - Percentage of goal
 */
export function updateChart(consumed, goal, percentage) {
    if (!calorieChart) {
        console.error('Chart not initialized');
        return;
    }

    const remaining = Math.max(0, goal - consumed);
    const color = getColorForPercentage(percentage);

    calorieChart.data.datasets[0].data = [consumed, remaining];
    calorieChart.data.datasets[0].backgroundColor = [
        color,
        '#E0E0E0'
    ];

    calorieChart.update('active');
}

/**
 * Get the color based on percentage of daily goal
 * @param {number} percentage - Percentage (0-100+)
 * @returns {string} Color hex code
 */
export function getColorForPercentage(percentage) {
    if (percentage < 80) {
        return '#4CAF50'; // Green
    } else if (percentage < 100) {
        return '#FFC107'; // Yellow/Warning
    } else {
        return '#F44336'; // Red
    }
}

/**
 * Destroy the chart instance
 */
export function destroyChart() {
    if (calorieChart) {
        calorieChart.destroy();
        calorieChart = null;
    }
}

/**
 * Get the chart instance
 * @returns {Chart|null} The chart instance or null
 */
export function getChart() {
    return calorieChart;
}