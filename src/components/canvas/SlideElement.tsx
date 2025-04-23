
import React, { useState, useRef, useEffect } from 'react';
import { SlideElement } from '@/utils/slideTypes';
import ElementContent from './ElementContent';
import { ResizeHandles } from './ResizeHandles';

interface SlideElementProps {
  element: SlideElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateElement: (updates: Partial<SlideElement>) => void;
  onDeleteElement?: () => void;
  zoom: number;
}

export const SlideElementComponent: React.FC<SlideElementProps> = ({ 
  element, 
  isSelected, 
  onSelect, 
  onUpdateElement,
  onDeleteElement,
  zoom
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(element.content || '');
  const editableInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === 'text' || element.type === 'button') {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (element.content !== editValue) {
      onUpdateElement({ content: editValue });
    }
  };

  useEffect(() => {
    if (isEditing && editableInputRef.current) {
      editableInputRef.current.focus();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setEditValue(element.content || '');
  }, [element.content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableInputRef.current?.blur();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteElement && onDeleteElement();
  };
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    // Check if we're clicking on a resize handle
    const target = e.target as HTMLElement;
    
    if (target.classList.contains('resize-handle')) {
      e.stopPropagation();
      e.preventDefault();
      const direction = target.getAttribute('data-handle');
      
      if (direction) {
        setIsResizing(true);
        setResizeDirection(direction);
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: element.width,
          height: element.height
        });
        
        // Also store the element's start position for handles that move position
        setElementStart({
          x: element.x,
          y: element.y
        });
      }
      return;
    }
    
    if (e.button !== 0 || target.classList.contains('delete-btn')) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.x, y: element.y });
  };
  
  // Mouse move handler for both dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Handle dragging
      if (isDragging) {
        e.preventDefault();
        
        const deltaX = (e.clientX - dragStart.x) / zoom;
        const deltaY = (e.clientY - dragStart.y) / zoom;
        
        onUpdateElement({
          x: Math.max(0, elementStart.x + deltaX),
          y: Math.max(0, elementStart.y + deltaY)
        });
      }
      
      // Handle resizing
      if (isResizing) {
        e.preventDefault();
        
        const deltaX = (e.clientX - resizeStart.x) / zoom;
        const deltaY = (e.clientY - resizeStart.y) / zoom;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = elementStart.x;
        let newY = elementStart.y;
        
        // Apply consistent resizing logic for all element types
        switch (resizeDirection) {
          case 'n':
            newHeight = Math.max(20, resizeStart.height - deltaY);
            newY = elementStart.y + deltaY;
            break;
          case 's':
            newHeight = Math.max(20, resizeStart.height + deltaY);
            break;
          case 'e':
            newWidth = Math.max(20, resizeStart.width + deltaX);
            break;
          case 'w':
            newWidth = Math.max(20, resizeStart.width - deltaX);
            newX = elementStart.x + deltaX;
            break;
          case 'ne':
            newWidth = Math.max(20, resizeStart.width + deltaX);
            newHeight = Math.max(20, resizeStart.height - deltaY);
            newY = elementStart.y + deltaY;
            break;
          case 'nw':
            newWidth = Math.max(20, resizeStart.width - deltaX);
            newHeight = Math.max(20, resizeStart.height - deltaY);
            newX = elementStart.x + deltaX;
            newY = elementStart.y + deltaY;
            break;
          case 'se':
            newWidth = Math.max(20, resizeStart.width + deltaX);
            newHeight = Math.max(20, resizeStart.height + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(20, resizeStart.width - deltaX);
            newHeight = Math.max(20, resizeStart.height + deltaY);
            newX = elementStart.x + deltaX;
            break;
        }
        
        // Apply consistent updates for all element types
        onUpdateElement({
          width: newWidth,
          height: newHeight,
          x: Math.max(0, newX),
          y: Math.max(0, newY)
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, elementStart, resizeStart, resizeDirection, onUpdateElement, zoom]);

  // Ensure all elements have a minimum size
  const minSize = 20;
  const styleProps = {
    left: element.x,
    top: element.y,
    width: Math.max(minSize, element.width),
    height: Math.max(minSize, element.height),
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: element.zIndex || 1
  };

  return (
    <div 
      ref={elementRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      className={`absolute ${isSelected ? 'border border-blue-500' : ''} select-none`}
      style={styleProps}
    >
      <ElementContent 
        element={element}
        isEditing={isEditing}
        editValue={editValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputRef={editableInputRef}
      />
      
      {isSelected && (
        <>
          <button 
            className="delete-btn absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10"
            onClick={handleDelete}
            title="Delete element"
          >
            ×
          </button>
          <ResizeHandles element={element} />
        </>
      )}
    </div>
  );
};

export default SlideElementComponent;
