import React, { useState, useRef, useEffect } from "react";
import { SlideElement } from "@/utils/slideTypes";
import { Slide } from "@/utils/slideTypes";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuTrigger,
  ContextMenuHighlightGroup,
} from "@/components/ui/context-menu";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Scissors, 
  Copy, 
  Clipboard, 
  ClipboardPaste, 
  FilePlus, 
  PenSquare, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Plus, 
  Palette, 
  Link, 
  Square,
  Trash 
} from "lucide-react";

interface SlideCanvasProps {
  slide: Slide;
  selectedElementId: string | null;
  zoom: number;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
  onDeleteElement: (id: string) => void;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startElementX: number;
  startElementY: number;
}

interface ResizeState {
  isResizing: boolean;
  handle: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startElementX: number;
  startElementY: number;
}

export function SlideCanvas({ 
  slide, 
  selectedElementId, 
  zoom, 
  onSelectElement, 
  onUpdateElement, 
  onDeleteElement 
}: SlideCanvasProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startElementX: 0,
    startElementY: 0
  });
  
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    handle: "",
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startElementX: 0,
    startElementY: 0
  });

  // Add a state for tracking which text element is being edited
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [isFontPopoverOpen, setIsFontPopoverOpen] = useState(false);
  const [isParagraphPopoverOpen, setIsParagraphPopoverOpen] = useState(false);
  const [isHyperlinkPopoverOpen, setIsHyperlinkPopoverOpen] = useState(false);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [contextMenuElement, setContextMenuElement] = useState<SlideElement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [elementToDelete, setElementToDelete] = useState<string | null>(null);
  const editableInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  const selectedElement = selectedElementId 
    ? slide.elements.find(el => el.id === selectedElementId) 
    : null;

  // Function to finish editing and apply changes
  const finishEditing = () => {
    if (editingElementId && editableInputRef.current) {
      const newContent = editableInputRef.current.value;
      const element = slide.elements.find(el => el.id === editingElementId);
      
      if (element) {
        if (element.type === "text") {
          onUpdateElement(editingElementId, { content: newContent });
        } else if (element.type === "button") {
          onUpdateElement(editingElementId, { label: newContent });
        }
      }
      
      setEditingElementId(null);
    }
  };

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
  }, [selectedElementId, selectedElement, editingElementId, onUpdateElement, onDeleteElement]);

  // Handle mouse events for pan/drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning && containerRef.current && containerRef.current.parentElement) {
        const parentElement = containerRef.current.parentElement;
        parentElement.scrollLeft += panStart.x - e.clientX;
        parentElement.scrollTop += panStart.y - e.clientY;
        setPanStart({ x: e.clientX, y: e.clientY });
      }
      
      // Handle element dragging
      if (dragState.isDragging && selectedElementId) {
        const deltaX = (e.clientX - dragState.startX) / zoom;
        const deltaY = (e.clientY - dragState.startY) / zoom;
        
        onUpdateElement(selectedElementId, {
          x: dragState.startElementX + deltaX,
          y: dragState.startElementY + deltaY
        });
      }
      
      // Handle element resizing
      if (resizeState.isResizing && selectedElementId) {
        const deltaX = (e.clientX - resizeState.startX) / zoom;
        const deltaY = (e.clientY - resizeState.startY) / zoom;
        const element = slide.elements.find(el => el.id === selectedElementId);
        
        if (!element) return;
        
        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;
        let newX = resizeState.startElementX;
        let newY = resizeState.startElementY;
        
        // Adjust based on the handle being dragged
        switch (resizeState.handle) {
          case "n":
            newHeight = Math.max(10, resizeState.startHeight - deltaY);
            newY = resizeState.startElementY + deltaY;
            break;
          case "s":
            newHeight = Math.max(10, resizeState.startHeight + deltaY);
            break;
          case "e":
            newWidth = Math.max(10, resizeState.startWidth + deltaX);
            break;
          case "w":
            newWidth = Math.max(10, resizeState.startWidth - deltaX);
            newX = resizeState.startElementX + deltaX;
            break;
          case "ne":
            newWidth = Math.max(10, resizeState.startWidth + deltaX);
            newHeight = Math.max(10, resizeState.startHeight - deltaY);
            newY = resizeState.startElementY + deltaY;
            break;
          case "nw":
            newWidth = Math.max(10, resizeState.startWidth - deltaX);
            newHeight = Math.max(10, resizeState.startHeight - deltaY);
            newX = resizeState.startElementX + deltaX;
            newY = resizeState.startElementY + deltaY;
            break;
          case "se":
            newWidth = Math.max(10, resizeState.startWidth + deltaX);
            newHeight = Math.max(10, resizeState.startHeight + deltaY);
            break;
          case "sw":
            newWidth = Math.max(10, resizeState.startWidth - deltaX);
            newHeight = Math.max(10, resizeState.startHeight + deltaY);
            newX = resizeState.startElementX + deltaX;
            break;
        }
        
        onUpdateElement(selectedElementId, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY
        });
      }
    };

    const handleMouseUp = () => {
      if (dragState.isDragging || resizeState.isResizing) {
        setDragState({ ...dragState, isDragging: false });
        setResizeState({ ...resizeState, isResizing: false });
        document.body.style.cursor = "";
      }
      
      if (isPanning) {
        setIsPanning(false);
        document.body.style.cursor = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, resizeState, isPanning, panStart, zoom, onUpdateElement, slide.elements]);

  // Enable panning with middle mouse button or by dragging the canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Middle mouse button or drag canvas background
    if (e.button === 1 || (e.button === 0 && e.target === canvasRef.current)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = "grabbing";
    }
  };

  // Handle background canvas click to deselect
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  // Handle element right-click for context menu
  const handleElementRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    element: SlideElement
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuElement(element);
    onSelectElement(element.id);
  };

  // Handle element double click for text editing
  const handleElementDoubleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    element: SlideElement
  ) => {
    e.stopPropagation();
    if (element.type === "text") {
      setEditingElementId(element.id);
      onSelectElement(element.id);
    } else if (element.type === "button") {
      setEditingElementId(element.id);
      onSelectElement(element.id);
    }
  };

  // Handle element mouse down for selection, dragging, resizing
  const handleElementMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    element: SlideElement
  ) => {
    if (e.button !== 0) return; // Only left click
    
    e.stopPropagation();
    
    // If we're currently editing, don't start dragging
    if (editingElementId === element.id) {
      return;
    }
    
    onSelectElement(element.id);
    
    // Check if we're clicking on a resize handle
    const target = e.target as HTMLElement;
    if (target.classList.contains("resize-handle")) {
      const handle = target.getAttribute("data-handle") || "";
      
      setResizeState({
        isResizing: true,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: element.width,
        startHeight: element.height,
        startElementX: element.x,
        startElementY: element.y
      });
      
      return;
    }
    
    // Otherwise start dragging
    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startElementX: element.x,
      startElementY: element.y
    });
    
    document.body.style.cursor = "grabbing";
  };

  // Handle mouse move for dragging or resizing elements
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Handle element dragging
    if (dragState.isDragging && selectedElementId) {
      const deltaX = (e.clientX - dragState.startX) / zoom;
      const deltaY = (e.clientY - dragState.startY) / zoom;
      
      onUpdateElement(selectedElementId, {
        x: dragState.startElementX + deltaX,
        y: dragState.startElementY + deltaY
      });
    }
    
    // Handle element resizing
    if (resizeState.isResizing && selectedElementId) {
      const deltaX = (e.clientX - resizeState.startX) / zoom;
      const deltaY = (e.clientY - resizeState.startY) / zoom;
      const element = slide.elements.find(el => el.id === selectedElementId);
      
      if (!element) return;
      
      let newWidth = resizeState.startWidth;
      let newHeight = resizeState.startHeight;
      let newX = resizeState.startElementX;
      let newY = resizeState.startElementY;
      
      // Adjust based on the handle being dragged
      switch (resizeState.handle) {
        case "n":
          newHeight = Math.max(10, resizeState.startHeight - deltaY);
          newY = resizeState.startElementY + deltaY;
          break;
        case "s":
          newHeight = Math.max(10, resizeState.startHeight + deltaY);
          break;
        case "e":
          newWidth = Math.max(10, resizeState.startWidth + deltaX);
          break;
        case "w":
          newWidth = Math.max(10, resizeState.startWidth - deltaX);
          newX = resizeState.startElementX + deltaX;
          break;
        case "ne":
          newWidth = Math.max(10, resizeState.startWidth + deltaX);
          newHeight = Math.max(10, resizeState.startHeight - deltaY);
          newY = resizeState.startElementY + deltaY;
          break;
        case "nw":
          newWidth = Math.max(10, resizeState.startWidth - deltaX);
          newHeight = Math.max(10, resizeState.startHeight - deltaY);
          newX = resizeState.startElementX + deltaX;
          newY = resizeState.startElementY + deltaY;
          break;
        case "se":
          newWidth = Math.max(10, resizeState.startWidth + deltaX);
          newHeight = Math.max(10, resizeState.startHeight + deltaY);
          break;
        case "sw":
          newWidth = Math.max(10, resizeState.startWidth - deltaX);
          newHeight = Math.max(10, resizeState.startHeight + deltaY);
          newX = resizeState.startElementX + deltaX;
          break;
      }
      
      onUpdateElement(selectedElementId, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY
      });
    }
  };

  // Handle context menu actions
  const handleDuplicate = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;
    
    // Duplicate functionality would be implemented here
    // Currently just logging to show the action would work
    console.log("Duplicate element", element);
  };

  const handleDeleteConfirm = () => {
    if (elementToDelete) {
      onDeleteElement(elementToDelete);
      setElementToDelete(null);
    }
    setIsDeleteDialogOpen(false);
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

  // Add new text formatting actions
  const handleCut = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element || element.type !== "text") return;
    
    // Store text in clipboard
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
    // This would need more implementation to actually store and render hyperlinks
    setIsHyperlinkPopoverOpen(false);
  };

  // Render resize handles for the selected element
  const renderResizeHandles = (element: SlideElement) => {
    const handles = [
      { position: 'n', style: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },
      { position: 's', style: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },
      { position: 'e', style: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
      { position: 'w', style: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
      { position: 'ne', style: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize' },
      { position: 'nw', style: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize' },
      { position: 'se', style: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize' },
      { position: 'sw', style: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize' }
    ];

    return handles.map(handle => (
      <div
        key={handle.position}
        className={`resize-handle absolute w-3 h-3 bg-primary rounded-full ${handle.style}`}
        data-handle={handle.position}
      />
    ));
  };

  // Render text context menu
  const renderTextContextMenu = (element: SlideElement) => (
    <ContextMenuContent className="w-64">
      {/* Cut, Copy, Paste section */}
      <ContextMenuItem onClick={() => handleCut(element.id)}>
        <Scissors className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="underline">C</span>ut
      </ContextMenuItem>
      <ContextMenuItem onClick={() => handleCopy(element.id)}>
        <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="underline">C</span>opy
      </ContextMenuItem>
      
      {/* Paste Options section */}
      <ContextMenuHighlightGroup title="Paste Options:">
        <ContextMenuItem onClick={() => handlePaste(element.id)}>
          <ClipboardPaste className="mr-2 h-4 w-4 text-orange-400" />
          Paste
        </ContextMenuItem>
      </ContextMenuHighlightGroup>
      
      <ContextMenuSeparator />
      
      {/* Exit Edit Text option */}
      <ContextMenuItem onClick={() => handleExitEditText(element.id)}>
        <PenSquare className="mr-2 h-4 w-4 text-muted-foreground" />
        Exit Edit Text
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      {/* Font section */}
      <Popover open={isFontPopoverOpen} onOpenChange={setIsFontPopoverOpen}>
        <PopoverTrigger asChild>
          <ContextMenuItem onClick={() => setIsFontPopoverOpen(true)} className="cursor-default">
            <Type className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">F</span>ont...
          </ContextMenuItem>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Font Settings</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm">Size</label>
                  <Input 
                    type="number" 
                    min={8} 
                    max={72} 
                    defaultValue={element.type === "text" ? element.fontSize || 16 : 16}
                    onChange={(e) => applyFontStyle(element.id, { fontSize: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm">Color</label>
                  <Input 
                    type="color" 
                    defaultValue={element.type === "text" ? element.fontColor || "#000000" : "#000000"}
                    onChange={(e) => applyFontStyle(element.id, { fontColor: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.fontWeight === "bold" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => applyFontStyle(element.id, { fontWeight: element.type === "text" && element.fontWeight === "bold" ? "normal" : "bold" })}
                >
                  B
                </button>
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.fontStyle === "italic" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => applyFontStyle(element.id, { fontStyle: element.type === "text" && element.fontStyle === "italic" ? "normal" : "italic" })}
                >
                  I
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Paragraph section */}
      <Popover open={isParagraphPopoverOpen} onOpenChange={setIsParagraphPopoverOpen}>
        <PopoverTrigger asChild>
          <ContextMenuItem onClick={() => setIsParagraphPopoverOpen(true)} className="cursor-default">
            <AlignLeft className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">P</span>aragraph...
          </ContextMenuItem>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Paragraph Settings</h4>
              <div className="flex gap-2">
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.align === "left" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => applyParagraphStyle(element.id, "left")}
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.align === "center" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => applyParagraphStyle(element.id, "center")}
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.align === "right" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => applyParagraphStyle(element.id, "right")}
                >
                  <AlignRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <ContextMenuSeparator />
      
      {/* Style options */}
      <ContextMenuItem>
        <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
        Apply style
      </ContextMenuItem>
      <ContextMenuItem>
        <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
        Update style from selection
      </ContextMenuItem>
      <ContextMenuItem>
        <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
        Create custom style from selection...
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      {/* Hyperlink section */}
      <Popover open={isHyperlinkPopoverOpen} onOpenChange={setIsHyperlinkPopoverOpen}>
        <PopoverTrigger asChild>
          <ContextMenuItem onClick={() => setIsHyperlinkPopoverOpen(true)} className="cursor-default">
            <Link className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">H</span>yperlink...
          </ContextMenuItem>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Insert Hyperlink</h4>
              <Input 
                placeholder="https://example.com" 
                onChange={(e) => {}}
              />
              <div className="flex justify-end">
                <button 
                  className="px-2 py-1 bg-primary text-primary-foreground rounded"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="https://example.com"]') as HTMLInputElement;
                    if (input) {
                      applyHyperlink(element.id, input.value);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Format Shape option */}
      <ContextMenuItem>
        <Square className="mr-2 h-4 w-4 text-muted-foreground" />
        Format Shape
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      {/* Delete option */}
      <ContextMenuItem 
        onClick={() => {
          setElementToDelete(element.id);
          setIsDeleteDialogOpen(true);
        }} 
        className="text-red-500"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );

  // Render default context menu for non-text elements
  const renderDefaultContextMenu = (element: SlideElement) => (
    <ContextMenuContent>
      <ContextMenuItem onClick={() => onSelectElement(element.id)}>Select</ContextMenuItem>
      {element.type === "text" && (
        <ContextMenuItem onClick={() => setEditingElementId(element.id)}>Edit Text</ContextMenuItem>
      )}
      {element.type === "button" && (
        <ContextMenuItem onClick={() => setEditingElementId(element.id)}>Edit Button</ContextMenuItem>
      )}
      <ContextMenuItem onClick={() => handleDuplicate(element.id)}>Duplicate</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => handleBringToFront(element.id)}>Bring to Front</ContextMenuItem>
      <ContextMenuItem onClick={() => handleSendToBack(element.id)}>Send to Back</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem 
        onClick={() => {
          setElementToDelete(element.id);
          setIsDeleteDialogOpen(true);
        }} 
        className="text-red-500"
      >
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );

  // Render individual element based on its type
  const renderElement = (element: SlideElement) => {
    const isSelected = selectedElementId === element.id;
    const isEditing = editingElementId === element.id;
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `100px`,
      top: `100px`,
      width: `300px`,
      height: `200px`,
      backgroundColor: '#f0f0ff' // 👈 to debug size
    };
    

    // Add common event listeners to all elements
    const commonProps = {
      onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => handleElementMouseDown(e, element),
      onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => handleElementRightClick(e, element),
      onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => handleElementDoubleClick(e, element),
      style: baseStyle,
      className: `element ${isSelected ? 'outline outline-2 outline-primary' : ''}`
    };

    // Wrap element in ContextMenu
    const wrappedElement = (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div {...commonProps}>
            {renderElementContent()}
            {isSelected && renderResizeHandles(element)}
          </div>
        </ContextMenuTrigger>
        {element.type === "text" ? renderTextContextMenu(element) : renderDefaultContextMenu(element)}
      </ContextMenu>
    );

    function renderElementContent() {
      switch (element.type) {
        case "text":
          return isEditing ? (
            <Textarea
              ref={(ref) => { editableInputRef.current = ref; }}
              defaultValue={element.content}
              style={{
                fontSize: element.fontSize ? `${element.fontSize}px` : 'inherit',
                color: element.fontColor || 'inherit',
                fontWeight: element.fontWeight || 'inherit',
                fontStyle: element.fontStyle || 'inherit',
                textAlign: element.align || 'left',
                width: '100%',
                height: '100%',
                resize: 'none',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                padding: '4px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  finishEditing();
                  e.preventDefault();
                }
              }}
            />
          ) : (
            <div
              style={{
                fontSize: element.fontSize ? `${element.fontSize}px` : 'inherit',
                color: element.fontColor || 'inherit',
                fontWeight: element.fontWeight || 'inherit',
                fontStyle: element.fontStyle || 'inherit',
                textAlign: element.align || 'left',
                width: '100%',
                height: '100%',
                padding: '4px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {element.content}
            </div>
          );
        case "image":
          return (
            <img
              src={element.src}
              alt={element.alt || "Slide image"}
              style={{
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }}
              draggable={false}
            />
          );
        case "button":
          return isEditing ? (
            <Input
              ref={(ref) => { editableInputRef.current = ref; }}
              defaultValue={element.label}
              style={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                padding: '4px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  finishEditing();
                  e.preventDefault();
                }
                if (e.key === 'Enter') {
                  finishEditing();
                  e.preventDefault();
                }
              }}
            />
          ) : (
            <div 
              className={`w-full h-full flex items-center justify-center
                ${element.style === "primary" ? "bg-primary text-primary-foreground" : 
                  element.style === "secondary" ? "bg-secondary text-secondary-foreground" : 
                  "border border-primary bg-transparent"}`}
              style={{
                borderRadius: '4px'
              }}
            >
              {element.label}
            </div>
          );
        case "hotspot":
          return (
            <div 
              className={`w-full h-full flex items-center justify-center border-2 border-dashed border-primary ${
                element.shape === "circle" ? "rounded-full" : ""
              }`}
              title={element.tooltip}
            >
              <div className="opacity-50">Hotspot</div>
            </div>
          );
        default:
          return <div>Unknown element type</div>;
      }
    }

    return wrappedElement;
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
      onMouseMove={handleMouseMove}
    >
      {/* Render all elements */}
      {slide.elements.map((element) => (
        <div key={element.id}>{renderElement(element)}</div>
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
