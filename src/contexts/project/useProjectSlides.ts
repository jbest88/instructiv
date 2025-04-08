
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Project, Scene, Slide } from "@/utils/slideTypes";

export function useProjectSlides(
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>,
  openSlides: { id: string; title: string }[],
  setOpenSlides: React.Dispatch<React.SetStateAction<{ id: string; title: string }[]>>,
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);

  // Function to select a slide
  const handleSelectSlide = (slideId: string) => {
    if (!project) return;
    
    setProject(prev => ({
      ...prev,
      currentSlideId: slideId
    }));
    setSelectedElementId(null);
  };
  
  // Function to close a slide tab
  const handleCloseSlide = (slideId: string) => {
    if (!project) return;
    
    setOpenSlides(prev => prev.filter(slide => slide.id !== slideId));
    
    // If closing the current slide, switch to another open slide or clear current slide
    if (project.currentSlideId === slideId) {
      const remainingSlides = openSlides.filter(slide => slide.id !== slideId);
      if (remainingSlides.length > 0) {
        handleSelectSlide(remainingSlides[0].id);
      } else {
        setProject(prev => ({
          ...prev,
          currentSlideId: ""
        }));
      }
    }
  };
  
  // Function to add a new slide
  const handleAddSlide = () => {
    if (!project || !project.scenes) {
      toast.error("Please create a scene first");
      return;
    }

    const currentScene = project.scenes.find(scene => scene.id === project.currentSceneId);
    if (!currentScene) {
      toast.error("Please create a scene first");
      return;
    }
    
    const slidesInCurrentScene = currentScene.slides ? currentScene.slides.length : 0;
    const newSlide: Slide = {
      id: `slide-${uuidv4()}`,
      title: `Slide ${slidesInCurrentScene + 1}`,
      elements: [],
      background: '#ffffff',
      order: slidesInCurrentScene + 1
    };
    
    setProject(prev => {
      if (!prev || !prev.scenes) return prev;
      
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          // Create a new scene with the slide added
          const updatedScene: Scene = {
            ...scene,
            slides: [...(scene.slides || []), newSlide]
          };
          return updatedScene;
        }
        return scene;
      });
      
      return {
        ...prev,
        scenes: updatedScenes,
        currentSlideId: newSlide.id
      };
    });
    
    toast.success("New slide added");
  };
  
  // Function to initiate slide deletion with confirmation
  const handleDeleteSlideInitiate = (slideId: string) => {
    setSlideToDelete(slideId);
    setIsDeleteConfirmOpen(true);
  };
  
  // Function to delete a slide after confirmation
  const handleDeleteSlideConfirmed = () => {
    if (!slideToDelete || !project || !project.scenes) return;
    
    const currentScene = project.scenes.find(scene => scene.id === project.currentSceneId);
    if (!currentScene || !currentScene.slides || currentScene.slides.length <= 1) {
      toast.error("Cannot delete the last slide in a scene");
      setIsDeleteConfirmOpen(false);
      setSlideToDelete(null);
      return;
    }
    
    const slideIndex = currentScene.slides.findIndex(slide => slide.id === slideToDelete);
    
    // Remove from open slides list
    setOpenSlides(prev => prev.filter(slide => slide.id !== slideToDelete));
    
    setProject(prev => {
      if (!prev || !prev.scenes) return prev;
      
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          if (!scene.slides) return scene;
          
          const newSlides = scene.slides.filter(slide => slide.id !== slideToDelete);
          
          // Create a new scene with the slide removed
          const updatedScene: Scene = {
            ...scene,
            slides: newSlides
          };
          return updatedScene;
        }
        return scene;
      });
      
      // If deleting the current slide, select the previous or next slide
      let newCurrentSlideId = prev.currentSlideId;
      if (slideToDelete === prev.currentSlideId) {
        const sceneToUpdate = updatedScenes.find(s => s.id === prev.currentSceneId);
        if (sceneToUpdate && sceneToUpdate.slides) {
          const newIndex = slideIndex > 0 ? slideIndex - 1 : 0;
          newCurrentSlideId = sceneToUpdate.slides[newIndex]?.id || "";
        }
      }
      
      return {
        ...prev,
        scenes: updatedScenes,
        currentSlideId: newCurrentSlideId
      };
    });
    
    toast.success("Slide deleted");
    setIsDeleteConfirmOpen(false);
    setSlideToDelete(null);
  };
  
  // Function to cancel slide deletion
  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setSlideToDelete(null);
  };
  
  // Function to update slide properties
  const handleUpdateSlide = (updates: Partial<Slide>) => {
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
              // Create a new slide with the updates
              const updatedSlide: Slide = {
                ...slide,
                ...updates
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

  return {
    handleSelectSlide,
    handleCloseSlide,
    handleAddSlide,
    handleDeleteSlideInitiate,
    handleDeleteSlideConfirmed,
    handleCancelDelete,
    handleUpdateSlide,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    slideToDelete
  };
}
