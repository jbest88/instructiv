
import { Project, Scene, Slide, SlideElement } from "@/utils/slideTypes";

export interface ProjectContextType {
  project: Project;
  setProject: (project: Project) => void; // Adding this missing property
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
  handleDeleteElement: (elementId: string) => void;
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
  handleLoadProjectFromSupabase: (projectId: string) => Promise<Project>;
  handleDeleteProjectFromSupabase: (projectId: string) => Promise<void>;
  handleUpdateProjectInSupabase: (projectId: string) => Promise<void>;
  handleAddNewElement: (element: SlideElement) => void;
  copyElementToClipboard: (element: SlideElement) => void;
  pasteElementFromClipboard: () => void;
  duplicateSelectedElement: () => void;
  openElementProperties: (elementId: string) => void;
}
