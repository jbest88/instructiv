
import { useProject } from "@/contexts/project";
import { usePanels } from "@/contexts/PanelContext";
import { Button } from "@/components/ui/button";
import { CircleCheck, X, Workflow } from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function StoryView() {
  const { project, currentScene, handleSelectScene } = useProject();
  const { storyViewOpen, setStoryViewOpen } = usePanels();
  
  if (!storyViewOpen) return null;

  return (
    <div className="border-b p-2 bg-background">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium">Story Structure</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setStoryViewOpen(false)}
          className="h-5 w-5"
        >
          <X size={14} />
        </Button>
      </div>
      
      <NavigationMenu className="max-w-full w-full justify-start">
        <NavigationMenuList className="justify-start space-x-0 overflow-x-auto p-1">
          {project.scenes.map((scene) => (
            <NavigationMenuItem key={scene.id}>
              <Button
                variant={scene.id === currentScene?.id ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "relative group text-sm h-8",
                  scene.id === currentScene?.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground"
                )}
                onClick={() => handleSelectScene(scene.id)}
              >
                {scene.title}
                {scene.id === currentScene?.id && (
                  <CircleCheck className="ml-1 h-3 w-3" />
                )}
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* Scene Workflow button */}
      <div className="mt-2 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center text-xs gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          asChild
        >
          <Link to="/scene-view">
            <Workflow className="h-3.5 w-3.5" />
            Scene Workflow
          </Link>
        </Button>
      </div>
    </div>
  );
}
