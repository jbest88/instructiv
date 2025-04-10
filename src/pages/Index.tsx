
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

function ProjectContent() {
  const { project, currentScene, isPreviewOpen, setIsPreviewOpen, userProjects } = useProject();
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
        
        {/* Right toolbox panel */}
        <ToolboxPanel 
          isOpen={toolboxOpen}
          onToggle={() => setToolboxOpen(!toolboxOpen)}
        />
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

const Index = () => {
  return (
    <PanelProvider>
      <ProjectProvider>
        <ProjectContent />
      </ProjectProvider>
    </PanelProvider>
  );
};

export default Index;
