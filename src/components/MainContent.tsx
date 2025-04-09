import { useProject } from "@/contexts/project/ProjectContext";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SceneSelector } from "@/components/SceneSelector";
import { Timeline } from "@/components/Timeline";
import { StoryView } from "@/components/StoryView";
import { Button } from "@/components/ui/button";
import { Plus, ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [canvasCenter, setCanvasCenter] = useState({ x: 0, y: 0 });

  // Keep track of the canvas scroll position relative to the center
  useEffect(() => {
    if (currentSlide && canvasContainerRef.current) {
      const container = canvasContainerRef.current;
      
      const centerX = container.scrollLeft + container.clientWidth / 2;
      const centerY = container.scrollTop + container.clientHeight / 2;
      
      // Calculate position relative to canvas
      const canvasWidth = 1920 * canvasZoom;
      const canvasHeight = 1200 * canvasZoom;
      
      // Store as percentage of canvas dimensions
      const centerPctX = centerX / canvasWidth;
      const centerPctY = centerY / canvasHeight;
      
      setCanvasCenter({ x: centerPctX, y: centerPctY });
    }
  }, [currentSlide]);

  // Zoom controls with better step values for smooth zooming
  const handleZoomIn = () => {
    const newZoom = Math.min(canvasZoom + 0.1, 3);
    setCanvasZoom(newZoom);
    maintainCenterOnZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(canvasZoom - 0.1, 0.1);
    setCanvasZoom(newZoom);
    maintainCenterOnZoom(newZoom);
  };

  // Reset zoom to 100% (centers canvas automatically)
  const handleResetZoom = () => {
    setCanvasZoom(1);
    centerCanvas(1);
  };
  
  // Function to maintain the same center point when zooming
  const maintainCenterOnZoom = (newZoom: number) => {
    if (!canvasContainerRef.current || !currentSlide) return;
    
    const container = canvasContainerRef.current;
    
    // Calculate new canvas dimensions
    const newCanvasWidth = 1920 * newZoom;
    const newCanvasHeight = 1200 * newZoom;
    
    // Apply the new scroll position to maintain the same center point
    const newScrollX = (newCanvasWidth * canvasCenter.x) - (container.clientWidth / 2);
    const newScrollY = (newCanvasHeight * canvasCenter.y) - (container.clientHeight / 2);
    
    // Apply the scroll position
    container.scrollLeft = Math.max(0, newScrollX);
    container.scrollTop = Math.max(0, newScrollY);
  };
  
  // Function to center the canvas in the viewport
  const centerCanvas = (zoom: number) => {
    if (!canvasContainerRef.current || !currentSlide) return;
    
    const container = canvasContainerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate the center position
    const scrollLeft = (1920 * zoom - containerWidth) / 2;
    const scrollTop = (1200 * zoom - containerHeight) / 2;
    
    // Apply the scroll position
    container.scrollLeft = Math.max(0, scrollLeft);
    container.scrollTop = Math.max(0, scrollTop);
    
    // Update the center point
    setCanvasCenter({ x: 0.5, y: 0.5 });
  };
  
  // Center canvas when zoom changes or on window resize
  useEffect(() => {
    if (currentSlide) {
      maintainCenterOnZoom(canvasZoom);
    }
    
    const handleResize = () => {
      if (currentSlide) {
        maintainCenterOnZoom(canvasZoom);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasZoom, currentSlide]);

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
              <Move className="h-3 w-3" /> Pan: Space + Drag or Middle Mouse
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
      
      {/* Timeline at the bottom */}
      {currentSlide && <Timeline currentSlide={currentSlide} />}
    </div>
  );
}
