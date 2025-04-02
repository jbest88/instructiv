
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload, Eye, X } from "lucide-react";

interface ToolbarProps {
  onPreview: () => void;
}

export function Toolbar({ onPreview }: ToolbarProps) {
  const { 
    openSlides, 
    currentSlide, 
    handleSelectSlide, 
    handleCloseSlide,
    handleSaveProject, 
    handleLoadProject 
  } = useProject();

  return (
    <div className="flex items-center justify-between gap-4 border-b p-2">
      <div className="flex items-center">
        <span className="font-semibold text-lg mr-4">Narratify</span>
        
        <div className="space-x-1">
          <Button variant="outline" size="sm" onClick={handleSaveProject}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadProject}>
            <Upload className="h-4 w-4 mr-1" />
            Load
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        {openSlides.length > 0 && (
          <Tabs 
            value={currentSlide?.id} 
            onValueChange={handleSelectSlide}
            className="w-auto"
          >
            <TabsList className="bg-background">
              {openSlides.map(slide => (
                <TabsTrigger 
                  key={slide.id} 
                  value={slide.id}
                  className="flex items-center px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative"
                >
                  {slide.title}
                  <button
                    className="ml-2 opacity-50 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseSlide(slide.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
      
      <div>
        <Button onClick={onPreview}>
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
      </div>
    </div>
  );
}
