
import { useState } from "react";
import { useProject } from "@/contexts/project";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { createDefaultProject } from "@/utils/defaultSlides";

export function WelcomeScreen() {
  const { 
    setProject, 
    userProjects, 
    isLoadingProjects,
    handleLoadProjectFromSupabase,
    handleSaveProjectToSupabase
  } = useProject();
  
  const { user, signOut } = useAuth();
  const [newProjectTitle, setNewProjectTitle] = useState("My New Project");
  const [creating, setCreating] = useState(false);
  
  const handleCreateNewProject = async () => {
    setCreating(true);
    const newProject = createDefaultProject();
    newProject.title = newProjectTitle;
    
    try {
      // First set the project to update the local state
      setProject(newProject);
      
      // Then save it to Supabase if the user is logged in
      if (user) {
        await handleSaveProjectToSupabase(newProjectTitle);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setCreating(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome to Instructive</CardTitle>
              <CardDescription>
                {user ? `Signed in as ${user.email}` : "Create and manage your projects"}
              </CardDescription>
            </div>
            {user && (
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Create new project */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Create a new project</h3>
            <div className="flex gap-2">
              <Input 
                value={newProjectTitle} 
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Project title"
                className="max-w-sm"
              />
              <Button 
                onClick={handleCreateNewProject}
                disabled={creating || !newProjectTitle.trim()}
              >
                {creating ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </div>
          
          {/* Recent projects */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recent projects</h3>
            {isLoadingProjects ? (
              <p className="text-muted-foreground">Loading your projects...</p>
            ) : userProjects.length === 0 ? (
              <p className="text-muted-foreground">You don't have any saved projects yet</p>
            ) : (
              <div className="grid gap-2">
                {userProjects.map(project => (
                  <div 
                    key={project.id} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 cursor-pointer"
                    onClick={() => handleLoadProjectFromSupabase(project.id)}
                  >
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {format(new Date(project.updated_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Build interactive presentations and learning materials with Instructive
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
