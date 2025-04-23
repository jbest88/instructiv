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
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSessionContext } from "@supabase/auth-helpers-react";

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
  const supabase = useSupabaseClient();
  const { session, isLoading: isLoadingSession } = useSessionContext();
  const [userProjects, setUserProjects] = useState<
    { id: string; title: string; updated_at: string }[]
  >([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Load projects from Supabase on component mount
  useEffect(() => {
    if (session?.user?.id) {
      handleLoadUserProjects();
    }
  }, [session?.user?.id]);

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

  const handleSaveProjectToSupabase = async (title?: string) => {
    if (!session?.user) {
      toast.error("Please sign in to save projects.");
      return;
    }

    try {
      // If it's a new project, create a new record
      if (project.isNewProject) {
        const { data, error } = await supabase
          .from("projects")
          .insert([
            {
              title: title || project.title,
              user_id: session.user.id,
              project_data: project,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error("Error saving project:", error);
          toast.error("Failed to save project to Supabase");
          return;
        }

        // Update the local project state with the new project ID
        setProject((prev) => ({ ...prev, id: data.id, isNewProject: false }));

        // Update the user projects list
        handleLoadUserProjects();

        toast.success("Project saved to Supabase");
      } else {
        // If it's an existing project, update the existing record
        await handleUpdateProjectInSupabase(project.id);
        toast.success("Project saved to Supabase");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project to Supabase");
    }
  };

  const handleLoadUserProjects = async () => {
    if (!session?.user?.id) {
      console.log("No user ID found, cannot load projects");
      return;
    }

    setIsLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, updated_at")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error loading projects:", error);
        toast.error("Failed to load projects");
        return;
      }

      setUserProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleLoadProjectFromSupabase = async (
    projectId: string
  ): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("project_data")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error loading project:", error);
        toast.error("Failed to load project");
        return;
      }

      const loadedProject = data.project_data as Project;
      setProject(loadedProject);
    } catch (error) {
      console.error("Error loading project:", error);
      toast.error("Failed to load project");
    }
  };

  const handleDeleteProjectFromSupabase = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
        return;
      }

      // Refresh the list of user projects
      handleLoadUserProjects();
      toast.success("Project deleted");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleUpdateProjectInSupabase = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ project_data: project })
        .eq("id", projectId);

      if (error) {
        console.error("Error updating project:", error);
        toast.error("Failed to update project in Supabase");
      } else {
        // Refresh the list of user projects
        handleLoadUserProjects();
        toast.success("Project updated in Supabase");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project in Supabase");
    }
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
