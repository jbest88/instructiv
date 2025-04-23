import React from "react";
import { SlideElement } from "@/utils/slideTypes";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuHighlightGroup,
} from "@/components/ui/context-menu";
import { 
  Scissors, 
  Copy, 
  ClipboardPaste,
  Group,
  SendToBack,
  Edit,
  Save,
  PaintBucket,
  Ruler,
  Grid3x3,
  Settings2,
  RotateCcw
} from "lucide-react";

interface ElementContextMenuProps {
  element: SlideElement;
  onCut: (id: string) => void;
  onCopy: (id: string) => void;
  onPaste: (id: string) => void;
  onGroup?: () => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onEdit?: (id: string) => void;
  onFormatShape?: (id: string) => void;
  onRename?: (id: string) => void;
  onSetDefaultShape?: (id: string) => void;
  children: React.ReactNode;
}

export const ElementContextMenu: React.FC<ElementContextMenuProps> = ({
  element,
  onCut,
  onCopy,
  onPaste,
  onGroup,
  onBringToFront,
  onSendToBack,
  onEdit,
  onFormatShape,
  onRename,
  onSetDefaultShape,
  children
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* Basic operations */}
        <ContextMenuItem onClick={() => onCut(element.id)}>
          <Scissors className="mr-2 h-4 w-4" />
          Cut
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onCopy(element.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </ContextMenuItem>
        
        {/* Paste Options submenu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ClipboardPaste className="mr-2 h-4 w-4" />
            Paste Options
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => onPaste(element.id)}>
              Paste
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onPaste(element.id)}>
              Paste Format Only
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />
        
        {/* Group operations */}
        {onGroup && (
          <ContextMenuItem onClick={onGroup}>
            <Group className="mr-2 h-4 w-4" />
            Group
          </ContextMenuItem>
        )}
        
        {/* Ordering operations */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <SendToBack className="mr-2 h-4 w-4" />
            Order
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => onBringToFront(element.id)}>
              Bring to Front
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onSendToBack(element.id)}>
              Send to Back
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {/* Element-specific operations */}
        {element.type === 'text' && onEdit && (
          <ContextMenuItem onClick={() => onEdit(element.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Text
          </ContextMenuItem>
        )}
        
        {element.type === 'button' && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              Button Set
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Primary Button</ContextMenuItem>
              <ContextMenuItem>Secondary Button</ContextMenuItem>
              <ContextMenuItem>Text Button</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {onFormatShape && (
          <ContextMenuItem onClick={() => onFormatShape(element.id)}>
            <PaintBucket className="mr-2 h-4 w-4" />
            Format Shape
          </ContextMenuItem>
        )}

        {onRename && (
          <ContextMenuItem onClick={() => onRename(element.id)}>
            Rename "{element.type}"
          </ContextMenuItem>
        )}

        {onSetDefaultShape && (
          <ContextMenuItem onClick={() => onSetDefaultShape(element.id)}>
            Set as Default Shape
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

interface CanvasContextMenuProps {
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onAddGuide?: () => void;
  onToggleRuler?: () => void;
  onToggleGrid?: () => void;
  onReset?: () => void;
  onFormatBackground?: () => void;
  onProperties?: () => void;
  children: React.ReactNode;
}

export const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  onCut,
  onCopy,
  onPaste,
  onAddGuide,
  onToggleRuler,
  onToggleGrid,
  onReset,
  onFormatBackground,
  onProperties,
  children
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={onCut}>
          <Scissors className="mr-2 h-4 w-4" />
          Cut
        </ContextMenuItem>
        <ContextMenuItem onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </ContextMenuItem>
        
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ClipboardPaste className="mr-2 h-4 w-4" />
            Paste Options
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={onPaste}>
              Paste
            </ContextMenuItem>
            <ContextMenuItem>
              Paste Format Only
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onToggleRuler}>
          <Ruler className="mr-2 h-4 w-4" />
          Ruler
        </ContextMenuItem>
        
        <ContextMenuItem onClick={onToggleGrid}>
          <Grid3x3 className="mr-2 h-4 w-4" />
          Grid and Guides...
        </ContextMenuItem>
        
        <ContextMenuItem onClick={onAddGuide}>
          Add new vertical guide line
        </ContextMenuItem>

        <ContextMenuSeparator />
        
        <ContextMenuItem>
          Apply Layout
        </ContextMenuItem>
        
        <ContextMenuItem onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Slide
        </ContextMenuItem>
        
        <ContextMenuItem onClick={onFormatBackground}>
          <PaintBucket className="mr-2 h-4 w-4" />
          Format Background...
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onProperties}>
          <Settings2 className="mr-2 h-4 w-4" />
          Properties...
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
