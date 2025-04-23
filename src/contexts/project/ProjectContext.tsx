
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Project } from "@/utils/slideTypes";
import { ProjectContextType } from "./projectTypes";
import { createDefaultProject } from "@/utils/defaultSlides";
import { useProjectScenes } from "./useProjectScenes";
import { useProjectSlides } from "./useProjectSlides";
import { useProjectElements } from "./useProjectElements";

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
    localStorage.setItem("project", JSON.stringify(project));
    toast.success("Project saved to local storage");
  };

  // Function to load the project from local storage
  const handleLoadProject = () => {
    const storedProject = localStorage.getItem("project");
    if (storedProject) {
      const loadedProject = JSON.parse(storedProject);
      setProject(loadedProject);
      toast.success("Project loaded from local storage");
    } else {
      toast.error("No project found in local storage");
    }
  };

  const handleExportProject = () => {
    const dataStr = JSON.stringify(project);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileName = "project.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileName);
    linkElement.click();
    toast.success("Project exported");
  };

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

  // Stubbed Supabase functions since we're not using auth-helpers anymore
  const handleLoadUserProjects = async () => {
    console.log("Load user projects functionality requires Supabase setup");
    return [];
  };

  const handleSaveProjectToSupabase = async (title?: string) => {
    console.log("Save to Supabase functionality requires Supabase setup");
    toast.info("Supabase integration not configured");
  };

  const handleLoadProjectFromSupabase = async (projectId: string) => {
    console.log("Load from Supabase functionality requires Supabase setup");
    toast.info("Supabase integration not configured");
  };

  const handleDeleteProjectFromSupabase = async (projectId: string) => {
    console.log("Delete from Supabase functionality requires Supabase setup");
    toast.info("Supabase integration not configured");
  };

  const handleUpdateProjectInSupabase = async (projectId: string) => {
    console.log("Update in Supabase functionality requires Supabase setup");
    toast.info("Supabase integration not configured");
  };

  const value: ProjectContextType = {
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
