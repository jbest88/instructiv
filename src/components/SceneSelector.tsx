
import { Plus, Trash2 } from "lucide-react";
import { Scene } from "@/utils/slideTypes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SceneSelectorProps {
  scenes: Scene[];
  currentSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAddScene: () => void;
  onDeleteScene: (sceneId: string) => void;
}

export function SceneSelector({
  scenes,
  currentSceneId,
  onSelectScene,
  onAddScene,
  onDeleteScene
}: SceneSelectorProps) {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  
  // Sort scenes by order
  const sortedScenes = [...scenes].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full h-20 bg-card flex items-center gap-2 px-4 overflow-x-auto border-b">
      {sortedScenes.map((scene) => (
        <div
          key={scene.id}
          className={cn(
            "scene-item flex-shrink-0 h-14 w-32 rounded-md border relative",
            currentSceneId === scene.id && "ring-2 ring-primary"
          )}
          onClick={() => onSelectScene(scene.id)}
          onMouseEnter={() => setIsHovering(scene.id)}
          onMouseLeave={() => setIsHovering(null)}
        >
          <div className="absolute inset-0 p-2 flex flex-col">
            <div className="text-xs font-medium truncate">{scene.title}</div>
            <div className="text-[10px] text-muted-foreground">{scene.slides.length} Slides</div>
          </div>
          
          {/* Delete button overlay - only show when hovering and more than 1 scene */}
          {isHovering === scene.id && scenes.length > 1 && (
            <button 
              className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-red-100 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteScene(scene.id);
              }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-14 flex-shrink-0"
        onClick={onAddScene}
      >
        <Plus size={16} className="mr-1" />
        Add Scene
      </Button>
    </div>
  );
}
