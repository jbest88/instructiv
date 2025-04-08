
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Project, Scene, Slide, SlideElement, TextElement, ImageElement, ButtonElement, HotspotElement } from "@/utils/slideTypes";

export function useProjectElements(
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>,
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>
) {
  // Function to add an element to the current slide
  const handleAddElement = (type: SlideElement['type']) => {
    if (!project || !project.scenes) return;
    
    const currentScene = project.scenes.find(scene => scene.id === project.currentSceneId);
    if (!currentScene) return;
    
    const currentSlide = currentScene.slides.find(slide => slide.id === project.currentSlideId);
    if (!currentSlide) return;
    
    let newElement: SlideElement;
    
    // Create the appropriate element type based on the 'type' parameter
    if (type === "text") {
      const textElement: TextElement = {
        id: `text-${uuidv4()}`,
        type: "text",
        content: "New Text",
        x: 200,
        y: 200,
        width: 300,
        height: 50,
        fontSize: 16,
        fontColor: "#333333"
      };
      newElement = textElement;
    } else if (type === "image") {
      const imageElement: ImageElement = {
        id: `image-${uuidv4()}`,
        type: "image",
        src: "/placeholder.svg",
        alt: "Placeholder image",
        x: 200,
        y: 200,
        width: 200,
        height: 150
      };
      newElement = imageElement;
    } else if (type === "button") {
      const buttonElement: ButtonElement = {
        id: `button-${uuidv4()}`,
        type: "button",
        label: "Button",
        action: "nextSlide",
        style: "primary",
        x: 200,
        y: 200,
        width: 150,
        height: 50
      };
      newElement = buttonElement;
    } else if (type === "hotspot") {
      const hotspotElement: HotspotElement = {
        id: `hotspot-${uuidv4()}`,
        type: "hotspot",
        tooltip: "Hotspot information",
        shape: "circle",
        x: 200,
        y: 200,
        width: 60,
        height: 60
      };
      newElement = hotspotElement;
    } else {
      // This should never happen, but TypeScript needs this
      throw new Error(`Unsupported element type: ${type}`);
    }
    
    setProject(prev => {
      if (!prev || !prev.scenes) return prev;
      
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          if (!scene.slides) return scene;
          
          // Create a properly typed array of updated slides
          const updatedSlides: Slide[] = scene.slides.map(slide => {
            if (slide.id === prev.currentSlideId) {
              // Create a new slide with the element added
              const updatedSlide: Slide = {
                ...slide,
                elements: [...(slide.elements || []), newElement]
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
    
    setSelectedElementId(newElement.id);
    toast.success(`${type} element added`);
  };

  // Function to update an element
  const handleUpdateElement = (elementId: string, updates: Partial<SlideElement>) => {
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
  
  // Function to delete an element
  const handleDeleteElement = (elementId: string) => {
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
    
    setSelectedElementId(null);
    toast.success(`Element deleted`);
  };

  return { handleAddElement, handleUpdateElement, handleDeleteElement };
}
