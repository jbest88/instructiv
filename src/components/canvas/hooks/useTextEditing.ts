
import { useState, useRef, useEffect } from "react";
import { SlideElement } from "@/utils/slideTypes";

export function useTextEditing(onUpdateElement: (id: string, updates: Partial<SlideElement>) => void) {
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const editableInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  // Effect to focus input when editing starts
  useEffect(() => {
    if (editingElementId && editableInputRef.current) {
      editableInputRef.current.focus();
    }
  }, [editingElementId]);

  // Effect to handle clicking outside to finish editing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editingElementId && 
          editableInputRef.current && 
          !editableInputRef.current.contains(e.target as Node)) {
        finishEditing();
      }
    };

    if (editingElementId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingElementId]);

  // Function to finish editing and apply changes
  const finishEditing = () => {
    if (editingElementId && editableInputRef.current) {
      const value = editableInputRef.current.value;
      onUpdateElement(editingElementId, { content: value });
    }
    setEditingElementId(null);
  };
  
  return {
    editingElementId,
    setEditingElementId,
    editableInputRef,
    finishEditing
  };
}
