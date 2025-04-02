
import { useState } from "react";
import { ChevronLeft, ChevronRight, Palette, Type, Image, Square, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProject } from "@/contexts/ProjectContext";

interface ToolboxPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ToolboxPanel({ isOpen, onToggle }: ToolboxPanelProps) {
  const { 
    currentSlide, 
    currentScene, 
    selectedElement, 
    handleAddElement, 
    handleUpdateSlide, 
    handleUpdateScene 
  } = useProject();

  const [activeTab, setActiveTab] = useState("elements");

  return (
    <div 
      className={`bg-sidebar border-l border-sidebar-border transition-all duration-300 h-full flex flex-col ${
        isOpen ? "w-72" : "w-10"
      }`}
    >
      <div className="p-2 border-b border-sidebar-border flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="mx-auto"
        >
          {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {isOpen && (
        <div className="flex-1 p-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="elements" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Add Elements</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center justify-center"
                    onClick={() => handleAddElement("text")}
                  >
                    <Type className="h-8 w-8 mb-1" />
                    <span className="text-xs">Text</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center justify-center"
                    onClick={() => handleAddElement("image")}
                  >
                    <Image className="h-8 w-8 mb-1" />
                    <span className="text-xs">Image</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center justify-center"
                    onClick={() => handleAddElement("button")}
                  >
                    <Square className="h-8 w-8 mb-1" />
                    <span className="text-xs">Button</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center justify-center"
                    onClick={() => handleAddElement("hotspot")}
                  >
                    <CircleAlert className="h-8 w-8 mb-1" />
                    <span className="text-xs">Hotspot</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="properties" className="space-y-4">
              {selectedElement ? (
                <div>
                  <h3 className="text-sm font-medium mb-2">Element Properties</h3>
                  
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded text-sm">
                      <p>Type: {selectedElement.type}</p>
                      <p>Position: X: {selectedElement.x}, Y: {selectedElement.y}</p>
                      <p>Size: {selectedElement.width} x {selectedElement.height}</p>
                    </div>
                  </div>
                </div>
              ) : currentSlide ? (
                <div>
                  <h3 className="text-sm font-medium mb-2">Slide Properties</h3>
                  
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded text-sm">
                      <p>Title: {currentSlide.title}</p>
                      <p>Background: {currentSlide.background}</p>
                      <div className="mt-2 flex items-center">
                        <label className="text-xs mr-2">Background:</label>
                        <input 
                          type="color" 
                          value={currentSlide.background || '#ffffff'} 
                          onChange={(e) => handleUpdateSlide({ background: e.target.value })}
                          className="w-8 h-8 border rounded" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-sm font-medium mb-2">Scene Properties</h3>
                  
                  {currentScene && (
                    <div className="bg-muted p-3 rounded text-sm">
                      <p>Title: {currentScene.title}</p>
                      <p>Slides: {currentScene.slides.length}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-4">
                  No slide or element selected
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
