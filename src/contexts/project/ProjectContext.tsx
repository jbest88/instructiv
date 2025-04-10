
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createDefaultProject } from "@/utils/defaultSlides";
import { Project, Scene, Slide, SlideElement } from "@/utils/slideTypes";
import { ProjectContextType } from "./projectTypes";
import { useProjectElements } from "./useProjectElements";
import { useProjectScenes } from "./useProjectScenes";
import { useProjectSlides } from "./useProjectSlides";
import { useProjectExport } from "./useProjectExport";
import { useSupabaseProjects } from "./useSupabaseProjects";

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
  
  // Use our custom hooks
  const elements = useProjectElements(project, setProject, setSelectedElementId);
  const scenes = useProjectScenes(project, setProject, setSelectedElementId);
  const slides = useProjectSlides(project, setProject, openSlides, setOpenSlides, setSelectedElementId);
  const exportImport = useProjectExport(project, setProject, canvasSize, setCanvasSize, setOpenSlides);
  const supabase = useSupabaseProjects(project, setProject, setOpenSlides);
  
  // Get current scene, slide and element
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
  
  // When a slide is selected, add it to the open slides if not already there
  useEffect(() => {
    if (currentSlide && !openSlides.some(slide => slide.id === currentSlide.id)) {
      setOpenSlides(prev => [...prev, { id: currentSlide.id, title: currentSlide.title }]);
    }
  }, [currentSlide, openSlides]);
  
  // Load saved project on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('narratifyProject');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed && parsed.project && parsed.project.id) {
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
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      setProject(createDefaultProject());
    }
  }, []);

  const value: ProjectContextType = {
    project,
    currentScene,
    currentSlide,
    selectedElementId,
    selectedElement,
    openSlides,
    isDeleteConfirmOpen: slides.isDeleteConfirmOpen,
    slideToDelete: slides.slideToDelete,
    isPreviewOpen,
    canvasSize,
    canvasZoom,
    setIsPreviewOpen,
    setSelectedElementId,
    setCanvasZoom,
    setCanvasSize,
    handleSelectScene: scenes.handleSelectScene,
    handleAddScene: scenes.handleAddScene,
    handleDeleteScene: scenes.handleDeleteScene,
    handleSelectSlide: slides.handleSelectSlide,
    handleCloseSlide: slides.handleCloseSlide,
    handleAddSlide: slides.handleAddSlide,
    handleDeleteSlideInitiate: slides.handleDeleteSlideInitiate,
    handleDeleteSlideConfirmed: slides.handleDeleteSlideConfirmed,
    handleCancelDelete: slides.handleCancelDelete,
    handleAddElement: elements.handleAddElement,
    handleUpdateElement: elements.handleUpdateElement,
    handleDeleteElement: elements.handleDeleteElement,
    handleUpdateSlide: slides.handleUpdateSlide,
    handleUpdateScene: scenes.handleUpdateScene,
    handleSaveProject: exportImport.handleSaveProject,
    handleLoadProject: exportImport.handleLoadProject,
    handleExportProject: exportImport.handleExportProject,
    handleImportProject: exportImport.handleImportProject,
    setIsDeleteConfirmOpen: slides.setIsDeleteConfirmOpen,
    userProjects: supabase.userProjects,
    isLoadingProjects: supabase.isLoadingProjects,
    handleSaveProjectToSupabase: supabase.handleSaveProjectToSupabase,
    handleLoadProjectFromSupabase: supabase.handleLoadProjectFromSupabase,
    handleDeleteProjectFromSupabase: supabase.handleDeleteProjectFromSupabase,
    handleUpdateProjectInSupabase: supabase.handleUpdateProjectInSupabase
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
