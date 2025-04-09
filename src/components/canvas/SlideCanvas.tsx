
import React, { useRef } from "react";
import { SlideElement } from "@/utils/slideTypes";
import { Slide } from "@/utils/slideTypes";
import { SlideElementComponent } from "./SlideElement";
import { useElementInteraction } from "./hooks/useElementInteraction";
import { useTextEditing } from "./hooks/useTextEditing";
import { useContextMenuState } from "./hooks/useContextMenuState";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Custom hooks for state management
  const { editingElementId, setEditingElementId, editableInputRef, finishEditing } = 
    useTextEditing(onUpdateElement);
  
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
  
  const { startDrag, startPan, isPanning, panStart, setPanStart } = 
    useElementInteraction({
      selectedElementId,
      zoom,
      onUpdateElement,
      elements: slide.elements
    });

  // Register keyboard shortcuts
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

  // Event handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startPan(e);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
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
      onSelectElement(element.id);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent<HTMLDivElement>, element: SlideElement) => {
    // If we're already editing this element, don't interfere
    if (editingElementId === element.id) return;
    
    e.stopPropagation();
    onSelectElement(element.id);
    startDrag(e, element);
  };

  // Context menu action handlers
  const handleCut = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element || element.type !== "text") return;
    
    navigator.clipboard.writeText(element.content)
      .then(() => {
        onUpdateElement(elementId, { content: "" });
      })
      .catch(err => {
        console.error("Failed to cut text: ", err);
      });
  };

  const handleCopy = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element || element.type !== "text") return;
    
    navigator.clipboard.writeText(element.content)
      .catch(err => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handlePaste = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element || element.type !== "text") return;
    
    navigator.clipboard.readText()
      .then(clipText => {
        onUpdateElement(elementId, { content: element.content + clipText });
      })
      .catch(err => {
        console.error("Failed to paste text: ", err);
      });
  };

  const handleDuplicate = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;
    console.log("Duplicate element", element);
  };

  const handleBringToFront = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;
    console.log("Bring to front", element);
  };

  const handleSendToBack = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;
    console.log("Send to back", element);
  };

  const handleExitEditText = (elementId: string) => {
    if (editingElementId === elementId) {
      finishEditing();
    }
  };

  const applyFontStyle = (elementId: string, fontStyle: Partial<any>) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element || element.type !== "text") return;
    
    onUpdateElement(elementId, fontStyle);
    setIsFontPopoverOpen(false);
  };

  const applyParagraphStyle = (elementId: string, align: "left" | "center" | "right") => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element || element.type !== "text") return;
    
    onUpdateElement(elementId, { align });
    setIsParagraphPopoverOpen(false);
  };

  const applyHyperlink = (elementId: string, url: string) => {
    console.log(`Applying hyperlink ${url} to element ${elementId}`);
    setIsHyperlinkPopoverOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (elementToDelete) {
      onDeleteElement(elementToDelete);
      setElementToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteInitiate = (id: string) => {
    setElementToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div
      ref={canvasRef}
      className="slide-canvas relative"
      style={{
        width: '100%',
        height: '100%',
        minWidth: '800px',
        minHeight: '600px'
      }}
      onMouseDown={handleCanvasMouseDown}
      onClick={handleCanvasClick}
    >
      {/* Render all elements */}
      {slide.elements.map((element) => (
        <div key={element.id}>
          <SlideElementComponent
            element={element}
            isSelected={selectedElementId === element.id}
            isEditing={editingElementId === element.id}
            editableInputRef={editableInputRef}
            onMouseDown={handleElementMouseDown}
            onContextMenu={handleElementRightClick}
            onDoubleClick={handleElementDoubleClick}
            onFinishEditing={finishEditing}
            onCut={handleCut}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onExitEdit={handleExitEditText}
            onFontStyleChange={applyFontStyle}
            onParagraphStyleChange={applyParagraphStyle}
            onHyperlinkChange={applyHyperlink}
            onDuplicate={handleDuplicate}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
            onSelect={onSelectElement}
            onDeleteElement={onDeleteElement}
            onDeleteInitiate={handleDeleteInitiate}
            isFontPopoverOpen={isFontPopoverOpen}
            setIsFontPopoverOpen={setIsFontPopoverOpen}
            isParagraphPopoverOpen={isParagraphPopoverOpen}
            setIsParagraphPopoverOpen={setIsParagraphPopoverOpen}
            isHyperlinkPopoverOpen={isHyperlinkPopoverOpen}
            setIsHyperlinkPopoverOpen={setIsHyperlinkPopoverOpen}
          />
        </div>
      ))}

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
