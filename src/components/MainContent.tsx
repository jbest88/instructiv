
import { useProject } from "@/contexts/project/ProjectContext";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SceneSelector } from "@/components/SceneSelector";
import { StoryView } from "@/components/StoryView";
import { Button } from "@/components/ui/button";
import { Plus, ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MainContent() {
  const { 
    currentScene, 
    currentSlide, 
    selectedElementId, 
    setSelectedElementId, 
    handleUpdateElement,
    handleAddSlide,
    canvasZoom,
    setCanvasZoom,
    handleDeleteElement
  } = useProject();
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Zoom controls with better step values for smooth zooming
  const handleZoomIn = () => {
    const newZoom = Math.min(canvasZoom + 0.1, 3);
    setCanvasZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(canvasZoom - 0.1, 0.1);
    setCanvasZoom(newZoom);
  };

  // Reset zoom to 100% (centers canvas automatically)
  const handleResetZoom = () => {
    setCanvasZoom(1);
  };

  // Prevent browser zoom on Ctrl+wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        
        // Custom zoom handling
        if (e.deltaY < 0) {
          // Zoom in
          handleZoomIn();
        } else {
          // Zoom out
          handleZoomOut();
        }
      }
    };
    
    // Add event listener to prevent default browser zoom
    const canvasContainer = canvasContainerRef.current;
    if (canvasContainer) {
      canvasContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (canvasContainer) {
        canvasContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [canvasZoom]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f2f1]">
      {/* Story view */}
      <StoryView />
      
      {/* Scene selector */}
      <SceneSelector />
      
      {/* Editor canvas */}
      {currentSlide ? (
        <div className="flex-1 overflow-hidden relative">
          <div 
            ref={canvasContainerRef}
            className="absolute inset-0 overflow-auto"
            style={{
              position: 'relative',
              height: '100%',
              width: '100%'
            }}
          >
            <div
              style={{
                transform: `scale(${canvasZoom})`,
                transformOrigin: '0 0',
                width: `${1920}px`,
                height: `${1200}px`,
                background: currentSlide.background || '#ffffff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                margin: '20px'
              }}
            >
              <SlideCanvas 
                slide={currentSlide}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                zoom={canvasZoom}
              />
            </div>
          </div>
          
          {/* Zoom controls with keyboard shortcuts and percentage */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 rounded-md p-1 shadow-md z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomOut}
              title="Zoom Out (Ctrl+-)"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-2 text-sm tabular-nums">
              {Math.round(canvasZoom * 100)}%
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomIn}
              title="Zoom In (Ctrl++)"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleResetZoom} 
              className="ml-1"
              title="Reset Zoom (Ctrl+0)"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Shortcut hints */}
          <div className="absolute bottom-4 left-4 bg-white/80 rounded p-1 text-xs text-gray-600 shadow-sm z-10">
            <div className="flex items-center gap-1">
              <Move className="h-3 w-3" /> Pan: Drag or Middle Mouse
            </div>
            <div>Zoom: Ctrl + Mouse Wheel</div>
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
      
      {/* Timeline component has been removed */}
    </div>
  );
}
