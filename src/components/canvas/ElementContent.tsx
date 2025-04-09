import React from "react";
import { SlideElement, TextElement, ButtonElement } from "@/utils/slideTypes";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
          verticalAlign: 'top',
          alignSelf: 'flex-start'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onFinishEditing();
            e.preventDefault();
          }
        }}
      />
    );
  }
  
  return (
    <div
      style={{
        fontSize: element.fontSize ? `${element.fontSize}px` : 'inherit',
        color: element.fontColor || 'inherit',
        fontWeight: element.fontWeight || 'inherit',
        fontStyle: element.fontStyle || 'inherit',
        textAlign: element.align || 'left',
        width: '100%',
        height: '100%',
        padding: '4px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}
    >
      {element.content}
    </div>
  );
}

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
          padding: '4px'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onFinishEditing();
            e.preventDefault();
          }
          if (e.key === 'Enter') {
            onFinishEditing();
            e.preventDefault();
          }
        }}
      />
    );
  }
  
  return (
    <div 
      className={`w-full h-full flex items-center justify-center
        ${element.style === "primary" ? "bg-primary text-primary-foreground" : 
          element.style === "secondary" ? "bg-secondary text-secondary-foreground" : 
          "border border-primary bg-transparent"}`}
      style={{
        borderRadius: '4px'
      }}
    >
      {element.label}
    </div>
  );
}

interface ImageContentProps {
  src: string;
  alt?: string;
}

export function ImageElementContent({ src, alt }: ImageContentProps) {
  return (
    <img
      src={src}
      alt={alt || "Slide image"}
      style={{
        width: '100%', 
        height: '100%', 
        objectFit: 'contain'
      }}
      draggable={false}
    />
  );
}

interface HotspotContentProps {
  tooltip: string;
  shape: string;
}

export function HotspotElementContent({ tooltip, shape }: HotspotContentProps) {
  return (
    <div 
      className={`w-full h-full flex items-center justify-center border-2 border-dashed border-primary ${
        shape === "circle" ? "rounded-full" : ""
      }`}
      title={tooltip}
    >
      <div className="opacity-50">Hotspot</div>
    </div>
  );
}

interface ElementContentProps {
  element: SlideElement;
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onFinishEditing: () => void;
}

export function ElementContent({ element, isEditing, editableInputRef, onFinishEditing }: ElementContentProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onFinishEditing();
      e.preventDefault();
    }
    if (element.type === "button" && e.key === 'Enter') {
      onFinishEditing();
      e.preventDefault();
    }
  };

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
      return <ImageElementContent src={element.src} alt={element.alt} />;
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
      return <HotspotElementContent tooltip={element.tooltip} shape={element.shape} />;
    default:
      return <div>Unknown element type</div>;
  }
}
