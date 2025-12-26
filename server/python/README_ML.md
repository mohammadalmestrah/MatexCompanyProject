# Matex Chatbot Machine Learning Implementation

## Overview

This implementation adds machine learning capabilities to the Matex chatbot, enabling it to learn from user interactions and improve response accuracy over time.

## Features

### 🤖 **Machine Learning Model**
- **Text Classification**: Uses TF-IDF vectorization with Random Forest classifier
- **Category Prediction**: Automatically categorizes user questions
- **Confidence Scoring**: Provides confidence levels for predictions
- **Continuous Learning**: Learns from user feedback

### 📊 **Model Architecture**
- **Vectorizer**: TF-IDF with 5000 features, 1-2 gram range
- **Classifier**: Random Forest with 100 estimators
- **Preprocessing**: Text normalization, stemming, lemmatization
- **Feature Engineering**: Sentiment analysis, keyword detection, question indicators

### 🔄 **Training Pipeline**
1. **Data Collection**: Extracts training data from response categories
2. **Text Preprocessing**: Tokenization, stop word removal, stemming
3. **Feature Extraction**: TF-IDF vectors + custom features
4. **Model Training**: Cross-validation with performance metrics
5. **Model Persistence**: Saves trained models for reuse

## Installation

### 1. Install Dependencies

```bash
cd server/python
pip install -r requirements.txt
```

### 2. Train the Initial Model

```bash
python train_model.py
```

### 3. Start the Server

```bash
python app.py
```

## API Endpoints

### Chat with ML
```http
POST /api/chat
Content-Type: application/json

{
  "message": "What is machine learning?",
  "session_id": "optional_session_id",
  "use_ml": true
}
```

**Response:**
```json
{
  "response": "Machine Learning is a subset of artificial intelligence...",
  "session_id": "session_id",
  "predicted_category": "machine_learning",
  "confidence": 0.85,
  "confidence_level": "high"
}
```

### Train Model
```http
POST /api/ml/train
Content-Type: application/json

{
  "force_retrain": false
}
```

### Submit Feedback
```http
POST /api/ml/feedback
Content-Type: application/json

{
  "message": "What is machine learning?",
  "correct_category": "machine_learning",
  "user_satisfaction": 0.8,
  "feedback_text": "Good response, but could be more detailed"
}
```

### Model Status
```http
GET /api/ml/status
```

### Predict Category
```http
POST /api/ml/predict
Content-Type: application/json

{
  "message": "How does AI work?"
}
```

## Model Performance

### Metrics Tracked
- **Accuracy**: Overall classification accuracy
- **Precision**: Per-category precision scores
- **Recall**: Per-category recall scores
- **F1-Score**: Per-category F1 scores
- **Confidence Distribution**: Confidence level statistics

### Confidence Levels
- **High**: ≥ 80% confidence
- **Medium**: 60-79% confidence
- **Low**: 40-59% confidence
- **Very Low**: < 40% confidence

## Continuous Learning

### Feedback Collection
1. **User Satisfaction**: 1-5 star rating system
2. **Category Correction**: Users can specify correct categories
3. **Text Feedback**: Free-form improvement suggestions
4. **Automatic Retraining**: Triggers when satisfaction < 50%

### Learning Triggers
- Low user satisfaction scores
- New training examples added
- Manual retraining requests
- Scheduled retraining (future feature)

## Data Storage

### Model Files
```
server/data/ml_models/
├── classifier.pkl          # Trained classifier
├── label_encoder.pkl       # Category label encoder
├── metrics.json           # Model performance metrics
└── training_data.json     # Training examples
```

### Training Data Format
```json
[
  {
    "text": "What is machine learning?",
    "category": "machine_learning",
    "response": "Machine Learning is...",
    "timestamp": "2024-01-01T00:00:00Z"
  }
]
```

## Integration

### Frontend Integration
The chatbot automatically uses ML predictions when available:

```typescript
// Frontend automatically tries ML first, falls back to local
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    use_ml: true
  })
});
```

### Fallback Strategy
1. **ML Model**: Primary response generation
2. **OpenAI API**: Fallback for low confidence
3. **Local Chatbot**: Final fallback if APIs unavailable

## Configuration

### Model Parameters
```python
# In ml_chatbot_model.py
TFIDF_MAX_FEATURES = 5000
TFIDF_NGRAM_RANGE = (1, 2)
RANDOM_FOREST_ESTIMATORS = 100
MIN_CONFIDENCE_THRESHOLD = 0.3
```

### Training Parameters
```python
TEST_SPLIT_SIZE = 0.2
RANDOM_STATE = 42
CROSS_VALIDATION_FOLDS = 5
```

## Monitoring

### Model Metrics Dashboard
Access model performance at `/api/ml/status`:

```json
{
  "ok": true,
  "model_status": {
    "metrics": {
      "accuracy": 0.85,
      "last_trained": "2024-01-01T00:00:00Z",
      "training_samples": 150,
      "version": "1.0"
    },
    "is_trained": true,
    "categories": ["help", "machine_learning", "..."],
    "training_data_count": 150
  }
}
```

### Logging
- Training progress and metrics
- Prediction confidence levels
- User feedback collection
- Error handling and fallbacks

## Future Enhancements

### Planned Features
1. **Deep Learning**: Neural network models for better accuracy
2. **Intent Recognition**: More sophisticated intent classification
3. **Sentiment Analysis**: Response tone adaptation
4. **Multi-language Support**: Cross-language learning
5. **A/B Testing**: Model performance comparison
6. **Real-time Learning**: Online learning algorithms

### Scalability Improvements
1. **Distributed Training**: Multi-GPU training support
2. **Model Versioning**: Multiple model versions
3. **Feature Stores**: Centralized feature management
4. **MLOps Pipeline**: Automated training and deployment

## Troubleshooting

### Common Issues

**Model Not Training**
```bash
# Check dependencies
pip install -r requirements.txt

# Verify data files
ls server/data/responseCategories.js

# Run training manually
python train_model.py
```

**Low Accuracy**
```bash
# Add more training data
# Check category keywords
# Adjust model parameters
```

**API Errors**
```bash
# Check server logs
# Verify model files exist
# Test with curl
curl -X POST http://localhost:8000/api/ml/status
```

## Contributing

### Adding New Categories
1. Update `server/data/responseCategories.js`
2. Add keywords and responses
3. Retrain model: `python train_model.py`
4. Test with new examples

### Improving Model Performance
1. Add more training examples
2. Tune hyperparameters
3. Implement feature engineering
4. Collect user feedback

## License

This ML implementation is part of the Matex project and follows the same licensing terms.


