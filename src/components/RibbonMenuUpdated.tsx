
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "@/contexts/ProjectContext";
import { FileMenuDropdown } from "@/components/FileMenuDropdown";
import { 
  Type,
  Image,
  Square,
  MousePointer,
  Layout,
  Palette
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export function RibbonMenuUpdated() {
  const { 
    canvasSize, 
    setCanvasSize 
  } = useProject();
  
  const handleCanvasSizeChange = (field: 'width' | 'height', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    
    setCanvasSize({
      ...canvasSize,
      [field]: numValue
    });
  };
  
  return (
    <div className="p-1 border-b bg-white">
      <div className="flex items-center space-x-1">
        <div className="flex items-center">
          <FileMenuDropdown />
          
          <Tabs defaultValue="insert" className="w-full">
            <TabsList>
              <TabsTrigger value="insert">Insert</TabsTrigger>
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="format">Format</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="pt-1 pb-1">
        {/* Canvas Size Controls */}
        <TooltipProvider>
          <div className="flex flex-wrap gap-2">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 w-auto flex flex-col items-center justify-center gap-1 px-3"
                  >
                    <Layout className="h-5 w-5" />
                    <span className="text-xs">Canvas Size</span>
                    <span className="text-xs text-muted-foreground">{canvasSize.width} × {canvasSize.height}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Canvas Dimensions</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the width and height of your canvas
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          className="col-span-2 h-8"
                          value={canvasSize.width}
                          onChange={(e) => handleCanvasSizeChange('width', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          className="col-span-2 h-8"
                          value={canvasSize.height}
                          onChange={(e) => handleCanvasSizeChange('height', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => setCanvasSize({ width: 1920, height: 1200 })}
                      >
                        1920 × 1200
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => setCanvasSize({ width: 1280, height: 720 })}
                      >
                        1280 × 720
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => setCanvasSize({ width: 3840, height: 2160 })}
                      >
                        3840 × 2160
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
