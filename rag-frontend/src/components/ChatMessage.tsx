
import React from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: Date;
}

const ChatMessage = ({ content, isUser, timestamp = new Date() }: ChatMessageProps) => {
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div 
      className={cn(
        "flex items-start space-x-2 mb-4 animate-fade-in",
        isUser ? "justify-end ml-12" : "mr-12"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
          <span className="text-accent font-semibold">AI</span>
        </div>
      )}
      
      <div className={cn(
        "p-3 rounded-xl text-sm",
        isUser 
          ? "bg-accent text-white rounded-tr-none" 
          : "bg-secondary rounded-tl-none"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="markdown-content prose prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
        <div className={cn(
          "text-[10px] mt-1 text-right",
          isUser ? "text-white/70" : "text-muted-foreground"
        )}>
          {formattedTime}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-semibold">You</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
