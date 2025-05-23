
import React from 'react';
import { SlideElement, Slide } from "@/utils/slideTypes";
import { SlideElementComponent } from "./canvas/SlideElement";
import { ResizeHandles } from "./canvas/ResizeHandles";

interface SlideCanvasProps {
  slide: Slide;
  selectedElementId: string | null;
  zoom: number;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
  onDeleteElement: (id: string) => void;
}

export function SlideCanvas({
  slide,
  selectedElementId,
  zoom,
  onSelectElement,
  onUpdateElement,
  onDeleteElement
}: SlideCanvasProps) {
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  const handleElementSelect = (elementId: string) => {
    onSelectElement(elementId);
  };

  const handleElementDrag = (elementId: string, updates: Partial<SlideElement>) => {
    onUpdateElement(elementId, updates);
  };

  // Adjust the dimensions of the canvas based on zoom level
  const canvasStyle = {
    width: "100%", 
    height: "100%",
    minWidth: "800px",
    minHeight: "600px",
    transform: `scale(${zoom})`,
    transformOrigin: "0 0",
    position: "relative" as const,
    background: slide.background || '#ffffff',
  };

  return (
    <div
      className="slide-canvas relative"
      style={canvasStyle}
      onClick={handleCanvasClick}
    >
      {slide.elements.map((element) => (
        <SlideElementComponent
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          onSelect={() => handleElementSelect(element.id)}
          onUpdateElement={(updates) => handleElementDrag(element.id, updates)}
          onDeleteElement={() => onDeleteElement(element.id)}
          zoom={zoom}
        />
      ))}
    </div>
  );
}

export default SlideCanvas;
