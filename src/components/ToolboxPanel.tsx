
import React from 'react';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

interface ToolboxPanelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ToolboxPanel({ open, setOpen }: ToolboxPanelProps) {
  if (!open) return null;
  
  return (
    <div className="border-l border-border bg-background w-80 h-full overflow-hidden">
      <div className="p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Toolbox</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setOpen(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Toolbox content */}
          <div className="rounded-md bg-muted p-4">
            <h4 className="text-sm font-medium mb-2">Properties</h4>
            {/* Properties editor goes here */}
            <p className="text-sm text-muted-foreground">Select an element to edit its properties</p>
          </div>
          
          <div className="rounded-md bg-muted p-4">
            <h4 className="text-sm font-medium mb-2">Styles</h4>
            {/* Styles editor goes here */}
            <p className="text-sm text-muted-foreground">Select an element to edit its styles</p>
          </div>
          
          <div className="rounded-md bg-muted p-4">
            <h4 className="text-sm font-medium mb-2">Animations</h4>
            {/* Animation controls go here */}
            <p className="text-sm text-muted-foreground">Select an element to edit its animations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
