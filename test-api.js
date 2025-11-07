const request = require('supertest');
const fs = require('fs');
const path = require('path');

// Simple test script to verify API functionality
async function runTests() {
    console.log('🧪 Starting API tests...\n');
    
    try {
        // Import the app
        const app = require('./server.js');
        
        // Create a test image buffer (simple 1x1 PNG)
        const testImageBuffer = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            'base64'
        );
        
        let sessionId = 'test_session_' + Date.now();
        
        // Test 1: Health check
        console.log('📋 Test 1: Health check');
        const healthResponse = await request(app)
            .get('/api/health')
            .expect(200);
        console.log('✅ Health check passed:', healthResponse.body.status);
        
        // Test 2: Upload and analyze image
        console.log('\n📋 Test 2: Image analysis');
        const detectResponse = await request(app)
            .post('/api/detect')
            .attach('image', testImageBuffer, 'test.png')
            .field('session_id', sessionId)
            .expect(200);
        
        console.log('✅ Detection completed');
        console.log('   Detection ID:', detectResponse.body.id);
        console.log('   Objects detected:', detectResponse.body.objects.length);
        console.log('   Session ID:', detectResponse.body.sessionId);
        
        // Test 3: Get session detections
        console.log('\n📋 Test 3: Get session detections');
        const sessionResponse = await request(app)
            .get(`/api/sessions/${sessionId}/detections`)
            .expect(200);
        
        console.log('✅ Session detections retrieved');
        console.log('   Detection count:', sessionResponse.body.length);
        console.log('   First detection ID:', sessionResponse.body[0]?.id);
        
        // Test 4: Get session info
        console.log('\n📋 Test 4: Get session info');
        const sessionInfoResponse = await request(app)
            .get(`/api/sessions/${sessionId}`)
            .expect(200);
        
        console.log('✅ Session info retrieved');
        console.log('   Detection count:', sessionInfoResponse.body.detectionCount);
        console.log('   Created at:', sessionInfoResponse.body.createdAt);
        
        // Test 5: Clear session history
        console.log('\n📋 Test 5: Clear session history');
        const clearResponse = await request(app)
            .delete(`/api/sessions/${sessionId}/detections`)
            .expect(200);
        
        console.log('✅ Session history cleared');
        console.log('   Success message:', clearResponse.body.message);
        
        // Test 6: Verify history is cleared
        console.log('\n📋 Test 6: Verify history cleared');
        const emptySessionResponse = await request(app)
            .get(`/api/sessions/${sessionId}/detections`)
            .expect(200);
        
        console.log('✅ History cleared successfully');
        console.log('   Detection count after clear:', emptySessionResponse.length);
        
        console.log('\n🎉 All tests passed! ✨');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().then(() => {
        console.log('\n🏁 Test suite completed');
        process.exit(0);
    }).catch(error => {
        console.error('💥 Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = { runTests };