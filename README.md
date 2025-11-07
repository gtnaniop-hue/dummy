# Detection History App

A web application for image analysis with session tracking and detection history management.

## Features

- **Session Tracking**: Persistent session ID stored in localStorage
- **Image Analysis**: Upload and analyze images for object detection
- **Detection History**: View chronological list of previous detections
- **Detection Details**: Navigate to detailed view of each detection
- **History Management**: Clear detection history with confirmation
- **Responsive UI**: Mobile-friendly design with loading states

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **File Upload**: Multer middleware
- **Storage**: In-memory storage (can be replaced with database)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd detection-history-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Detection Analysis
- **POST** `/api/detect`
  - Upload image and perform object detection
  - Requires: `image` (file), `session_id` (string)
  - Returns: Detection result with objects, confidence scores, and metadata

### Session Management
- **GET** `/api/sessions/:id/detections`
  - Get all detections for a specific session
  - Returns: Array of detection objects sorted by timestamp (newest first)

- **DELETE** `/api/sessions/:id/detections`
  - Clear all detections for a specific session
  - Returns: Success confirmation

- **GET** `/api/sessions/:id`
  - Get session information and statistics
  - Returns: Session metadata and detection count

### Health Check
- **GET** `/api/health`
  - Check server status and statistics
  - Returns: Server health information

## Usage

1. **Upload and Analyze**: 
   - Select an image file using the file input
   - Click "Analyze" to process the image
   - View detection results on the home page

2. **View History**:
   - Click "History" in the navigation
   - See chronological list of all detections for current session
   - Click on any detection to view details

3. **Manage History**:
   - Use "Clear History" button to remove all detections
   - Confirm the action in the popup dialog

4. **Detection Details**:
   - Click on any history item to see full details
   - View detected objects, confidence scores, and timestamps
   - Use "Back to History" to return to the list

## Session Management

- Session IDs are automatically generated and stored in localStorage
- Each session maintains its own detection history
- Sessions persist across browser restarts until localStorage is cleared
- Session IDs follow the format: `session_{timestamp}_{random_string}`

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # Frontend JavaScript application
├── server.js          # Backend Express server
├── package.json       # Node.js dependencies
├── uploads/           # Uploaded image storage (auto-created)
└── README.md          # This file
```

## Development Notes

- The backend uses mock detection results for demonstration
- In production, integrate with actual ML models like YOLO, TensorFlow, etc.
- Current storage is in-memory; consider using a database for production
- File uploads are stored locally in the `uploads/` directory

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

ISC License