class SessionManager {
    constructor() {
        this.sessionId = this.getOrCreateSessionId();
    }

    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('detection_session_id');
        if (!sessionId) {
            sessionId = this.generateSessionId();
            localStorage.setItem('detection_session_id', sessionId);
        }
        return sessionId;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getSessionId() {
        return this.sessionId;
    }

    resetSession() {
        this.sessionId = this.generateSessionId();
        localStorage.setItem('detection_session_id', this.sessionId);
    }
}

class DetectionAPI {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    async analyzeImage(file, sessionId) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('session_id', sessionId);

        try {
            const response = await fetch(`${this.baseUrl}/api/detect`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error analyzing image:', error);
            throw error;
        }
    }

    async getSessionDetections(sessionId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/detections`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching session detections:', error);
            throw error;
        }
    }

    async clearSessionHistory(sessionId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/detections`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error clearing session history:', error);
            throw error;
        }
    }
}

class DetectionApp {
    constructor() {
        this.sessionManager = new SessionManager();
        this.api = new DetectionAPI();
        this.currentDetection = null;
        this.detectionHistory = [];
        
        this.initializeElements();
        this.bindEvents();
        this.showSection('home');
    }

    initializeElements() {
        // Navigation
        this.homeLink = document.getElementById('home-link');
        this.historyLink = document.getElementById('history-link');
        
        // Sections
        this.homeSection = document.getElementById('home-section');
        this.historySection = document.getElementById('history-section');
        this.detailsSection = document.getElementById('details-section');
        
        // Home section elements
        this.fileInput = document.getElementById('file-input');
        this.analyzeBtn = document.getElementById('analyze-btn');
        this.currentDetectionEl = document.getElementById('current-detection');
        
        // History section elements
        this.clearHistoryBtn = document.getElementById('clear-history-btn');
        this.historyListEl = document.getElementById('history-list');
        this.emptyHistoryEl = document.getElementById('empty-history');
        
        // Details section elements
        this.backToHistoryBtn = document.getElementById('back-to-history');
        this.detectionDetailsEl = document.getElementById('detection-details');
        
        // Loading
        this.loadingEl = document.getElementById('loading');
    }

