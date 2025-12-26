#!/usr/bin/env python3
"""
Training script for the Matex chatbot ML model.
Run this script to train the model with your response categories.
"""

import os
import sys
import json
from ml_chatbot_model import ChatbotMLModel

def load_response_categories():
    """Load response categories from the JavaScript file."""
    categories_path = os.path.join("..", "data", "responseCategories.js")
    
    if not os.path.exists(categories_path):
        print(f"Error: {categories_path} not found")
        return None
    
    try:
        with open(categories_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Simple parsing of JavaScript object
        import re
        
        categories = {}
        category_pattern = r'(\w+):\s*\{([^}]+)\}'
        matches = re.findall(category_pattern, content, re.DOTALL)
        
        for cat_name, cat_content in matches:
            # Extract keywords and responses
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
        
        print(f"Loaded {len(categories)} response categories:")
        for name, data in categories.items():
            print(f"  - {name}: {len(data['keywords'])} keywords, {len(data['responses'])} responses")
        
        return categories
    except Exception as e:
        print(f"Error parsing response categories: {e}")
        return None

def main():
    """Main training function."""
    print("🤖 Matex Chatbot ML Model Training")
    print("=" * 40)
    
    # Load response categories
    print("📚 Loading response categories...")
    categories = load_response_categories()
    
    if not categories:
        print("❌ Failed to load response categories")
        sys.exit(1)
    
    # Initialize ML model
    print("🧠 Initializing ML model...")
    ml_model = ChatbotMLModel()
    
    # Train the model
    print("🎯 Training model...")
    try:
        result = ml_model.train_model(categories)
        
        print("\n✅ Training completed successfully!")
        print(f"📊 Accuracy: {result['accuracy']:.3f}")
        print(f"📈 Training samples: {result['training_samples']}")
        print(f"🏷️  Categories: {', '.join(result['categories'])}")
        
        # Show classification report
        if 'classification_report' in result:
            print("\n📋 Classification Report:")
            for category, metrics in result['classification_report'].items():
                if isinstance(metrics, dict) and 'precision' in metrics:
                    print(f"  {category}:")
                    print(f"    Precision: {metrics['precision']:.3f}")
                    print(f"    Recall: {metrics['recall']:.3f}")
                    print(f"    F1-score: {metrics['f1-score']:.3f}")
        
        print("\n💾 Models saved successfully!")
        
    except Exception as e:
        print(f"❌ Training failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
