
import { 
  Save, 
  FilePlus, 
  FileDown, 
  FileUp, 
  Cloud,
  Upload,
  FileX
} from "lucide-react";
import { useState } from "react";
import { useProject } from "@/contexts/project";
import { ProjectsList } from "@/components/ProjectsList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function FileMenuDropdown() {
  const { 
    handleSaveProject, 
    handleLoadProject,
    handleSaveProjectToSupabase,
    handleExportProject,
    handleImportProject
  } = useProject();
  
  const [isProjectsListOpen, setIsProjectsListOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      await handleImportProject(file);
    } catch (error) {
      console.error("Import error", error);
    } finally {
      setIsImporting(false);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 text-sm">File</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuItem onClick={() => window.location.reload()}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Project
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Import from file */}
          <DropdownMenuItem asChild disabled={isImporting}>
            <label className="flex items-center cursor-pointer">
              <FileDown className="mr-2 h-4 w-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
                disabled={isImporting}
              />
            </label>
          </DropdownMenuItem>
          
          {/* Export to file */}
          <DropdownMenuItem onClick={handleExportProject}>
            <FileUp className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Save local */}
          <DropdownMenuItem onClick={handleSaveProject}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </DropdownMenuItem>
          
          {/* Save As (to cloud) */}
          <DropdownMenuItem onClick={() => handleSaveProjectToSupabase()}>
            <Upload className="mr-2 h-4 w-4" />
            Save As
          </DropdownMenuItem>
          
          {/* Open from local */}
          <DropdownMenuItem onClick={handleLoadProject}>
            <FileDown className="mr-2 h-4 w-4" />
            Open
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Cloud projects */}
          <DropdownMenuItem onClick={() => setIsProjectsListOpen(true)}>
            <Cloud className="mr-2 h-4 w-4" />
            Cloud Projects
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Upload className="mr-2 h-4 w-4" />
            Publish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Cloud Projects Modal */}
      <ProjectsList 
        isOpen={isProjectsListOpen}
        onClose={() => setIsProjectsListOpen(false)}
      />
    </>
  );
}
