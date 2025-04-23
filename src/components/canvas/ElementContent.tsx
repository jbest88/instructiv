
import React from 'react';
import { SlideElement } from '@/utils/slideTypes';

interface ElementContentProps {
  element: SlideElement;
  isEditing: boolean;
  editValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ElementContent: React.FC<ElementContentProps> = ({
  element,
  isEditing,
  editValue,
  onChange,
}) => {
  switch (element.type) {
    case 'text':
      return isEditing ? (
        <textarea
          value={editValue}
          onChange={onChange}
          className="w-full h-full p-0 resize-none border-none outline-none bg-transparent"
          style={{
            fontFamily: element.fontFamily || 'sans-serif',
            fontSize: element.fontSize || 16,
            color: element.color || 'black',
            textAlign: element.align as any || 'left',
            fontWeight: element.fontStyle?.includes('bold') ? 'bold' : 'normal',
            fontStyle: element.fontStyle?.includes('italic') ? 'italic' : 'normal',
            textDecoration: element.fontStyle?.includes('underline') ? 'underline' : 'none',
          }}
        />
      ) : (
        <div
          className="whitespace-pre-wrap break-words"
          style={{
            fontFamily: element.fontFamily || 'sans-serif',
            fontSize: element.fontSize || 16,
            color: element.color || 'black',
            textAlign: element.align as any || 'left',
            fontWeight: element.fontStyle?.includes('bold') ? 'bold' : 'normal',
            fontStyle: element.fontStyle?.includes('italic') ? 'italic' : 'normal',
            textDecoration: element.fontStyle?.includes('underline') ? 'underline' : 'none',
          }}
        >
          {element.content}
        </div>
      );

    case 'image':
      return (
        <img
          src={element.src}
          alt={element.alt || ''}
          className="w-full h-full"
          style={{
            // Instead of objectFit, use CSS object-fit
            objectFit: 'contain'
          }}
        />
      );

    case 'button':
      return (
        <button
          className="px-4 py-2 rounded"
          style={{
            backgroundColor: element.backgroundColor || '#3b82f6',
            color: element.color || 'white',
            border: element.border || 'none',
            borderRadius: element.borderRadius || '4px',
            fontFamily: element.fontFamily || 'sans-serif',
            fontSize: element.fontSize || 16,
          }}
        >
          {element.content}
        </button>
      );

    case 'hotspot':
      return (
        <div
          className="flex items-center justify-center rounded-full border-2 border-dashed cursor-pointer"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: '#3b82f6',
          }}
        >
          <span className="text-blue-500 text-xs">Hotspot</span>
        </div>
      );

    default:
      return <div>Unknown element type</div>;
  }
};
