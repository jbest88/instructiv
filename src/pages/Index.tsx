
import { ProjectProvider } from "@/contexts/ProjectContext";
import { PanelProvider } from "@/contexts/PanelContext";
import { useProject } from "@/contexts/ProjectContext";
import { usePanels } from "@/contexts/PanelContext";

import { Sidebar } from "@/components/Sidebar";
import { PreviewModal } from "@/components/PreviewModal";
import { ToolboxPanel } from "@/components/ToolboxPanel";
import { Toolbar } from "@/components/Toolbar";
import { MainContent } from "@/components/MainContent";
import { EmptyState } from "@/components/EmptyState";
import { DeleteSlideDialog } from "@/components/DeleteSlideDialog";

function ProjectContent() {
  const { project, currentScene, isPreviewOpen, setIsPreviewOpen } = useProject();
  const { toolboxOpen, setToolboxOpen, ribbonOpen, setRibbonOpen } = usePanels();

  // Empty state - no scenes
  if (project.scenes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Toolbar at the top, including ribbon menu */}
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
