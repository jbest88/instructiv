import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Project, SlideElement } from "@/utils/slideTypes";
import { ProjectContextType } from "./projectTypes";
import { createDefaultProject } from "@/utils/defaultSlides";
import { useProjectScenes } from "./useProjectScenes";
import { useProjectSlides } from "./useProjectSlides";
import { useProjectElements } from "./useProjectElements";
import { supabase } from "@/integrations/supabase/client";

// Create a global clipboard for storing copied elements
// This is in memory only and not persisted
let elementClipboard: SlideElement | null = null;

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [project, setProject] = useState<Project>(createDefaultProject());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [openSlides, setOpenSlides] = useState<{ id: string; title: string }[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [userProjects, setUserProjects] = useState<
    { id: string; title: string; updated_at: string }[]
  >([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Load project from localStorage when component mounts
  useEffect(() => {
    const savedProject = localStorage.getItem('project');
    if (savedProject) {
      try {
        const parsedProject = JSON.parse(savedProject);
        setProject(parsedProject);
        console.log("Project loaded from localStorage on mount");
      } catch (error) {
        console.error("Error loading project from localStorage:", error);
      }
    }
  }, []);

  // Auto-save project to localStorage whenever it changes
  useEffect(() => {
    // Don't save if it's just the default project
    if (project && (project.scenes.length > 1 || project.scenes[0]?.slides.length > 1)) {
      localStorage.setItem('project', JSON.stringify(project));
      console.log("Project auto-saved to localStorage");
    }
  }, [project]);

  // Automatically open the first slide when a project is loaded
  useEffect(() => {
    if (project && project.scenes && project.scenes.length > 0) {
      const firstScene = project.scenes[0];
      if (firstScene.slides && firstScene.slides.length > 0) {
        const firstSlide = firstScene.slides[0];
        if (!openSlides.find((slide) => slide.id === firstSlide.id)) {
          setOpenSlides([{ id: firstSlide.id, title: firstSlide.title }]);
        }
      }
    }
  }, [project]);

  // Update openSlides when currentSlideId changes
  useEffect(() => {
    if (project.currentSlideId) {
      const currentSlide = project.scenes
        .find((scene) => scene.id === project.currentSceneId)
        ?.slides.find((slide) => slide.id === project.currentSlideId);

      if (currentSlide && !openSlides.find((slide) => slide.id === currentSlide.id)) {
        setOpenSlides((prevOpenSlides) => [
          ...prevOpenSlides,
          { id: currentSlide.id, title: currentSlide.title },
        ]);
      }
    }
  }, [project.currentSlideId]);

  const currentScene = project.scenes.find(
    (scene) => scene.id === project.currentSceneId
  );
  const currentSlide = currentScene?.slides.find(
    (slide) => slide.id === project.currentSlideId
  );

  const selectedElement = currentSlide?.elements.find(
    (element) => element.id === selectedElementId
  );

  // Project Scenes operations
  const {
    handleSelectScene,
    handleAddScene,
    handleDeleteScene,
    handleUpdateScene,
  } = useProjectScenes(project, setProject, setSelectedElementId);

  // Project Slides operations
  const {
    handleSelectSlide,
    handleCloseSlide,
    handleAddSlide,
    handleDeleteSlideInitiate,
    handleDeleteSlideConfirmed,
    handleCancelDelete,
    handleUpdateSlide,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    slideToDelete,
  } = useProjectSlides(
    project,
    setProject,
    openSlides,
    setOpenSlides,
    setSelectedElementId
  );

  // Project Elements operations
  const { handleAddElement, handleUpdateElement, handleDeleteElement } =
    useProjectElements(project, setProject, setSelectedElementId);

  // Function to save the project to local storage
  const handleSaveProject = () => {
    try {
      localStorage.setItem("project", JSON.stringify(project));
      toast.success("Project saved to local storage");
      console.log("Project saved to local storage", project);
    } catch (error) {
      console.error("Error saving to local storage:", error);
      toast.error("Failed to save to local storage");
    }
  };

  // Function to load the project from local storage
  const handleLoadProject = () => {
    try {
      const storedProject = localStorage.getItem("project");
      if (storedProject) {
        const loadedProject = JSON.parse(storedProject);
        setProject(loadedProject);
        toast.success("Project loaded from local storage");
        console.log("Project loaded from local storage", loadedProject);
      } else {
        toast.error("No project found in local storage");
      }
    } catch (error) {
      console.error("Error loading from local storage:", error);
      toast.error("Failed to load from local storage");
    }
  };

  // Function to export the project to a file
  const handleExportProject = () => {
    try {
      const dataStr = JSON.stringify(project);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileName = `${project.title || 'project'}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.click();
      toast.success("Project exported");
    } catch (error) {
      console.error("Error exporting project:", error);
      toast.error("Failed to export project");
    }
  };

  // Function to import a project from a file
  const handleImportProject = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const contents = e.target?.result;
          if (typeof contents === "string") {
            const importedProject = JSON.parse(contents);
            setProject(importedProject);
            toast.success("Project imported");
            resolve();
          } else {
            toast.error("Failed to read file");
            reject(new Error("Failed to read file"));
          }
        } catch (error) {
          toast.error("Failed to parse JSON");
          reject(error);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  };

  // Load user's projects when authenticated
  useEffect(() => {
    const loadUserProjects = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      setIsLoadingProjects(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, updated_at')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setUserProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadUserProjects();
  }, []);

  // Function to save project to Supabase
  const handleSaveProjectToSupabase = async (title?: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast.error('Please sign in to save projects to cloud');
      return;
    }

    try {
      const projectToSave = {
        title: title || project.title,
        data: project as any, // Type assertion to avoid TypeScript issues with Json type
        user_id: session.session.user.id
      };

      console.log("Saving project to Supabase:", projectToSave);
      
      const { data, error } = await supabase
        .from('projects')
        .insert(projectToSave);

      if (error) throw error;
      
      // Refresh projects list
      const { data: updatedProjects, error: fetchError } = await supabase
        .from('projects')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUserProjects(updatedProjects || []);
      
      toast.success('Project saved to cloud');
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.message || 'Failed to save project');
      throw error;
    }
  };

  // Function to load project from Supabase
  const handleLoadProjectFromSupabase = async (projectId: string): Promise<Project> => {
    try {
      console.log("Loading project from Supabase:", projectId);
      const { data, error } = await supabase
        .from('projects')
        .select('data')
        .eq('id', projectId)
        .single();

      if (error) {
        throw error;
      }
      
      if (!data?.data) {
        throw new Error('No project data found');
      }

      // Cast the data to Project type
      const loadedProject = data.data as unknown as Project;
      console.log("Loaded project:", loadedProject);
      
      // Validate the project has required structure
      if (!loadedProject.id || 
          !loadedProject.title || 
          !Array.isArray(loadedProject.scenes)) {
        throw new Error("Invalid project format");
      }
      
      setProject(loadedProject);
      toast.success('Project loaded from cloud');
      return loadedProject; // Return the loaded project
    } catch (error: any) {
      console.error('Error loading project:', error);
      toast.error(error.message || 'Failed to load project');
      throw error;
    }
  };

  // Function to delete project from Supabase
  const handleDeleteProjectFromSupabase = async (projectId: string) => {
    try {
      console.log("Deleting project from Supabase:", projectId);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Update the projects list after deletion
      setUserProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project deleted');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
      throw error;
    }
  };

  // Function to update project in Supabase
  const handleUpdateProjectInSupabase = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          data: project as any, // Type assertion to avoid TypeScript issues
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;
      toast.success('Project updated');
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error(error.message || 'Failed to update project');
      throw error;
    }
  };

  const handleAddNewElement = (element: SlideElement) => {
    if (!currentScene || !currentSlide) return;

    const updatedSlides = currentScene.slides.map((slide) => {
      if (slide.id === currentSlide.id) {
        return {
          ...slide,
          elements: [...slide.elements, element],
        };
      }
      return slide;
    });

    const updatedScenes = project.scenes.map((scene) => {
      if (scene.id === currentScene.id) {
        return {
          ...scene,
          slides: updatedSlides,
        };
      }
      return scene;
    });

    setProject({
      ...project,
      scenes: updatedScenes,
    });
  };

  // Clipboard Operations
  const copyElementToClipboard = useCallback((element: SlideElement) => {
    if (!element) {
      toast.error("No element selected to copy");
      return;
    }

    try {
      // Store in our in-memory clipboard
      elementClipboard = { ...element };
      console.log("Copy element:", element.id);
      toast.success("Element copied to clipboard");
    } catch (error) {
      console.error("Failed to copy element", error);
      toast.error("Failed to copy element");
    }
  }, []);

  const pasteElementFromClipboard = useCallback(() => {
    if (!elementClipboard || !currentSlide) {
      toast.error("No element in clipboard to paste");
      return;
    }

    try {
      // Create a new element with a new ID and slightly offset position
      const newElement: SlideElement = {
        ...elementClipboard,
        id: uuidv4(),
        x: elementClipboard.x + 20,
        y: elementClipboard.y + 20,
      };

      // Add the new element to the current slide
      handleAddNewElement(newElement);
      toast.success("Element pasted from clipboard");
      
      // Select the newly pasted element
      setSelectedElementId(newElement.id);
    } catch (error) {
      console.error("Failed to paste element", error);
      toast.error("Failed to paste element");
    }
  }, [currentSlide, elementClipboard, handleAddNewElement]);

  const duplicateSelectedElement = useCallback(() => {
    if (!selectedElement) {
      toast.error("No element selected to duplicate");
      return;
    }

    try {
      // Create a new element with a new ID and slightly offset position
      const duplicatedElement: SlideElement = {
        ...selectedElement,
        id: uuidv4(),
        x: selectedElement.x + 20,
        y: selectedElement.y + 20,
      };

      // Add the duplicated element to the current slide
      handleAddNewElement(duplicatedElement);
      toast.success("Element duplicated");
      
      // Select the newly duplicated element
      setSelectedElementId(duplicatedElement.id);
    } catch (error) {
      console.error("Failed to duplicate element", error);
      toast.error("Failed to duplicate element");
    }
  }, [selectedElement, handleAddNewElement]);

  // Placeholder for properties dialog
  const openElementProperties = useCallback((elementId: string) => {
    if (!elementId) {
      toast.error("No element selected");
      return;
    }
    
    toast.info("Properties dialog will be implemented soon");
    // Future implementation will go here
  }, []);

  const value: ProjectContextType = {
    project,
    setProject,  // Add this line to include setProject in the value object
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
    handleDeleteElement,
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
    handleDeleteProjectFromSupabase,
    handleUpdateProjectInSupabase,
    handleAddNewElement,
    copyElementToClipboard,
    pasteElementFromClipboard,
    duplicateSelectedElement,
    openElementProperties,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
