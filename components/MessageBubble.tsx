
import React from 'react';
import type { Message } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  // Render model messages with markdown for code blocks
  const renderModelMessage = (text: string) => {
    // Regex to find code blocks: ```lang\ncode```
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const content: React.ReactNode[] = [];
    let lastIndex = 0;
    
    let hasCodeBlock = false;
    for (const match of text.matchAll(codeBlockRegex)) {
      hasCodeBlock = true;
      // Add text part before the code block
      if (match.index! > lastIndex) {
        content.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      const language = match[1];
      const code = match[2];

      // Add code block
      content.push(
          <div key={`code-${match.index}`} className="bg-black bg-opacity-30 rounded-md my-2">
              <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 rounded-t-md flex justify-between items-center">
                  <span>{language || 'code'}</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono"><code>{code.trim()}</code></pre>
          </div>
      );
      lastIndex = match.index! + match[0].length;
    }

    // Add remaining text after the last code block
    if (lastIndex < text.length) {
      content.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    // If no code blocks found, render the whole text as-is in a pre tag to preserve whitespace
    if (!hasCodeBlock) {
      return <pre className="whitespace-pre-wrap font-sans text-sm md:text-base">{text}</pre>;
    }
    
    return <div className="whitespace-pre-wrap font-sans text-sm md:text-base">{content}</div>;
  }


  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center">
          <BotIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-2xl rounded-lg px-4 py-3 ${
          isModel ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'
        }`}
      >
        {isModel ? renderModelMessage(message.text) : <pre className="whitespace-pre-wrap font-sans text-sm md:text-base">{message.text}</pre>}
      </div>
       {!isModel && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
