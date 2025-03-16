
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Upload, File } from "lucide-react";
import * as XLSX from 'xlsx';

interface DemoWelcomeScreenProps {
  onStart: (demoUrls: string[]) => void;
}

const DemoWelcomeScreen: React.FC<DemoWelcomeScreenProps> = ({ onStart }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [extractedUrls, setExtractedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      setError("");
      setExtractedUrls([]);
      return;
    }
    
    // Check if file is an Excel file
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      setFile(null);
      setExtractedUrls([]);
      return;
    }
    
    setFile(selectedFile);
    setError("");
    parseExcelFile(selectedFile);
  };

  const parseExcelFile = (excelFile: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<{ [key: string]: any }>(worksheet, { header: 1 });
        
        // Extract URLs
        const urls: string[] = [];
        
        jsonData.forEach(row => {
          if (Array.isArray(row)) {
            row.forEach(cell => {
              if (typeof cell === 'string' && (cell.startsWith('http://') || cell.startsWith('https://'))) {
                urls.push(cell);
              }
            });
          }
        });
        
        if (urls.length === 0) {
          setError("No valid URLs found in the Excel file");
          setExtractedUrls([]);
          return;
        }
        
        if (urls.length > 1000) {
          setError("For performance reasons, please limit to 1000 demos or fewer");
          setExtractedUrls(urls.slice(0, 1000));
          return;
        }
        
        setExtractedUrls(urls);
        setError("");
      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setError("Error parsing Excel file. Please ensure it's a valid Excel format.");
        setExtractedUrls([]);
      }
    };
    
    reader.onerror = () => {
      setError("Error reading the file");
      setExtractedUrls([]);
    };
    
    reader.readAsArrayBuffer(excelFile);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (extractedUrls.length === 0) {
      setError("Please upload an Excel file with valid URLs first");
      return;
    }
    
    onStart(extractedUrls);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-purple-light/20 border-2">
        <CardHeader className="bg-purple-light/10 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-purple-dark">Demo Review Tracker</CardTitle>
          <CardDescription>Upload an Excel file with demo URLs to review</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div 
              className="border-2 border-dashed border-purple-light/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple/50 transition-colors mb-4"
              onClick={handleUploadClick}
            >
              <File className="mx-auto h-12 w-12 text-purple-light mb-2" />
              <p className="text-sm text-gray-500 mb-1">Click to upload an Excel file with demo URLs</p>
              <p className="text-xs text-gray-400">.xlsx or .xls format</p>
              
              {file && (
                <div className="mt-4 p-2 bg-purple-light/10 rounded-md">
                  <p className="text-sm font-medium text-purple-dark">{file.name}</p>
                  <p className="text-xs text-gray-500">{extractedUrls.length} URLs found</p>
                </div>
              )}
            </div>
            
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            
            {extractedUrls.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Found {extractedUrls.length} demo URLs:</p>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
                  {extractedUrls.map((url, index) => (
                    <p key={index} className="text-xs truncate text-gray-600 py-1 border-b border-gray-100 last:border-0">
                      {url}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-purple hover:bg-purple-dark transition-colors"
              disabled={extractedUrls.length === 0}
            >
              Start Review <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default DemoWelcomeScreen;
