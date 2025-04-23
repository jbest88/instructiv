
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
  onAddElement
}: UseKeyboardShortcutsProps) {
  // Handle keyboard shortcuts and element movement/deletion
  useEffect(() => {
    if (!selectedElementId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if currently editing text
      if (editingElementId) return;

      if (selectedElementId && selectedElement) {
        const MOVE_AMOUNT = 1; // Pixels to move
        
        // Handle copy/paste/duplicate shortcuts
        if (e.ctrlKey) {
          switch (e.key.toLowerCase()) {
            case 'c': // Copy
              // Store element data in clipboard
              const elementData = JSON.stringify(selectedElement);
              navigator.clipboard.writeText(elementData)
                .then(() => toast.success("Element copied"))
                .catch(() => toast.error("Failed to copy"));
              e.preventDefault();
              break;

            case 'v': // Paste
              navigator.clipboard.readText()
                .then(text => {
                  try {
                    const pastedElement = JSON.parse(text) as SlideElement;
                    // Create new element with offset position
                    const newElement = {
                      ...pastedElement,
                      id: crypto.randomUUID(),
                      x: pastedElement.x + 20,
                      y: pastedElement.y + 20
                    };
                    onAddElement?.(newElement);
                    toast.success("Element pasted");
                  } catch (err) {
                    toast.error("Invalid element data in clipboard");
                  }
                })
                .catch(() => toast.error("Failed to paste"));
              e.preventDefault();
              break;

            case 'd': // Duplicate
              // Create new element with offset position
              const duplicatedElement = {
                ...selectedElement,
                id: crypto.randomUUID(),
                x: selectedElement.x + 20,
                y: selectedElement.y + 20
              };
              onAddElement?.(duplicatedElement);
              toast.success("Element duplicated");
              e.preventDefault();
              break;
          }
        }

        // Handle properties dialog (Ctrl+Shift+Enter)
        if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
          // TODO: Open properties dialog
          toast.info("Properties dialog (to be implemented)");
          e.preventDefault();
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
  }, [selectedElementId, selectedElement, editingElementId, onUpdateElement, setElementToDelete, setIsDeleteDialogOpen, setEditingElementId, finishEditing, onAddElement]);
}
