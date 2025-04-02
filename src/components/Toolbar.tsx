
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsList } from "@/components/ProjectsList";
import { Save, Upload, Eye, X, User, LogOut, Cloud, Database } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ToolbarProps {
  onPreview: () => void;
}

export function Toolbar({ onPreview }: ToolbarProps) {
  const { 
    openSlides, 
    currentSlide, 
    handleSelectSlide, 
    handleCloseSlide,
    handleSaveProject, 
    handleLoadProject 
  } = useProject();

  const { user, signOut } = useAuth();
  const [isProjectsListOpen, setIsProjectsListOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 border-b p-2">
      <div className="flex items-center">
        <span className="font-semibold text-lg mr-4">Narratify</span>
        
        <div className="space-x-1">
          <Button variant="outline" size="sm" onClick={handleSaveProject} title="Save to browser storage">
            <Database className="h-4 w-4 mr-1" />
            Save Local
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadProject} title="Load from browser storage">
            <Upload className="h-4 w-4 mr-1" />
            Load Local
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsProjectsListOpen(true)} title="Cloud projects">
            <Cloud className="h-4 w-4 mr-1" />
            Cloud Projects
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        {openSlides.length > 0 && (
          <Tabs 
            value={currentSlide?.id} 
            onValueChange={handleSelectSlide}
            className="w-auto"
          >
            <TabsList className="bg-background">
              {openSlides.map(slide => (
                <TabsTrigger 
                  key={slide.id} 
                  value={slide.id}
                  className="flex items-center px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative"
                >
                  {slide.title}
                  <button
                    className="ml-2 opacity-50 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseSlide(slide.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button onClick={onPreview}>
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="sm" asChild>
            <a href="/auth">Sign In</a>
          </Button>
        )}
      </div>
      
      <ProjectsList 
        isOpen={isProjectsListOpen}
        onClose={() => setIsProjectsListOpen(false)}
      />
    </div>
  );
}
