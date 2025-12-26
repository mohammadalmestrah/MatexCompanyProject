import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, X, MessageSquare, Loader2, Bot, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MLChatbot from '../services/mlChatbot';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: ''
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  // Initialize ML chatbot
  const [mlChatbot] = useState(() => new MLChatbot());
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || '';

  // No need for health check since we're using local data
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "What is machine learning?",
    "Tell me about artificial intelligence",
    "What services does Matex offer?",
    "Do you develop mobile apps?",
    "What about cloud computing?",
    "How can I contact Matex?",
    "Tell me about cybersecurity",
    "What web technologies do you use?"
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

  // No need for health check since we're using local data

  useEffect(() => {
    // Set initial assistant greeting when language changes
    const greeting = t('chatbot.greeting') || "Hello! I'm Matex's AI assistant with machine learning capabilities. I can help you with detailed information about machine learning, AI, software development, mobile development, web technologies, cloud computing, cybersecurity, and more. What would you like to know?";
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [i18n.language]);

  const localFallbackResponder = (text: string) => {
    const lower = text.toLowerCase();
    if (/(price|cost|pay|pricing|سعر|تكلفة|دفع)/.test(lower)) {
      return t('chatbot.fallback.price');
    }
    if (/(service|offer|what do you do|خدمة|خدمات|ماذا تفعلون)/.test(lower)) {
      return t('chatbot.fallback.services');
    }
    if (/(contact|email|phone|reach|اتصال|تواصل|بريد|هاتف)/.test(lower)) {
      return t('chatbot.fallback.contact');
    }
    return t('chatbot.fallback.generic');
  };

  const postChat = async (messageText: string) => {
    // Use ML chatbot directly (no server needed)
    try {
      const response = await mlChatbot.chat(messageText);
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id);
      }
      return response.response;
    } catch (error) {
      console.error('ML chatbot error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user' as const, content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const reply = await postChat(userMessage.content);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Error:', error);
      const fallback = localFallbackResponder(userMessage.content);
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Send the suggestion as a message immediately
    setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
    setIsLoading(true);
    setShowSuggestions(false);
    postChat(suggestion)
      .then((reply) => {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      })
      .catch(() => {
        const fallback = localFallbackResponder(suggestion);
        setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      })
      .finally(() => setIsLoading(false));
  };

  // Lead capture minimal UI (modal-like inline)
  const [showLead, setShowLead] = useState(false);
  const [lead, setLead] = useState({ name: '', email: '', company: '' });
  const submitLead = async () => {
    if (!lead.name || !lead.email) return;
    try {
      // Store lead data locally (you can implement actual storage later)
      const leadData = {
        ...lead,
        language: (window as any).i18next?.language || 'en',
        timestamp: new Date().toISOString()
      };
      
      // For now, just log it (you can implement actual storage)
      console.log('Lead captured:', leadData);
      
      setShowLead(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Thank you for your interest! We have received your information and will contact you soon. You can also reach us directly at contact@matex.com or +1 (234) 567-890.' 
      }]);
      
      // Reset form
      setLead({ name: '', email: '', company: '' });
    } catch (error) {
      console.error('Error saving lead:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error saving your information. Please contact us directly at contact@matex.com or +1 (234) 567-890.' 
      }]);
    }
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
        <span className="font-medium text-sm sm:text-base whitespace-nowrap">Chat with Matex AI</span>
      </motion.button>

      {/* Chat Window - Half Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%', scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: '100%', scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              mass: 0.5
            }}
            className="fixed top-0 right-0 w-full md:w-1/2 h-screen bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#5C3FBD] p-6 relative overflow-hidden">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-sm">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-white text-lg">Matex ML AI Assistant</h3>
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
                      Show Suggestions
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
                      Close
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
                  initial={{ opacity: 0, y: 20, scale: 0.9, x: message.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                    delay: index * 0.05
                  }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <motion.div 
                      className="w-10 h-10 rounded-xl bg-[#5C3FBD]/10 flex items-center justify-center mr-3"
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Bot className="h-5 w-5 text-[#5C3FBD]" />
                    </motion.div>
                  )}
                  <motion.div
                    className={`max-w-[80%] p-4 text-base rounded-2xl shadow-sm whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-[#5C3FBD] text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {message.content}
                  </motion.div>
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
                  <motion.button
                    onClick={() => setShowLead(true)}
                    className="w-full text-left p-4 text-base bg-white rounded-xl hover:bg-[#5C3FBD]/5 transition-all duration-200 border border-gray-100 hover:border-[#5C3FBD]/20"
                    whileHover={{ x: 5 }}
                  >
                    Contact Sales
                  </motion.button>
                </motion.div>
              )}
              {showLead && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                  <div className="flex gap-3">
                    <input placeholder="Your Name" value={lead.name} onChange={(e)=>setLead({...lead,name:e.target.value})} className="flex-1 border rounded px-3 py-2"/>
                    <input placeholder="Your Email" value={lead.email} onChange={(e)=>setLead({...lead,email:e.target.value})} className="flex-1 border rounded px-3 py-2"/>
                  </div>
                  <input placeholder="Company (Optional)" value={lead.company} onChange={(e)=>setLead({...lead,company:e.target.value})} className="w-full border rounded px-3 py-2"/>
                  <div className="flex gap-2">
                    <button onClick={submitLead} className="px-4 py-2 bg-[#5C3FBD] text-white rounded">Submit</button>
                    <button onClick={()=>setShowLead(false)} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                </div>
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
                  placeholder="Ask me about Matex services, founder, or contact info..."
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