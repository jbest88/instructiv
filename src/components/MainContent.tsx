
import { useProject } from "@/contexts/ProjectContext";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SceneSelector } from "@/components/SceneSelector";
import { Timeline } from "@/components/Timeline";
import { StoryView } from "@/components/StoryView";
import { Button } from "@/components/ui/button";
import { Plus, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export function MainContent() {
  const { 
    currentScene, 
    currentSlide, 
    selectedElementId, 
    setSelectedElementId, 
    handleUpdateElement,
    handleAddSlide,
    canvasZoom,
    setCanvasZoom
  } = useProject();

  const handleZoomIn = () => {
    setCanvasZoom(Math.min(canvasZoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setCanvasZoom(Math.max(canvasZoom - 0.1, 0.1));
  };

  const handleResetZoom = () => {
    setCanvasZoom(1);
  };

  // Add handleDeleteElement from the project context
  const { handleAddElement } = useProject();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f2f1]">
      {/* Story view */}
      <StoryView />
      
      {/* Scene selector */}
      <SceneSelector />
      
      {/* Editor canvas */}
      {currentSlide ? (
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <SlideCanvas 
              slide={currentSlide}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={(elementId) => {
                if (handleAddElement) {
                  // Use handleAddElement to access SlideElement functions
                  const elementFunctions = useProject();
                  if (elementFunctions.handleDeleteElement) {
                    elementFunctions.handleDeleteElement(elementId);
                  }
                }
              }}
            />
          </div>
          
          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 rounded-md p-1 shadow-md">
            <Button variant="ghost" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-2 text-sm tabular-nums">
              {Math.round(canvasZoom * 100)}%
            </div>
            <Button variant="ghost" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleResetZoom} className="ml-1">
              <Maximize2 className="h-4 w-4" />
            </Button>
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
  );
}
