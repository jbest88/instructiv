
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
      <Menubar>
        {/* this will now show New / Import / Export / Save Local / Open Local / Save to Cloud / Open from Cloud */}
        <FileMenuDropdown>
          {/* optionally your extra items here */}
        </FileMenuDropdown>
        {/* …rest of your Home/Insert/Slides buttons… */}
      </Menubar>
    );
  }
