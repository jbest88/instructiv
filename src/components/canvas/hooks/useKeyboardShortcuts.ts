import { useEffect } from "react";
import { SlideElement } from "@/utils/slideTypes";
import { toast } from "sonner";

interface UseKeyboardShortcutsProps {
  selectedElementId: string | null;
  selectedElement: SlideElement | null;
  editingElementId: string | null;
  onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
  setElementToDelete: (id: string | null) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setEditingElementId: (id: string | null) => void;
  finishEditing: () => void;
  onAddElement?: (element: SlideElement) => void;
  copyElementToClipboard?: (element: SlideElement) => void;
  pasteElementFromClipboard?: () => void;
  duplicateSelectedElement?: () => void;
  openElementProperties?: (elementId: string) => void;
}

export function useKeyboardShortcuts({
  selectedElementId,
  selectedElement,
  editingElementId,
  onUpdateElement,
  setElementToDelete,
  setIsDeleteDialogOpen,
  setEditingElementId,
  finishEditing,
  onAddElement,
  copyElementToClipboard,
  pasteElementFromClipboard,
  duplicateSelectedElement,
  openElementProperties
}: UseKeyboardShortcutsProps) {
  // Handle keyboard shortcuts and element movement/deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if currently editing text
      if (editingElementId) return;

      if (selectedElementId && selectedElement) {
        const MOVE_AMOUNT = 1; // Pixels to move
        
        // Handle copy/paste/duplicate shortcuts
        if (e.ctrlKey) {
          switch (e.key.toLowerCase()) {
            case 'c': // Copy
              if (copyElementToClipboard && selectedElement) {
                copyElementToClipboard(selectedElement);
                e.preventDefault();
              }
              break;

            case 'v': // Paste
              if (pasteElementFromClipboard) {
                pasteElementFromClipboard();
                e.preventDefault();
              }
              break;

            case 'd': // Duplicate
              if (duplicateSelectedElement) {
                duplicateSelectedElement();
                e.preventDefault();
              }
              break;
          }
        }

        // Handle properties dialog (Ctrl+Shift+Enter)
        if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
          if (openElementProperties && selectedElementId) {
            openElementProperties(selectedElementId);
            e.preventDefault();
          }
          return;
        }

        // Keep existing movement shortcuts
        switch (e.key) {
          case "Delete":
          case "Backspace":
            setElementToDelete(selectedElementId);
            setIsDeleteDialogOpen(true);
            e.preventDefault();
            break;
          case "ArrowLeft":
            onUpdateElement(selectedElementId, { x: selectedElement.x - MOVE_AMOUNT });
            e.preventDefault();
            break;
          case "ArrowRight":
            onUpdateElement(selectedElementId, { x: selectedElement.x + MOVE_AMOUNT });
            e.preventDefault();
            break;
          case "ArrowUp":
            onUpdateElement(selectedElementId, { y: selectedElement.y - MOVE_AMOUNT });
            e.preventDefault();
            break;
          case "ArrowDown":
            onUpdateElement(selectedElementId, { y: selectedElement.y + MOVE_AMOUNT });
            e.preventDefault();
            break;
          case "Enter":
            if (selectedElement.type === "text" && selectedElementId !== editingElementId) {
              setEditingElementId(selectedElementId);
              e.preventDefault();
            }
            break;
          case "Escape":
            if (editingElementId) {
              finishEditing();
              e.preventDefault();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedElementId, 
    selectedElement, 
    editingElementId, 
    onUpdateElement, 
    setElementToDelete, 
    setIsDeleteDialogOpen, 
    setEditingElementId, 
    finishEditing,
    onAddElement,
    copyElementToClipboard,
    pasteElementFromClipboard,
    duplicateSelectedElement,
    openElementProperties
  ]);
}
