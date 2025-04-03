
import { usePanels } from "@/contexts/PanelContext";
import { useProject } from "@/contexts/ProjectContext";
import { 
  Menubar, 
  MenubarMenu, 
  MenubarTrigger, 
  MenubarContent, 
  MenubarItem,
  MenubarSeparator
} from "@/components/ui/menubar";
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
  Type, Image, Square, Palette, Save, FilePlus, Play,
  FileDown, FileUp, Grid, Layout, Table, List, Cloud
} from "lucide-react";
import { ProjectsList } from "@/components/ProjectsList";
import { useState } from "react";

export function RibbonMenu() {
  const { 
    handleAddElement, 
    handleSaveProject, 
    handleLoadProject,
    handleSaveProjectToSupabase
  } = useProject();
  
  const { ribbonOpen } = usePanels();
  const [isProjectsListOpen, setIsProjectsListOpen] = useState(false);
  
  if (!ribbonOpen) return null;
  
  return (
    <div className="border-b bg-muted/40 p-1">
      <Menubar className="border-none bg-transparent">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => window.location.reload()}>
              <FilePlus className="mr-2 h-4 w-4" />
              New Project
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleSaveProject}>
              <Save className="mr-2 h-4 w-4" />
              Save Local
            </MenubarItem>
            <MenubarItem onClick={handleLoadProject}>
              <FileDown className="mr-2 h-4 w-4" />
              Load Local
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleSaveProjectToSupabase()}>
              <FileUp className="mr-2 h-4 w-4" />
              Save to Cloud
            </MenubarItem>
            <MenubarItem onClick={() => setIsProjectsListOpen(true)}>
              <Cloud className="mr-2 h-4 w-4" />
              Cloud Projects
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
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
            <MenubarItem onClick={() => handleAddElement("hotspot")}>
              <Palette className="mr-2 h-4 w-4" />
              Hotspot
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
        
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Grid className="mr-2 h-4 w-4" />
              Grid
            </MenubarItem>
            <MenubarItem>
              <Layout className="mr-2 h-4 w-4" />
              Layouts
            </MenubarItem>
            <MenubarItem>
              <Table className="mr-2 h-4 w-4" />
              Tables
            </MenubarItem>
            <MenubarItem>
              <List className="mr-2 h-4 w-4" />
              Lists
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Cloud Projects Modal */}
      <ProjectsList 
        isOpen={isProjectsListOpen}
        onClose={() => setIsProjectsListOpen(false)}
      />
    </div>
  );
}
