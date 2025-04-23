
import React from "react";
import { SceneWorkflow } from "@/components/SceneWorkflow";
import { Toolbar } from "@/components/Toolbar";
import { SceneSelector } from "@/components/SceneSelector";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Workflow, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useProject } from "@/contexts/project";

const SceneView = () => {
  const { handleAddScene } = useProject();
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header/Toolbar */}
      <header className="border-b px-4 py-2 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Editor
            </Link>
          </Button>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <h1 className="flex items-center text-lg font-medium">
            <Workflow className="h-5 w-5 mr-2 text-blue-500" />
            Scene Workflow
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddScene}
            className="flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add New Scene
          </Button>
        </div>
      </header>
      
      {/* Scene selector */}
      <SceneSelector />
      
      {/* Scene workflow visualization */}
      <div className="flex-1 overflow-hidden">
        <SceneWorkflow />
      </div>
    </div>
  );
};

export default SceneView;
