
import React, { useState, useRef, useEffect } from 'react';
import { SlideElement } from '@/utils/slideTypes';
import ElementContent from './ElementContent';

interface SlideElementProps {
  element: SlideElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateElement: (updatedElement: SlideElement) => void;
  onDeleteElement?: (elementId: string) => void;
}

export const SlideElementComponent: React.FC<SlideElementProps> = ({ 
  element, 
  isSelected, 
  onSelect, 
  onUpdateElement,
  onDeleteElement
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(element.content || '');
  const editableInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (element.content !== editValue) {
      onUpdateElement({ ...element, content: editValue });
    }
  };

  useEffect(() => {
    if (isEditing && editableInputRef.current) {
      editableInputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableInputRef.current?.blur();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteElement && onDeleteElement(element.id);
  };

  return (
    <div 
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      className={`absolute ${isSelected ? 'border-2 border-blue-500' : ''} select-none`}
      style={{ 
        left: element.x, 
        top: element.y, 
        width: element.width, 
        height: element.height 
      }}
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
        <button 
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
          onClick={handleDelete}
          title="Delete element"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SlideElementComponent;
