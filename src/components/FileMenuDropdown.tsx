
import { 
  Save, 
  FilePlus, 
  FileDown, 
  FileUp, 
  Cloud,
  Upload,
  FileX
} from "lucide-react";
import { useState, useRef } from "react";
import { useProject } from "@/contexts/project";
import { ProjectsList } from "@/components/ProjectsList";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FileMenuDropdown() {
  const { 
    handleSaveProject, 
    handleLoadProject,
    handleSaveProjectToSupabase,
    handleExportProject,
    handleImportProject
  } = useProject();
  
  const { user } = useAuth();
  const [isProjectsListOpen, setIsProjectsListOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      await handleImportProject(file);
      toast.success("Project imported successfully");
    } catch (error) {
      console.error("Import error", error);
      toast.error("Failed to import project");
    } finally {
      setIsImporting(false);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleSaveToCloud = async () => {
    try {
      if (!user) {
        toast.error("Please sign in to save to cloud");
        return;
      }
      await handleSaveProjectToSupabase();
      toast.success("Project saved to cloud");
    } catch (error) {
      console.error("Error saving to cloud:", error);
      toast.error("Failed to save to cloud");
    }
  };

  const handleSaveLocalProject = () => {
    try {
      handleSaveProject();
      toast.success("Project saved locally");
    } catch (error) {
      console.error("Error saving locally:", error);
      toast.error("Failed to save locally");
    }
  };

  const handleLoadLocalProject = () => {
    try {
      handleLoadProject();
    } catch (error) {
      console.error("Error loading project:", error);
      toast.error("Failed to load project");
    }
  };

  const handleExport = () => {
    try {
      handleExportProject();
      toast.success("Project exported successfully");
    } catch (error) {
      console.error("Error exporting project:", error);
      toast.error("Failed to export project");
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
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
                disabled={isImporting}
              />
            </label>
          </DropdownMenuItem>
          
          {/* Export to file */}
          <DropdownMenuItem onClick={handleExport}>
            <FileUp className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Save local */}
          <DropdownMenuItem onClick={handleSaveLocalProject}>
            <Save className="mr-2 h-4 w-4" />
            Save Local
          </DropdownMenuItem>
          
          {/* Save As (to cloud) */}
          {user && (
            <DropdownMenuItem onClick={handleSaveToCloud}>
              <Upload className="mr-2 h-4 w-4" />
              Save to Cloud
            </DropdownMenuItem>
          )}
          
          {/* Open from local */}
          <DropdownMenuItem onClick={handleLoadLocalProject}>
            <FileDown className="mr-2 h-4 w-4" />
            Open Local
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Cloud projects */}
          <DropdownMenuItem 
            onClick={() => setIsProjectsListOpen(true)}
            disabled={!user}
            className={!user ? "opacity-50 cursor-not-allowed" : ""}
          >
            <Cloud className="mr-2 h-4 w-4" />
            {user ? "Cloud Projects" : "Sign in for Cloud Projects"}
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
