
import React from "react";
import { ProjectProvider } from "@/contexts/project";
import { PanelProvider } from "@/contexts/PanelContext";
import { SceneWorkflow } from "@/components/SceneWorkflow";
import { Toolbar } from "@/components/Toolbar";
import { SceneSelector } from "@/components/SceneSelector";

const SceneView = () => {
  const handlePreview = () => {
    console.log("Preview mode activated");
    // Preview functionality would be implemented here
  };

  return (
    <PanelProvider>
      <ProjectProvider>
        <div className="flex flex-col h-screen overflow-hidden bg-background">
          {/* Toolbar at the top */}
          <Toolbar onPreview={handlePreview} />
          
          {/* Scene selector */}
          <SceneSelector />
          
          {/* Scene workflow visualization */}
          <div className="flex-1 overflow-hidden">
            <SceneWorkflow />
          </div>
        </div>
      </ProjectProvider>
    </PanelProvider>
  );
};

export default SceneView;
