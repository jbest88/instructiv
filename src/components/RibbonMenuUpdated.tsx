
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileMenuDropdown } from "@/components/FileMenuDropdown";
import { 
  Type,
  Image,
  Square,
  MousePointer,
  Layout,
  Palette,
  Video,
  AudioLines,
  Table,
  MapPin,
  CheckSquare,
  LayoutList,
  Grid,
  Ruler,
  Play,
  ArrowsUpFromLine
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useProject } from "@/contexts/project";

export function RibbonMenuUpdated() {
  const { handleAddElement } = useProject();
  
  return (
    <div className="p-1 border-b bg-white">
      <div className="flex items-center space-x-1">
        <div className="flex items-center flex-wrap">
          <FileMenuDropdown />
          
          <Tabs defaultValue="home" className="w-full">
            <TabsList>
              <TabsTrigger value="home">Home</TabsTrigger>
              
              <TabsTrigger value="insert" className="relative">
                Insert
              </TabsTrigger>
              
              <TabsTrigger value="design">Design</TabsTrigger>
              
              <TabsTrigger value="transitions">Transitions</TabsTrigger>
              
              <TabsTrigger value="animations">Animations</TabsTrigger>
              
              <TabsTrigger value="view">View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Insert Menu Dropdown */}
      <div className="py-1 flex flex-wrap gap-2">
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Image size={16} />
                    <span>Picture</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Insert Picture</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleAddElement("image")}>
                From Computer
              </DropdownMenuItem>
              <DropdownMenuItem>From URL</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleAddElement("text")}>
                <Type size={16} />
                <span>Text Box</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Text Box</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Square size={16} />
                    <span>Shape</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Insert Shape</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem>Rectangle</DropdownMenuItem>
              <DropdownMenuItem>Circle</DropdownMenuItem>
              <DropdownMenuItem>Triangle</DropdownMenuItem>
              <DropdownMenuItem>Line</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Video size={16} />
                <span>Video</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Video</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <AudioLines size={16} />
                <span>Audio</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Audio</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Table size={16} />
                <span>Table</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Table</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleAddElement("button")}>
                <Square size={16} />
                <span>Button</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Button</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleAddElement("hotspot")}>
                <MapPin size={16} />
                <span>Hotspot</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Hotspot</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <CheckSquare size={16} />
                    <span>Input</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Insert Input</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem>Checkbox</DropdownMenuItem>
              <DropdownMenuItem>Radio Button</DropdownMenuItem>
              <DropdownMenuItem>Text Field</DropdownMenuItem>
              <DropdownMenuItem>Dropdown</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
        
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <LayoutList size={16} />
                    <span>Slides</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Slide Options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem>New Slide</DropdownMenuItem>
              <DropdownMenuItem>Duplicate Slide</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete Slide</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
      
      {/* View Menu Options */}
      <div className="py-1 flex flex-wrap gap-2">
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Layout size={16} />
                    <span>View</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>View Options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <LayoutList className="mr-2 h-4 w-4" />
                Slide View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Layout className="mr-2 h-4 w-4" />
                Scene View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Ruler className="mr-2 h-4 w-4" />
                Ruler
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Grid className="mr-2 h-4 w-4" />
                Grid Lines
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
        
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Palette size={16} />
                    <span>Design</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Design Options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>Colors</DropdownMenuItem>
              <DropdownMenuItem>Fonts</DropdownMenuItem>
              <DropdownMenuItem>Backgrounds</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
        
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ArrowsUpFromLine size={16} />
                    <span>Transitions</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Transition Options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem>Fade</DropdownMenuItem>
              <DropdownMenuItem>Slide</DropdownMenuItem>
              <DropdownMenuItem>Push</DropdownMenuItem>
              <DropdownMenuItem>Wipe</DropdownMenuItem>
              <DropdownMenuItem>Split</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
        
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Play size={16} />
                    <span>Animations</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Animation Options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem>Entrance</DropdownMenuItem>
              <DropdownMenuItem>Emphasis</DropdownMenuItem>
              <DropdownMenuItem>Exit</DropdownMenuItem>
              <DropdownMenuItem>Motion Paths</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Animation Pane</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </div>
  );
}
