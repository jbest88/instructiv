import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProject } from '@/contexts/project';
import { createDefaultProject } from '@/utils/defaultSlides';
import { FileIcon, FolderOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { handleSaveProjectToSupabase, handleLoadProjectFromSupabase, userProjects, isLoadingProjects } = useProject();
  
  const handleCreateNewProject = async () => {
    const newProject = createDefaultProject();
    await handleSaveProjectToSupabase(newProject.title);
    navigate('/editor');
  };

  const handleOpenProject = async (projectId: string) => {
    await handleLoadProjectFromSupabase(projectId);
    navigate('/editor');
  };

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Instructiv</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create New Project */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Start with a blank canvas and build your interactive content</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
              <Plus size={48} className="text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateNewProject} className="w-full">
              Create New Project
            </Button>
          </CardFooter>
        </Card>
        
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Open one of your existing projects</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px]">
            {isLoadingProjects ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : userProjects.length > 0 ? (
              <div className="space-y-2">
                {userProjects.map(project => (
                  <Button 
                    key={project.id} 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleOpenProject(project.id)}
                  >
                    <FileIcon className="mr-2 h-4 w-4" />
                    <div className="flex-1 text-left">
                      <div>{project.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No recent projects</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/projects')}>
              Browse All Projects
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
