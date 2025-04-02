
import { useState, useRef } from "react";
import { Slide, SlideElement } from "@/utils/slideTypes";
import { cn } from "@/lib/utils";

interface SlideCanvasProps {
  slide: Slide;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<SlideElement>) => void;
}

export function SlideCanvas({ 
  slide, 
  selectedElementId, 
  onSelectElement,
  onUpdateElement
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
    
    // Calculate new position
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    
    // Update element position
    onUpdateElement(selectedElementId, { x, y });
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDragging(false);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background: slide.background || '#ffffff' }}
      onClick={handleBackgroundClick}
    >
      {slide.elements.map((element) => {
        // Render different elements based on type
        if (element.type === "text") {
          return (
            <div
              key={element.id}
              className={cn(
                "canvas-element",
                selectedElementId === element.id && "selected"
              )}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
                fontSize: `${element.fontSize || 16}px`,
                color: element.fontColor || '#000000',
                fontWeight: element.fontWeight || 'normal'
              }}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleDragStart(e, element)}
            >
              {element.content}
            </div>
          );
        }
        
        if (element.type === "image") {
          return (
            <div
              key={element.id}
              className={cn(
                "canvas-element",
                selectedElementId === element.id && "selected"
              )}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`
              }}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleDragStart(e, element)}
            >
              <img 
                src={element.src} 
                alt={element.alt || 'Slide image'} 
                className="w-full h-full object-contain"
              />
            </div>
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
            <div
              key={element.id}
              className={cn(
                "canvas-element flex items-center justify-center rounded",
                buttonClass,
                selectedElementId === element.id && "selected"
              )}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`
              }}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleDragStart(e, element)}
            >
              {element.label}
            </div>
          );
        }
        
        if (element.type === "hotspot") {
          const isCircle = element.shape === "circle";
          
          return (
            <div
              key={element.id}
              className={cn(
                "canvas-element bg-blue-400/30 border-2 border-blue-500",
                isCircle ? "rounded-full" : "rounded",
                selectedElementId === element.id && "selected"
              )}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`
              }}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleDragStart(e, element)}
              title={element.tooltip}
            />
          );
        }
        
        return null;
      })}
      
      {/* Resize handles for selected element */}
      {selectedElementId && (
        <div className="resize-handles">
          {/* We'd implement resize handles here in a more complete version */}
        </div>
      )}
    </div>
  );
}
