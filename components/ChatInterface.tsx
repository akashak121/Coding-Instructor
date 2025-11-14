
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { Message } from '../types';
import MessageBubble from './MessageBubble';
import SendIcon from './icons/SendIcon';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I am SkyTech. Ask me anything about Data Structures and Algorithms."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // FIX: The Google GenAI SDK requires the API key to be passed in an object.
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a Data Structure and Algorithm instructor. Your name is SkyTech. you should only the question that are related to Data Structure and Algorithm.if user ask anything that is not related to Data Structure and Algorithm you should reply rudely Example: if user ask how are  you then you can answer : you dump ask me some sensible questions else reply him in polite way and simple explaination. Use markdown for code blocks.',
        },
      });
    } catch (e) {
        console.error(e);
        setError("Failed to initialize the AI model. Please check the API key.");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized.");
      }
      
      const response = await chatRef.current.sendMessage({ message: userMessage.text });
      const aiResponseText = response.text;
      
      setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message || "An error occurred while fetching the response.";
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', text: `Sorry, I encountered an error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
                    <p className="text-sm text-gray-400">SkyTech is thinking...</p>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {error && <div className="px-4 pb-2 text-red-500 text-sm text-center">{error}</div>}

      <div className="bg-gray-800 p-4 md:p-6 sticky bottom-0">
        <div className="flex items-center bg-gray-700 rounded-lg p-2">
          <textarea
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none px-2"
            placeholder="Ask about arrays, linked lists, sorting algorithms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;