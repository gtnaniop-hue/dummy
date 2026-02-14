# Calorie Tracker 🍎

A modern, responsive web application for tracking daily calorie intake with visual summaries and smart notifications.

## Features

- **Food Entry Form**: Easily log meals with name, calories, and time
- **Visual Dashboard**: Interactive doughnut chart showing calorie progress
- **Daily Limit Notifications**: Smart alerts at 80% and 100% of daily goal
- **Date Navigation**: View and edit entries for any past or future date
- **Weekly Summary**: Track weekly averages and progress
- **Data Persistence**: All data saved locally in your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Customizable Goals**: Set your own daily calorie target

## Getting Started

### Installation

Simply clone the repository and open `index.html` in your web browser. No build process or server required!

```bash
# Clone the repository
git clone <repository-url>
cd calorie-tracker

# Open index.html in your browser
# Or use a local server:
npx serve .
# Then visit http://localhost:3000
```

### Usage

1. **Set Your Goal**: Click the ⚙️ settings button to set your daily calorie goal (default: 2000 calories)

2. **Add Entries**: Fill in the food name, calories, and time, then click "Add Entry"

3. **Track Progress**: View your daily progress on the dashboard with:
   - Visual chart showing consumed vs. remaining calories
   - Progress bar with color-coded status
   - Detailed statistics (goal, consumed, percentage)

4. **Navigate Dates**: Use the arrow buttons to view different days

5. **Manage Entries**: Edit or delete entries from your meals list

6. **View Weekly Stats**: See your weekly overview with averages and totals

## Features in Detail

### Smart Notifications

The app intelligently notifies you when approaching or exceeding your daily goal:
- **80% Warning**: Yellow alert when you've consumed 80% of your goal
- **100% Alert**: Red notification when you've reached or exceeded your goal

Notifications are shown only once per day to avoid spam, and can be disabled in settings.

### Data Persistence

All data is stored locally in your browser using localStorage:
- Food entries are organized by date
- Settings (goal, notifications) are saved separately
- Data persists across browser sessions

### Responsive Design

The app adapts to different screen sizes:
- **Desktop**: Side-by-side layout with entry form and dashboard
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single column layout with touch-friendly controls

## Technical Stack

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS custom properties, Grid, and Flexbox
- **Vanilla JavaScript (ES6+)**: Modular architecture with no framework dependencies
- **Chart.js**: Interactive data visualization via CDN
- **localStorage**: Client-side data persistence

## Project Structure

```
calorie-tracker/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styling and responsive design
├── js/
│   ├── app.js          # Main application logic
│   ├── storage.js      # localStorage management
│   ├── chart.js        # Chart.js integration
│   ├── notifications.js # Toast notification system
│   ├── ui.js           # UI rendering and updates
│   └── utils.js        # Helper functions
└── README.md           # This file
```

## Browser Support

Works in all modern browsers that support:
- ES6 modules
- localStorage API
- CSS Grid and Flexbox
- Canvas API (for Chart.js)

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Privacy

This application runs entirely in your browser. No data is sent to any server. Your information stays private on your device.

## Customization

### Changing the Default Goal

Edit `js/storage.js` and change the `DEFAULT_GOAL` constant:

```javascript
const DEFAULT_GOAL = 2000; // Change to your preferred default
```

### Adjusting Notification Thresholds

Edit `js/notifications.js` to modify when alerts appear:

```javascript
const NOTIFICATION_THRESHOLDS = {
    WARNING: 80,  // Percentage for warning
    ALERT: 100   // Percentage for alert
};
```

### Modifying Colors

All colors are defined as CSS custom properties in `css/styles.css`:

```css
:root {
    --primary-color: #4CAF50;
    --warning-color: #FFC107;
    --danger-color: #F44336;
    /* ... more colors */
}
```

## Limitations

- **Storage**: localStorage has approximately 5MB limit, sufficient for years of entries
- **Single Device**: Data doesn't sync across devices (by design for privacy)
- **No Account**: No user accounts or cloud backup

## Future Enhancements

Potential features for future versions:
- Macro tracking (protein, carbs, fats)
- Food database with calorie lookup
- Meal categories (breakfast, lunch, dinner, snacks)
- Export/Import data functionality
- Charts for weekly/monthly trends
- Water tracking
- Weight logging
- Recipe builder

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

Made with ❤️ for healthy living