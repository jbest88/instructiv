
import { useProject } from "@/contexts/ProjectContext";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SceneSelector } from "@/components/SceneSelector";
import { Timeline } from "@/components/Timeline";
import { RibbonMenu } from "@/components/RibbonMenu";
import { StoryView } from "@/components/StoryView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function MainContent() {
  const { 
    currentScene, 
    currentSlide, 
    selectedElementId, 
    setSelectedElementId, 
    handleUpdateElement,
    handleAddSlide
  } = useProject();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f2f1]">
      {/* Story view */}
      <StoryView />
      
      {/* Scene selector */}
      <SceneSelector />
      
      {/* Editor canvas */}
      {currentSlide ? (
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-6 shadow-lg bg-white rounded-md overflow-hidden">
            <SlideCanvas 
              slide={currentSlide}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onUpdateElement={handleUpdateElement}
            />
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
