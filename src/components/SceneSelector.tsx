
import React from 'react';
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/project";
import { PlusCircle } from "lucide-react";

export const SceneSelector = () => {
  const { project, currentScene, handleSelectScene, handleAddScene } = useProject();

  return (
    <div className="border-b bg-muted/40 p-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium">Scenes</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddScene}
          className="h-8 px-2 text-xs"
        >
          <PlusCircle className="h-3.5 w-3.5 mr-1" />
          Add Scene
        </Button>
      </div>
      
      <div className="flex gap-1 overflow-x-auto pb-1">
        {project.scenes.map((scene) => (
          <Button
            key={scene.id}
            variant={scene.id === currentScene?.id ? "default" : "outline"}
            size="sm"
            className="h-8 whitespace-nowrap"
            onClick={() => handleSelectScene(scene.id)}
          >
            {scene.title}
          </Button>
        ))}
      </div>
    </div>
  );
};
