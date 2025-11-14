
import React from 'react';
import ChatInterface from './components/ChatInterface';
import BotIcon from './components/icons/BotIcon';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 shadow-md p-4 flex items-center justify-center space-x-3 sticky top-0 z-10">
        <div className="w-8 h-8">
            <BotIcon />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-cyan-400">SkyTech DSA Instructor</h1>
      </header>
      <main className="flex-1 flex flex-col">
        <ChatInterface />
      </main>
    </div>
  );
};

export default App;
