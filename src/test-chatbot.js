// Simple test for the local chatbot
import LocalChatbot from './services/localChatbot.js';

const chatbot = new LocalChatbot();

// Test questions
const testQuestions = [
  "What services does Matex offer?",
  "Tell me about Mohammad ALMESTRAH",
  "What AI solutions do you provide?",
  "How can I contact Matex?",
  "What is your pricing?",
  "Where is Matex located?"
];

console.log('Testing Matex Chatbot...\n');

testQuestions.forEach(async (question, index) => {
  try {
    const response = await chatbot.chat(question);
    console.log(`Q${index + 1}: ${question}`);
    console.log(`A${index + 1}: ${response.response}\n`);
  } catch (error) {
    console.error(`Error with question ${index + 1}:`, error);
  }
});



