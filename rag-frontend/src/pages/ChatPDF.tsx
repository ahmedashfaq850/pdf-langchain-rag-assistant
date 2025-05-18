
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import PDFViewer from '@/components/PDFViewer';
import ChatInterface from '@/components/ChatInterface';
import LoadingAnimation from '@/components/LoadingAnimation';
import { Button } from "@/components/ui/button";

const ChatPDF = () => {
  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedData = sessionStorage.getItem('pdfData');
    const storedPdfContent = sessionStorage.getItem('pdfContent');
    
    if (!storedData) {
      toast({
        title: "No PDF data found",
        description: "Please upload a PDF first.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    try {
      const data = JSON.parse(storedData);
      setPdfData(data);
      
      // Use the actual PDF content from sessionStorage
      if (storedPdfContent) {
        setPdfUrl(storedPdfContent);
      } else {
        toast({
          title: "PDF content not found",
          description: "There was an issue with the PDF display.",
          variant: "destructive",
        });
        navigate('/');
      }
      
      // Simulate loading time for UI polish
      setTimeout(() => {
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error parsing PDF data:", error);
      toast({
        title: "Error",
        description: "Failed to load PDF data. Please try again.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation type="full" text="Preparing chat interface..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-secondary/30 p-2 border-b border-border flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          Back to Upload
        </Button>
        <h1 className="text-lg font-medium">PDF Chat Assistant</h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 h-[400px] md:h-auto border-r border-border">
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
        
        <div className="w-full md:w-1/2 h-[calc(100vh-400px-44px)] md:h-auto">
          <ChatInterface fileName={pdfData?.fileName} />
        </div>
      </div>
    </div>
  );
};

export default ChatPDF;
