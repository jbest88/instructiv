
import React from 'react';
import { SlideElement } from '@/utils/slideTypes';

interface ElementContentProps {
  element: SlideElement;
  isEditing: boolean;
  editValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

const ElementContent: React.FC<ElementContentProps> = ({
  element,
  isEditing,
  editValue,
  onChange,
  onKeyDown,
  inputRef
}) => {
  // Apply consistent styling for all element types
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: element.align || 'center',
    overflow: 'hidden',
    position: 'relative',
  };

  switch (element.type) {
    case 'text': {
      const textStyle: React.CSSProperties = {
        fontSize: `${element.fontSize || 16}px`,
        fontWeight: element.fontWeight || 'normal',
        fontStyle: element.fontStyle || 'normal',
        color: element.fontColor || '#000000',
        textAlign: element.align as any || 'left',
        width: '100%',
        height: '100%',
        padding: '4px',
        margin: 0,
        resize: 'none',
        border: 'none',
        background: 'transparent',
        overflow: 'hidden',
      };

      return isEditing ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          style={textStyle}
          value={editValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={() => console.log('blur')}
          autoFocus
        />
      ) : (
        <div style={{ ...containerStyle, ...textStyle }}>
          {element.content || ''}
        </div>
      );
    }

    case 'image': {
      return (
        <div style={containerStyle}>
          <img
            src={element.src || '/placeholder.svg'}
            alt={element.alt || 'Image'}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: element.objectFit as any || 'contain',
            }}
          />
        </div>
      );
    }

    case 'button': {
      const buttonStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: element.buttonColor || '#3b82f6',
        color: element.textColor || '#ffffff',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer',
        border: 'none',
        fontSize: `${element.fontSize || 16}px`,
        fontWeight: 'bold',
      };

      return isEditing ? (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={() => console.log('blur')}
          style={{
            ...buttonStyle,
            textAlign: 'center',
          }}
          autoFocus
        />
      ) : (
        <button style={buttonStyle}>
          {element.content || element.label || 'Button'}
        </button>
      );
    }

    case 'hotspot': {
      const isCircle = element.shape === 'circle';
      
      const hotspotStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        border: '2px dashed #3b82f6',
        borderRadius: isCircle ? '50%' : '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      };

      return (
        <div style={hotspotStyle}>
          {element.tooltip && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none">
              {element.tooltip}
            </span>
          )}
        </div>
      );
    }

    default:
      return <div>Unknown element type</div>;
  }
};

export default ElementContent;
