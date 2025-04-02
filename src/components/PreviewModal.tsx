
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Scene, Slide } from "@/utils/slideTypes";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
  initialSceneId: string;
  initialSlideId: string;
}

export function PreviewModal({ 
  isOpen, 
  onClose, 
  scenes,
  initialSceneId,
  initialSlideId
}: PreviewModalProps) {
  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);
  const [currentSlideId, setCurrentSlideId] = useState(initialSlideId);
  
  // Reset to initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSceneId(initialSceneId);
      setCurrentSlideId(initialSlideId);
    }
  }, [isOpen, initialSceneId, initialSlideId]);
  
  // Find the current scene and slide
  const currentScene = scenes.find(scene => scene.id === currentSceneId) || scenes[0];
  const sortedSlides = [...currentScene.slides].sort((a, b) => a.order - b.order);
  const currentSlide = sortedSlides.find(slide => slide.id === currentSlideId) || sortedSlides[0];
  
  // Get the current slide index for navigation
  const currentSlideIndex = sortedSlides.findIndex(slide => slide.id === currentSlideId);
  
  // Navigate to the next slide or scene
  const handleNext = () => {
    // If there are more slides in the current scene
    if (currentSlideIndex < sortedSlides.length - 1) {
      setCurrentSlideId(sortedSlides[currentSlideIndex + 1].id);
      return;
    }
    
    // If this is the last slide in the current scene, move to the next scene
    const currentSceneIndex = scenes.findIndex(scene => scene.id === currentSceneId);
    if (currentSceneIndex < scenes.length - 1) {
      const nextScene = scenes[currentSceneIndex + 1];
      const nextSlides = [...nextScene.slides].sort((a, b) => a.order - b.order);
      setCurrentSceneId(nextScene.id);
      setCurrentSlideId(nextSlides[0]?.id || "");
    }
  };
  
  // Navigate to the previous slide or scene
  const handlePrevious = () => {
    // If there are previous slides in the current scene
    if (currentSlideIndex > 0) {
      setCurrentSlideId(sortedSlides[currentSlideIndex - 1].id);
      return;
    }
    
    // If this is the first slide in the current scene, move to the previous scene
    const currentSceneIndex = scenes.findIndex(scene => scene.id === currentSceneId);
    if (currentSceneIndex > 0) {
      const prevScene = scenes[currentSceneIndex - 1];
      const prevSlides = [...prevScene.slides].sort((a, b) => a.order - b.order);
      setCurrentSceneId(prevScene.id);
      setCurrentSlideId(prevSlides[prevSlides.length - 1]?.id || "");
    }
  };
  
  // Function to handle button clicks in slides
  const handleButtonClick = (action: string, targetSlideId?: string) => {
    if (action === "nextSlide") {
      handleNext();
    } else if (action === "prevSlide") {
      handlePrevious();
    } else if (action === "goToSlide" && targetSlideId) {
      setCurrentSlideId(targetSlideId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[90vw] h-[80vh] p-0 overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          {/* Preview Header */}
          <div className="bg-card border-b p-2 flex items-center justify-between">
            <div className="text-sm font-medium">
              Preview: {currentScene.title} - {currentSlide.title}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </div>
          
          {/* Preview Content */}
          <div 
            className="flex-1 relative overflow-hidden" 
            style={{ background: currentSlide.background || '#ffffff' }}
          >
            {/* Render slide elements */}
            {currentSlide.elements.map(element => {
              if (element.type === "text") {
                return (
                  <div
                    key={element.id}
                    className="absolute"
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                      fontSize: `${element.fontSize || 16}px`,
                      color: element.fontColor || '#000000',
                      fontWeight: element.fontWeight || 'normal'
                    }}
                  >
                    {element.content}
                  </div>
                );
              }
              
              if (element.type === "image") {
                return (
                  <div
                    key={element.id}
                    className="absolute"
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`
                    }}
                  >
                    <img 
                      src={element.src} 
                      alt={element.alt || 'Slide image'} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                );
              }
              
              if (element.type === "button") {
                let buttonClass = "bg-primary text-white";
                if (element.style === "secondary") {
                  buttonClass = "bg-secondary text-secondary-foreground";
                } else if (element.style === "outline") {
                  buttonClass = "bg-transparent border border-primary text-primary";
                }
                
                return (
                  <button
                    key={element.id}
                    className={`absolute flex items-center justify-center rounded ${buttonClass}`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`
                    }}
                    onClick={() => handleButtonClick(element.action, element.targetSlideId)}
                  >
                    {element.label}
                  </button>
                );
              }
              
              if (element.type === "hotspot") {
                const isCircle = element.shape === "circle";
                
                return (
                  <div
                    key={element.id}
                    className={`absolute bg-blue-400/30 border-2 border-blue-500 ${isCircle ? 'rounded-full' : 'rounded'}`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`
                    }}
                    title={element.tooltip}
                  />
                );
              }
              
              return null;
            })}
          </div>
          
          {/* Preview Controls */}
          <div className="bg-card border-t p-2 flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevious}
              disabled={currentSlideIndex === 0 && scenes.findIndex(scene => scene.id === currentSceneId) === 0}
            >
              <ArrowLeft size={16} className="mr-1" />
              Previous
            </Button>
            
            <div className="text-sm">
              Scene {scenes.findIndex(scene => scene.id === currentSceneId) + 1} / {scenes.length},
              Slide {currentSlideIndex + 1} / {sortedSlides.length}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNext}
              disabled={
                currentSlideIndex === sortedSlides.length - 1 && 
                scenes.findIndex(scene => scene.id === currentSceneId) === scenes.length - 1
              }
            >
              Next
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
