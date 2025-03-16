
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Save, Download, Check, Home } from "lucide-react";
import { SlideNode, DoublyLinkedList } from "@/utils/DoublyLinkedList";
import { generateReviewReport, downloadTextFile } from "@/utils/fileUtils";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface ReviewInterfaceProps {
  slidesList: DoublyLinkedList;
  onComplete: () => void;
}

const ReviewInterface: React.FC<ReviewInterfaceProps> = ({ slidesList, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState<SlideNode | null>(slidesList.current);
  const [remarks, setRemarks] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [slidesRemaining, setSlidesRemaining] = useState<number>(slidesList.getSlidesRemaining());
  const { toast } = useToast();

  useEffect(() => {
    if (currentSlide) {
      setRemarks(currentSlide.remarks);
    }
    
    setProgress(slidesList.getCompletionPercentage());
    setSlidesRemaining(slidesList.getSlidesRemaining());
  }, [currentSlide, slidesList]);

  const handlePrevious = () => {
    const prevSlide = slidesList.movePrev();
    if (prevSlide) {
      setCurrentSlide(prevSlide);
    }
  };

  const handleNext = () => {
    const nextSlide = slidesList.moveNext();
    if (nextSlide) {
      setCurrentSlide(nextSlide);
    }
  };

  const handleSave = () => {
    if (currentSlide) {
      slidesList.updateCurrentSlide(remarks);
      setProgress(slidesList.getCompletionPercentage());
      setSlidesRemaining(slidesList.getSlidesRemaining());
      
      toast({
        title: "Slide Saved",
        description: `Slide ${currentSlide.id} review has been saved.`,
        duration: 3000,
      });
      
      // Automatically move to next slide if available
      if (currentSlide.next) {
        handleNext();
      }
    }
  };

  const handleGenerateReport = () => {
    const allSlides = slidesList.getAllSlides();
    const reportContent = generateReviewReport(allSlides);
    downloadTextFile(reportContent, "slide-review-report.txt");
    
    toast({
      title: "Report Generated",
      description: "Your review report has been downloaded.",
      duration: 3000,
    });
    
    onComplete();
  };

  if (!currentSlide) return null;

  const isFirst = currentSlide.prev === null;
  const isLast = currentSlide.next === null;
  const isComplete = slidesList.isComplete();

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-4xl shadow-lg border-purple-light/20 border-2">
        <CardHeader className="bg-purple-light/10 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-purple-dark">
                Slide {currentSlide.id} of {slidesList.totalSlides}
              </CardTitle>
              <CardDescription>
                {slidesRemaining} slides remaining • {progress.toFixed(0)}% complete
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-purple-light/30"
                >
                  <Home className="h-4 w-4 mr-1" /> Home
                </Button>
              </Link>
              <div className="text-sm font-medium text-purple-dark">
                {currentSlide.reviewed ? (
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    Reviewed
                  </div>
                ) : (
                  "Not Reviewed"
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-4">
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>
          
          <div className="mb-4">
            <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 mb-2">
              Review Remarks
            </label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter your remarks for this slide (leave empty if everything is fine)"
              className="min-h-[200px] border-purple-light/30 focus:border-purple"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
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

export default ReviewInterface;
