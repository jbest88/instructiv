
import { useState } from "react";
import { toast } from "sonner";
import { Project, SlideElement } from "@/utils/slideTypes";
import { createElement } from "@/utils/elementCreators";
import { useElementOperations } from "@/hooks/useElementOperations";

export function useProjectElements(
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>,
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>
) {
  // Get element operations from our custom hook
  const { updateElement, deleteElement } = useElementOperations(project, setProject);
  
  // Function to add an element to the current slide
  const handleAddElement = (type: SlideElement['type']) => {
    if (!project || !project.scenes) return;
    
    const currentScene = project.scenes.find(scene => scene.id === project.currentSceneId);
    if (!currentScene) return;
    
    const currentSlide = currentScene.slides.find(slide => slide.id === project.currentSlideId);
    if (!currentSlide) return;
    
    // Create a new element using our factory function
    const newElement = createElement(type);
    
    setProject(prev => {
      if (!prev || !prev.scenes) return prev;
      
      const updatedScenes = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          const updatedSlides = scene.slides.map(slide => {
            if (slide.id === prev.currentSlideId) {
              return {
                ...slide,
                elements: [...(slide.elements || []), newElement]
              };
            }
            return slide;
          });
          
          return {
            ...scene,
            slides: updatedSlides
          };
        }
        return scene;
      });
      
      return {
        ...prev,
        scenes: updatedScenes
      };
    });
    
    setSelectedElementId(newElement.id);
    toast.success(`${type} element added`);
  };

  // Use the update and delete functions from the hook
  const handleUpdateElement = updateElement;
  const handleDeleteElement = (elementId: string) => {
    deleteElement(elementId);
    setSelectedElementId(null);
  };

  return { handleAddElement, handleUpdateElement, handleDeleteElement };
}
