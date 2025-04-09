import React, { useState, useRef, useEffect } from "react";
import { SlideElement } from "@/utils/slideTypes";
import { Slide } from "@/utils/slideTypes";

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
    startHeight: 0
  });

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedElement = selectedElementId 
    ? slide.elements.find(el => el.id === selectedElementId) 
    : null;

  // Handle keyboard shortcuts and element movement/deletion
  useEffect(() => {
    if (!selectedElementId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedElementId && selectedElement) {
        const MOVE_AMOUNT = 1; // Pixels to move
        
        switch (e.key) {
          case "Delete":
          case "Backspace":
            onDeleteElement(selectedElementId);
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
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementId, selectedElement, onUpdateElement, onDeleteElement]);

  // Handle spacebar panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && canvasRef.current && !isPanning) {
        e.preventDefault();
        document.body.style.cursor = "grab";
        canvasRef.current.style.cursor = "grab";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        document.body.style.cursor = "";
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "";
        }
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.body.style.cursor = "";
    };
  }, [isPanning]);

  // Handle background canvas click to deselect
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  // Element drag handlers
  const handleElementMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    element: SlideElement
  ) => {
    if (e.button !== 0) return; // Only left click
    
    e.stopPropagation();
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
        startHeight: element.height
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
      let newX = element.x;
      let newY = element.y;
      
      // Adjust based on the handle being dragged
      switch (resizeState.handle) {
        case "n":
          newHeight = Math.max(10, resizeState.startHeight - deltaY);
          newY = resizeState.startHeight - deltaY < 10 ? element.y : element.y + deltaY;
          break;
        case "s":
          newHeight = Math.max(10, resizeState.startHeight + deltaY);
          break;
        case "e":
          newWidth = Math.max(10, resizeState.startWidth + deltaX);
          break;
        case "w":
          newWidth = Math.max(10, resizeState.startWidth - deltaX);
          newX = resizeState.startWidth - deltaX < 10 ? element.x : element.x + deltaX;
          break;
        case "ne":
          newWidth = Math.max(10, resizeState.startWidth + deltaX);
          newHeight = Math.max(10, resizeState.startHeight - deltaY);
          newY = resizeState.startHeight - deltaY < 10 ? element.y : element.y + deltaY;
          break;
        case "nw":
          newWidth = Math.max(10, resizeState.startWidth - deltaX);
          newHeight = Math.max(10, resizeState.startHeight - deltaY);
          newX = resizeState.startWidth - deltaX < 10 ? element.x : element.x + deltaX;
          newY = resizeState.startHeight - deltaY < 10 ? element.y : element.y + deltaY;
          break;
        case "se":
          newWidth = Math.max(10, resizeState.startWidth + deltaX);
          newHeight = Math.max(10, resizeState.startHeight + deltaY);
          break;
        case "sw":
          newWidth = Math.max(10, resizeState.startWidth - deltaX);
          newHeight = Math.max(10, resizeState.startHeight + deltaY);
          newX = resizeState.startWidth - deltaX < 10 ? element.x : element.x + deltaX;
          break;
      }
      
      onUpdateElement(selectedElementId, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    }
    
    // Handle canvas panning with space + drag or middle mouse button
    if (isPanning && containerRef.current) {
      containerRef.current.scrollLeft += panStart.x - e.clientX;
      containerRef.current.scrollTop += panStart.y - e.clientY;
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up to end dragging or resizing
  const handleMouseUp = () => {
    if (dragState.isDragging || resizeState.isResizing) {
      setDragState({ ...dragState, isDragging: false });
      setResizeState({ ...resizeState, isResizing: false });
      document.body.style.cursor = "";
    }
    
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = "";
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "";
      }
    }
  };

  // Handle mouse down on canvas (for panning)
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Middle mouse button or space key + left click for panning
    const isMiddleButton = e.button === 1;
    const isSpacePressed = e.nativeEvent.getModifierState("Space");
    
    if ((isMiddleButton || isSpacePressed) && e.target === canvasRef.current) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = "grabbing";
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }
    }
  };

  // Set up global event listeners for when mouse leaves the canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [dragState, resizeState, isPanning]);

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

  // Render individual element based on its type
  const renderElement = (element: SlideElement) => {
    const isSelected = selectedElementId === element.id;
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`
    };

    // Add common event listeners to all elements
    const commonProps = {
      onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => handleElementMouseDown(e, element),
      style: baseStyle,
      className: `element ${isSelected ? 'outline outline-2 outline-primary' : ''}`
    };

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            {...commonProps}
            className={`${commonProps.className} bg-white p-2 overflow-hidden select-none`}
            style={{
              ...baseStyle,
              fontSize: element.fontSize ? `${element.fontSize}px` : 'inherit',
              color: element.fontColor || 'inherit',
              fontWeight: element.fontWeight || 'inherit',
              fontStyle: element.fontStyle || 'normal',
              textAlign: element.align || 'left'
            }}
          >
            {element.content}
            {isSelected && renderResizeHandles(element)}
          </div>
        );

      case "image":
        return (
          <div
            key={element.id}
            {...commonProps}
            className={`${commonProps.className} overflow-hidden select-none`}
          >
            <img
              src={element.src}
              alt={element.alt || "Image"}
              className="w-full h-full object-contain pointer-events-none"
            />
            {isSelected && renderResizeHandles(element)}
          </div>
        );

      case "button":
        return (
          <div
            key={element.id}
            {...commonProps}
            className={`${commonProps.className} flex items-center justify-center select-none 
              ${element.style === 'primary' ? 'bg-primary text-primary-foreground' : 
                element.style === 'secondary' ? 'bg-secondary text-secondary-foreground' : 
                'bg-background border border-input'}`}
          >
            {element.label}
            {isSelected && renderResizeHandles(element)}
          </div>
        );

      case "hotspot":
        return (
          <div
            key={element.id}
            {...commonProps}
            className={`${commonProps.className} select-none border-2 border-dashed border-blue-500 
              ${element.shape === 'circle' ? 'rounded-full' : ''}`}
          >
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-medium">
                Hotspot
              </div>
            )}
            {isSelected && renderResizeHandles(element)}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="slide-canvas-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={canvasRef}
        className="slide-canvas relative bg-white shadow-md mx-auto"
        style={{
          width: 1920 * zoom,
          height: 1200 * zoom,
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          background: slide.background || '#ffffff'
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
      >
        {slide.elements.map(renderElement)}
      </div>
    </div>
  );
}
