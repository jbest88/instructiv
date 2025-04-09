
import { useState } from "react";
import { toast } from "sonner";
import { Project, Scene, Slide, SlideElement } from "@/utils/slideTypes";

export function useElementOperations(
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>
) {
  // Update an element in the current slide
  const updateElement = (elementId: string, updates: Partial<SlideElement>) => {
    if (!project || !project.scenes) return;
    
    setProject(prev => {
      if (!prev || !prev.scenes) return prev;
      
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          if (!scene.slides) return scene;
          
          // Create a properly typed array of updated slides
          const updatedSlides: Slide[] = scene.slides.map(slide => {
            if (slide.id === prev.currentSlideId) {
              if (!slide.elements) return slide;
              
              // First, find the element we need to update
              const elementToUpdate = slide.elements.find(el => el.id === elementId);
              
              if (!elementToUpdate) return slide;
              
              // Create a new properly typed array of elements
              const updatedElements: SlideElement[] = slide.elements.map(element => {
                if (element.id === elementId) {
                  // Merge the existing element with updates, maintaining its specific type
                  const updated = {
                    ...element,
                    ...updates
                  };
                  return updated as SlideElement; // Cast back to SlideElement
                }
                return element;
              });
              
              // Create a new slide with the updated elements
              const updatedSlide: Slide = {
                ...slide,
                elements: updatedElements
              };
              return updatedSlide;
            }
            return slide;
          });
          
          // Create a new scene with the updated slides
          const updatedScene: Scene = {
            ...scene,
            slides: updatedSlides
          };
          return updatedScene;
        }
        return scene;
      });
      
      // Return a properly typed Project object
      return {
        ...prev,
        scenes: updatedScenes
      };
    });
  };
  
  // Delete an element from the current slide
  const deleteElement = (elementId: string) => {
    if (!project || !project.scenes) {
      toast.error("Cannot delete element: No active slide");
      return;
    }
    
    const currentScene = project.scenes.find(scene => scene.id === project.currentSceneId);
    if (!currentScene) {
      toast.error("Cannot delete element: No active scene");
      return;
    }
    
    const currentSlide = currentScene.slides.find(slide => slide.id === project.currentSlideId);
    if (!currentSlide) {
      toast.error("Cannot delete element: No active slide");
      return;
    }
    
    // Find the element to ensure it exists
    const elementExists = currentSlide.elements && currentSlide.elements.find(el => el.id === elementId);
    if (!elementExists) {
      toast.error("Element not found");
      return;
    }
    
    setProject(prev => {
      if (!prev || !prev.scenes) return prev;
      
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          if (!scene.slides) return scene;
          
          const updatedSlides: Slide[] = scene.slides.map(slide => {
            if (slide.id === prev.currentSlideId) {
              if (!slide.elements) return slide;
              
              // Filter out the element to delete
              const updatedElements = slide.elements.filter(el => el.id !== elementId);
              
              return {
                ...slide,
                elements: updatedElements
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
    
    toast.success(`Element deleted`);
  };

  return {
    updateElement,
    deleteElement
  };
}
