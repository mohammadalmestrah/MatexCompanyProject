#!/usr/bin/env python3
"""
Simple test script to test the ML chatbot API endpoints
"""

import requests
import json
import time

def test_server():
    """Test the ML chatbot server endpoints."""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Matex ML Chatbot Server")
    print("=" * 40)
    
    # Test 1: Health check
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/api/health", timeout=5)
        print(f"   ✅ Health check: {response.status_code}")
        print(f"   📊 Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("   ❌ Server not running. Please start the server first:")
        print("   📝 Run: python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload")
        return False
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        return False
    
    # Test 2: ML model status
    print("\n2. Testing ML model status...")
    try:
        response = requests.get(f"{base_url}/api/ml/status", timeout=5)
        print(f"   ✅ ML Status: {response.status_code}")
        data = response.json()
        print(f"   🧠 Model trained: {data['model_status']['is_trained']}")
        print(f"   📊 Accuracy: {data['model_status']['metrics']['accuracy']}")
        print(f"   📈 Training samples: {data['model_status']['training_data_count']}")
    except Exception as e:
        print(f"   ❌ ML status failed: {e}")
    
    # Test 3: Chat with ML
    print("\n3. Testing ML-powered chat...")
    test_messages = [
        "What is machine learning?",
        "Tell me about your services",
        "How can I contact you?",
        "What is artificial intelligence?",
        "Do you develop mobile apps?"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n   Test {i}: '{message}'")
        try:
            response = requests.post(
                f"{base_url}/api/chat",
                json={
                    "message": message,
                    "use_ml": True
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Response: {data['response'][:100]}...")
                if data.get('predicted_category'):
                    print(f"   🎯 Category: {data['predicted_category']}")
                    print(f"   📊 Confidence: {data['confidence']:.3f} ({data['confidence_level']})")
                else:
                    print("   ⚠️  No ML prediction (fallback used)")
            else:
                print(f"   ❌ Chat failed: {response.status_code}")
                print(f"   📝 Error: {response.text}")
        except Exception as e:
            print(f"   ❌ Chat error: {e}")
    
    # Test 4: Category prediction
    print("\n4. Testing category prediction...")
    try:
        response = requests.post(
            f"{base_url}/api/ml/predict",
            json={"message": "What is machine learning?"},
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Prediction: {data['predicted_category']}")
            print(f"   📊 Confidence: {data['confidence']:.3f}")
            print(f"   🎯 Level: {data['confidence_level']}")
        else:
            print(f"   ❌ Prediction failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Prediction error: {e}")
    
    print("\n✅ Testing completed!")
    return True

if __name__ == "__main__":
    test_server()


