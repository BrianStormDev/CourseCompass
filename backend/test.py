
from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/chart', methods=['GET'])
def get_chart():
    """Test endpoint to verify server is working"""
    test_data = {
        "message": "Flask server is working!",
        "port": 5000,
        "endpoint": "/api/chart",
        "test_data": {
            "topics": ["AI", "Machine Learning", "Natural Language Processing"],
            "counts": [45, 32, 28],
            "timestamp": "2025-06-22"
        }
    }
    return jsonify(test_data)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "port": 5000})

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({"message": "Flask backend is running on port 5000"})

if __name__ == '__main__':
    print("Starting Flask server on port 5000...")
    print("Test URLs:")
    print("  - http://localhost:5000/")
    print("  - http://localhost:5000/health") 
    print("  - http://localhost:5000/api/chart")
    
    app.run(
        debug=True, 
        port=5000,
        host='0.0.0.0'  # Accept connections from any IP
    )