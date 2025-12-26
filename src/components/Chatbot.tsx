import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, X, MessageSquare, Loader2, Bot, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MLChatbot from '../services/mlChatbot';
import AIChatbot from '../services/aiChatbot';

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

  // Initialize AI chatbot (ChatGPT-like) - Always use AI service
  const [aiChatbot] = useState(() => {
    try {
      return new AIChatbot({
        useOpenAI: true // Always try to use AI
      });
    } catch (error) {
      console.warn('AI Chatbot initialization failed:', error);
      return null;
    }
  });
  const [mlChatbot] = useState(() => new MLChatbot()); // Fallback only
  const [useAI] = useState(true); // Always prefer AI mode
  const [isStreaming, setIsStreaming] = useState(false);
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || '';

  // No need for health check since we're using local data
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Check if current language is RTL (Arabic)
  const isRTL = i18n.language === 'ar';

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
    try {
      // Always try AI chatbot first (it has built-in fallback)
      if (aiChatbot) {
        const response = await aiChatbot.chat(messageText, true);
        if (response.session_id && !sessionId) {
          setSessionId(response.session_id);
        }
        return response.response;
      } else {
        // Fallback to ML chatbot if AI service unavailable
        const response = await mlChatbot.chat(messageText);
        if (response.session_id && !sessionId) {
          setSessionId(response.session_id);
        }
        return response.response;
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      // Final fallback to ML chatbot
      try {
        const response = await mlChatbot.chat(messageText);
        return response.response;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Check if streaming is available and enabled (if OpenAI API key is set)
      if (aiChatbot && import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_ENABLE_STREAMING === 'true') {
        setIsStreaming(true);
        let fullResponse = '';
        
        await aiChatbot.chatStream(messageText, (chunk: string) => {
          fullResponse += chunk;
          // Update the last message with streaming content
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
              lastMsg.content = fullResponse;
            } else {
              newMessages.push({ role: 'assistant', content: fullResponse });
            }
            return newMessages;
          });
        });
        
        setIsStreaming(false);
      } else {
        // Regular non-streaming response
        const reply = await postChat(messageText);
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch (error) {
      console.error('Error:', error);
      const fallback = localFallbackResponder(messageText);
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
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
        content: 'Thank you for your interest! We have received your information and will contact you soon. You can also reach us directly at almestrahmohammad@gmail.com or +961 76162549.' 
      }]);
      
      // Reset form
      setLead({ name: '', email: '', company: '' });
    } catch (error) {
      console.error('Error saving lead:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error saving your information. Please contact us directly at almestrahmohammad@gmail.com or +961 76162549.' 
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
        className={`fixed bottom-4 sm:bottom-6 bg-[#5C3FBD] text-white px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#5C3FBD]/20 transition-all duration-300 flex items-center gap-2 sm:gap-3 z-50 group ${
          isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageSquare className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-medium text-sm sm:text-base whitespace-nowrap">{t('chatbot.buttonText')}</span>
      </motion.button>

      {/* Chat Window - Half Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? '-100%' : '100%', scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: isRTL ? '-100%' : '100%', scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              mass: 0.5
            }}
            className={`fixed top-0 w-full md:w-1/2 h-screen bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col ${
              isRTL 
                ? 'left-0 border-r border-gray-200 dark:border-gray-700' 
                : 'right-0 border-l border-gray-200 dark:border-gray-700'
            }`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="bg-[#5C3FBD] dark:bg-gray-800 h-16 flex items-center px-4 sm:px-6 relative overflow-visible">
              <div className="relative flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-sm relative">
                    <Bot className="h-6 w-6 text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-0.5 shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                    >
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg flex items-center gap-2">
                      {t('chatbot.title')}
                      <motion.span
                        className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-400/30"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        AI
                      </motion.span>
                    </h3>
                    <p className="text-xs text-white/70">Powered by Advanced AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-white/80 hover:text-white p-2.5 rounded-lg hover:bg-white/10 transition-colors relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {t('chatbot.showSuggestions')}
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white p-2.5 rounded-lg hover:bg-white/10 transition-colors relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-5 w-5" />
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {t('chatbot.close')}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
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
                  className={`flex ${
                    isRTL 
                      ? (message.role === 'user' ? 'justify-start' : 'justify-end')
                      : (message.role === 'user' ? 'justify-end' : 'justify-start')
                  }`}
                >
                  {message.role === 'assistant' && (
                    <motion.div 
                      className={`w-10 h-10 rounded-xl bg-[#5C3FBD]/10 flex items-center justify-center ${
                        isRTL ? 'ml-3' : 'mr-3'
                      }`}
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Bot className="h-5 w-5 text-[#5C3FBD]" />
                    </motion.div>
                  )}
                  <motion.div
                    className={`max-w-[80%] p-4 text-base rounded-2xl shadow-sm whitespace-pre-wrap ${
                      message.role === 'user'
                        ? `bg-[#5C3FBD] text-white ${isRTL ? 'rounded-bl-none' : 'rounded-br-none'}`
                        : `bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${isRTL ? 'rounded-br-none' : 'rounded-bl-none'} border border-gray-100 dark:border-gray-600`
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {message.content}
                  </motion.div>
                </motion.div>
              ))}
              {isLoading && !isStreaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-[#5C3FBD]/10 flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    <Bot className="h-5 w-5 text-[#5C3FBD]" />
                  </div>
                  <div className={`bg-white dark:bg-gray-700 p-4 rounded-2xl ${isRTL ? 'rounded-br-none' : 'rounded-bl-none'} border border-gray-100 dark:border-gray-600`}>
                    <Loader2 className="h-6 w-6 animate-spin text-[#5C3FBD]" />
                  </div>
                </motion.div>
              )}
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-[#5C3FBD]/10 flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    <Sparkles className="h-5 w-5 text-[#5C3FBD] animate-pulse" />
                  </div>
                  <div className={`bg-white dark:bg-gray-700 p-3 rounded-2xl ${isRTL ? 'rounded-br-none' : 'rounded-bl-none'} border border-gray-100 dark:border-gray-600`}>
                    <div className="flex gap-1">
                      <motion.div className="w-2 h-2 bg-[#5C3FBD] rounded-full" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-2 h-2 bg-[#5C3FBD] rounded-full" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 bg-[#5C3FBD] rounded-full" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
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
                      className="w-full text-left p-4 text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl hover:bg-[#5C3FBD]/5 dark:hover:bg-[#5C3FBD]/10 transition-all duration-200 border border-gray-100 dark:border-gray-600 hover:border-[#5C3FBD]/20 dark:hover:border-[#5C3FBD]/30"
                      whileHover={{ x: 5 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={() => setShowLead(true)}
                    className="w-full text-left p-4 text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl hover:bg-[#5C3FBD]/5 dark:hover:bg-[#5C3FBD]/10 transition-all duration-200 border border-gray-100 dark:border-gray-600 hover:border-[#5C3FBD]/20 dark:hover:border-[#5C3FBD]/30"
                    whileHover={{ x: 5 }}
                  >
                    {t('chatbot.contactSales')}
                  </motion.button>
                </motion.div>
              )}
              {showLead && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 space-y-3">
                  <div className="flex gap-3">
                    <input placeholder={t('chatbot.leadName')} value={lead.name} onChange={(e)=>setLead({...lead,name:e.target.value})} className="flex-1 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"/>
                    <input placeholder={t('chatbot.leadEmail')} value={lead.email} onChange={(e)=>setLead({...lead,email:e.target.value})} className="flex-1 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"/>
                  </div>
                  <input placeholder={t('chatbot.leadCompany')} value={lead.company} onChange={(e)=>setLead({...lead,company:e.target.value})} className="w-full border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"/>
                  <div className="flex gap-2">
                    <button onClick={submitLead} className="px-4 py-2 bg-[#5C3FBD] text-white rounded">{t('chatbot.leadSubmit')}</button>
                    <button onClick={()=>setShowLead(false)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">{t('chatbot.leadCancel')}</button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 h-12 px-4 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#5C3FBD]/20 focus:border-[#5C3FBD] outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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