
import { useState } from "react";
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
  Image, Square, Circle, MousePointer, Type, 
  FileText, Save, Upload, Play, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SlideElement } from "@/utils/slideTypes";

interface SlideControlsProps {
  selectedElement: SlideElement | null;
  onUpdateElement: (elementId: string, updates: Partial<SlideElement>) => void;
  onAddElement: (type: SlideElement['type']) => void;
  onDeleteElement: (elementId: string) => void;
  onPreview: () => void;
  onSaveProject: () => void;
  onLoadProject: () => void;
}

export function SlideControls({ 
  selectedElement, 
  onUpdateElement,
  onAddElement,
  onDeleteElement,
  onPreview,
  onSaveProject,
  onLoadProject
}: SlideControlsProps) {
  const [activeTab, setActiveTab] = useState("insert");
  
  // Helper function for position updates that allows clearing values
  const handlePositionChange = (elementId: string, field: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    onUpdateElement(elementId, { [field]: numValue });
  };
  
  return (
    <div className="h-full flex flex-col border-b border-border">
      <div className="flex items-center p-2 border-b border-border">
        <div className="space-x-1 mr-auto">
          <Button variant="ghost" size="icon" title="Save Project" onClick={onSaveProject}>
            <Save size={18} />
          </Button>
          <Button variant="ghost" size="icon" title="Load Project" onClick={onLoadProject}>
            <Upload size={18} />
          </Button>
        </div>
        
        <Button 
          variant="default" 
          size="sm" 
          className="ml-auto"
          onClick={onPreview}
        >
          <Play size={16} className="mr-1" />
          Preview
        </Button>
      </div>
      
      <Tabs defaultValue="insert" value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="w-full justify-start border-b rounded-none px-4">
          <TabsTrigger value="insert">Insert</TabsTrigger>
          <TabsTrigger value="format" disabled={!selectedElement}>Format</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insert" className="p-4 h-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="flex flex-col h-20 gap-1" 
              onClick={() => onAddElement("text")}
            >
              <Type size={20} />
              <span className="text-xs">Text</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col h-20 gap-1"
              onClick={() => onAddElement("image")}
            >
              <Image size={20} />
              <span className="text-xs">Image</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col h-20 gap-1"
              onClick={() => onAddElement("button")}
            >
              <Square size={20} />
              <span className="text-xs">Button</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col h-20 gap-1"
              onClick={() => onAddElement("hotspot")}
            >
              <Circle size={20} />
              <span className="text-xs">Hotspot</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="format" className="p-4 h-full">
          {selectedElement && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Element Options</h3>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  onDeleteElement(selectedElement.id);
                }}
              >
                <Trash2 size={14} className="mr-1" />
                Remove
              </Button>
            </div>
          )}

          {selectedElement?.type === "text" && (
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const currentWeight = selectedElement.fontWeight || "normal";
                    onUpdateElement(selectedElement.id, { 
                      fontWeight: currentWeight === "bold" ? "normal" : "bold" 
                    });
                  }}
                  className={selectedElement.fontWeight === "bold" ? "bg-accent" : ""}
                >
                  <Bold size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const currentStyle = selectedElement.fontStyle || "normal";
                    onUpdateElement(selectedElement.id, { 
                      fontStyle: currentStyle === "italic" ? "normal" : "italic" 
                    });
                  }}
                  className={selectedElement.fontStyle === "italic" ? "bg-accent" : ""}
                >
                  <Italic size={16} />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onUpdateElement(selectedElement.id, { align: "left" })}
                  className={selectedElement.align === "left" ? "bg-accent" : ""}
                >
                  <AlignLeft size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onUpdateElement(selectedElement.id, { align: "center" })}
                  className={selectedElement.align === "center" ? "bg-accent" : ""}
                >
                  <AlignCenter size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onUpdateElement(selectedElement.id, { align: "right" })}
                  className={selectedElement.align === "right" ? "bg-accent" : ""}
                >
                  <AlignRight size={16} />
                </Button>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Text Content</label>
                <textarea 
                  className="w-full rounded-md border border-input p-2"
                  value={selectedElement.content}
                  onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {selectedElement?.type === "button" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Button Text</label>
                <input 
                  type="text"
                  className="w-full rounded-md border border-input p-2"
                  value={selectedElement.label}
                  onChange={(e) => onUpdateElement(selectedElement.id, { label: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Button Action</label>
                <select 
                  className="w-full rounded-md border border-input p-2"
                  value={selectedElement.action}
                  onChange={(e) => onUpdateElement(
                    selectedElement.id, 
                    { action: e.target.value as "nextSlide" | "prevSlide" | "goToSlide" }
                  )}
                >
                  <option value="nextSlide">Next Slide</option>
                  <option value="prevSlide">Previous Slide</option>
                  <option value="goToSlide">Go to Specific Slide</option>
                </select>
              </div>
            </div>
          )}
          
          {selectedElement?.type === "hotspot" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tooltip Text</label>
                <input 
                  type="text"
                  className="w-full rounded-md border border-input p-2"
                  value={selectedElement.tooltip}
                  onChange={(e) => onUpdateElement(selectedElement.id, { tooltip: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Shape</label>
                <select 
                  className="w-full rounded-md border border-input p-2"
                  value={selectedElement.shape}
                  onChange={(e) => onUpdateElement(
                    selectedElement.id, 
                    { shape: e.target.value as "circle" | "rectangle" }
                  )}
                >
                  <option value="circle">Circle</option>
                  <option value="rectangle">Rectangle</option>
                </select>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
