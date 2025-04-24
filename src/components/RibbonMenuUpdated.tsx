
import { useState } from "react";
import { FileMenuDropdown } from "../components/FileMenuDropdown";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { FileMenuDropdown } from "@/components/FileMenuDropdown";
import { useProject } from "@/contexts/project";
import { 
  Type,
  Image,
  Square,
  Circle,
  Video,
  AudioLines,
  Table,
  MapPin,
  CheckSquare,
  LayoutList,
  Grid, 
  Ruler,
  Play,
  ArrowsUpFromLine,
  Palette,
  Layout,
  PanelLeft,
  MousePointer
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function RibbonMenuUpdated() {
  const { handleAddElement } = useProject();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };
  
  return (
    <div className="border-b bg-background flex flex-col">
      {/* Main Menu Bar */}
      <Menubar className="border-0 rounded-none h-auto">
        {/* File Menu */}
        <FileMenuDropdown/>
        
        {/* Home Menu Button */}
        <div 
          className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${activeMenu === 'home' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleMenuClick('home')}
        >
          Home
        </div>
        
        {/* Insert Menu Button */}
        <div 
          className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${activeMenu === 'insert' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleMenuClick('insert')}
        >
          Insert
        </div>

        {/* Slides Menu Button */}
        <div 
          className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${activeMenu === 'slides' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleMenuClick('slides')}
        >
          Slides
        </div>

        {/* Design Menu Button */}
        <div 
          className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${activeMenu === 'design' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleMenuClick('design')}
        >
          Design
        </div>

        {/* Transitions Menu Button */}
        <div 
          className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${activeMenu === 'transitions' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleMenuClick('transitions')}
        >
          Transitions
        </div>

        {/* Animations Menu Button */}
        <div 
          className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${activeMenu === 'animations' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleMenuClick('animations')}
        >
          Animations
        </div>

        {/* View Menu Button */}
        <div 
          className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${activeMenu === 'view' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleMenuClick('view')}
        >
          View
        </div>
      </Menubar>
      
      {/* Expandable Ribbon Content */}
      {activeMenu === 'insert' && (
        <div className="w-full bg-background border-t p-2">
          <div className="grid grid-cols-9 gap-2">
            {/* Picture */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full" 
                    onClick={() => handleAddElement("image")}
                  >
                    <Image className="h-8 w-8 mb-1" />
                    <span className="text-xs">Picture</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Picture</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Shape */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full"
                  >
                    <Square className="h-8 w-8 mb-1" />
                    <span className="text-xs">Shape</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Shape</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Video */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full"
                  >
                    <Video className="h-8 w-8 mb-1" />
                    <span className="text-xs">Video</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Video</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Audio */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full"
                  >
                    <AudioLines className="h-8 w-8 mb-1" />
                    <span className="text-xs">Audio</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Audio</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Text Box */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full"
                    onClick={() => handleAddElement("text")}
                  >
                    <Type className="h-8 w-8 mb-1" />
                    <span className="text-xs">Text Box</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Text Box</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Table */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full"
                  >
                    <Table className="h-8 w-8 mb-1" />
                    <span className="text-xs">Table</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Table</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full"
                    onClick={() => handleAddElement("button")}
                  >
                    <Square className="h-8 w-8 mb-1" />
                    <span className="text-xs">Button</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Button</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Hotspot */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full"
                    onClick={() => handleAddElement("hotspot")}
                  >
                    <MapPin className="h-8 w-8 mb-1" />
                    <span className="text-xs">Hotspot</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Hotspot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Input */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center h-20 w-full"
                  >
                    <CheckSquare className="h-8 w-8 mb-1" />
                    <span className="text-xs">Input</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Input Control</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* Home ribbon content */}
      {activeMenu === 'home' && (
        <div className="w-full bg-background border-t p-2">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <MousePointer className="h-6 w-6 mb-1" />
                    <span className="text-xs">Select</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select Element</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <Layout className="h-6 w-6 mb-1" />
                    <span className="text-xs">Layout</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change Layout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* Slides ribbon content */}
      {activeMenu === 'slides' && (
        <div className="w-full bg-background border-t p-2">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <LayoutList className="h-6 w-6 mb-1" />
                    <span className="text-xs">New Slide</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add New Slide</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <LayoutList className="h-6 w-6 mb-1" />
                    <span className="text-xs">Duplicate</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicate Slide</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* Design ribbon content */}
      {activeMenu === 'design' && (
        <div className="w-full bg-background border-t p-2">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <Palette className="h-6 w-6 mb-1" />
                    <span className="text-xs">Themes</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change Theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <Palette className="h-6 w-6 mb-1" />
                    <span className="text-xs">Colors</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change Colors</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* Transitions ribbon content */}
      {activeMenu === 'transitions' && (
        <div className="w-full bg-background border-t p-2">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <ArrowsUpFromLine className="h-6 w-6 mb-1" />
                    <span className="text-xs">Fade</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fade Transition</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <ArrowsUpFromLine className="h-6 w-6 mb-1" />
                    <span className="text-xs">Slide</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Slide Transition</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* Animations ribbon content */}
      {activeMenu === 'animations' && (
        <div className="w-full bg-background border-t p-2">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <Play className="h-6 w-6 mb-1" />
                    <span className="text-xs">Entrance</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Entrance Animation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <Play className="h-6 w-6 mb-1" />
                    <span className="text-xs">Emphasis</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Emphasis Animation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* View ribbon content */}
      {activeMenu === 'view' && (
        <div className="w-full bg-background border-t p-2">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <Layout className="h-6 w-6 mb-1" />
                    <span className="text-xs">Slide View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to Slide View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <PanelLeft className="h-6 w-6 mb-1" />
                    <span className="text-xs">Scene View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to Scene View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <Ruler className="h-6 w-6 mb-1" />
                    <span className="text-xs">Ruler</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Ruler</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center h-20">
                    <Grid className="h-6 w-6 mb-1" />
                    <span className="text-xs">Grid Lines</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Grid Lines</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
}
