import os
import json
import pickle
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime
import re

# ML Libraries
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
import joblib

# Text processing
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from textblob import TextBlob

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('vader_lexicon', quiet=True)
except:
    pass

class ChatbotMLModel:
    """
    Machine Learning model for chatbot that learns from conversation data
    and improves response accuracy over time.
    """
    
    def __init__(self, model_dir: str = "../data/ml_models"):
        self.model_dir = model_dir
        os.makedirs(model_dir, exist_ok=True)
        
        # Initialize components
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=2,
            max_df=0.95
        )
        
        self.classifier = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english', ngram_range=(1, 2))),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        
        self.label_encoder = LabelEncoder()
        self.stemmer = PorterStemmer()
        self.lemmatizer = WordNetLemmatizer()
        
        # Training data storage
        self.training_data = []
        self.response_templates = {}
        self.category_keywords = {}
        
        # Model performance tracking
        self.model_metrics = {
            'accuracy': 0.0,
            'last_trained': None,
            'training_samples': 0,
            'version': '1.0'
        }
        
        # Load existing models if available
        self.load_models()
        
    def preprocess_text(self, text: str) -> str:
        """Preprocess text for ML model training."""
        if not text:
            return ""
            
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenize and remove stop words
        try:
            tokens = word_tokenize(text)
            stop_words = set(stopwords.words('english'))
            tokens = [token for token in tokens if token not in stop_words]
            
            # Stemming and lemmatization
            tokens = [self.stemmer.stem(self.lemmatizer.lemmatize(token)) for token in tokens]
            
            return ' '.join(tokens)
        except:
            return text
    
    def extract_features(self, text: str) -> Dict[str, Any]:
        """Extract features from text for ML model."""
        features = {}
        
        # Basic text features
        features['length'] = len(text)
        features['word_count'] = len(text.split())
        features['char_count'] = len(text)
        
        # Sentiment analysis
        try:
            blob = TextBlob(text)
            features['sentiment_polarity'] = blob.sentiment.polarity
            features['sentiment_subjectivity'] = blob.sentiment.subjectivity
        except:
            features['sentiment_polarity'] = 0.0
            features['sentiment_subjectivity'] = 0.0
        
        # Question indicators
        features['is_question'] = 1 if '?' in text else 0
        features['has_what'] = 1 if 'what' in text.lower() else 0
        features['has_how'] = 1 if 'how' in text.lower() else 0
        features['has_why'] = 1 if 'why' in text.lower() else 0
        features['has_when'] = 1 if 'when' in text.lower() else 0
        features['has_where'] = 1 if 'where' in text.lower() else 0
        
        # Technology keywords
        tech_keywords = [
            'ai', 'machine learning', 'software', 'development', 'mobile', 'web',
            'cloud', 'cybersecurity', 'programming', 'coding', 'react', 'python',
            'javascript', 'java', 'database', 'api', 'frontend', 'backend'
        ]
        
        for keyword in tech_keywords:
            features[f'has_{keyword.replace(" ", "_")}'] = 1 if keyword in text.lower() else 0
        
        # Business keywords
        business_keywords = [
            'price', 'cost', 'service', 'company', 'contact', 'project', 'consultation',
            'team', 'solution', 'help', 'support', 'meeting', 'schedule'
        ]
        
        for keyword in business_keywords:
            features[f'has_{keyword}'] = 1 if keyword in text.lower() else 0
        
        return features
    
    def create_training_data_from_responses(self, response_categories: Dict) -> List[Tuple[str, str]]:
        """Create training data from response categories."""
        training_data = []
        
        for category_name, category_data in response_categories.items():
            if 'keywords' in category_data and 'responses' in category_data:
                # Create training samples from keywords
                for keyword in category_data['keywords']:
                    training_data.append((keyword, category_name))
                    
                    # Generate variations of keywords
                    variations = self.generate_keyword_variations(keyword)
                    for variation in variations:
                        training_data.append((variation, category_name))
                
                # Create training samples from responses (reverse mapping)
                for response in category_data['responses']:
                    # Extract key phrases from responses and map to category
                    key_phrases = self.extract_key_phrases(response)
                    for phrase in key_phrases:
                        training_data.append((phrase, category_name))
        
        return training_data
    
    def generate_keyword_variations(self, keyword: str) -> List[str]:
        """Generate variations of keywords for better training data."""
        variations = [keyword]
        
        # Add question variations
        if not keyword.startswith(('what', 'how', 'why', 'when', 'where')):
            variations.extend([
                f"what is {keyword}",
                f"how does {keyword} work",
                f"tell me about {keyword}",
                f"explain {keyword}",
                f"information about {keyword}"
            ])
        
        # Add synonyms and related terms
        synonym_map = {
            'ai': ['artificial intelligence', 'machine intelligence'],
            'ml': ['machine learning', 'ml'],
            'software': ['programming', 'coding', 'development'],
            'mobile': ['mobile app', 'mobile development', 'smartphone app'],
            'web': ['website', 'web development', 'web application'],
            'cloud': ['cloud computing', 'cloud services', 'cloud platform'],
            'security': ['cybersecurity', 'cyber security', 'information security']
        }
        
        for key, synonyms in synonym_map.items():
            if key in keyword.lower():
                variations.extend([synonym for synonym in synonyms])
        
        return variations[:5]  # Limit to 5 variations
    
    def extract_key_phrases(self, text: str) -> List[str]:
        """Extract key phrases from response text."""
        # Simple key phrase extraction
        sentences = text.split('.')
        key_phrases = []
        
        for sentence in sentences[:3]:  # Take first 3 sentences
            sentence = sentence.strip()
            if len(sentence) > 10 and len(sentence) < 100:
                key_phrases.append(sentence)
        
        return key_phrases
    
    def train_model(self, response_categories: Dict, additional_data: List[Tuple[str, str]] = None) -> Dict[str, Any]:
        """Train the ML model on response categories and additional data."""
        print("Starting ML model training...")
        
        # Create training data
        training_data = self.create_training_data_from_responses(response_categories)
        
        if additional_data:
            training_data.extend(additional_data)
        
        if not training_data:
            print("No training data available")
            return {'error': 'No training data available'}
        
        # Prepare data
        texts = [self.preprocess_text(item[0]) for item in training_data]
        labels = [item[1] for item in training_data]
        
        # Filter out empty texts
        valid_data = [(text, label) for text, label in zip(texts, labels) if text.strip()]
        if not valid_data:
            print("No valid training data after preprocessing")
            return {'error': 'No valid training data after preprocessing'}
        
        texts, labels = zip(*valid_data)
        
        # Encode labels
        encoded_labels = self.label_encoder.fit_transform(labels)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            texts, encoded_labels, test_size=0.2, random_state=42, stratify=encoded_labels
        )
        
        # Train model
        self.classifier.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.classifier.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Update metrics
        self.model_metrics.update({
            'accuracy': float(accuracy),
            'last_trained': datetime.now().isoformat(),
            'training_samples': len(training_data),
            'version': '1.0'
        })
        
        # Generate classification report
        report = classification_report(y_test, y_pred, target_names=self.label_encoder.classes_, output_dict=True)
        
        print(f"Model trained successfully! Accuracy: {accuracy:.3f}")
        print(f"Training samples: {len(training_data)}")
        
        # Save models
        self.save_models()
        
        return {
            'accuracy': float(accuracy),
            'training_samples': len(training_data),
            'classification_report': report,
            'categories': list(self.label_encoder.classes_)
        }
    
    def predict_category(self, text: str) -> Tuple[str, float]:
        """Predict the category for given text."""
        if not hasattr(self.classifier, 'predict_proba'):
            return 'unknown', 0.0
        
        try:
            processed_text = self.preprocess_text(text)
            if not processed_text.strip():
                return 'unknown', 0.0
            
            # Get prediction probabilities
            probabilities = self.classifier.predict_proba([processed_text])[0]
            max_prob_idx = np.argmax(probabilities)
            max_prob = probabilities[max_prob_idx]
            
            # Get category name
            category = self.label_encoder.inverse_transform([max_prob_idx])[0]
            
            return category, float(max_prob)
        except Exception as e:
            print(f"Prediction error: {e}")
            return 'unknown', 0.0
    
    def get_confidence_level(self, confidence: float) -> str:
        """Convert confidence score to human-readable level."""
        if confidence >= 0.8:
            return "high"
        elif confidence >= 0.6:
            return "medium"
        elif confidence >= 0.4:
            return "low"
        else:
            return "very_low"
    
    def generate_response(self, text: str, response_categories: Dict) -> Dict[str, Any]:
        """Generate response using ML model prediction."""
        # Predict category
        predicted_category, confidence = self.predict_category(text)
        confidence_level = self.get_confidence_level(confidence)
        
        # Get response from category
        response_text = "I'm here to help! How can I assist you today?"
        follow_up = None
        
        if predicted_category in response_categories and confidence > 0.3:
            category_data = response_categories[predicted_category]
            if 'responses' in category_data and category_data['responses']:
                response_text = category_data['responses'][0]  # Use first response
                
                if 'followUp' in category_data and category_data['followUp']:
                    follow_up = category_data['followUp'][0]
        
        # If confidence is low, add uncertainty to response
        if confidence_level in ['low', 'very_low']:
            response_text = "I'm not entirely sure about your question, but " + response_text.lower()
        
        return {
            'response': response_text,
            'follow_up': follow_up,
            'predicted_category': predicted_category,
            'confidence': confidence,
            'confidence_level': confidence_level,
            'features': self.extract_features(text)
        }
    
    def save_models(self):
        """Save trained models to disk."""
        try:
            # Save classifier
            joblib.dump(self.classifier, os.path.join(self.model_dir, 'classifier.pkl'))
            
            # Save label encoder
            joblib.dump(self.label_encoder, os.path.join(self.model_dir, 'label_encoder.pkl'))
            
            # Save metrics
            with open(os.path.join(self.model_dir, 'metrics.json'), 'w') as f:
                json.dump(self.model_metrics, f, indent=2)
            
            # Save training data
            with open(os.path.join(self.model_dir, 'training_data.json'), 'w') as f:
                json.dump(self.training_data, f, indent=2)
            
            print(f"Models saved to {self.model_dir}")
        except Exception as e:
            print(f"Error saving models: {e}")
    
    def load_models(self):
        """Load trained models from disk."""
        try:
            classifier_path = os.path.join(self.model_dir, 'classifier.pkl')
            encoder_path = os.path.join(self.model_dir, 'label_encoder.pkl')
            metrics_path = os.path.join(self.model_dir, 'metrics.json')
            training_data_path = os.path.join(self.model_dir, 'training_data.json')
            
            if os.path.exists(classifier_path) and os.path.exists(encoder_path):
                self.classifier = joblib.load(classifier_path)
                self.label_encoder = joblib.load(encoder_path)
                print("Loaded existing ML models")
            
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    self.model_metrics = json.load(f)
            
            if os.path.exists(training_data_path):
                with open(training_data_path, 'r') as f:
                    self.training_data = json.load(f)
            
        except Exception as e:
            print(f"Error loading models: {e}")
    
    def add_training_example(self, text: str, category: str, response: str = None):
        """Add a new training example for continuous learning."""
        self.training_data.append({
            'text': text,
            'category': category,
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
        # Save updated training data
        try:
            with open(os.path.join(self.model_dir, 'training_data.json'), 'w') as f:
                json.dump(self.training_data, f, indent=2)
        except Exception as e:
            print(f"Error saving training data: {e}")
    
    def retrain_with_feedback(self, text: str, correct_category: str, user_satisfaction: float):
        """Retrain model with user feedback."""
        # Add the feedback as training data
        self.add_training_example(text, correct_category)
        
        # If we have enough new data, retrain the model
        if len([item for item in self.training_data if isinstance(item, dict) and 'timestamp' in item]) > 10:
            print("Retraining model with new feedback data...")
            # Convert to training format
            new_training_data = [(item['text'], item['category']) for item in self.training_data if isinstance(item, dict)]
            return self.train_model({}, new_training_data)
        
        return {'message': 'Feedback recorded, will retrain when enough data is available'}
    
    def get_model_status(self) -> Dict[str, Any]:
        """Get current model status and metrics."""
        return {
            'metrics': self.model_metrics,
            'is_trained': hasattr(self.classifier, 'predict_proba'),
            'categories': list(self.label_encoder.classes_) if hasattr(self.label_encoder, 'classes_') else [],
            'training_data_count': len(self.training_data)
        }


# Initialize global ML model instance
ml_model = None

def get_ml_model() -> ChatbotMLModel:
    """Get or create the global ML model instance."""
    global ml_model
    if ml_model is None:
        ml_model = ChatbotMLModel()
    return ml_model
