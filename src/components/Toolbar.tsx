
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, X, User, LogOut } from "lucide-react";
import { useProject } from "@/contexts/project";
import { usePanels } from "@/contexts/PanelContext";
import { RibbonMenuUpdated } from "./RibbonMenuUpdated";
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
  } = useProject();

  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col border-b">
      {/* Ribbon menu at the top */}
      <RibbonMenuUpdated />
      
      {/* Main toolbar content */}
      <div className="flex items-center justify-between gap-4 p-2">
        <div className="flex items-center">
          <span className="font-semibold text-lg mr-4">Instructiv</span>
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
      </div>
    </div>
  );
}
