
import { useState } from "react";
import { ChevronLeft, ChevronRight, Palette, Type, Image, Square, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProject } from "@/contexts/project";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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
    handleUpdateElement,
    handleUpdateSlide, 
    handleUpdateScene,
    canvasSize,
    setCanvasSize
  } = useProject();

  const [activeTab, setActiveTab] = useState("elements");
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);

  // Helper function for position updates that allows clearing values
  const handlePositionChange = (elementId: string, field: 'x' | 'y' | 'width' | 'height', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    // Don't check isNaN - allow empty string to be converted to 0
    handleUpdateElement(elementId, { [field]: numValue });
  };

  // Handle double click to edit title
  const handleTitleDoubleClick = (id: string) => {
    setEditingTitleId(id);
  };

  // Handle canvas size change
  const handleCanvasSizeChange = (field: 'width' | 'height', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    setCanvasSize({
      ...canvasSize,
      [field]: numValue
    });
  };

  // Helper function to render properties based on element type
  const renderElementProperties = () => {
    if (!selectedElement) return null;

    // Position controls - common for all elements
    const positionControls = (
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <Label htmlFor="position-x">X Position</Label>
          <Input 
            id="position-x"
            type="number"
            value={selectedElement.x}
            onChange={(e) => handlePositionChange(selectedElement.id, 'x', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="position-y">Y Position</Label>
          <Input 
            id="position-y"
            type="number"
            value={selectedElement.y}
            onChange={(e) => handlePositionChange(selectedElement.id, 'y', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="element-width">Width</Label>
          <Input 
            id="element-width"
            type="number"
            value={selectedElement.width}
            onChange={(e) => handlePositionChange(selectedElement.id, 'width', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="element-height">Height</Label>
          <Input 
            id="element-height"
            type="number"
            value={selectedElement.height}
            onChange={(e) => handlePositionChange(selectedElement.id, 'height', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    );

    switch (selectedElement.type) {
      case "text":
        return (
          <div className="space-y-4">
            {positionControls}
            
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea 
                id="text-content"
                value={selectedElement.content}
                onChange={(e) => handleUpdateElement(selectedElement.id, { content: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <Input 
                id="font-size"
                type="number"
                value={selectedElement.fontSize || 16}
                onChange={(e) => handleUpdateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="font-color">Font Color</Label>
              <div className="flex mt-1">
                <Input 
                  id="font-color"
                  type="text"
                  value={selectedElement.fontColor || "#000000"}
                  onChange={(e) => handleUpdateElement(selectedElement.id, { fontColor: e.target.value })}
                  className="flex-1 mr-2"
                />
                <input 
                  type="color" 
                  value={selectedElement.fontColor || "#000000"} 
                  onChange={(e) => handleUpdateElement(selectedElement.id, { fontColor: e.target.value })}
                  className="h-10 w-10 border rounded cursor-pointer"
                />
              </div>
            </div>
            
            <div>
              <Label>Text Alignment</Label>
              <RadioGroup 
                value={selectedElement.align || "left"}
                onValueChange={(value) => handleUpdateElement(selectedElement.id, { align: value as "left" | "center" | "right" })}
                className="flex space-x-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="left" />
                  <Label htmlFor="left">Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="center" id="center" />
                  <Label htmlFor="center">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="right" />
                  <Label htmlFor="right">Right</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case "image":
        return (
          <div className="space-y-4">
            {positionControls}
            
            <div>
              <Label htmlFor="image-src">Image Source</Label>
              <Input 
                id="image-src"
                value={selectedElement.src}
                onChange={(e) => handleUpdateElement(selectedElement.id, { src: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input 
                id="image-alt"
                value={selectedElement.alt || ""}
                onChange={(e) => handleUpdateElement(selectedElement.id, { alt: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        );
        
      case "button":
        return (
          <div className="space-y-4">
            {positionControls}
            
            <div>
              <Label htmlFor="button-label">Button Text</Label>
              <Input 
                id="button-label"
                value={selectedElement.label}
                onChange={(e) => handleUpdateElement(selectedElement.id, { label: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="button-action">Button Action</Label>
              <select 
                id="button-action"
                className="w-full mt-1 rounded-md border border-input p-2 bg-background text-sm"
                value={selectedElement.action}
                onChange={(e) => handleUpdateElement(
                  selectedElement.id, 
                  { action: e.target.value as "nextSlide" | "prevSlide" | "goToSlide" | "debug" }
                )}
              >
                <option value="nextSlide">Next Slide</option>
                <option value="prevSlide">Previous Slide</option>
                <option value="goToSlide">Go to Specific Slide</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="button-style">Button Style</Label>
              <select 
                id="button-style"
                className="w-full mt-1 rounded-md border border-input p-2 bg-background text-sm"
                value={selectedElement.style || "primary"}
                onChange={(e) => handleUpdateElement(
                  selectedElement.id, 
                  { style: e.target.value as "primary" | "secondary" | "outline" }
                )}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        );
        
      case "hotspot":
        return (
          <div className="space-y-4">
            {positionControls}
            
            <div>
              <Label htmlFor="hotspot-tooltip">Tooltip Text</Label>
              <Input 
                id="hotspot-tooltip"
                value={selectedElement.tooltip}
                onChange={(e) => handleUpdateElement(selectedElement.id, { tooltip: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="hotspot-shape">Shape</Label>
              <select 
                id="hotspot-shape"
                className="w-full mt-1 rounded-md border border-input p-2 bg-background text-sm"
                value={selectedElement.shape}
                onChange={(e) => handleUpdateElement(
                  selectedElement.id, 
                  { shape: e.target.value as "circle" | "rectangle" }
                )}
              >
                <option value="circle">Circle</option>
                <option value="rectangle">Rectangle</option>
              </select>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-muted-foreground p-4 text-center">
            Element properties not available
          </div>
        );
    }
  };

  // Render slide properties
  const renderSlideProperties = () => {
    if (!currentSlide) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="slide-title">Slide Title</Label>
          {editingTitleId === currentSlide.id ? (
            <Input 
              id="slide-title"
              value={currentSlide.title}
              onChange={(e) => handleUpdateSlide({ title: e.target.value })}
              className="mt-1"
              autoFocus
              onBlur={() => setEditingTitleId(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitleId(null)}
            />
          ) : (
            <div 
              className="p-2 mt-1 border rounded cursor-pointer hover:bg-muted"
              onDoubleClick={() => handleTitleDoubleClick(currentSlide.id)}
            >
              {currentSlide.title}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="slide-background">Background Color</Label>
          <div className="flex mt-1">
            <Input 
              id="slide-background"
              type="text"
              value={currentSlide.background || "#ffffff"}
              onChange={(e) => handleUpdateSlide({ background: e.target.value })}
              className="flex-1 mr-2"
            />
            <input 
              type="color" 
              value={currentSlide.background || "#ffffff"} 
              onChange={(e) => handleUpdateSlide({ background: e.target.value })}
              className="h-10 w-10 border rounded cursor-pointer"
            />
          </div>
        </div>
        
        {/* Canvas Size Controls */}
        <div>
          <Label className="font-medium">Canvas Size</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <Label htmlFor="canvas-width" className="text-xs">Width</Label>
              <Input 
                id="canvas-width"
                type="number"
                value={canvasSize.width}
                onChange={(e) => handleCanvasSizeChange('width', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="canvas-height" className="text-xs">Height</Label>
              <Input 
                id="canvas-height"
                type="number"
                value={canvasSize.height}
                onChange={(e) => handleCanvasSizeChange('height', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => setCanvasSize({ width: 1920, height: 1200 })}
            >
              1920×1200
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => setCanvasSize({ width: 1280, height: 720 })}
            >
              1280×720
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => setCanvasSize({ width: 3840, height: 2160 })}
            >
              3840×2160
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Render scene properties
  const renderSceneProperties = () => {
    if (!currentScene) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="scene-title">Scene Title</Label>
          {editingTitleId === currentScene.id ? (
            <Input 
              id="scene-title"
              value={currentScene.title}
              onChange={(e) => handleUpdateScene({ title: e.target.value })}
              className="mt-1"
              autoFocus
              onBlur={() => setEditingTitleId(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitleId(null)}
            />
          ) : (
            <div 
              className="p-2 mt-1 border rounded cursor-pointer hover:bg-muted"
              onDoubleClick={() => handleTitleDoubleClick(currentScene.id)}
            >
              {currentScene.title}
            </div>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Contains {currentScene.slides.length} slides
        </div>
      </div>
    );
  };

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
                  <h3 className="text-sm font-medium mb-4">Element Properties</h3>
                  {renderElementProperties()}
                </div>
              ) : currentSlide ? (
                <div>
                  <h3 className="text-sm font-medium mb-2">Slide Properties</h3>
                  {renderSlideProperties()}
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-sm font-medium mb-2">Scene Properties</h3>
                  {renderSceneProperties()}
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
