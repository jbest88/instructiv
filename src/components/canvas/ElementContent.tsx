
import React, { useState, useEffect } from "react";
import { SlideElement } from "@/utils/slideTypes";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// --- TextElementContent ---
interface TextContentProps {
  element: SlideElement & { type: 'text'; content: string };
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onFinishEditing: (updatedValue?: string) => void;
}

export function TextElementContent({
  element,
  isEditing,
  editableInputRef,
  onFinishEditing
}: TextContentProps) {
  const [value, setValue] = useState(element.content);

  useEffect(() => {
    setValue(element.content);
  }, [element.content]);

  const handleFinish = () => {
    if (value !== element.content) {
      onFinishEditing(value); // 💾 send updated value
    } else {
      onFinishEditing(); // no change
    }
  };

  if (isEditing) {
    return (
      <Textarea
        ref={editableInputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleFinish}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            handleFinish();
          }
        }}
        style={{
          fontSize: element.fontSize ? `${element.fontSize}px` : "inherit",
          color: element.fontColor || "inherit",
          fontWeight: element.fontWeight || "inherit",
          fontStyle: element.fontStyle || "inherit",
          textAlign: element.align as any || "left",
          width: "100%",
          height: "100%",
          resize: "none",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          padding: "4px",
          boxSizing: "border-box",
          verticalAlign: "top",
          whiteSpace: "pre-wrap", // ✅ multiline preservation
          overflowWrap: "break-word"
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "4px",
        overflow: "auto",
        boxSizing: "border-box",
        display: "block",
        whiteSpace: "pre-wrap", // ✅ show line breaks
        wordBreak: "break-word"
      }}
    >
      <div
        style={{
          fontSize: element.fontSize ? `${element.fontSize}px` : "inherit",
          color: element.fontColor || "inherit",
          fontWeight: element.fontWeight || "inherit",
          fontStyle: element.fontStyle || "inherit",
          textAlign: element.align as any || "left",
          width: "100%"
        }}
      >
        {value || '\u00A0'}
      </div>
    </div>
  );
}


// --- ButtonElementContent ---
interface ButtonContentProps {
  element: SlideElement & { type: 'button'; label: string };
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
  element: SlideElement & { type: 'image'; src: string; alt?: string };
}

export function ImageElementContent({ element }: ImageContentProps) {
  return (
    <img
      src={element.src}
      alt={element.alt || "Slide image"}
      style={{
        width: '100%',
        height: '100%',
        objectFit: element.objectFit as any || 'contain',
        display: 'block'
      }}
      draggable={false}
    />
  );
}

// --- HotspotElementContent ---
interface HotspotContentProps {
  element: SlideElement & { type: 'hotspot'; tooltip?: string; shape?: string };
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
  onFinishEditing: (updatedValue?: string) => void;
}

export function ElementContent({ element, isEditing, editableInputRef, onFinishEditing }: ElementContentProps) {
  switch (element.type) {
    case "text":
      return (
        <TextElementContent
          element={element as SlideElement & { type: 'text'; content: string }}
          isEditing={isEditing}
          editableInputRef={editableInputRef}
          onFinishEditing={onFinishEditing}
        />
      );
    case "image":
      return <ImageElementContent element={element as SlideElement & { type: 'image'; src: string }} />;
    case "button":
      return (
        <ButtonElementContent
          element={element as SlideElement & { type: 'button'; label: string }}
          isEditing={isEditing}
          editableInputRef={editableInputRef}
          onFinishEditing={onFinishEditing}
        />
      );
    case "hotspot":
      return <HotspotElementContent element={element as SlideElement & { type: 'hotspot' }} />;
    default:
      const elementType = (element as any)?.type ?? 'unknown';
      return <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs p-2 text-center">Unsupported Element Type: {elementType}</div>;
  }
}
