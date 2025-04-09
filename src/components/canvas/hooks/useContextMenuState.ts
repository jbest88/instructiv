
import { useState } from "react";
import { SlideElement } from "@/utils/slideTypes";

export function useContextMenuState() {
  const [contextMenuElement, setContextMenuElement] = useState<SlideElement | null>(null);
  const [elementToDelete, setElementToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFontPopoverOpen, setIsFontPopoverOpen] = useState(false);
  const [isParagraphPopoverOpen, setIsParagraphPopoverOpen] = useState(false);
  const [isHyperlinkPopoverOpen, setIsHyperlinkPopoverOpen] = useState(false);

  return {
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
  };
}
