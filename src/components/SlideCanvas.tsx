
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  
  const { canvasSize, canvasZoom, setCanvasZoom } = useProject();

  // Handle wheel event for zooming
  const handleWheel = (e: WheelEvent) => {
    // Only zoom when shift key is pressed
    if (e.shiftKey) {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      let newZoom = canvasZoom + delta;
      
      // Limit zoom range
      newZoom = Math.max(0.1, Math.min(3, newZoom));
      
      // Calculate mouse position relative to canvas
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Adjust canvas position to zoom toward/away from mouse position
        const newX = mouseX - (mouseX - canvasPosition.x) * (newZoom / canvasZoom);
        const newY = mouseY - (mouseY - canvasPosition.y) * (newZoom / canvasZoom);
        
        setCanvasPosition({ x: newX, y: newY });
      }
      
      setCanvasZoom(newZoom);
    }
  };
  
  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [canvasZoom, canvasPosition]);
  
  // Handle canvas panning with middle mouse button or space + left mouse button
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Middle mouse button (button 1) or space key + left mouse button
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsDraggingCanvas(true);
      setStartDragPos({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (isDraggingCanvas) {
      const dx = e.clientX - startDragPos.x;
      const dy = e.clientY - startDragPos.y;
      
      setCanvasPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      setStartDragPos({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
  };
  
  // Add event listeners for canvas panning
  useEffect(() => {
    if (isDraggingCanvas) {
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleCanvasMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleCanvasMouseMove);
      document.removeEventListener('mouseup', handleCanvasMouseUp);
    };
  }, [isDraggingCanvas, startDragPos]);

  // Center canvas on initial render and when size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const centerX = container.clientWidth / 2 - (canvasSize.width * canvasZoom) / 2;
    const centerY = container.clientHeight / 2 - (canvasSize.height * canvasZoom) / 2;
    
    setCanvasPosition({ x: centerX, y: centerY });
  }, [canvasSize, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);
  
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
      className="relative w-full h-full overflow-hidden bg-neutral-200"
      onMouseDown={handleCanvasMouseDown}
      style={{ cursor: isDraggingCanvas ? 'grabbing' : 'default' }}
    >
      <div
        ref={canvasRef}
        className="absolute shadow-lg"
        style={{ 
          transform: `scale(${canvasZoom})`,
          transformOrigin: '0 0',
          left: `${canvasPosition.x}px`,
          top: `${canvasPosition.y}px`,
          transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out',
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
      
      {/* Helper text overlay */}
      <div className="absolute bottom-16 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-md pointer-events-none opacity-70">
        <div>Ctrl + Drag: Pan Canvas</div>
        <div>Shift + Scroll: Zoom</div>
      </div>
    </div>
  );
}
