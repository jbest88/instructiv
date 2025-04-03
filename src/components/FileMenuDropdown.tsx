
import React, { useState, useRef } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectsList } from "@/components/ProjectsList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Save, FolderOpen, Upload, Download, FileJson, Cloud } from "lucide-react";

export function FileMenuDropdown() {
  const { 
    handleSaveProject, 
    handleLoadProject, 
    handleExportProject, 
    handleImportProject,
    handleSaveProjectToSupabase,
    project
  } = useProject();
  
  const { user } = useAuth();
  
  const [isCloudProjectsOpen, setIsCloudProjectsOpen] = useState(false);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // File input ref for importing projects
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      await handleImportProject(files[0]);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleSaveToCloud = async () => {
    if (!user) {
      setIsSaveAsOpen(true);
      return;
    }
    
    try {
      setIsSaving(true);
      await handleSaveProjectToSupabase();
    } catch (error) {
      console.error("Failed to save to cloud:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveAsToCloud = async () => {
    if (!projectTitle.trim()) return;
    
    try {
      setIsSaving(true);
      await handleSaveProjectToSupabase(projectTitle);
      setIsSaveAsOpen(false);
      setProjectTitle("");
    } catch (error) {
      console.error("Failed to save to cloud:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">File</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={handleSaveProject}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLoadProject}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Load
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportProject}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json"
              style={{ display: "none" }}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCloudProjectsOpen(true)}>
            <Cloud className="mr-2 h-4 w-4" />
            Cloud Projects
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Cloud Projects Dialog */}
      <ProjectsList 
        isOpen={isCloudProjectsOpen} 
        onClose={() => setIsCloudProjectsOpen(false)}
      />
      
      {/* Save As Dialog */}
      <Dialog open={isSaveAsOpen} onOpenChange={setIsSaveAsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
            <DialogDescription>
              {user ? 
                "Enter a title for your project" : 
                "You need to sign in to save projects to the cloud"}
            </DialogDescription>
          </DialogHeader>
          
          {user ? (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="projectTitle" className="text-sm font-medium">
                    Project Title
                  </label>
                  <Input
                    id="projectTitle"
                    placeholder={project.title || "My Project"}
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSaveAsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAsToCloud} disabled={isSaving || !projectTitle.trim()}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSaveAsOpen(false)}>
                Cancel
              </Button>
              <Button asChild>
                <a href="/auth">Sign In</a>
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
