const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// In-memory storage for sessions and detections (in production, use a database)
const sessions = new Map();
const detections = new Map();

// Helper functions
function getSessionDetections(sessionId) {
    return detections.get(sessionId) || [];
}

function addDetection(sessionId, detection) {
    const sessionDetections = getSessionDetections(sessionId);
    sessionDetections.push(detection);
    detections.set(sessionId, sessionDetections);
    return detection;
}

function clearSessionDetections(sessionId) {
    detections.delete(sessionId);
}

// Mock detection function (in real app, this would call an actual ML model)
function performDetection(imagePath) {
    // Simulate random detection results
    const objects = [
        { class: 'person', confidence: 0.95, bbox: [10, 10, 100, 200] },
        { class: 'car', confidence: 0.87, bbox: [150, 50, 200, 100] },
        { class: 'dog', confidence: 0.92, bbox: [50, 150, 80, 60] },
        { class: 'cat', confidence: 0.78, bbox: [200, 100, 40, 50] }
    ];
    
    // Randomly select 1-3 objects
    const numObjects = Math.floor(Math.random() * 3) + 1;
    const selectedObjects = [];
    
    for (let i = 0; i < numObjects; i++) {
        const randomIndex = Math.floor(Math.random() * objects.length);
        const obj = { ...objects[randomIndex] };
        obj.confidence = Math.random() * 0.4 + 0.6; // Random confidence between 0.6-1.0
        selectedObjects.push(obj);
    }
    
    return selectedObjects;
}

// API Routes

// POST /api/detect - Analyze image and store detection
app.post('/api/detect', upload.single('image'), (req, res) => {
    try {
        const { session_id } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        
        if (!session_id) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Perform mock detection
        const detectedObjects = performDetection(req.file.path);
        
        // Create detection record
        const detection = {
            id: uuidv4(),
            sessionId: session_id,
            timestamp: new Date().toISOString(),
            imagePath: req.file.path,
            originalName: req.file.originalname,
            objects: detectedObjects,
            metadata: {
                fileSize: req.file.size,
                mimetype: req.file.mimetype
            }
        };

        // Store detection
        addDetection(session_id, detection);

        // Respond with detection results
        res.json(detection);

    } catch (error) {
        console.error('Error in detection:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/sessions/:id/detections - Get all detections for a session
app.get('/api/sessions/:id/detections', (req, res) => {
    try {
        const { id } = req.params;
        const sessionDetections = getSessionDetections(id);
        
        // Sort by timestamp (newest first)
        const sortedDetections = sessionDetections.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        res.json(sortedDetections);

    } catch (error) {
        console.error('Error fetching session detections:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/sessions/:id/detections - Clear all detections for a session
app.delete('/api/sessions/:id/detections', (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete detections for this session
        clearSessionDetections(id);
        
        res.json({ success: true, message: 'Session history cleared successfully' });

    } catch (error) {
        console.error('Error clearing session detections:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/sessions/:id - Get session info
app.get('/api/sessions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const sessionDetections = getSessionDetections(id);
        
        const sessionInfo = {
            sessionId: id,
            detectionCount: sessionDetections.length,
            createdAt: sessionDetections.length > 0 ? sessionDetections[0].timestamp : new Date().toISOString(),
            lastActivity: sessionDetections.length > 0 ? 
                sessionDetections[sessionDetections.length - 1].timestamp : new Date().toISOString()
        };
        
        res.json(sessionInfo);

    } catch (error) {
        console.error('Error fetching session info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        activeSessions: sessions.size,
        totalDetections: Array.from(detections.values()).reduce((sum, dets) => sum + dets.length, 0)
    });
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Detection History App server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to access the application`);
});

module.exports = app;