
import { ProjectProvider } from "@/contexts/project";
import { PanelProvider } from "@/contexts/PanelContext";
import { useProject } from "@/contexts/project";
import { usePanels } from "@/contexts/PanelContext";
import { useAuth } from "@/contexts/AuthContext";

import { Sidebar } from "@/components/Sidebar";
import { PreviewModal } from "@/components/PreviewModal";
import { ToolboxPanel } from "@/components/ToolboxPanel";
import { Toolbar } from "@/components/Toolbar";
import { MainContent } from "@/components/MainContent";
import { EmptyState } from "@/components/EmptyState";
import { DeleteSlideDialog } from "@/components/DeleteSlideDialog";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { SlideControls } from "@/components/SlideControls";

function ProjectContent() {
  const { project, currentScene, currentSlide, isPreviewOpen, setIsPreviewOpen, userProjects, handleAddElement, handleUpdateElement, handleDeleteElement, handleSaveProject, handleLoadProject } = useProject();
  const { toolboxOpen, setToolboxOpen } = usePanels();
  const { user } = useAuth();

  // Show welcome screen if user is logged in and has projects but none are loaded
  // Or if user is logged in and has no scenes in the current project
  const showWelcomeScreen = 
    user && 
    ((userProjects.length > 0 && project.scenes.length === 0) || 
     (project.scenes.length === 0 && !project.isNewProject));

  if (showWelcomeScreen) {
    return <WelcomeScreen />;
  }

  // Empty state - no scenes
  if (project.scenes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Toolbar at the top */}
      <Toolbar onPreview={() => setIsPreviewOpen(true)} />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with slides for current scene */}
        {currentScene && <Sidebar />}
        
        {/* Main content */}
        <MainContent />
        
        {/* Right toolbox panel - ensuring it's rendered */}
        <ToolboxPanel 
          open={toolboxOpen} 
          setOpen={setToolboxOpen} 
        />

        {/* Element Controls Panel - add this back to fix controls issue */}
        {toolboxOpen && currentSlide && (
          <div className="border-l w-72 h-full overflow-auto">
            <SlideControls 
              selectedElement={currentSlide.elements.find(el => el.id === project.selectedElementId) || null}
              onUpdateElement={handleUpdateElement}
              onAddElement={handleAddElement}
              onDeleteElement={handleDeleteElement}
              onPreview={() => setIsPreviewOpen(true)}
              onSaveProject={handleSaveProject}
              onLoadProject={handleLoadProject}
            />
          </div>
        )}
      </div>
      
      {/* Preview modal */}
      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
      
      {/* Delete Slide Confirmation Dialog */}
      <DeleteSlideDialog />
    </div>
  );
}

export default ProjectContent;
