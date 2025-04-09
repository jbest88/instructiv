import { useState, useEffect } from "react";
import { SlideElement } from "@/utils/slideTypes";

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

interface UseElementInteractionProps {
  selectedElementId: string | null;
  zoom: number;
  onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
  elements: SlideElement[];
}

export function useElementInteraction({
  selectedElementId,
  zoom,
  onUpdateElement,
  elements
}: UseElementInteractionProps) {
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

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Handle mouse events for pan/drag/resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
        const element = elements.find(el => el.id === selectedElementId);
        
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
        setDragState(prev => ({ ...prev, isDragging: false }));
        setResizeState(prev => ({ ...prev, isResizing: false }));
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
  }, [dragState, resizeState, isPanning, panStart, zoom, onUpdateElement, selectedElementId, elements]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement>, element: SlideElement) => {
    if (e.button !== 0) return; // Only left click
    
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
      
      return true;
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
    return true;
  };

  const startPan = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1 || (e.button === 0 && e.target === e.currentTarget)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = "grabbing";
      return true;
    }
    return false;
  };

  const handlePan = (e: MouseEvent, containerRef: React.RefObject<HTMLDivElement>) => {
    if (isPanning && containerRef.current && containerRef.current.parentElement) {
      const parentElement = containerRef.current.parentElement;
      parentElement.scrollLeft += panStart.x - e.clientX;
      parentElement.scrollTop += panStart.y - e.clientY;
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  return {
    dragState,
    resizeState,
    isPanning,
    panStart,
    startDrag,
    startPan,
    handlePan,
    setPanStart
  };
}
