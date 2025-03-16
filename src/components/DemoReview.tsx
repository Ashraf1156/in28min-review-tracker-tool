
import React, { useState } from "react";
import DemoWelcomeScreen from "./DemoWelcomeScreen";
import DemoReviewInterface from "./DemoReviewInterface";
import { DemoDoublyLinkedList } from "@/utils/DemoDoublyLinkedList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

const DemoReview: React.FC = () => {
  const [demosList, setDemosList] = useState<DemoDoublyLinkedList | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handleStart = (demoUrls: string[]) => {
    const newDemosList = new DemoDoublyLinkedList(demoUrls);
    setDemosList(newDemosList);
    setIsComplete(false);
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  const handleReset = () => {
    setDemosList(null);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-purple-light/20 border-2">
          <CardHeader className="bg-purple-light/10 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-purple-dark">Review Complete!</CardTitle>
            <CardDescription>Your demo review has been successfully completed</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <p className="text-center">
              Thank you for using the Demo Review Tracker. Your review report has been downloaded.
            </p>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleReset}
                className="bg-purple hover:bg-purple-dark transition-colors"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Start a New Demo Review
              </Button>
              
              <Link to="/">
                <Button 
                  variant="outline"
                  className="border-purple-light/30"
                >
                  <Home className="mr-1 h-4 w-4" /> Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!demosList) {
    return <DemoWelcomeScreen onStart={handleStart} />;
  }

  return <DemoReviewInterface demosList={demosList} onComplete={handleComplete} />;
};

export default DemoReview;
