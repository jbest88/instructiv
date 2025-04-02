
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SceneSelector() {
  const { 
    project, 
    handleSelectScene, 
    handleAddScene, 
    handleDeleteScene 
  } = useProject();
  
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex items-center border-b border-border py-1 px-2 transition-all duration-200",
      collapsed ? "h-8" : "h-12"
    )}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-1 h-6 w-6" 
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
      </Button>
      
      {!collapsed && (
        <>
          <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide space-x-1 pr-2">
            {project.scenes.map((scene) => (
              <div
                key={scene.id}
                className={cn(
                  "relative group px-3 py-1 rounded text-sm font-medium cursor-pointer transition-colors hover:bg-accent",
                  scene.id === project.currentSceneId ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
                onClick={() => handleSelectScene(scene.id)}
                onMouseEnter={() => setIsHovering(scene.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                {scene.title}
                
                {/* Delete button - only show when hovering and more than 1 scene */}
                {isHovering === scene.id && project.scenes.length > 1 && (
                  <button
                    className="absolute -right-1 -top-1 h-4 w-4 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScene(scene.id);
                    }}
                  >
                    <Trash2 size={10} className="h-3 w-3 mx-auto" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 shrink-0"
            onClick={handleAddScene}
          >
            <Plus size={16} className="mr-1" />
            New Scene
          </Button>
        </>
      )}
    </div>
  );
}
