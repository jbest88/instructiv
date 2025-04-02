
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Slide } from "@/utils/slideTypes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  slides: Slide[];
  currentSlideId: string;
  onSelectSlide: (slideId: string) => void;
  onAddSlide: () => void;
  onDeleteSlide: (slideId: string) => void;
}

export function Sidebar({ 
  slides, 
  currentSlideId, 
  onSelectSlide, 
  onAddSlide, 
  onDeleteSlide 
}: SidebarProps) {
  const [isHovering, setIsHovering] = useState<string | null>(null);

  return (
    <div className="w-64 h-full bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-medium">Slides</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className={cn(
              "slide-thumb aspect-video",
              currentSlideId === slide.id && "active"
            )}
            onClick={() => onSelectSlide(slide.id)}
            onMouseEnter={() => setIsHovering(slide.id)}
            onMouseLeave={() => setIsHovering(null)}
            style={{ background: slide.background || '#ffffff' }}
          >
            <div className="p-2 text-xs truncate">{slide.title}</div>
            
            {/* Simplified representation of slide elements */}
            <div className="relative w-full h-full scale-[0.8]">
              {slide.elements.map(element => {
                if (element.type === "text") {
                  return (
                    <div 
                      key={element.id}
                      className="absolute bg-gray-200 rounded"
                      style={{ 
                        left: `${element.x / 8}px`, 
                        top: `${element.y / 8}px`,
                        width: `${element.width / 8}px`,
                        height: `${element.height / 8}px`
                      }}
                    />
                  );
                }
                if (element.type === "image") {
                  return (
                    <div 
                      key={element.id}
                      className="absolute bg-blue-100 rounded"
                      style={{ 
                        left: `${element.x / 8}px`, 
                        top: `${element.y / 8}px`,
                        width: `${element.width / 8}px`,
                        height: `${element.height / 8}px`
                      }}
                    />
                  );
                }
                if (element.type === "button") {
                  return (
                    <div 
                      key={element.id}
                      className="absolute bg-blue-500 rounded"
                      style={{ 
                        left: `${element.x / 8}px`, 
                        top: `${element.y / 8}px`,
                        width: `${element.width / 8}px`,
                        height: `${element.height / 8}px`
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>
            
            {/* Delete button overlay - only show when hovering and more than 1 slide */}
            {isHovering === slide.id && slides.length > 1 && (
              <button 
                className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-red-100 text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSlide(slide.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center"
          onClick={onAddSlide}
        >
          <Plus size={16} className="mr-1" />
          Add Slide
        </Button>
      </div>
    </div>
  );
}
