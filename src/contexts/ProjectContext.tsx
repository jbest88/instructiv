import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createDefaultProject, createDefaultScene } from "@/utils/defaultSlides";
import { Project, Scene, Slide, SlideElement, TextElement, ImageElement, ButtonElement, HotspotElement } from "@/utils/slideTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type ProjectContextType = {
  project: Project;
  currentScene: Scene | null;
  currentSlide: Slide | null;
  selectedElementId: string | null;
  selectedElement: SlideElement | null;
  openSlides: { id: string; title: string }[];
  isDeleteConfirmOpen: boolean;
  slideToDelete: string | null;
  isPreviewOpen: boolean;
  canvasSize: { width: number; height: number };
  canvasZoom: number;
  setIsPreviewOpen: (isOpen: boolean) => void;
  setSelectedElementId: (id: string | null) => void;
  setCanvasZoom: (zoom: number) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
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
  handleDeleteElement: (elementId: string) => void; // Add this line
  handleUpdateSlide: (updates: Partial<Slide>) => void;
  handleUpdateScene: (updates: Partial<Scene>) => void;
  handleSaveProject: () => void;
  handleLoadProject: () => void;
  handleExportProject: () => void;
  handleImportProject: (file: File) => Promise<void>;
  setIsDeleteConfirmOpen: (isOpen: boolean) => void;
  userProjects: { id: string; title: string; updated_at: string }[];
  isLoadingProjects: boolean;
  handleSaveProjectToSupabase: (title?: string) => Promise<void>;
  handleLoadProjectFromSupabase: (projectId: string) => Promise<void>;
  handleDeleteProjectFromSupabase: (projectId: string) => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  // Project state - Initialize with a default project to avoid undefined errors
  const [project, setProject] = useState<Project>(createDefaultProject());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [openSlides, setOpenSlides] = useState<{ id: string; title: string }[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1200 });
  const [canvasZoom, setCanvasZoom] = useState(1);
  
  // Confirmation dialog state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);
  
  // User projects from Supabase
  const [userProjects, setUserProjects] = useState<{ id: string; title: string; updated_at: string }[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  
  const { user } = useAuth();
  
  // Get current scene, slide and element
  // Fix the potential undefined access by ensuring project exists and has scenes
  const currentScene = project && project.scenes && project.currentSceneId 
    ? project.scenes.find(scene => scene.id === project.currentSceneId) || null
    : project.scenes && project.scenes.length > 0 
      ? project.scenes[0] 
      : null;
    
  const currentSlide = currentScene && currentScene.slides && project.currentSlideId
    ? currentScene.slides.find(slide => slide.id === project.currentSlideId) || null
    : currentScene && currentScene.slides && currentScene.slides.length > 0 
      ? currentScene.slides[0] 
      : null;
    
  const selectedElement = selectedElementId && currentSlide && currentSlide.elements
    ? currentSlide.elements.find(element => element.id === selectedElementId) || null
    : null;
  
  // Fetch user's projects when authenticated
  useEffect(() => {
    if (user) {
      fetchUserProjects();
    } else {
      setUserProjects([]);
    }
  }, [user]);
  
  // When a slide is selected, add it to the open slides if not already there
  useEffect(() => {
    if (currentSlide && !openSlides.some(slide => slide.id === currentSlide.id)) {
      setOpenSlides(prev => [...prev, { id: currentSlide.id, title: currentSlide.title }]);
    }
  }, [currentSlide, openSlides]);
  
  const fetchUserProjects = async () => {
    if (!user) return;
    
    setIsLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      setUserProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast.error(`Failed to load projects: ${error.message}`);
    } finally {
      setIsLoadingProjects(false);
    }
  };
  
  // Function to save project to Supabase
  const handleSaveProjectToSupabase = async (title?: string) => {
    if (!user) {
      toast.error("Please sign in to save your project");
      return;
    }
    
    try {
      const projectToSave = {
        ...project,
        title: title || project.title
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: projectToSave.title,
          data: projectToSave as any
        })
        .select();
        
      if (error) throw error;
      
      toast.success(`Project "${projectToSave.title}" saved successfully!`);
      await fetchUserProjects();
      return;
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error(`Failed to save project: ${error.message}`);
    }
  };
  
  // Function to load project from Supabase
  const handleLoadProjectFromSupabase = async (projectId: string) => {
    if (!user) {
      toast.error("Please sign in to load projects");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('data')
        .eq('id', projectId)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error("Project not found");
      
      // Properly cast the data to Project type
      const projectData = data.data as unknown as Project;
      
      // Validate that the data has the required Project properties
      if (!projectData || 
          !projectData.id || 
          !projectData.title || 
          !Array.isArray(projectData.scenes) || 
          !projectData.currentSceneId || 
          !projectData.currentSlideId) {
        throw new Error("Invalid project data format");
      }
      
      setProject(projectData);
      setSelectedElementId(null);
      setOpenSlides([]);
      toast.success("Project loaded successfully!");
    } catch (error: any) {
      console.error("Error loading project:", error);
      toast.error(`Failed to load project: ${error.message}`);
    }
  };
  
  // Function to delete project from Supabase
  const handleDeleteProjectFromSupabase = async (projectId: string) => {
    if (!user) {
      toast.error("Please sign in to delete projects");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) throw error;
      
      await fetchUserProjects();
      toast.success("Project deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };
  
  // Function to select a scene
  const handleSelectScene = (sceneId: string) => {
    if (!project || !project.scenes) return;
    
    const scene = project.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    setProject(prev => ({
      ...prev,
      currentSceneId: sceneId,
      currentSlideId: scene.slides && scene.slides[0] ? scene.slides[0].id : prev.currentSlideId
    }));
    setSelectedElementId(null);
  };
  
  // Function to add a new scene
  const handleAddScene = () => {
    if (!project || !project.scenes) return;
    
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
    if (!project || !project.scenes) return;
    
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
    if (!slideToDelete || !currentScene || !project || !project.scenes) return;
    
    if (!currentScene.slides || currentScene.slides.length <= 1) {
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

  // Function to add an element to the current slide
  const handleAddElement = (type: SlideElement['type']) => {
    if (!currentSlide || !project || !project.scenes) return;
    
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
  
  // Function to delete an element - fixed implementation
  const handleDeleteElement = (elementId: string) => {
    if (!project || !project.scenes || !currentScene || !currentSlide) {
      toast.error("Cannot delete element: No active slide");
      return;
    }
    
    // Find the element to ensure it exists
    const elementToDelete = currentSlide.elements.find(el => el.id === elementId);
    if (!elementToDelete) {
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
  
  // Function to update scene properties
  const handleUpdateScene = (updates: Partial<Scene>) => {
    if (!project || !project.scenes) return;
    
    setProject(prev => {
      if (!prev || !prev.scenes) return prev;
      
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
      const projectData = JSON.stringify({
        project,
        canvasSize
      });
      localStorage.setItem('narratifyProject', projectData);
      toast.success("Project saved to browser storage");
    } catch (error) {
      toast.error("Failed to save project");
      console.error("Save error:", error);
    }
  };
  
  // Load project from localStorage
  const handleLoadProject = () => {
    try {
      const savedData = localStorage.getItem('narratifyProject');
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setProject(parsed.project);
        if (parsed.canvasSize) {
          setCanvasSize(parsed.canvasSize);
        }
        setOpenSlides([]);
        toast.success("Project loaded from browser storage");
      } else {
        toast.info("No saved project found in browser storage");
      }
    } catch (error) {
      toast.error("Failed to load project");
      console.error("Load error:", error);
    }
  };
  
  // Export project to a file
  const handleExportProject = () => {
    try {
      const projectData = JSON.stringify({
        project,
        canvasSize,
        version: '1.0'
      }, null, 2);
      
      const blob = new Blob([projectData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title || 'narratify-project'}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Project exported successfully");
    } catch (error) {
      toast.error("Failed to export project");
      console.error("Export error:", error);
    }
  };
  
  // Import project from a file
  const handleImportProject = async (file: File): Promise<void> => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            if (!e.target?.result) {
              toast.error("Failed to read file");
              reject(new Error("Failed to read file"));
              return;
            }
            
            const content = e.target.result as string;
            const parsed = JSON.parse(content);
            
            // Basic validation
            if (!parsed.project || !parsed.project.id || !parsed.project.scenes) {
              toast.error("Invalid project file format");
              reject(new Error("Invalid project file format"));
              return;
            }
            
            setProject(parsed.project);
            
            if (parsed.canvasSize) {
              setCanvasSize(parsed.canvasSize);
            }
            
            setOpenSlides([]);
            toast.success("Project imported successfully");
            resolve();
          } catch (parseError) {
            toast.error("Failed to parse project file");
            console.error("Import parse error:", parseError);
            reject(parseError);
          }
        };
        
        reader.onerror = (error) => {
          toast.error("Error reading file");
          console.error("Import read error:", error);
          reject(error);
        };
        
        reader.readAsText(file);
      });
    } catch (error) {
      toast.error("Failed to import project");
      console.error("Import error:", error);
      throw error;
    }
  };
  
  // Load saved project on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('narratifyProject');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.project) {
          setProject(parsed.project);
          if (parsed.canvasSize) {
            setCanvasSize(parsed.canvasSize);
          }
        } else {
          console.warn("Invalid project data in localStorage, using default project instead");
          setProject(createDefaultProject());
        }
      } catch (error) {
        console.error("Error loading saved project:", error);
        setProject(createDefaultProject());
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
    isPreviewOpen,
    canvasSize,
    canvasZoom,
    setIsPreviewOpen,
    setSelectedElementId,
    setCanvasZoom,
    setCanvasSize,
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
    handleDeleteElement, // Add this line
    handleUpdateSlide,
    handleUpdateScene,
    handleSaveProject,
    handleLoadProject,
    handleExportProject,
    handleImportProject,
    setIsDeleteConfirmOpen,
    userProjects,
    isLoadingProjects,
    handleSaveProjectToSupabase,
    handleLoadProjectFromSupabase,
    handleDeleteProjectFromSupabase
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
