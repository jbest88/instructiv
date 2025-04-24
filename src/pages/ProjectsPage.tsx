
import React, { useEffect } from 'react';
import { useProject } from '@/contexts/project';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Download, ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { 
    userProjects, 
    isLoadingProjects, 
    handleLoadProjectFromSupabase, 
    handleDeleteProjectFromSupabase 
  } = useProject();
  
  const { user } = useAuth();
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null);
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  const handleLoadProject = async (projectId: string) => {
    await handleLoadProjectFromSupabase(projectId);
    navigate('/');
  };
  
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    await handleDeleteProjectFromSupabase(projectToDelete);
    setProjectToDelete(null);
  };
  
  if (!user) {
    return null; // Return null during redirect
  }
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
          <CardDescription>
            Manage your saved projects
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoadingProjects ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading your projects...</p>
            </div>
          ) : userProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have any saved projects yet</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate('/')}
              >
                Create New Project
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProjects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{format(new Date(project.updated_at), "MMM d, yyyy 'at' h:mm a")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Open project" 
                          onClick={() => handleLoadProject(project.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Delete project"
                          className="text-destructive"
                          onClick={() => setProjectToDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowUp className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
