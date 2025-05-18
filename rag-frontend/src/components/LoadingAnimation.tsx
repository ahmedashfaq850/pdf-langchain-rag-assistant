
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingAnimationProps {
  text?: string;
  type?: 'full' | 'inline';
}

const LoadingAnimation = ({ text = "Loading...", type = 'inline' }: LoadingAnimationProps) => {
  if (type === 'full') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 h-full w-full">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-accent border-b-transparent border-l-transparent animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-accent border-l-transparent animate-spin-slow" style={{ animationDuration: '2.5s' }}></div>
        </div>
        {text && <p className="text-muted-foreground animate-pulse text-center">{text}</p>}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader className="h-4 w-4 animate-spin text-accent" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingAnimation;
