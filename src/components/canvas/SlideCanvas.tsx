import React, { useRef } from "react";
import { SlideElement } from "@/utils/slideTypes";
import { Slide } from "@/utils/slideTypes";
import { SlideElementComponent } from "./SlideElement";
import { useElementInteraction } from "./hooks/useElementInteraction";
import { useTextEditing } from "./hooks/useTextEditing";
import { useContextMenuState } from "./hooks/useContextMenuState";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { CanvasContextMenu } from "./ContextMenus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SlideCanvasProps {
  slide: Slide;
  selectedElementId: string | null;
  zoom: number;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
  onDeleteElement: (id: string) => void;
}

export function SlideCanvas({
  slide,
  selectedElementId,
  zoom,
  onSelectElement,
  onUpdateElement,
  onDeleteElement
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastEditedIdRef = useRef<string | null>(null);

  const {
    editingElementId,
    setEditingElementId,
    editableInputRef,
    finishEditing
  } = useTextEditing(onUpdateElement);

  const {
    contextMenuElement,
    setContextMenuElement,
    elementToDelete,
    setElementToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isFontPopoverOpen,
    setIsFontPopoverOpen,
    isParagraphPopoverOpen,
    setIsParagraphPopoverOpen,
    isHyperlinkPopoverOpen,
    setIsHyperlinkPopoverOpen
  } = useContextMenuState();

  const {
    startDrag,
    startPan,
    isPanning,
    panStart,
    setPanStart
  } = useElementInteraction({
    selectedElementId,
    zoom,
    onUpdateElement,
    elements: slide.elements
  });

  useKeyboardShortcuts({
    selectedElementId,
    selectedElement: selectedElementId ? slide.elements.find(el => el.id === selectedElementId) : null,
    editingElementId,
    onUpdateElement,
    setElementToDelete,
    setIsDeleteDialogOpen,
    setEditingElementId,
    finishEditing
  });

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    // Prevent default context menu
    e.preventDefault();
  };

  // Implement canvas context menu handlers
  const handleCanvasCut = () => {
    console.log('Canvas cut');
  };

  const handleCanvasCopy = () => {
    console.log('Canvas copy');
  };

  const handleCanvasPaste = () => {
    console.log('Canvas paste');
  };

  const handleToggleRuler = () => {
    console.log('Toggle ruler');
  };

  const handleToggleGrid = () => {
    console.log('Toggle grid');
  };

  const handleAddGuide = () => {
    console.log('Add guide');
  };

  const handleResetSlide = () => {
    console.log('Reset slide');
  };

  const handleFormatBackground = () => {
    console.log('Format background');
  };

  const handleProperties = () => {
    console.log('Open properties');
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startPan(e);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  const handleElementSelect = (elementId: string) => {
    onSelectElement(elementId);
  };

  const handleElementRightClick = (e: React.MouseEvent<HTMLDivElement>, element: SlideElement) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuElement(element);
    onSelectElement(element.id);
  };

  const handleElementDoubleClick = (e: React.MouseEvent<HTMLDivElement>, element: SlideElement) => {
    e.stopPropagation();
    if (element.type === "text" || element.type === "button") {
      setEditingElementId(element.id);
      lastEditedIdRef.current = element.id;
      onSelectElement(element.id);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent<HTMLDivElement>, element: SlideElement) => {
    if (editingElementId === element.id) return;
    e.stopPropagation();
    onSelectElement(element.id);
    startDrag(e, element);
  };

  const handleDeleteConfirm = () => {
    if (elementToDelete) {
      onDeleteElement(elementToDelete);
      setElementToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  // Adjust the dimensions of the canvas based on zoom level
  const canvasStyle = {
    width: "100%",
    height: "100%",
    minWidth: "800px",
    minHeight: "600px",
    transform: `scale(${zoom})`,
    transformOrigin: "0 0",
    position: "relative" as const
  };

  // Update the return statement
  return (
    <div className="flex-1 overflow-hidden relative">
      <CanvasContextMenu
        onCut={handleCanvasCut}
        onCopy={handleCanvasCopy}
        onPaste={handleCanvasPaste}
        onToggleRuler={handleToggleRuler}
        onToggleGrid={handleToggleGrid}
        onAddGuide={handleAddGuide}
        onReset={handleResetSlide}
        onFormatBackground={handleFormatBackground}
        onProperties={handleProperties}
      >
        <div 
          ref={canvasRef}
          className="absolute inset-0 overflow-auto"
          onContextMenu={handleCanvasContextMenu}
          style={{
            position: 'relative',
            height: '100%',
            width: '100%'
          }}
        >
          {slide.elements.map((element) => (
            <SlideElementComponent
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={() => handleElementSelect(element.id)}
              onUpdateElement={(updates) => onUpdateElement(element.id, updates)}
              onDeleteElement={() => onDeleteElement(element.id)}
              zoom={zoom}
            />
          ))}
        </div>
      </CanvasContextMenu>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Element</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this element? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
