import { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/project";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { project } = useProject();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Reset indices when opening the preview
  useEffect(() => {
    if (isOpen) {
      // Find the index of current scene and slide
      const sceneIndex = project.scenes.findIndex(s => s.id === project.currentSceneId);
      
      if (sceneIndex >= 0) {
        setCurrentSceneIndex(sceneIndex);
        
        const scene = project.scenes[sceneIndex];
        const slideIndex = scene.slides.findIndex(s => s.id === project.currentSlideId);
        
        if (slideIndex >= 0) {
          setCurrentSlideIndex(slideIndex);
        } else {
          setCurrentSlideIndex(0);
        }
      } else {
        setCurrentSceneIndex(0);
        setCurrentSlideIndex(0);
      }
    }
  }, [isOpen, project]);
  
  // Navigate to next slide or scene
  const handleNext = () => {
    const currentScene = project.scenes[currentSceneIndex];
    
    if (currentSlideIndex < currentScene.slides.length - 1) {
      // Go to next slide in current scene
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (currentSceneIndex < project.scenes.length - 1) {
      // Go to first slide of next scene
      setCurrentSceneIndex(currentSceneIndex + 1);
      setCurrentSlideIndex(0);
    }
  };
  
  // Navigate to previous slide or scene
  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      // Go to previous slide in current scene
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (currentSceneIndex > 0) {
      // Go to last slide of previous scene
      const prevScene = project.scenes[currentSceneIndex - 1];
      setCurrentSceneIndex(currentSceneIndex - 1);
      setCurrentSlideIndex(prevScene.slides.length - 1);
    }
  };
  
  // Get current slide
  const getCurrentSlide = () => {
    if (project.scenes.length === 0) return null;
    
    const currentScene = project.scenes[currentSceneIndex];
    if (!currentScene || currentScene.slides.length === 0) return null;
    
    return currentScene.slides[currentSlideIndex];
  };
  
  const currentSlide = getCurrentSlide();
  
  if (!currentSlide) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl w-screen h-[90vh] flex flex-col p-0">
        <div className="border-b p-2 flex items-center justify-between">
          <div className="text-sm font-medium">
            Preview: {project.scenes[currentSceneIndex]?.title} - {currentSlide.title}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 relative bg-gray-100 overflow-hidden">
          {/* Preview of slide */}
          <div 
            className="absolute inset-8 shadow-xl rounded-md overflow-hidden"
            style={{ background: currentSlide.background || '#ffffff' }}
          >
            {/* Render slide elements here */}
            {currentSlide.elements.map(element => {
              if (element.type === "text") {
                return (
                  <div
                    key={element.id}
                    style={{
                      position: 'absolute',
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      fontSize: `${element.fontSize}px`,
                      color: element.fontColor,
                      fontWeight: element.fontWeight,
                    }}
                  >
                    {element.content}
                  </div>
                );
              }
              
              if (element.type === "image") {
                return (
                  <img
                    key={element.id}
                    src={element.src}
                    alt={element.alt || ""}
                    style={{
                      position: 'absolute',
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                      objectFit: 'contain'
                    }}
                  />
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
                    className={`absolute rounded ${buttonClass} flex items-center justify-center`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                    }}
                    onClick={element.action === "nextSlide" ? handleNext : undefined}
                  >
                    {element.label}
                  </button>
                );
              }
              
              if (element.type === "hotspot") {
                return (
                  <div
                    key={element.id}
                    className={`absolute ${element.shape === "circle" ? "rounded-full" : "rounded"} bg-blue-400/30 border-2 border-blue-500`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                    }}
                    title={element.tooltip}
                  />
                );
              }
              
              return null;
            })}
          </div>
        </div>
        
        <div className="border-t p-2 flex items-center justify-center space-x-4">
          <Button 
            onClick={handlePrevious}
            disabled={currentSceneIndex === 0 && currentSlideIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="text-sm">
            Slide {currentSlideIndex + 1} of {project.scenes[currentSceneIndex]?.slides.length} 
            | Scene {currentSceneIndex + 1} of {project.scenes.length}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={
              currentSceneIndex === project.scenes.length - 1 &&
              currentSlideIndex === project.scenes[currentSceneIndex]?.slides.length - 1
            }
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
