
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Save, Download, Check, ExternalLink } from "lucide-react";
import { DemoNode, DemoDoublyLinkedList } from "@/utils/DemoDoublyLinkedList";
import { generateDemoReviewReport, downloadTextFile } from "@/utils/demoFileUtils";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface DemoReviewInterfaceProps {
  demosList: DemoDoublyLinkedList;
  onComplete: () => void;
}

const DemoReviewInterface: React.FC<DemoReviewInterfaceProps> = ({ demosList, onComplete }) => {
  const [currentDemo, setCurrentDemo] = useState<DemoNode | null>(demosList.current);
  const [remarks, setRemarks] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [demosRemaining, setDemosRemaining] = useState<number>(demosList.getDemosRemaining());
  const { toast } = useToast();

  useEffect(() => {
    if (currentDemo) {
      setRemarks(currentDemo.remarks);
    }
    
    setProgress(demosList.getCompletionPercentage());
    setDemosRemaining(demosList.getDemosRemaining());
  }, [currentDemo, demosList]);

  const handlePrevious = () => {
    const prevDemo = demosList.movePrev();
    if (prevDemo) {
      setCurrentDemo(prevDemo);
    }
  };

  const handleNext = () => {
    const nextDemo = demosList.moveNext();
    if (nextDemo) {
      setCurrentDemo(nextDemo);
    }
  };

  const handleSave = () => {
    if (currentDemo) {
      demosList.updateCurrentDemo(remarks);
      setProgress(demosList.getCompletionPercentage());
      setDemosRemaining(demosList.getDemosRemaining());
      
      toast({
        title: "Demo Saved",
        description: `Demo ${currentDemo.id} review has been saved.`,
        duration: 3000,
      });
      
      // Automatically move to next demo if available
      if (currentDemo.next) {
        handleNext();
      }
    }
  };

  const handleGenerateReport = () => {
    const allDemos = demosList.getAllDemos();
    const reportContent = generateDemoReviewReport(allDemos);
    downloadTextFile(reportContent, "demo-review-report.txt");
    
    toast({
      title: "Report Generated",
      description: "Your demo review report has been downloaded.",
      duration: 3000,
    });
    
    onComplete();
  };

  const handleOpenInNewTab = () => {
    if (currentDemo?.url) {
      window.open(currentDemo.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!currentDemo) return null;

  const isFirst = currentDemo.prev === null;
  const isLast = currentDemo.next === null;
  const isComplete = demosList.isComplete();
  
  // Make sure the URL starts with http:// or https://
  const safeUrl = currentDemo.url.startsWith('http') 
    ? currentDemo.url
    : `https://${currentDemo.url}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-7xl shadow-lg border-purple-light/20 border-2">
        <CardHeader className="bg-purple-light/10 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-purple-dark">
                Demo {currentDemo.id} of {demosList.totalDemos}
              </CardTitle>
              <CardDescription>
                {demosRemaining} demos remaining • {progress.toFixed(0)}% complete
              </CardDescription>
            </div>
            <div className="text-sm font-medium text-purple-dark flex gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-light/30"
                onClick={handleOpenInNewTab}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Open in New Tab
              </Button>
              {currentDemo.reviewed ? (
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Reviewed
                </div>
              ) : (
                "Not Reviewed"
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-4">
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="border rounded-lg overflow-hidden bg-white h-[500px] shadow-sm">
                <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
                  <span className="text-xs truncate text-gray-600 max-w-[300px]">{safeUrl}</span>
                </div>
                <iframe
                  src={safeUrl}
                  className="w-full h-[465px]"
                  title={`Demo ${currentDemo.id}`}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 mb-2">
                Review Remarks
              </label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your remarks for this demo (leave empty if everything is fine)"
                className="min-h-[450px] border-purple-light/30 focus:border-purple"
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <div>
            <Button 
              onClick={handlePrevious} 
              disabled={isFirst}
              variant="outline"
              className="mr-2 border-purple-light/30"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={isLast}
              variant="outline"
              className="border-purple-light/30"
            >
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div>
            {isComplete ? (
              <Button 
                onClick={handleGenerateReport}
                className="bg-green-600 hover:bg-green-700 transition-colors"
              >
                <Download className="mr-1 h-4 w-4" /> Save Review Report
              </Button>
            ) : (
              <Button 
                onClick={handleSave}
                className="bg-purple hover:bg-purple-dark transition-colors"
              >
                <Save className="mr-1 h-4 w-4" /> Save and Continue
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DemoReviewInterface;
