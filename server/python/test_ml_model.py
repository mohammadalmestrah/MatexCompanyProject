#!/usr/bin/env python3
"""
Test script for the Matex chatbot ML model.
Run this to test the trained model with sample questions.
"""

import os
import sys
from ml_chatbot_model import ChatbotMLModel

def load_response_categories():
    """Load response categories for testing."""
    categories_path = os.path.join("..", "data", "responseCategories.js")
    
    if not os.path.exists(categories_path):
        print(f"Error: {categories_path} not found")
        return None
    
    try:
        with open(categories_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        import re
        categories = {}
        category_pattern = r'(\w+):\s*\{([^}]+)\}'
        matches = re.findall(category_pattern, content, re.DOTALL)
        
        for cat_name, cat_content in matches:
            keywords_match = re.search(r'keywords:\s*\[([^\]]+)\]', cat_content)
            responses_match = re.search(r'responses:\s*\[([^\]]+)\]', cat_content, re.DOTALL)
            
            if keywords_match and responses_match:
                keywords = [k.strip().strip('"\'') for k in keywords_match.group(1).split(',')]
                responses = [r.strip().strip('"\'') for r in responses_match.group(1).split(',')]
                
                categories[cat_name] = {
                    'keywords': keywords,
                    'responses': responses,
                    'context': cat_name
                }
        
        return categories
    except Exception as e:
        print(f"Error parsing response categories: {e}")
        return None

def test_questions():
    """Test questions for different categories."""
    return [
        # Machine Learning
        ("What is machine learning?", "machine_learning"),
        ("Tell me about neural networks", "machine_learning"),
        ("How does supervised learning work?", "machine_learning"),
        
        # Artificial Intelligence
        ("What is artificial intelligence?", "artificial_intelligence"),
        ("Explain AI to me", "artificial_intelligence"),
        ("How does AI work?", "artificial_intelligence"),
        
        # Software Development
        ("What is software development?", "software_development"),
        ("Tell me about programming", "software_development"),
        ("How do you develop software?", "software_development"),
        
        # Mobile Development
        ("Do you develop mobile apps?", "mobile_development"),
        ("What about iOS development?", "mobile_development"),
        ("Tell me about React Native", "mobile_development"),
        
        # Web Technologies
        ("What web frameworks do you use?", "web_technologies"),
        ("Tell me about React", "web_technologies"),
        ("How do you build websites?", "web_technologies"),
        
        # Cloud Computing
        ("What cloud services do you offer?", "cloud_computing"),
        ("Tell me about AWS", "cloud_computing"),
        ("How does cloud computing work?", "cloud_computing"),
        
        # Cybersecurity
        ("What about security?", "cybersecurity"),
        ("Tell me about cybersecurity", "cybersecurity"),
        ("How do you protect data?", "cybersecurity"),
        
        # General Help
        ("Help me", "help"),
        ("I need assistance", "help"),
        ("Can you help?", "help"),
        
        # Services
        ("What services do you offer?", "services"),
        ("What do you do?", "services"),
        ("Tell me about your company", "services"),
        
        # Contact
        ("How can I contact you?", "contact"),
        ("What's your email?", "contact"),
        ("Where are you located?", "contact"),
        
        # Pricing
        ("What are your prices?", "pricing"),
        ("How much does it cost?", "pricing"),
        ("Tell me about pricing", "pricing"),
    ]

def main():
    """Main test function."""
    print("🧪 Testing Matex Chatbot ML Model")
    print("=" * 40)
    
    # Load model
    print("📚 Loading ML model...")
    ml_model = ChatbotMLModel()
    
    # Load categories
    print("📖 Loading response categories...")
    categories = load_response_categories()
    
    if not categories:
        print("❌ Failed to load response categories")
        sys.exit(1)
    
    # Check if model is trained
    status = ml_model.get_model_status()
    if not status['is_trained']:
        print("⚠️  Model not trained. Training now...")
        result = ml_model.train_model(categories)
        print(f"✅ Model trained with {result['training_samples']} samples, accuracy: {result['accuracy']:.3f}")
    
    # Test questions
    print("\n🎯 Testing with sample questions...")
    test_data = test_questions()
    
    correct_predictions = 0
    total_predictions = 0
    confidence_scores = []
    
    for question, expected_category in test_data:
        # Predict category
        predicted_category, confidence = ml_model.predict_category(question)
        
        # Check if prediction is correct
        is_correct = predicted_category == expected_category
        if is_correct:
            correct_predictions += 1
        total_predictions += 1
        confidence_scores.append(confidence)
        
        # Generate response
        ml_result = ml_model.generate_response(question, categories)
        
        # Display results
        status_icon = "✅" if is_correct else "❌"
        confidence_level = ml_model.get_confidence_level(confidence)
        
        print(f"\n{status_icon} Question: {question}")
        print(f"   Expected: {expected_category}")
        print(f"   Predicted: {predicted_category} ({confidence:.3f}, {confidence_level})")
        print(f"   Response: {ml_result['response'][:100]}...")
    
    # Calculate statistics
    accuracy = correct_predictions / total_predictions if total_predictions > 0 else 0
    avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
    
    print(f"\n📊 Test Results:")
    print(f"   Accuracy: {accuracy:.3f} ({correct_predictions}/{total_predictions})")
    print(f"   Average Confidence: {avg_confidence:.3f}")
    print(f"   Total Questions Tested: {total_predictions}")
    
    # Confidence distribution
    high_conf = sum(1 for c in confidence_scores if c >= 0.8)
    med_conf = sum(1 for c in confidence_scores if 0.6 <= c < 0.8)
    low_conf = sum(1 for c in confidence_scores if c < 0.6)
    
    print(f"\n📈 Confidence Distribution:")
    print(f"   High (≥80%): {high_conf} ({high_conf/total_predictions*100:.1f}%)")
    print(f"   Medium (60-79%): {med_conf} ({med_conf/total_predictions*100:.1f}%)")
    print(f"   Low (<60%): {low_conf} ({low_conf/total_predictions*100:.1f}%)")
    
    print("\n✅ Testing completed!")

if __name__ == "__main__":
    main()
