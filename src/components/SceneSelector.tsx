
import { useProject } from "@/contexts/project";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, Plus, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function SceneSelector() {
  const { 
    project, 
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
                onDoubleClick={(e) => handleEditStart(scene.id, scene.title, e)}
              >
                {editingSceneId === scene.id ? (
                  <div className="flex items-center" onClick={e => e.stopPropagation()}>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-6 py-0 px-1 text-xs min-w-24"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(scene.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <Button 
                      size="icon"
                      variant="ghost" 
                      className="h-5 w-5 ml-1" 
                      onClick={() => handleSaveEdit(scene.id)}
                    >
                      <Check size={12} />
                    </Button>
                    <Button 
                      size="icon"
                      variant="ghost" 
                      className="h-5 w-5" 
                      onClick={handleCancelEdit}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  scene.title
                )}
                
                {/* Delete button - only show when hovering and more than 1 scene */}
                {isHovering === scene.id && project.scenes.length > 1 && !editingSceneId && (
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
