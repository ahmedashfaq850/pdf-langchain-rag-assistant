
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  fileName?: string;
}

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = ({ fileName }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hi there! I've analyzed your PDF. What would you like to know about it?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Send request to API with correct endpoint and format
      const response = await fetch('http://127.0.0.1:8000/chat-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data); // For debugging
      
      // Simulate AI thinking time for better UX
      setTimeout(() => {
        setIsTyping(false);
        
        // Add AI response - check for the 'answer' field from the API
        setMessages(prev => [
          ...prev, 
          {
            content: data.answer || data.response || data.message || "I processed your question but couldn't find a specific answer in the document.",
            isUser: false,
            timestamp: new Date()
          }
        ]);
        
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-background p-4 border-b border-border">
        <h2 className="text-lg font-medium">Chat with PDF{fileName ? `: ${fileName}` : ""}</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Ask questions about the document content
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about the document..."
            className="bg-secondary border-none focus-visible:ring-1 focus-visible:ring-accent"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className={`${
              isLoading || !inputValue.trim() 
                ? 'bg-secondary text-muted-foreground' 
                : 'bg-accent text-white hover:bg-accent/90'
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
