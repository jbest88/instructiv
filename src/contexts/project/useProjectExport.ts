
import { useState } from "react";
import { toast } from "sonner";
import { Project } from "@/utils/slideTypes";

interface CanvasSize {
  width: number;
  height: number;
}

export function useProjectExport(
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>,
  canvasSize: CanvasSize,
  setCanvasSize: React.Dispatch<React.SetStateAction<CanvasSize>>,
  setOpenSlides: React.Dispatch<React.SetStateAction<{ id: string; title: string }[]>>
) {
  // Save project to localStorage
  const handleSaveProject = () => {
    try {
      const projectData = JSON.stringify({
        project,
        canvasSize
      });
      localStorage.setItem('narratifyProject', projectData);
      toast.success("Project saved to browser storage");
    } catch (error) {
      toast.error("Failed to save project");
      console.error("Save error:", error);
    }
  };
  
  // Load project from localStorage
  const handleLoadProject = () => {
    try {
      const savedData = localStorage.getItem('narratifyProject');
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setProject(parsed.project);
        if (parsed.canvasSize) {
          setCanvasSize(parsed.canvasSize);
        }
        setOpenSlides([]);
        toast.success("Project loaded from browser storage");
      } else {
        toast.info("No saved project found in browser storage");
      }
    } catch (error) {
      toast.error("Failed to load project");
      console.error("Load error:", error);
    }
  };
  
  // Export project to a file
  const handleExportProject = () => {
    try {
      const projectData = JSON.stringify({
        project,
        canvasSize,
        version: '1.0'
      }, null, 2);
      
      const blob = new Blob([projectData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title || 'narratify-project'}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Project exported successfully");
    } catch (error) {
      toast.error("Failed to export project");
      console.error("Export error:", error);
    }
  };
  
  // Import project from a file
  const handleImportProject = async (file: File): Promise<void> => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            if (!e.target?.result) {
              toast.error("Failed to read file");
              reject(new Error("Failed to read file"));
              return;
            }
            
            const content = e.target.result as string;
            const parsed = JSON.parse(content);
            
            // Basic validation
            if (!parsed.project || !parsed.project.id || !parsed.project.scenes) {
              toast.error("Invalid project file format");
              reject(new Error("Invalid project file format"));
              return;
            }
            
            setProject(parsed.project);
            
            if (parsed.canvasSize) {
              setCanvasSize(parsed.canvasSize);
            }
            
            setOpenSlides([]);
            toast.success("Project imported successfully");
            resolve();
          } catch (parseError) {
            toast.error("Failed to parse project file");
            console.error("Import parse error:", parseError);
            reject(parseError);
          }
        };
        
        reader.onerror = (error) => {
          toast.error("Error reading file");
          console.error("Import read error:", error);
          reject(error);
        };
        
        reader.readAsText(file);
      });
    } catch (error) {
      toast.error("Failed to import project");
      console.error("Import error:", error);
      throw error;
    }
  };

  return {
    handleSaveProject,
    handleLoadProject,
    handleExportProject,
    handleImportProject
  };
}
