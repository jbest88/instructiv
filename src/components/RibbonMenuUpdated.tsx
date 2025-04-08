
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function RibbonMenuUpdated() {
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
    </div>
  );
}
