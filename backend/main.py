# Simple HTTP server fallback when FastAPI is not available
try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False
    # Create mock classes for when FastAPI is not available
    class FastAPI:
        def __init__(self, **kwargs):
            self.routes = {}
        def get(self, path):
            def decorator(func):
                self.routes[f"GET {path}"] = func
                return func
            return decorator
        def post(self, path):
            def decorator(func):
                self.routes[f"POST {path}"] = func
                return func
            return decorator
    
    class HTTPException(Exception):
        def __init__(self, status_code, detail):
            self.status_code = status_code
            self.detail = detail
    
    class CORSMiddleware:
        def __init__(self, app, **kwargs):
            pass
    
    class BaseModel:
        pass

import os
from datetime import datetime

# Try to import uvicorn, but don't fail if it's not available
try:
    import uvicorn
    UVICORN_AVAILABLE = True
except ImportError:
    UVICORN_AVAILABLE = False

# Try to import tensorflow, but don't fail if it's not available
try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
    TF_VERSION = tf.__version__
except ImportError:
    TENSORFLOW_AVAILABLE = False
    TF_VERSION = "Not installed"

# Try to import numpy, but don't fail if it's not available
try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False

app = FastAPI(title="Backend API", version="1.0.0")

if FASTAPI_AVAILABLE:
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Database configuration (simplified for demo)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@db:5432/appdb")

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: str
    tensorflow_version: str
    tensorflow_available: bool

class PredictionRequest(BaseModel):
    data: list

class PredictionResponse(BaseModel):
    prediction: list
    timestamp: str
    note: str

def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "backend",
        "timestamp": datetime.now().isoformat(),
        "tensorflow_version": TF_VERSION,
        "tensorflow_available": TENSORFLOW_AVAILABLE
    }

def root():
    """Root endpoint"""
    return {
        "message": "Backend API is running",
        "tensorflow_version": TF_VERSION,
        "tensorflow_available": TENSORFLOW_AVAILABLE,
        "fastapi_available": FASTAPI_AVAILABLE,
        "uvicorn_available": UVICORN_AVAILABLE,
        "numpy_available": NUMPY_AVAILABLE,
        "timestamp": datetime.now().isoformat()
    }

def predict(request):
    """Simple prediction endpoint"""
    try:
        # Handle both BaseModel and dict input
        if hasattr(request, 'data'):
            data = request.data
        elif isinstance(request, dict) and 'data' in request:
            data = request['data']
        else:
            data = [1, 2, 3, 4, 5]  # Default data
        
        if TENSORFLOW_AVAILABLE and NUMPY_AVAILABLE:
            # Create a simple model for demonstration
            model = tf.keras.Sequential([
                tf.keras.layers.Dense(10, activation='relu', input_shape=(len(data),)),
                tf.keras.layers.Dense(1, activation='sigmoid')
            ])
            
            # Convert input to numpy array and make prediction
            input_data = np.array(data).reshape(1, -1)
            prediction = model.predict(input_data)
            
            return {
                "prediction": prediction.tolist(),
                "timestamp": datetime.now().isoformat(),
                "note": "Prediction made with TensorFlow"
            }
        elif NUMPY_AVAILABLE:
            # Fallback simple prediction without TensorFlow
            input_data = np.array(data)
            simple_prediction = [float(np.mean(input_data) * 0.5)]
            
            return {
                "prediction": simple_prediction,
                "timestamp": datetime.now().isoformat(),
                "note": "TensorFlow not available, using simple calculation with numpy"
            }
        else:
            # Fallback without any libraries
            simple_prediction = [sum(data) / len(data) * 0.5]
            
            return {
                "prediction": simple_prediction,
                "timestamp": datetime.now().isoformat(),
                "note": "TensorFlow and numpy not available, using basic calculation"
            }
    except Exception as e:
        if FASTAPI_AVAILABLE:
            raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
        else:
            return {
                "error": f"Prediction failed: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }

def tensorflow_info():
    """Get TensorFlow information"""
    if TENSORFLOW_AVAILABLE:
        return {
            "version": TF_VERSION,
            "gpu_available": tf.config.list_physical_devices('GPU'),
            "build_info": tf.sysconfig.get_build_info(),
            "available": True
        }
    else:
        return {
            "version": TF_VERSION,
            "available": False,
            "message": "TensorFlow is not installed in this container"
        }

if __name__ == "__main__":
    if FASTAPI_AVAILABLE and UVICORN_AVAILABLE:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=os.getenv("DEBUG", "false").lower() == "true"
        )
    else:
        # Simple HTTP server fallback
        import http.server
        import socketserver
        import json
        import urllib.parse

        class SimpleAPIHandler(http.server.SimpleHTTPRequestHandler):
            def do_GET(self):
                if self.path == '/health':
                    response = health_check()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode())
                elif self.path == '/':
                    response = root()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode())
                elif self.path == '/tensorflow/info':
                    response = tensorflow_info()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode())
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b'Not Found')
            
            def do_POST(self):
                if self.path == '/predict':
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    try:
                        request_data = json.loads(post_data.decode('utf-8'))
                        response = predict(request_data)
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps(response).encode())
                    except Exception as e:
                        error_response = {"error": str(e)}
                        self.send_response(500)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps(error_response).encode())
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b'Not Found')

        PORT = 8000
        with socketserver.TCPServer(("", PORT), SimpleAPIHandler) as httpd:
            print(f"Simple HTTP server running on port {PORT}")
            httpd.serve_forever()