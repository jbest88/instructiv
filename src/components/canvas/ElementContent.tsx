import React from "react";
import { SlideElement, TextElement, ButtonElement, ImageElement, HotspotElement } from "@/utils/slideTypes";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// --- TextElementContent ---
interface TextContentProps {
  element: TextElement;
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onFinishEditing: () => void;
}

export function TextElementContent({ element, isEditing, editableInputRef, onFinishEditing }: TextContentProps) {
  if (isEditing) {
    return (
      <Textarea
        ref={editableInputRef as React.RefObject<HTMLTextAreaElement>}
        defaultValue={element.content}
        style={{
          fontSize: element.fontSize ? `${element.fontSize}px` : 'inherit',
          color: element.fontColor || 'inherit',
          fontWeight: element.fontWeight || 'inherit',
          fontStyle: element.fontStyle || 'inherit',
          textAlign: element.align || 'left',
          width: '100%',
          height: '100%',
          resize: 'none',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          padding: '4px',
          boxSizing: 'border-box',
          verticalAlign: 'top'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onFinishEditing();
            e.preventDefault();
          }
        }}
        onBlur={onFinishEditing}
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '4px',
        overflow: 'auto',
        boxSizing: 'border-box',
        backgroundColor: '#fffae6',
        border: '1px solid red',
        display: 'block'
      }}
    >
      <div
        style={{
          fontSize: element.fontSize ? `${element.fontSize}px` : 'inherit',
          color: element.fontColor || 'inherit',
          fontWeight: element.fontWeight || 'inherit',
          fontStyle: element.fontStyle || 'inherit',
          textAlign: element.align || 'left',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          width: '100%',
          backgroundColor: '#e6fffa'
        }}
      >
        {element.content || '\u00A0'}
      </div>
    </div>
  );
}

// --- ButtonElementContent ---
interface ButtonContentProps {
  element: ButtonElement;
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onFinishEditing: () => void;
}

export function ButtonElementContent({ element, isEditing, editableInputRef, onFinishEditing }: ButtonContentProps) {
  if (isEditing) {
    return (
      <Input
        ref={editableInputRef as React.RefObject<HTMLInputElement>}
        defaultValue={element.label}
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          padding: '4px',
          boxSizing: 'border-box'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter') {
            onFinishEditing();
            e.preventDefault();
          }
        }}
        onBlur={onFinishEditing}
      />
    );
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center text-sm
        ${element.style === "primary" ? "bg-primary text-primary-foreground hover:bg-primary/90" :
          element.style === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" :
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        }`}
      style={{
        borderRadius: '4px',
        cursor: 'pointer',
        padding: '4px',
        boxSizing: 'border-box',
        transition: 'colors'
      }}
    >
      {element.label || 'Button'}
    </div>
  );
}

// --- ImageElementContent ---
interface ImageContentProps {
  element: ImageElement;
}

export function ImageElementContent({ element }: ImageContentProps) {
  return (
    <img
      src={element.src}
      alt={element.alt || "Slide image"}
      style={{
        width: '100%',
        height: '100%',
        objectFit: element.objectFit || 'contain',
        display: 'block'
      }}
      draggable={false}
    />
  );
}

// --- HotspotElementContent ---
interface HotspotContentProps {
  element: HotspotElement;
}

export function HotspotElementContent({ element }: HotspotContentProps) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center border-2 border-dashed border-primary hover:border-primary/80 hover:bg-primary/10 ${
        element.shape === "circle" ? "rounded-full" : ""
      } cursor-pointer`}
      title={element.tooltip}
      style={{ boxSizing: 'border-box', transition: 'border-color, background-color' }}
    >
      {/* Invisible content */}
    </div>
  );
}

// --- ElementContent ---
interface ElementContentProps {
  element: SlideElement;
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onFinishEditing: () => void;
}

export function ElementContent({ element, isEditing, editableInputRef, onFinishEditing }: ElementContentProps) {
  switch (element.type) {
    case "text":
      return (
        <TextElementContent
          element={element}
          isEditing={isEditing}
          editableInputRef={editableInputRef}
          onFinishEditing={onFinishEditing}
        />
      );
    case "image":
      return <ImageElementContent element={element} />;
    case "button":
      return (
        <ButtonElementContent
          element={element}
          isEditing={isEditing}
          editableInputRef={editableInputRef}
          onFinishEditing={onFinishEditing}
        />
      );
    case "hotspot":
      return <HotspotElementContent element={element} />;
    default:
      const elementType = (element as any)?.type ?? 'unknown';
      return <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs p-2 text-center">Unsupported Element Type: {elementType}</div>;
  }
}
