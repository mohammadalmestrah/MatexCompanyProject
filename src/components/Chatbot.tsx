import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Loader2, Bot, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello! I'm the Matex Assistant. I can help you with:\n\n• Information about Matex\n• Our services and solutions\n• Office locations\n• Contact information\n• Career opportunities\n• Technology stack\n• Schedule a consultation\n\nWhat would you like to know?"
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "Tell me about Matex",
    "What services do you offer?",
    "Where are your offices?",
    "How can I contact you?",
    "Career opportunities",
    "Schedule a consultation"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user' as const, content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: userMessage.content })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#5C3FBD] text-white px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#5C3FBD]/20 transition-all duration-300 flex items-center gap-2 sm:gap-3 z-50 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageSquare className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-medium text-sm sm:text-base whitespace-nowrap">Chat with us</span>
      </motion.button>

      {/* Chat Window - Half Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 w-full md:w-1/2 h-screen bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#5C3FBD] p-6 relative overflow-hidden">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-sm">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-white text-lg">Matex Assistant</h3>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-white/80 hover:text-white p-2.5 rounded-lg hover:bg-white/10 transition-colors relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Show suggestions
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white p-2.5 rounded-lg hover:bg-white/10 transition-colors relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-5 w-5" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Close chat
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-xl bg-[#5C3FBD]/10 flex items-center justify-center mr-3">
                      <Bot className="h-5 w-5 text-[#5C3FBD]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 text-base rounded-2xl shadow-sm whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-[#5C3FBD] text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#5C3FBD]/10 flex items-center justify-center mr-3">
                    <Bot className="h-5 w-5 text-[#5C3FBD]" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100">
                    <Loader2 className="h-6 w-6 animate-spin text-[#5C3FBD]" />
                  </div>
                </motion.div>
              )}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-4 text-base bg-white rounded-xl hover:bg-[#5C3FBD]/5 transition-all duration-200 border border-gray-100 hover:border-[#5C3FBD]/20"
                      whileHover={{ x: 5 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 h-12 px-4 text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C3FBD]/20 focus:border-[#5C3FBD] outline-none transition-all duration-200"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="h-12 w-12 flex items-center justify-center bg-[#5C3FBD] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#5C3FBD]/20 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;