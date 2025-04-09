
import { useProject } from "@/contexts/project";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, Plus, Trash2, Check, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SceneSelector() {
  const { 
    project, 
    currentScene,
    handleSelectScene, 
    handleAddScene, 
    handleDeleteScene, 
    handleUpdateScene
  } = useProject();
  
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleEditStart = (sceneId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSceneId(sceneId);
    setEditTitle(title);
  };

  const handleSaveEdit = (sceneId: string) => {
    handleUpdateScene({ id: sceneId, title: editTitle });
    setEditingSceneId(null);
  };

  const handleCancelEdit = () => {
    setEditingSceneId(null);
  };

  // Don't render if collapsed
  if (collapsed) {
    return (
      <div className="flex items-center border-b border-border py-1 px-2 h-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={() => setCollapsed(false)}
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b border-border py-2 px-4 h-12 bg-background">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 h-6 w-6" 
          onClick={() => setCollapsed(true)}
        >
          <ChevronsLeft size={16} />
        </Button>
        
        {/* Scene dropdown selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center justify-between min-w-[200px]"
            >
              {currentScene?.title || "Select Scene"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {project.scenes.map(scene => (
              <DropdownMenuItem 
                key={scene.id}
                className="flex items-center justify-between"
                onSelect={() => handleSelectScene(scene.id)}
              >
                {scene.title}
                {scene.id === project.currentSceneId && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddScene}
      >
        <Plus size={16} className="mr-1" />
        New Scene
      </Button>
    </div>
  );
}
