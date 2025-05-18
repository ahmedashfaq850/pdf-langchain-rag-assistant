
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start space-x-2 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
        <span className="text-accent font-semibold">AI</span>
      </div>
      <div className="bg-secondary p-3 rounded-xl rounded-tl-none max-w-xs">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
