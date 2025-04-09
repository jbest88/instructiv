
import { useState } from "react";
import { Plus, Trash2, PanelLeftClose, PanelLeftOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProject } from "@/contexts/project/ProjectContext";
import { usePanels } from "@/contexts/PanelContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Sidebar() {
  const { 
    project,
    currentScene, 
    currentSlide, 
    handleSelectScene,
    handleSelectSlide, 
    handleAddSlide, 
    handleDeleteSlideInitiate 
  } = useProject();
  
  const { sidebarOpen, toggleSidebar } = usePanels();
  const [isHovering, setIsHovering] = useState<string | null>(null);
  
  if (!currentScene) return null;
  
  // Sort slides by order
  const sortedSlides = [...currentScene.slides].sort((a, b) => a.order - b.order);

  return (
    <div className={`h-full bg-background flex flex-col border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-14'}`}>
      <div className="p-2 border-b flex items-center justify-between">
        {sidebarOpen && <h2 className="text-lg font-medium">Scenes</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={sidebarOpen ? "" : "mx-auto"}
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </Button>
      </div>
      
      {sidebarOpen && (
        <>
          {/* Scene selector dropdown */}
          <div className="p-3 border-b">
            <Select 
              value={currentScene.id} 
              onValueChange={handleSelectScene}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a scene" />
              </SelectTrigger>
              <SelectContent>
                {project.scenes.map((scene) => (
                  <SelectItem key={scene.id} value={scene.id}>
                    {scene.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {sortedSlides.map((slide) => (
              <div 
                key={slide.id}
                className={cn(
                  "slide-thumb aspect-video relative bg-white shadow rounded-md cursor-pointer border",
                  currentSlide?.id === slide.id ? "border-primary" : "border-transparent hover:border-gray-300"
                )}
                onClick={() => handleSelectSlide(slide.id)}
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
                {isHovering === slide.id && sortedSlides.length > 1 && (
                  <button 
                    className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-red-100 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlideInitiate(slide.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center"
              onClick={handleAddSlide}
            >
              <Plus size={16} className="mr-1" />
              Add Slide
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
