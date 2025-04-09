
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
  
  return (
    <div className="border-b bg-background">
      <Menubar className="border-0 rounded-none h-auto">
        {/* File Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium px-4 py-2">File</MenubarTrigger>
          <MenubarContent align="start" className="w-52">
            <MenubarItem onClick={() => window.location.reload()}>
              New
            </MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Import</MenubarItem>
            <MenubarItem>Export</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Save</MenubarItem>
            <MenubarItem>Save As</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Publish</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        {/* Home Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium px-4 py-2">Home</MenubarTrigger>
          <MenubarContent align="start">
            <MenubarItem>
              <MousePointer className="mr-2 h-4 w-4" />
              Select
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Layout className="mr-2 h-4 w-4" />
              Layout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Insert Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium px-4 py-2">Insert</MenubarTrigger>
          <MenubarContent align="start" className="w-[480px] grid grid-cols-4 gap-1 p-2">
            {/* Picture */}
            <MenubarItem 
              onClick={() => handleAddElement("image")}
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <Image className="h-8 w-8" />
              <span>Picture</span>
            </MenubarItem>
            
            {/* Shape */}
            <MenubarItem 
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <Square className="h-8 w-8" />
              <span>Shape</span>
            </MenubarItem>
            
            {/* Video */}
            <MenubarItem 
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <Video className="h-8 w-8" />
              <span>Video</span>
            </MenubarItem>
            
            {/* Audio */}
            <MenubarItem 
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <AudioLines className="h-8 w-8" />
              <span>Audio</span>
            </MenubarItem>
            
            {/* Text Box */}
            <MenubarItem 
              onClick={() => handleAddElement("text")}
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <Type className="h-8 w-8" />
              <span>Text Box</span>
            </MenubarItem>
            
            {/* Table */}
            <MenubarItem 
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <Table className="h-8 w-8" />
              <span>Table</span>
            </MenubarItem>
            
            {/* Button */}
            <MenubarItem 
              onClick={() => handleAddElement("button")}
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <Square className="h-8 w-8" />
              <span>Button</span>
            </MenubarItem>
            
            {/* Hotspot */}
            <MenubarItem 
              onClick={() => handleAddElement("hotspot")}
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <MapPin className="h-8 w-8" />
              <span>Hotspot</span>
            </MenubarItem>
            
            {/* Input */}
            <MenubarItem 
              className="flex flex-col items-center justify-center h-20 gap-2 w-full"
            >
              <CheckSquare className="h-8 w-8" />
              <span>Input</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Slides Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium px-4 py-2">Slides</MenubarTrigger>
          <MenubarContent align="start">
            <MenubarItem>
              <LayoutList className="mr-2 h-4 w-4" />
              New Slide
            </MenubarItem>
            <MenubarItem>
              <LayoutList className="mr-2 h-4 w-4" />
              Duplicate Slide
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Design Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium px-4 py-2">Design</MenubarTrigger>
          <MenubarContent align="start">
            <MenubarItem>
              <Palette className="mr-2 h-4 w-4" />
              Themes
            </MenubarItem>
            <MenubarItem>
              <Palette className="mr-2 h-4 w-4" />
              Colors
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Transitions Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium px-4 py-2">Transitions</MenubarTrigger>
          <MenubarContent align="start">
            <MenubarItem>
              <ArrowsUpFromLine className="mr-2 h-4 w-4" />
              Fade
            </MenubarItem>
            <MenubarItem>
              <ArrowsUpFromLine className="mr-2 h-4 w-4" />
              Slide
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Animations Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium px-4 py-2">Animations</MenubarTrigger>
          <MenubarContent align="start">
            <MenubarItem>
              <Play className="mr-2 h-4 w-4" />
              Entrance
            </MenubarItem>
            <MenubarItem>
              <Play className="mr-2 h-4 w-4" />
              Emphasis
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* View Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium px-4 py-2">View</MenubarTrigger>
          <MenubarContent align="start">
            <MenubarItem>
              <Layout className="mr-2 h-4 w-4" />
              Slide View
            </MenubarItem>
            <MenubarItem>
              <PanelLeft className="mr-2 h-4 w-4" />
              Scene View
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Ruler className="mr-2 h-4 w-4" />
              Ruler
            </MenubarItem>
            <MenubarItem>
              <Grid className="mr-2 h-4 w-4" />
              Grid Lines
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
