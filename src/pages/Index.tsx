
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createDefaultProject, createDefaultScene, createDefaultSlide } from "@/utils/defaultSlides";
import { Project, Scene, Slide, SlideElement, TextElement, ImageElement, ButtonElement, HotspotElement } from "@/utils/slideTypes";
import { Sidebar } from "@/components/Sidebar";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SlideControls } from "@/components/SlideControls";
import { PreviewModal } from "@/components/PreviewModal";
import { ToolboxPanel } from "@/components/ToolboxPanel";
import { SceneSelector } from "@/components/SceneSelector";
import { Toolbar } from "@/components/Toolbar";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  // Project state
  const [project, setProject] = useState<Project>(createDefaultProject());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toolboxOpen, setToolboxOpen] = useState(true);
  
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
  
  // Function to delete a slide
  const handleDeleteSlide = (slideId: string) => {
    if (currentScene.slides.length <= 1) {
      toast.error("Cannot delete the last slide in a scene");
      return;
    }
    
    const slideIndex = currentScene.slides.findIndex(slide => slide.id === slideId);
    
    setProject(prev => {
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          const newSlides = scene.slides.filter(slide => slide.id !== slideId);
          
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
      if (slideId === prev.currentSlideId) {
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

  // Empty state - no scenes
  if (project.scenes.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md p-8 rounded-lg">
          <h1 className="text-2xl font-bold">Welcome to Narratify</h1>
          <p className="text-muted-foreground">
            No scenes have been created yet. Create your first scene to get started.
          </p>
          <Button 
            size="lg" 
            className="mt-4"
            onClick={handleAddScene}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Scene
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Toolbar at the top */}
      <Toolbar onPreview={() => setIsPreviewOpen(true)} />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with slides for current scene */}
        {currentScene && (
          <Sidebar 
            slides={currentScene.slides}
            currentSlideId={project.currentSlideId}
            onSelectSlide={handleSelectSlide}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
          />
        )}
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f2f1]">
          {/* Scene selector */}
          <SceneSelector
            scenes={project.scenes}
            currentSceneId={project.currentSceneId}
            onSelectScene={handleSelectScene}
            onAddScene={handleAddScene}
            onDeleteScene={handleDeleteScene}
          />
          
          {/* Editor canvas */}
          {currentSlide ? (
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-6 shadow-lg bg-white rounded-md overflow-hidden">
                <SlideCanvas 
                  slide={currentSlide}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  onUpdateElement={handleUpdateElement}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-xl font-medium mb-2">No Slides Available</h2>
                <p className="text-muted-foreground mb-4">
                  This scene doesn't have any slides yet.
                </p>
                <Button onClick={handleAddSlide}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Slide
                </Button>
              </div>
            </div>
          )}
          
          {/* Timeline at the bottom */}
          {currentSlide && <Timeline currentSlide={currentSlide} />}
        </div>
        
        {/* Right toolbox panel */}
        <ToolboxPanel 
          onAddElement={handleAddElement}
          currentSlide={currentSlide}
          currentScene={currentScene}
          onUpdateSlide={handleUpdateSlide}
          onUpdateScene={handleUpdateScene}
          isOpen={toolboxOpen}
          onToggle={() => setToolboxOpen(!toolboxOpen)}
        />
      </div>
      
      {/* Preview modal */}
      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        scenes={project.scenes}
        initialSceneId={project.currentSceneId}
        initialSlideId={project.currentSlideId}
      />
    </div>
  );
};

export default Index;
