import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
import { RibbonMenuAccordion } from "./RibbonMenuAccordion";

export function RibbonMenuUpdated() {
  const { handleAddElement } = useProject();
  
  return (
    <div className="border-b bg-background">
      <div className="flex items-center">
        {/* File Menu - Keep as dropdown */}
        <Menubar className="border-0 rounded-none h-auto">
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
        </Menubar>
        
        {/* Home Menu - As accordion */}
        <div className="h-10 flex items-center">
          <RibbonMenuAccordion title="Home">
            <div className="w-52 p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <MousePointer className="h-4 w-4" />
                <span>Select</span>
              </div>
              <div className="h-px bg-muted my-1" />
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <Layout className="h-4 w-4" />
                <span>Layout</span>
              </div>
            </div>
          </RibbonMenuAccordion>
        </div>

        {/* Insert Menu - As accordion */}
        <div className="h-10 flex items-center">
          <RibbonMenuAccordion title="Insert">
            <div className="w-[480px] grid grid-cols-4 gap-1 p-2">
              {/* Picture */}
              <div 
                onClick={() => handleAddElement("image")}
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <Image className="h-8 w-8" />
                <span>Picture</span>
              </div>
              
              {/* Shape */}
              <div 
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <Square className="h-8 w-8" />
                <span>Shape</span>
              </div>
              
              {/* Video */}
              <div 
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <Video className="h-8 w-8" />
                <span>Video</span>
              </div>
              
              {/* Audio */}
              <div 
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <AudioLines className="h-8 w-8" />
                <span>Audio</span>
              </div>
              
              {/* Text Box */}
              <div 
                onClick={() => handleAddElement("text")}
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <Type className="h-8 w-8" />
                <span>Text Box</span>
              </div>
              
              {/* Table */}
              <div 
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <Table className="h-8 w-8" />
                <span>Table</span>
              </div>
              
              {/* Button */}
              <div 
                onClick={() => handleAddElement("button")}
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <Square className="h-8 w-8" />
                <span>Button</span>
              </div>
              
              {/* Hotspot */}
              <div 
                onClick={() => handleAddElement("hotspot")}
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <MapPin className="h-8 w-8" />
                <span>Hotspot</span>
              </div>
              
              {/* Input */}
              <div 
                className="flex flex-col items-center justify-center h-20 gap-2 w-full cursor-pointer hover:bg-accent rounded-sm p-2"
              >
                <CheckSquare className="h-8 w-8" />
                <span>Input</span>
              </div>
            </div>
          </RibbonMenuAccordion>
        </div>

        {/* Slides Menu - As accordion */}
        <div className="h-10 flex items-center">
          <RibbonMenuAccordion title="Slides">
            <div className="w-52 p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <LayoutList className="h-4 w-4" />
                <span>New Slide</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <LayoutList className="h-4 w-4" />
                <span>Duplicate Slide</span>
              </div>
            </div>
          </RibbonMenuAccordion>
        </div>

        {/* Design Menu - As accordion */}
        <div className="h-10 flex items-center">
          <RibbonMenuAccordion title="Design">
            <div className="w-52 p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <Palette className="h-4 w-4" />
                <span>Themes</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <Palette className="h-4 w-4" />
                <span>Colors</span>
              </div>
            </div>
          </RibbonMenuAccordion>
        </div>

        {/* Transitions Menu - As accordion */}
        <div className="h-10 flex items-center">
          <RibbonMenuAccordion title="Transitions">
            <div className="w-52 p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <ArrowsUpFromLine className="h-4 w-4" />
                <span>Fade</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <ArrowsUpFromLine className="h-4 w-4" />
                <span>Slide</span>
              </div>
            </div>
          </RibbonMenuAccordion>
        </div>

        {/* Animations Menu - As accordion */}
        <div className="h-10 flex items-center">
          <RibbonMenuAccordion title="Animations">
            <div className="w-52 p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <Play className="h-4 w-4" />
                <span>Entrance</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <Play className="h-4 w-4" />
                <span>Emphasis</span>
              </div>
            </div>
          </RibbonMenuAccordion>
        </div>

        {/* View Menu - As accordion */}
        <div className="h-10 flex items-center">
          <RibbonMenuAccordion title="View">
            <div className="w-52 p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <Layout className="h-4 w-4" />
                <span>Slide View</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <PanelLeft className="h-4 w-4" />
                <span>Scene View</span>
              </div>
              <div className="h-px bg-muted my-1" />
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <Ruler className="h-4 w-4" />
                <span>Ruler</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer">
                <Grid className="h-4 w-4" />
                <span>Grid Lines</span>
              </div>
            </div>
          </RibbonMenuAccordion>
        </div>
      </div>
    </div>
  );
}
