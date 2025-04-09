import React, { useRef } from "react";
import { SlideElement, Slide } from "@/utils/slideTypes";
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
  onDeleteElement,
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastEditedIdRef = useRef<string | null>(null);

  const {
    editingElementId,
    setEditingElementId,
    editableInputRef,
    finishEditing,
  } = useTextEditing(() => {}); // manually handle saving

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
    setIsHyperlinkPopoverOpen,
  } = useContextMenuState();

  const { startDrag, startPan } = useElementInteraction({
    selectedElementId,
    zoom,
    onUpdateElement,
    elements: slide.elements,
  });

  useKeyboardShortcuts({
    selectedElementId,
    selectedElement: selectedElementId
      ? slide.elements.find((el) => el.id === selectedElementId)
      : null,
    editingElementId,
    onUpdateElement,
    setElementToDelete,
    setIsDeleteDialogOpen,
    setEditingElementId,
    finishEditing,
  });

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startPan(e);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  const handleElementRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    element: SlideElement
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuElement(element);
    onSelectElement(element.id);
  };

  const handleElementDoubleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    element: SlideElement
  ) => {
    e.stopPropagation();
    if (element.type === "text" || element.type === "button") {
      lastEditedIdRef.current = element.id;
      setEditingElementId(element.id);
      onSelectElement(element.id);
    }
  };

  const handleElementMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    element: SlideElement
  ) => {
    if (editingElementId === element.id) return;
    e.stopPropagation();
    onSelectElement(element.id);
    startDrag(e, element);
  };

  const handleFinishEditing = (updatedValue?: string) => {
    const id = lastEditedIdRef.current;
    if (id && typeof updatedValue === "string") {
      onUpdateElement(id, { content: updatedValue });
    }
    setEditingElementId(null);
    lastEditedIdRef.current = null;
  };

  return (
    <div
      ref={canvasRef}
      className="slide-canvas relative"
      style={{
        width: "100%",
        height: "100%",
        minWidth: "800px",
        minHeight: "600px",
      }}
      onMouseDown={handleCanvasMouseDown}
      onClick={handleCanvasClick}
    >
      {slide.elements.map((element) => (
        <SlideElementComponent
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          isEditing={editingElementId === element.id}
          editableInputRef={editableInputRef}
          onMouseDown={handleElementMouseDown}
          onContextMenu={handleElementRightClick}
          onDoubleClick={handleElementDoubleClick}
          onFinishEditing={handleFinishEditing}
          onCut={() => {}}
          onCopy={() => {}}
          onPaste={() => {}}
          onExitEdit={handleFinishEditing}
          onFontStyleChange={() => {}}
          onParagraphStyleChange={() => {}}
          onHyperlinkChange={() => {}}
          onDuplicate={() => {}}
          onBringToFront={() => {}}
          onSendToBack={() => {}}
          onSelect={onSelectElement}
          onDeleteElement={onDeleteElement}
          onDeleteInitiate={setElementToDelete}
          isFontPopoverOpen={isFontPopoverOpen}
          setIsFontPopoverOpen={setIsFontPopoverOpen}
          isParagraphPopoverOpen={isParagraphPopoverOpen}
          setIsParagraphPopoverOpen={setIsParagraphPopoverOpen}
          isHyperlinkPopoverOpen={isHyperlinkPopoverOpen}
          setIsHyperlinkPopoverOpen={setIsHyperlinkPopoverOpen}
        />
      ))}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Element</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this element? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (elementToDelete) {
                  onDeleteElement(elementToDelete);
                  setElementToDelete(null);
                }
                setIsDeleteDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
