
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  Square, Circle, Type, Image as ImageIcon,
  PanelRightOpen, PanelRightClose, Layout, Settings
} from "lucide-react";
import { SlideElement, Slide } from "@/utils/slideTypes";

interface ToolboxPanelProps {
  onAddElement: (type: SlideElement['type']) => void;
  currentSlide: Slide;
  onUpdateSlide: (updates: Partial<Slide>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ToolboxPanel({ 
  onAddElement, 
  currentSlide,
  onUpdateSlide, 
  isOpen,
  onToggle
}: ToolboxPanelProps) {
  return (
    <div className={`border-l border-border w-60 h-full overflow-y-auto transition-all ${isOpen ? 'translate-x-0' : 'translate-x-full hidden'}`}>
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-medium text-sm">Properties</h3>
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {isOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </Button>
      </div>
      
      <Tabs defaultValue="elements">
        <TabsList className="w-full justify-around border-b rounded-none">
          <TabsTrigger value="elements" className="flex-1">
            <Layout size={14} className="mr-1" />
            Elements
          </TabsTrigger>
          <TabsTrigger value="slide" className="flex-1">
            <Settings size={14} className="mr-1" />
            Slide
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="elements" className="p-0">
          <Accordion type="single" collapsible defaultValue="elements">
            <AccordionItem value="elements" className="border-b-0">
              <AccordionTrigger className="px-4 py-2">Elements</AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex flex-col gap-1"
                    onClick={() => onAddElement("text")}
                  >
                    <Type size={18} />
                    <span className="text-xs">Text</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex flex-col gap-1"
                    onClick={() => onAddElement("image")}
                  >
                    <ImageIcon size={18} />
                    <span className="text-xs">Image</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex flex-col gap-1"
                    onClick={() => onAddElement("button")}
                  >
                    <Square size={18} />
                    <span className="text-xs">Button</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex flex-col gap-1"
                    onClick={() => onAddElement("hotspot")}
                  >
                    <Circle size={18} />
                    <span className="text-xs">Hotspot</span>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="slide" className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Slide Title</label>
            <input
              type="text"
              className="w-full rounded-md border border-input p-2"
              value={currentSlide.title}
              onChange={(e) => onUpdateSlide({ title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="rounded border border-input w-8 h-8"
                value={currentSlide.background || '#ffffff'}
                onChange={(e) => onUpdateSlide({ background: e.target.value })}
              />
              <input
                type="text"
                className="w-full rounded-md border border-input p-2 text-sm"
                value={currentSlide.background || '#ffffff'}
                onChange={(e) => onUpdateSlide({ background: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
