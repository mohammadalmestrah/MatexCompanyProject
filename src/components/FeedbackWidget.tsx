import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star, X } from 'lucide-react';

interface FeedbackWidgetProps {
  message: string;
  predictedCategory?: string;
  confidence?: number;
  onFeedback: (feedback: FeedbackData) => void;
  onClose: () => void;
}

interface FeedbackData {
  message: string;
  predictedCategory?: string;
  confidence?: number;
  satisfaction: number;
  correctCategory?: string;
  feedbackText?: string;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  message,
  predictedCategory,
  confidence,
  onFeedback,
  onClose
}) => {
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [correctCategory, setCorrectCategory] = useState('');

  const handleSubmit = () => {
    if (satisfaction !== null) {
      onFeedback({
        message,
        predictedCategory,
        confidence,
        satisfaction,
        correctCategory: correctCategory || undefined,
        feedbackText: feedbackText || undefined
      });
      onClose();
    }
  };

  const categories = [
    'help', 'machine_learning', 'artificial_intelligence', 'software_development',
    'mobile_development', 'web_technologies', 'cloud_computing', 'cybersecurity',
    'services', 'contact', 'pricing', 'escalation'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Help Improve Our AI</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Your question:</p>
          <p className="text-sm bg-gray-50 p-2 rounded border">"{message}"</p>
          
          {predictedCategory && (
            <div className="mt-2 text-xs text-gray-500">
              AI predicted: <span className="font-medium">{predictedCategory}</span>
              {confidence && (
                <span className="ml-2">
                  (confidence: {(confidence * 100).toFixed(1)}%)
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">How satisfied are you with this response?</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSatisfaction(rating / 5)}
                className={`p-2 rounded-full transition-colors ${
                  satisfaction !== null && satisfaction >= rating / 5
                    ? 'text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star className="h-5 w-5 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {satisfaction !== null && satisfaction < 0.6 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">What category should this have been?</p>
            <select
              value={correctCategory}
              onChange={(e) => setCorrectCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Select category...</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Additional feedback (optional):</p>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="How can we improve?"
            className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-20"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={satisfaction === null}
            className="flex-1 px-4 py-2 bg-[#5C3FBD] text-white rounded hover:bg-[#4A2F9A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackWidget;

