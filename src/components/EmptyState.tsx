import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProject } from "@/contexts/project";

export function EmptyState() {
  const { handleAddScene } = useProject();
  
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md p-8 rounded-lg">
        <h1 className="text-2xl font-bold">Welcome to Instructiv</h1>
        <p className="text-muted-foreground">
          No scenes have been created yet. Create your first scene to get started.
        </p>
        <Button 
          size="lg" 
          className="mt-4"
          onClick={handleAddScene}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Scene
        </Button>
      </div>
    </div>
  );
}

