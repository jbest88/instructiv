
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlideElement, Slide, ButtonElement } from "@/utils/slideTypes";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  initialSlideId: string;
}

export function PreviewModal({ 
  isOpen, 
  onClose, 
  slides, 
  initialSlideId 
}: PreviewModalProps) {
  const [currentSlideId, setCurrentSlideId] = useState(initialSlideId);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  
  const currentSlideIndex = slides.findIndex(slide => slide.id === currentSlideId);
  const currentSlide = slides[currentSlideIndex];
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideId(initialSlideId);
      setActiveHotspotId(null);
    }
  }, [isOpen, initialSlideId]);
  
  // Navigate to the next slide
  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideId(slides[currentSlideIndex + 1].id);
      setActiveHotspotId(null);
    }
  };
  
  // Navigate to the previous slide
  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideId(slides[currentSlideIndex - 1].id);
      setActiveHotspotId(null);
    }
  };
  
  // Handle button clicks
  const handleButtonClick = (button: ButtonElement) => {
    if (button.action === "nextSlide") {
      goToNextSlide();
    } else if (button.action === "prevSlide") {
      goToPrevSlide();
    } else if (button.action === "goToSlide" && button.targetSlideId) {
      setCurrentSlideId(button.targetSlideId);
      setActiveHotspotId(null);
    }
  };
  
  // Toggle hotspot tooltip
  const toggleHotspot = (hotspotId: string) => {
    setActiveHotspotId(activeHotspotId === hotspotId ? null : hotspotId);
  };

  if (!currentSlide) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-4 py-2 flex flex-row items-center justify-between">
          <DialogTitle>Preview: {currentSlide.title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </DialogHeader>
        
        <div 
          className="relative w-full h-[70vh] overflow-hidden"
          style={{ background: currentSlide.background || '#ffffff' }}
        >
          {/* Render slide elements for preview */}
          {currentSlide.elements.map((element) => {
            if (element.type === "text") {
              return (
                <div
                  key={element.id}
                  className="absolute pointer-events-none"
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
                  className="absolute pointer-events-none"
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
                  className={`absolute flex items-center justify-center rounded cursor-pointer ${buttonClass}`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`
                  }}
                  onClick={() => handleButtonClick(element)}
                >
                  {element.label}
                </button>
              );
            }
            
            if (element.type === "hotspot") {
              const isCircle = element.shape === "circle";
              
              return (
                <div key={element.id} className="absolute">
                  <div
                    className={`absolute cursor-pointer bg-blue-400/30 border-2 border-blue-500 ${isCircle ? 'rounded-full' : 'rounded'}`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`
                    }}
                    onClick={() => toggleHotspot(element.id)}
                  />
                  
                  {activeHotspotId === element.id && (
                    <div 
                      className="absolute bg-white p-3 rounded shadow-lg z-10 max-w-xs border border-gray-200"
                      style={{
                        left: `${element.x + element.width / 2}px`,
                        top: `${element.y + element.height + 10}px`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {element.tooltip}
                    </div>
                  )}
                </div>
              );
            }
            
            return null;
          })}
        </div>
        
        <div className="p-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={goToPrevSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Slide {currentSlideIndex + 1} of {slides.length}
          </div>
          
          <Button 
            variant="outline" 
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
