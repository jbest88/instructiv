
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/utils/slideTypes";
import { useAuth } from "@/contexts/AuthContext";

export function useSupabaseProjects(
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>,
  setOpenSlides: React.Dispatch<React.SetStateAction<{ id: string; title: string }[]>>
) {
  const [userProjects, setUserProjects] = useState<{ id: string; title: string; updated_at: string }[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const { user } = useAuth();
  
  // Fetch user's projects when authenticated
  useEffect(() => {
    if (user) {
      fetchUserProjects();
    } else {
      setUserProjects([]);
    }
  }, [user]);
  
  const fetchUserProjects = async () => {
    if (!user) return;
    
    setIsLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      setUserProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast.error(`Failed to load projects: ${error.message}`);
    } finally {
      setIsLoadingProjects(false);
    }
  };
  
  // Function to save project to Supabase
  const handleSaveProjectToSupabase = async (title?: string) => {
    if (!user) {
      toast.error("Please sign in to save your project");
      return;
    }
    
    try {
      const projectToSave = {
        ...project,
        title: title || project.title
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: projectToSave.title,
          data: projectToSave as any
        })
        .select();
        
      if (error) throw error;
      
      toast.success(`Project "${projectToSave.title}" saved successfully!`);
      await fetchUserProjects();
      return;
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error(`Failed to save project: ${error.message}`);
    }
  };
  
  // Function to load project from Supabase
  const handleLoadProjectFromSupabase = async (projectId: string) => {
    if (!user) {
      toast.error("Please sign in to load projects");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('data')
        .eq('id', projectId)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error("Project not found");
      
      // Properly cast the data to Project type
      const projectData = data.data as unknown as Project;
      
      // Validate that the data has the required Project properties
      if (!projectData || 
          !projectData.id || 
          !projectData.title || 
          !Array.isArray(projectData.scenes) || 
          !projectData.currentSceneId || 
          !projectData.currentSlideId) {
        throw new Error("Invalid project data format");
      }
      
      setProject(projectData);
      setOpenSlides([]);
      toast.success("Project loaded successfully!");
    } catch (error: any) {
      console.error("Error loading project:", error);
      toast.error(`Failed to load project: ${error.message}`);
    }
  };
  
  // Function to delete project from Supabase
  const handleDeleteProjectFromSupabase = async (projectId: string) => {
    if (!user) {
      toast.error("Please sign in to delete projects");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) throw error;
      
      await fetchUserProjects();
      toast.success("Project deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };

  return {
    userProjects,
    isLoadingProjects,
    handleSaveProjectToSupabase,
    handleLoadProjectFromSupabase,
    handleDeleteProjectFromSupabase
  };
}