    bindEvents() {
        // Navigation
        this.homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('home');
        });
        
        this.historyLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('history');
            this.loadDetectionHistory();
        });
        
        // Home section
        this.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        this.fileInput.addEventListener('change', () => this.handleFileSelect());
        
        // History section
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Details section
        this.backToHistoryBtn.addEventListener('click', () => this.showSection('history'));
    }

    showSection(sectionName) {
        // Hide all sections
        this.homeSection.classList.remove('active');
        this.historySection.classList.remove('active');
        this.detailsSection.classList.remove('active');
        
        // Remove active class from navigation
        this.homeLink.classList.remove('active');
        this.historyLink.classList.remove('active');
        
        // Show selected section and update navigation
        switch(sectionName) {
            case 'home':
                this.homeSection.classList.add('active');
                this.homeLink.classList.add('active');
                break;
            case 'history':
                this.historySection.classList.add('active');
                this.historyLink.classList.add('active');
                break;
            case 'details':
                this.detailsSection.classList.add('active');
                break;
        }
    }

    handleFileSelect() {
        const file = this.fileInput.files[0];
        this.analyzeBtn.disabled = !file;
    }

    async handleAnalyze() {
        const file = this.fileInput.files[0];
        if (!file) {
            alert('Please select an image file');
            return;
        }

        this.showLoading(true);
        
        try {
            const result = await this.api.analyzeImage(file, this.sessionManager.getSessionId());
            this.currentDetection = {
                ...result,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionManager.getSessionId()
            };
            
            this.displayCurrentDetection();
            
            // Add to history
            this.detectionHistory.unshift(this.currentDetection);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            this.currentDetectionEl.innerHTML = `
                <div class="error">
                    <h3>Analysis Failed</h3>
                    <p>${error.message}</p>
                </div>
            `;
        } finally {
            this.showLoading(false);
        }
    }

    displayCurrentDetection() {
        if (!this.currentDetection) return;
        
        const detection = this.currentDetection;
        this.currentDetectionEl.innerHTML = `
            <h3>Detection Results</h3>
            <p><strong>Timestamp:</strong> ${new Date(detection.timestamp).toLocaleString()}</p>
            <p><strong>Session ID:</strong> ${detection.sessionId}</p>
            <div class="detection-data">
                ${this.formatDetectionData(detection)}
            </div>
        `;
    }

    formatDetectionData(detection) {
        // This would format the actual detection results
        // For now, we'll show a placeholder
        if (detection.objects && detection.objects.length > 0) {
            return `
                <h4>Objects Detected:</h4>
                <ul>
                    ${detection.objects.map(obj => `<li>${obj.class} (confidence: ${(obj.confidence * 100).toFixed(1)}%)</li>`).join('')}
                </ul>
            `;
        } else {
            return '<p>No objects detected</p>';
        }
    }

    async loadDetectionHistory() {
        this.showLoading(true);
        
        try {
            const detections = await this.api.getSessionDetections(this.sessionManager.getSessionId());
            this.detectionHistory = detections || [];
            this.displayDetectionHistory();
        } catch (error) {
            console.error('Failed to load detection history:', error);
            // Fallback to local storage if API fails
            this.detectionHistory = this.getLocalHistory();
            this.displayDetectionHistory();
        } finally {
            this.showLoading(false);
        }
    }

    getLocalHistory() {
        const history = localStorage.getItem('detection_history');
        return history ? JSON.parse(history) : [];
    }

    saveLocalHistory() {
        localStorage.setItem('detection_history', JSON.stringify(this.detectionHistory));
    }

    displayDetectionHistory() {
        if (this.detectionHistory.length === 0) {
            this.historyListEl.style.display = 'none';
            this.emptyHistoryEl.style.display = 'block';
            return;
        }

        this.historyListEl.style.display = 'block';
        this.emptyHistoryEl.style.display = 'none';

        this.historyListEl.innerHTML = this.detectionHistory.map((detection, index) => {
            const date = new Date(detection.timestamp);
            return `
                <div class="history-item" data-index="${index}">
                    <div class="history-item-header">
                        <span class="history-item-date">${date.toLocaleDateString()}</span>
                        <span class="history-item-time">${date.toLocaleTimeString()}</span>
                    </div>
                    <div class="history-item-preview">
                        ${this.getDetectionPreview(detection)}
                    </div>
                </div>
            `;
        }).join('');

        // Bind click events to history items
        this.historyListEl.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.showDetectionDetails(this.detectionHistory[index]);
            });
        });
    }

    getDetectionPreview(detection) {
        if (detection.objects && detection.objects.length > 0) {
            const objectCount = detection.objects.length;
            const topObject = detection.objects[0];
            return `${objectCount} object(s) detected - ${topObject.class} (${(topObject.confidence * 100).toFixed(1)}%)`;
        } else {
            return 'No objects detected';
        }
    }

    showDetectionDetails(detection) {
        this.currentDetection = detection;
        
        this.detectionDetailsEl.innerHTML = `
            <h3>Detection Details</h3>
            <p><strong>Timestamp:</strong> ${new Date(detection.timestamp).toLocaleString()}</p>
            <p><strong>Session ID:</strong> ${detection.sessionId}</p>
            <div class="detection-data">
                ${this.formatDetectionData(detection)}
            </div>
            ${detection.imagePath ? `<img src="${detection.imagePath}" alt="Detection image" style="max-width: 100%; border-radius: 4px; margin-top: 1rem;">` : ''}
        `;
        
        this.showSection('details');
    }

    async clearHistory() {
        if (!confirm('Are you sure you want to clear all detection history?')) {
            return;
        }

        this.showLoading(true);
        
        try {
            await this.api.clearSessionHistory(this.sessionManager.getSessionId());
            this.detectionHistory = [];
            this.displayDetectionHistory();
        } catch (error) {
            console.error('Failed to clear history from server:', error);
            // Clear locally anyway
            this.detectionHistory = [];
            localStorage.removeItem('detection_history');
            this.displayDetectionHistory();
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        this.loadingEl.style.display = show ? 'flex' : 'none';
    }
}

// Mock API for development when backend is not available
class MockDetectionAPI extends DetectionAPI {
    async analyzeImage(file, sessionId) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Return mock detection data
        return {
            id: 'detection_' + Date.now(),
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            objects: [
                { class: 'person', confidence: 0.95, bbox: [10, 10, 100, 200] },
                { class: 'car', confidence: 0.87, bbox: [150, 50, 200, 100] }
            ],
            imagePath: URL.createObjectURL(file)
        };
    }

    async getSessionDetections(sessionId) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock history from localStorage or empty array
        const history = localStorage.getItem('detection_history');
        return history ? JSON.parse(history) : [];
    }

    async clearSessionHistory(sessionId) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Use real API by default, fallback to mock for development
    const app = new DetectionApp();
    
    // Test if server is available, if not use mock
    fetch('/api/health')
        .then(response => {
            if (response.ok) {
                console.log('🌐 Using real API server');
                // Real API is already set
            } else {
                throw new Error('Server not responding correctly');
            }
        })
        .catch(error => {
            console.log('🔧 Using mock API (server not available)');
            app.api = new MockDetectionAPI();
        });
    
    // Make app available globally for debugging
    window.detectionApp = app;
});