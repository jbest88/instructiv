
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createDefaultProject, createDefaultScene } from "@/utils/defaultSlides";
import { Project, Scene, Slide, SlideElement, TextElement, ImageElement, ButtonElement, HotspotElement } from "@/utils/slideTypes";

type ProjectContextType = {
  project: Project;
  currentScene: Scene | null;
  currentSlide: Slide | null;
  selectedElementId: string | null;
  selectedElement: SlideElement | null;
  openSlides: { id: string; title: string }[];
  isDeleteConfirmOpen: boolean;
  slideToDelete: string | null;
  isPreviewOpen: boolean; // Added missing property
  setIsPreviewOpen: (isOpen: boolean) => void; // Added missing property
  setSelectedElementId: (id: string | null) => void;
  handleSelectScene: (sceneId: string) => void;
  handleAddScene: () => void;
  handleDeleteScene: (sceneId: string) => void;
  handleSelectSlide: (slideId: string) => void;
  handleCloseSlide: (slideId: string) => void;
  handleAddSlide: () => void;
  handleDeleteSlideInitiate: (slideId: string) => void;
  handleDeleteSlideConfirmed: () => void;
  handleCancelDelete: () => void;
  handleAddElement: (type: SlideElement['type']) => void;
  handleUpdateElement: (elementId: string, updates: Partial<SlideElement>) => void;
  handleUpdateSlide: (updates: Partial<Slide>) => void;
  handleUpdateScene: (updates: Partial<Scene>) => void;
  handleSaveProject: () => void;
  handleLoadProject: () => void;
  setIsDeleteConfirmOpen: (isOpen: boolean) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  // Project state
  const [project, setProject] = useState<Project>(createDefaultProject());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [openSlides, setOpenSlides] = useState<{ id: string; title: string }[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Added state for preview modal
  
  // Confirmation dialog state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);
  
  // Get current scene, slide and element
  const currentScene = project.currentSceneId 
    ? project.scenes.find(scene => scene.id === project.currentSceneId) 
    : project.scenes[0] || null;
    
  const currentSlide = currentScene && project.currentSlideId
    ? currentScene.slides.find(slide => slide.id === project.currentSlideId)
    : currentScene?.slides[0] || null;
    
  const selectedElement = selectedElementId && currentSlide
    ? currentSlide.elements.find(element => element.id === selectedElementId) || null
    : null;
  
  // When a slide is selected, add it to the open slides if not already there
  useEffect(() => {
    if (currentSlide && !openSlides.some(slide => slide.id === currentSlide.id)) {
      setOpenSlides(prev => [...prev, { id: currentSlide.id, title: currentSlide.title }]);
    }
  }, [currentSlide, openSlides]);
  
  // Function to select a scene
  const handleSelectScene = (sceneId: string) => {
    const scene = project.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    setProject(prev => ({
      ...prev,
      currentSceneId: sceneId,
      currentSlideId: scene.slides[0]?.id || prev.currentSlideId
    }));
    setSelectedElementId(null);
  };
  
  // Function to add a new scene
  const handleAddScene = () => {
    const newSceneOrder = project.scenes.length + 1;
    const newScene = createDefaultScene(`Scene ${newSceneOrder}`, newSceneOrder);
    
    setProject(prev => {
      const newProject = {
        ...prev,
        scenes: [...prev.scenes, newScene],
        currentSceneId: newScene.id,
        currentSlideId: newScene.slides[0].id
      };
      return newProject;
    });
    
    toast.success("New scene added");
  };
  
  // Function to delete a scene
  const handleDeleteScene = (sceneId: string) => {
    if (project.scenes.length <= 1) {
      toast.error("Cannot delete the last scene");
      return;
    }
    
    const sceneIndex = project.scenes.findIndex(scene => scene.id === sceneId);
    const newScenes = project.scenes.filter(scene => scene.id !== sceneId);
    
    // If deleting the current scene, select the previous or next scene
    let newCurrentSceneId = project.currentSceneId;
    let newCurrentSlideId = project.currentSlideId;
    
    if (sceneId === project.currentSceneId) {
      const newIndex = sceneIndex > 0 ? sceneIndex - 1 : 0;
      newCurrentSceneId = newScenes[newIndex].id;
      newCurrentSlideId = newScenes[newIndex].slides[0]?.id || "";
    }
    
    setProject(prev => ({
      ...prev,
      scenes: newScenes,
      currentSceneId: newCurrentSceneId,
      currentSlideId: newCurrentSlideId
    }));
    
    toast.success("Scene deleted");
  };
  
  // Function to select a slide
  const handleSelectSlide = (slideId: string) => {
    setProject(prev => ({
      ...prev,
      currentSlideId: slideId
    }));
    setSelectedElementId(null);
  };
  
  // Function to close a slide tab
  const handleCloseSlide = (slideId: string) => {
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
    if (!currentScene) {
      toast.error("Please create a scene first");
      return;
    }
    
    const slidesInCurrentScene = currentScene.slides.length;
    const newSlide: Slide = {
      id: `slide-${uuidv4()}`,
      title: `Slide ${slidesInCurrentScene + 1}`,
      elements: [],
      background: '#ffffff',
      order: slidesInCurrentScene + 1
    };
    
    setProject(prev => {
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          // Create a new scene with the slide added
          const updatedScene: Scene = {
            ...scene,
            slides: [...scene.slides, newSlide]
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
    if (!slideToDelete || !currentScene) return;
    
    if (currentScene.slides.length <= 1) {
      toast.error("Cannot delete the last slide in a scene");
      setIsDeleteConfirmOpen(false);
      setSlideToDelete(null);
      return;
    }
    
    const slideIndex = currentScene.slides.findIndex(slide => slide.id === slideToDelete);
    
    // Remove from open slides list
    setOpenSlides(prev => prev.filter(slide => slide.id !== slideToDelete));
    
    setProject(prev => {
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
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
        if (sceneToUpdate) {
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

  // Function to add an element to the current slide
  const handleAddElement = (type: SlideElement['type']) => {
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
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          // Create a properly typed array of updated slides
          const updatedSlides: Slide[] = scene.slides.map(slide => {
            if (slide.id === prev.currentSlideId) {
              // Create a new slide with the element added
              const updatedSlide: Slide = {
                ...slide,
                elements: [...slide.elements, newElement]
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
    setProject(prev => {
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          // Create a properly typed array of updated slides
          const updatedSlides: Slide[] = scene.slides.map(slide => {
            if (slide.id === prev.currentSlideId) {
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
  
  // Function to update slide properties
  const handleUpdateSlide = (updates: Partial<Slide>) => {
    setProject(prev => {
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
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
  
  // Function to update scene properties
  const handleUpdateScene = (updates: Partial<Scene>) => {
    setProject(prev => {
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          // Create a new scene with the updates
          const updatedScene: Scene = {
            ...scene,
            ...updates
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
  
  // Save project to localStorage
  const handleSaveProject = () => {
    try {
      localStorage.setItem('narratifyProject', JSON.stringify(project));
      toast.success("Project saved successfully");
    } catch (error) {
      toast.error("Failed to save project");
      console.error("Save error:", error);
    }
  };
  
  // Load project from localStorage
  const handleLoadProject = () => {
    try {
      const savedProject = localStorage.getItem('narratifyProject');
      
      if (savedProject) {
        setProject(JSON.parse(savedProject));
        toast.success("Project loaded successfully");
      } else {
        toast.info("No saved project found");
      }
    } catch (error) {
      toast.error("Failed to load project");
      console.error("Load error:", error);
    }
  };
  
  // Load saved project on initial render
  useEffect(() => {
    const savedProject = localStorage.getItem('narratifyProject');
    if (savedProject) {
      try {
        setProject(JSON.parse(savedProject));
      } catch (error) {
        console.error("Error loading saved project:", error);
      }
    }
  }, []);

  const value = {
    project,
    currentScene,
    currentSlide,
    selectedElementId,
    selectedElement,
    openSlides,
    isDeleteConfirmOpen,
    slideToDelete,
    isPreviewOpen, // Added to the context value
    setIsPreviewOpen, // Added to the context value
    setSelectedElementId,
    handleSelectScene,
    handleAddScene,
    handleDeleteScene,
    handleSelectSlide,
    handleCloseSlide,
    handleAddSlide,
    handleDeleteSlideInitiate,
    handleDeleteSlideConfirmed,
    handleCancelDelete,
    handleAddElement,
    handleUpdateElement,
    handleUpdateSlide,
    handleUpdateScene,
    handleSaveProject,
    handleLoadProject,
    setIsDeleteConfirmOpen
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
