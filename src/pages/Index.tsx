
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Presentation, File } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg border-purple-light/20 border-2 mb-8">
        <CardHeader className="bg-purple-light/10 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-purple-dark text-center">
            What are you going to review?
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Choose the type of review you want to perform
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link to="/slide-review" className="h-full">
          <Card className="h-full shadow-lg border-purple-light/20 border-2 hover:border-purple transition-colors cursor-pointer hover:shadow-xl hover:translate-y-[-5px] transition-all">
            <CardHeader className="bg-purple-light/10 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-purple-dark text-center">
                Slide Review Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <Presentation className="w-24 h-24 text-purple mb-4" />
              <p className="text-center text-gray-600">
                Track and review your presentation slides efficiently
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/demo-review" className="h-full">
          <Card className="h-full shadow-lg border-purple-light/20 border-2 hover:border-purple transition-colors cursor-pointer hover:shadow-xl hover:translate-y-[-5px] transition-all">
            <CardHeader className="bg-purple-light/10 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-purple-dark text-center">
                Demo Review Tracker
            </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center justify-center">
            <File className="w-24 h-24 text-purple mb-4" />
              <p className="text-center text-gray-600">
                Review Scribes and manage your feedback
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Index;
