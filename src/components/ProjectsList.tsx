
import { useState } from "react";
import { useProject } from "@/contexts/project";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { format } from "date-fns";
import { Download, Trash2, PencilLine } from "lucide-react";

interface ProjectsListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectsList({ isOpen, onClose }: ProjectsListProps) {
  const { 
    userProjects, 
    isLoadingProjects, 
    handleLoadProjectFromSupabase, 
    handleSaveProjectToSupabase,
    handleDeleteProjectFromSupabase
  } = useProject();
  
  const { user } = useAuth();
  
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const handleSaveNewProject = async () => {
    if (!newProjectTitle.trim()) return;
    
    setIsSaving(true);
    try {
      await handleSaveProjectToSupabase(newProjectTitle);
      setNewProjectTitle("");
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLoadProject = async (projectId: string) => {
    await handleLoadProjectFromSupabase(projectId);
    onClose();
  };
  
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    await handleDeleteProjectFromSupabase(projectToDelete);
    setProjectToDelete(null);
  };
  
  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              Please sign in to save and load projects from the cloud.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>My Projects</DialogTitle>
            <DialogDescription>
              Save, load, and manage your projects.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="projectTitle" className="text-sm font-medium block mb-1">
                  Save current project
                </label>
                <Input
                  id="projectTitle"
                  placeholder="Enter project title"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveNewProject} disabled={isSaving || !newProjectTitle.trim()}>
                {isSaving ? "Saving..." : "Save Project"}
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Your saved projects</h3>
              
              {isLoadingProjects ? (
                <p className="text-center py-4 text-muted-foreground">Loading projects...</p>
              ) : userProjects.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  You don't have any saved projects yet
                </p>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>{project.title}</TableCell>
                          <TableCell>
                            {format(new Date(project.updated_at), "MMM d, yyyy 'at' h:mm a")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Load project"
                                onClick={() => handleLoadProject(project.id)}
                              >
                                <Download size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title="Delete project"
                                onClick={() => setProjectToDelete(project.id)}
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project.
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
    </>
  );
}
