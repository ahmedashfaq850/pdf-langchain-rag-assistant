
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const navigate = useNavigate();
  
  const handleUploadSuccess = (response: any) => {
    setUploadResponse(response);
    setUploadComplete(true);
  };
  
  const handleProceedToChat = () => {
    // Store the response in sessionStorage to access it in the chat page
    if (uploadResponse) {
      sessionStorage.setItem('pdfData', JSON.stringify(uploadResponse));
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 text-gradient">PDF Chat Assistant</h1>
        <p className="text-lg text-muted-foreground">
          Upload your PDF document and chat with its content
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>
      
      {uploadComplete && (
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-green-400 mb-4">
            Successfully processed {uploadResponse?.chunks || 'all'} chunks!
          </p>
          <Button 
            onClick={handleProceedToChat}
            size="lg" 
            className="bg-accent hover:bg-accent/80 text-white hover-glow group"
          >
            Proceed to Chat 
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <p className="text-sm text-muted-foreground">
          Powered by Advanced RAG Technology
        </p>
      </div>
    </div>
  );
};

export default Index;
