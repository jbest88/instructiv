
import { useEffect } from "react";
import { SlideElement } from "@/utils/slideTypes";

interface UseKeyboardShortcutsProps {
  selectedElementId: string | null;
  selectedElement: SlideElement | null;
  editingElementId: string | null;
  onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
  setElementToDelete: (id: string | null) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setEditingElementId: (id: string | null) => void;
  finishEditing: () => void;
}

export function useKeyboardShortcuts({
  selectedElementId,
  selectedElement,
  editingElementId,
  onUpdateElement,
  setElementToDelete,
  setIsDeleteDialogOpen,
  setEditingElementId,
  finishEditing
}: UseKeyboardShortcutsProps) {
  // Handle keyboard shortcuts and element movement/deletion
  useEffect(() => {
    if (!selectedElementId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if currently editing text
      if (editingElementId) return;

      if (selectedElementId && selectedElement) {
        const MOVE_AMOUNT = 1; // Pixels to move
        
        switch (e.key) {
          case "Delete":
          case "Backspace":
            // Show delete confirmation instead of immediate deletion
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
            // If text element is selected, enter edit mode on Enter key
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
  }, [selectedElementId, selectedElement, editingElementId, onUpdateElement, setElementToDelete, setIsDeleteDialogOpen, setEditingElementId, finishEditing]);
}
