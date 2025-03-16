
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: (slideCount: number) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [slideCount, setSlideCount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const count = parseInt(slideCount);
    
    if (isNaN(count) || count <= 0) {
      setError("Please enter a valid positive number");
      return;
    }
    
    if (count > 1000) {
      setError("For performance reasons, please limit to 1000 slides or fewer");
      return;
    }
    
    setError("");
    onStart(count);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-purple-light/20 border-2">
        <CardHeader className="bg-purple-light/10 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-purple-dark">Slide Review Tracker</CardTitle>
          <CardDescription>Track and review your slides efficiently</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <label htmlFor="slideCount" className="block text-sm font-medium text-slate-700 mb-2">
              How many slides are you going to review?
            </label>
            <Input
              id="slideCount"
              type="number"
              min="1"
              max="1000"
              value={slideCount}
              onChange={(e) => setSlideCount(e.target.value)}
              className="mb-2 border-purple-light/30 focus:border-purple focus-visible:ring-purple"
              placeholder="Enter number of slides"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-purple hover:bg-purple-dark transition-colors"
            >
              Start Review <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
