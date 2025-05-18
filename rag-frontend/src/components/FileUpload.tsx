import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

interface FileUploadProps {
  onUploadSuccess: (response: any) => void;
  maxSize?: number; // In MB
}

const FileUpload = ({ onUploadSuccess, maxSize = 10 }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size should not exceed ${maxSize}MB.`,
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    
    // Store PDF content for display
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // Store the PDF content in sessionStorage
        sessionStorage.setItem('pdfContent', e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    await uploadFile(file);
  };
  
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress (in a real app, you might get this from an upload progress event)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      const response = await fetch('http://127.0.0.1:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      setUploadProgress(100);
      const data = await response.json();
      
      setTimeout(() => {
        toast({
          title: "Success!",
          description: data.message || "PDF uploaded successfully.",
        });
        onUploadSuccess(data);
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      {isUploading ? (
        <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center space-y-6 animate-fade-in card-shadow">
          <LoadingAnimation type="full" text="Processing your PDF..."/>
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {uploadProgress < 100 
              ? "Analyzing and storing in knowledge base..."
              : "Processing complete!"}
          </p>
          {fileName && (
            <p className="text-xs text-muted-foreground mt-2 truncate max-w-full">
              {fileName}
            </p>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out text-center space-y-4 ${
            isDragging
              ? "bg-accent/10 border-accent"
              : "glass border-white/10 hover:border-accent/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto h-16 w-16 bg-secondary/50 flex items-center justify-center rounded-full">
            <Upload className="h-8 w-8 text-accent animate-bounce-subtle" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground">Upload a PDF Document</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop your PDF here, or click to browse files
            </p>
          </div>

          <Button 
            className="bg-accent text-white hover-glow"
            onClick={() => fileInputRef.current?.click()}
          >
            Select PDF File
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            accept="application/pdf"
            className="hidden"
          />

          <p className="text-xs text-muted-foreground">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
