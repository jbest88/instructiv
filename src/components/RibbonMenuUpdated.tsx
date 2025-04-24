import { usePanels } from "@/contexts/PanelContext";
import { useProject } from "@/contexts/project";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { 
  Menubar, 
  MenubarMenu, 
  MenubarTrigger, 
  MenubarContent, 
  MenubarItem,
  MenubarSeparator
} from "@/components/ui/menubar";
import { FileMenuDropdown } from "./FileMenuDropdown";
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
  Type, Image, Square, Palette, Save, FilePlus, Play,
  FileDown, FileUp, Grid, Layout, Table, List, Cloud
} from "lucide-react";

export function RibbonMenuUpdated() {
  const navigate = useNavigate();
  const { 
    handleAddElement, 
    handleSaveProject, 
    handleLoadProject,
    handleSaveProjectToSupabase
  } = useProject();
  
  const { user } = useAuth();
  const { ribbonOpen } = usePanels();
  
  if (!ribbonOpen) return null;
  
  const handleOpenProjects = () => {
    if (user) {
      navigate('/projects');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="border-b bg-muted/40 p-1">
      <Menubar className="border-none bg-transparent">
        <FileMenuDropdown />
        
        <MenubarMenu>
          <MenubarTrigger>Insert</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => handleAddElement("text")}>
              <Type className="mr-2 h-4 w-4" />
              Text
            </MenubarItem>
            <MenubarItem onClick={() => handleAddElement("image")}>
              <Image className="mr-2 h-4 w-4" />
              Image
            </MenubarItem>
            <MenubarItem onClick={() => handleAddElement("button")}>
              <Square className="mr-2 h-4 w-4" />
              Button
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Bold className="mr-2 h-4 w-4" />
              Bold
            </MenubarItem>
            <MenubarItem>
              <Italic className="mr-2 h-4 w-4" />
              Italic
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <AlignLeft className="mr-2 h-4 w-4" />
              Align Left
            </MenubarItem>
            <MenubarItem>
              <AlignCenter className="mr-2 h-4 w-4" />
              Align Center
            </MenubarItem>
            <MenubarItem>
              <AlignRight className="mr-2 h-4 w-4" />
              Align Right
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
