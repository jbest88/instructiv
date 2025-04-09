import { useState, useRef, useEffect } from "react";
import { Slide, SlideElement } from "@/utils/slideTypes";
import { cn } from "@/lib/utils";
import { useProject } from "@/contexts/project";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Trash2 } from "lucide-react";

interface SlideCanvasProps {
  slide: Slide;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<SlideElement>) => void;
  onDeleteElement?: (elementId: string) => void;
}

export function SlideCanvas({ 
  slide, 
  selectedElementId, 
  onSelectElement,
  onUpdateElement,
  onDeleteElement
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });
  
  const { canvasSize, canvasZoom, setCanvasZoom } = useProject();

  // Center canvas on initial load and when zoom changes
  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const canvasWidth = canvasSize.width * canvasZoom;
      const canvasHeight = canvasSize.height * canvasZoom;
      
      // Center the canvas in the viewport
      const paddingX = Math.max((containerWidth - canvasWidth) / 2, 100);
      const paddingY = Math.max((containerHeight - canvasHeight) / 2, 100);
      
      if (canvasRef.current.parentElement) {
        canvasRef.current.parentElement.style.padding = `${paddingY}px ${paddingX}px`;
        canvasRef.current.parentElement.style.minWidth = `${canvasWidth + (paddingX * 2)}px`;
        canvasRef.current.parentElement.style.minHeight = `${canvasHeight + (paddingY * 2)}px`;
        
        // Set scrollbars to center canvas on initial load
        if (viewportPosition.x === 0 && viewportPosition.y === 0) {
          setTimeout(() => {
            if (containerRef.current) {
              const scrollX = (canvasRef.current.parentElement!.offsetWidth - containerWidth) / 2;
              const scrollY = (canvasRef.current.parentElement!.offsetHeight - containerHeight) / 2;
              containerRef.current.scrollLeft = scrollX;
              containerRef.current.scrollTop = scrollY;
              setViewportPosition({ x: scrollX, y: scrollY });
            }
          }, 10);
        }
      }
    }
  }, [canvasSize, canvasZoom]);

  // Handle zoom with mouse positioning
  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      if (!containerRef.current || !canvasRef.current) return;
      
      // Get mouse position relative to canvas
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Get current scroll position
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      
      // Calculate mouse position relative to scroll position
      const mouseXInCanvas = mouseX + scrollLeft;
      const mouseYInCanvas = mouseY + scrollTop;
      
      // Calculate zoom change
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const prevZoom = canvasZoom;
      let newZoom = prevZoom + delta;
      
      // Limit zoom range
      newZoom = Math.max(0.1, Math.min(3, newZoom));
      if (newZoom === prevZoom) return;
      
      // Calculate new scroll position
      const zoomRatio = newZoom / prevZoom;
      const newScrollLeft = mouseXInCanvas * zoomRatio - mouseX;
      const newScrollTop = mouseYInCanvas * zoomRatio - mouseY;
      
      // Update zoom
      setCanvasZoom(newZoom);
      
      // Set new scroll position after zoom is applied
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollLeft = newScrollLeft;
          containerRef.current.scrollTop = newScrollTop;
          setViewportPosition({ x: newScrollLeft, y: newScrollTop });
        }
      }, 10);
    }
  };

  // Add space bar panning (like Articulate Storyline)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !isPanning && containerRef.current) {
      e.preventDefault();
      setIsPanning(true);
      containerRef.current.style.cursor = 'grabbing';
      document.addEventListener('mousemove', handleSpaceBarPan);
      document.addEventListener('mouseup', handleSpaceBarPanEnd);
    }
  };
  
  const handleSpaceBarPan = (e: MouseEvent) => {
    if (!isPanning || !containerRef.current) return;
    
    if (!panStart.x && !panStart.y) {
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    const deltaX = e.clientX - panStart.x;
    const deltaY = e.clientY - panStart.y;
    
    containerRef.current.scrollLeft -= deltaX;
    containerRef.current.scrollTop -= deltaY;
    
    setPanStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleSpaceBarPanEnd = () => {
    if (!containerRef.current) return;
    
    setIsPanning(false);
    containerRef.current.style.cursor = 'default';
    setPanStart({ x: 0, y: 0 });
    
    document.removeEventListener('mousemove', handleSpaceBarPan);
    document.removeEventListener('mouseup', handleSpaceBarPanEnd);
  };
  
  // Middle-mouse button panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle mouse button (button 1) or Alt+Left click for panning
    if (e.button === 1 || (e.button === 0 && (e.altKey || isPanning))) {
      e.preventDefault();
      setPanStart({ x: e.clientX, y: e.clientY });
      
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
      
      // Add document-level event listeners
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
    }
  };

  const handleDocumentMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || (!panStart.x && !panStart.y)) return;
    
    const deltaX = e.clientX - panStart.x;
    const deltaY = e.clientY - panStart.y;
    
    containerRef.current.scrollLeft -= deltaX;
    containerRef.current.scrollTop -= deltaY;
    
    setViewportPosition({
      x: containerRef.current.scrollLeft,
      y: containerRef.current.scrollTop
    });
    
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleDocumentMouseUp = () => {
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default';
    }
    
    setPanStart({ x: 0, y: 0 });
    
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleDocumentMouseUp);
  };

  // Cleanup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
      document.removeEventListener('mousemove', handleSpaceBarPan);
      document.removeEventListener('mouseup', handleSpaceBarPanEnd);
    };
  }, [canvasZoom, isPanning, panStart]);
  
  // Handle scroll events to update viewport position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      setViewportPosition({
        x: container.scrollLeft,
        y: container.scrollTop
      });
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle element selection
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    onSelectElement(elementId);
  };
  
  // Handle background click (deselect)
  const handleBackgroundClick = () => {
    onSelectElement(null);
  };
  
  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, element: SlideElement) => {
    e.stopPropagation();
    if (e.button !== 0) return; // Only left mouse button
    
    setDragging(true);
    
    // Calculate offset from mouse position to element corner
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Select this element
    onSelectElement(element.id);
    
    // Add temporary event listeners for drag
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // Handle dragging
  const handleDragMove = (e: MouseEvent) => {
    if (!dragging || !selectedElementId || !canvasRef.current) return;
    
    // Get canvas rect
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Calculate new position, accounting for zoom
    const x = (e.clientX - canvasRect.left - dragOffset.x) / canvasZoom;
    const y = (e.clientY - canvasRect.top - dragOffset.y) / canvasZoom;
    
    // Update element position
    onUpdateElement(selectedElementId, { x, y });
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDragging(false);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, element: SlideElement, handle: string) => {
    e.stopPropagation();
    if (e.button !== 0) return; // Only left mouse button
    
    setResizing(handle);
    
    // Select this element if not already selected
    if (selectedElementId !== element.id) {
      onSelectElement(element.id);
    }
    
    // Add temporary event listeners for resize
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  // Handle resize move
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing || !selectedElementId || !canvasRef.current) return;
    
    const element = slide.elements.find(el => el.id === selectedElementId);
    if (!element) return;
    
    // Get canvas rect
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Calculate position relative to canvas, accounting for zoom
    const mouseX = (e.clientX - canvasRect.left) / canvasZoom;
    const mouseY = (e.clientY - canvasRect.top) / canvasZoom;
    
    // Calculate new dimensions based on which handle is being dragged
    let newWidth = element.width;
    let newHeight = element.height;
    let newX = element.x;
    let newY = element.y;
    
    // Update dimensions based on which handle is being dragged
    switch (resizing) {
      case 'top-left':
        newWidth = element.x + element.width - mouseX;
        newHeight = element.y + element.height - mouseY;
        newX = mouseX;
        newY = mouseY;
        break;
      case 'top-right':
        newWidth = mouseX - element.x;
        newHeight = element.y + element.height - mouseY;
        newY = mouseY;
        break;
      case 'bottom-left':
        newWidth = element.x + element.width - mouseX;
        newHeight = mouseY - element.y;
        newX = mouseX;
        break;
      case 'bottom-right':
        newWidth = mouseX - element.x;
        newHeight = mouseY - element.y;
        break;
      case 'top':
        newHeight = element.y + element.height - mouseY;
        newY = mouseY;
        break;
      case 'right':
        newWidth = mouseX - element.x;
        break;
      case 'bottom':
        newHeight = mouseY - element.y;
        break;
      case 'left':
        newWidth = element.x + element.width - mouseX;
        newX = mouseX;
        break;
    }
    
    // Enforce minimum size
    newWidth = Math.max(20, newWidth);
    newHeight = Math.max(20, newHeight);
    
    // Update element dimensions
    onUpdateElement(selectedElementId, { 
      width: newWidth, 
      height: newHeight,
      x: newX,
      y: newY
    });
  };
  
  // Handle resize end
  const handleResizeEnd = () => {
    setResizing(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Handle element deletion
  const handleDeleteElement = (elementId: string) => {
    if (onDeleteElement) {
      onDeleteElement(elementId);
      onSelectElement(null);
    }
  };

  // Render resize handles for the selected element
  const renderResizeHandles = (element: SlideElement) => {
    if (selectedElementId !== element.id) return null;
    
    // Define handle positions
    const handles = [
      { position: 'top-left', cursor: 'nwse-resize', top: -4, left: -4 },
      { position: 'top-right', cursor: 'nesw-resize', top: -4, right: -4 },
      { position: 'bottom-left', cursor: 'nesw-resize', bottom: -4, left: -4 },
      { position: 'bottom-right', cursor: 'nwse-resize', bottom: -4, right: -4 },
      { position: 'top', cursor: 'ns-resize', top: -4, left: '50%', transform: 'translateX(-50%)' },
      { position: 'right', cursor: 'ew-resize', top: '50%', right: -4, transform: 'translateY(-50%)' },
      { position: 'bottom', cursor: 'ns-resize', bottom: -4, left: '50%', transform: 'translateX(-50%)' },
      { position: 'left', cursor: 'ew-resize', top: '50%', left: -4, transform: 'translateY(-50%)' }
    ];
    
    return handles.map(handle => (
      <div
        key={`${element.id}-${handle.position}`}
        className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
        style={{
          top: handle.top,
          left: handle.left,
          right: handle.right,
          bottom: handle.bottom,
          cursor: handle.cursor,
          transform: handle.transform,
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, element, handle.position)}
      />
    ));
  };

  // Render element with context menu
  const renderElement = (element: SlideElement) => {
    // Base styling for all elements
    const baseStyle = {
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`
    };

    // Common classes for all elements
    const baseClasses = cn(
      "absolute cursor-move border-transparent border hover:border-gray-400",
      selectedElementId === element.id && "border-2 border-blue-500"
    );

    if (element.type === "text") {
      return (
        <ContextMenu key={element.id}>
          <ContextMenuTrigger>
            <div
              className={baseClasses}
              style={{
                ...baseStyle,
                fontSize: `${element.fontSize || 16}px`,
                color: element.fontColor || '#000000',
                fontWeight: element.fontWeight || 'normal',
                fontStyle: element.fontStyle || 'normal',
                textAlign: element.align || 'left'
              }}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleDragStart(e, element)}
            >
              {element.content}
              {renderResizeHandles(element)}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onSelectElement(element.id)}>
              Select
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => {
              const currentWeight = element.fontWeight || "normal";
              onUpdateElement(element.id, { fontWeight: currentWeight === "bold" ? "normal" : "bold" });
            }}>
              <Bold className="mr-2 h-4 w-4" />
              {element.fontWeight === "bold" ? "Remove Bold" : "Bold"}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => {
              const currentStyle = element.fontStyle || "normal";
              onUpdateElement(element.id, { fontStyle: currentStyle === "italic" ? "normal" : "italic" });
            }}>
              <Italic className="mr-2 h-4 w-4" />
              {element.fontStyle === "italic" ? "Remove Italic" : "Italic"}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onUpdateElement(element.id, { align: "left" })}>
              <AlignLeft className="mr-2 h-4 w-4" />
              Align Left
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onUpdateElement(element.id, { align: "center" })}>
              <AlignCenter className="mr-2 h-4 w-4" />
              Align Center
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onUpdateElement(element.id, { align: "right" })}>
              <AlignRight className="mr-2 h-4 w-4" />
              Align Right
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleDeleteElement(element.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    }
    
    if (element.type === "image") {
      return (
        <ContextMenu key={element.id}>
          <ContextMenuTrigger>
            <div
              className={baseClasses}
              style={baseStyle}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleDragStart(e, element)}
            >
              <img 
                src={element.src} 
                alt={element.alt || 'Slide image'} 
                className="w-full h-full object-contain"
              />
              {renderResizeHandles(element)}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onSelectElement(element.id)}>
              Select
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleDeleteElement(element.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    }
    
    if (element.type === "button") {
      let buttonClass = "bg-primary text-white";
      if (element.style === "secondary") {
        buttonClass = "bg-secondary text-secondary-foreground";
      } else if (element.style === "outline") {
        buttonClass = "bg-transparent border border-primary text-primary";
      }
      
      return (
        <ContextMenu key={element.id}>
          <ContextMenuTrigger>
            <div
              className={cn(
                "absolute flex items-center justify-center rounded cursor-move",
                buttonClass,
                selectedElementId === element.id && "ring-2 ring-blue-500"
              )}
              style={baseStyle}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleDragStart(e, element)}
            >
              {element.label}
              {renderResizeHandles(element)}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onSelectElement(element.id)}>
              Select
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleDeleteElement(element.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    }
    
    if (element.type === "hotspot") {
      const isCircle = element.shape === "circle";
      
      return (
        <ContextMenu key={element.id}>
          <ContextMenuTrigger>
            <div
              className={cn(
                "absolute bg-blue-400/30 border-2 border-blue-500 cursor-move",
                isCircle ? "rounded-full" : "rounded",
                selectedElementId === element.id && "ring-2 ring-blue-500"
              )}
              style={baseStyle}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleDragStart(e, element)}
              title={element.tooltip}
            >
              {renderResizeHandles(element)}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onSelectElement(element.id)}>
              Select
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleDeleteElement(element.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    }
    
    return null;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-auto bg-neutral-200"
      onMouseDown={handleMouseDown}
    >
      <div 
        className="relative bg-neutral-300 min-h-full min-w-full flex items-center justify-center"
      >
        <div
          ref={canvasRef}
          className="relative shadow-lg"
          style={{ 
            transform: `scale(${canvasZoom})`,
            transformOrigin: '0 0',
            transition: 'transform 0.05s ease-out',
          }}
        >
          <div 
            className="relative bg-white overflow-hidden"
            style={{ 
              width: `${canvasSize.width}px`, 
              height: `${canvasSize.height}px`,
              background: slide.background || '#ffffff'
            }}
            onClick={handleBackgroundClick}
          >
            {slide.elements.map((element) => renderElement(element))}
          </div>
        </div>
      </div>
    </div>
  );
}
