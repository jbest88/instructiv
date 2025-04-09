import React from "react";
import { SlideElement, TextElement, ButtonElement, ImageElement, HotspotElement } from "@/utils/slideTypes"; // Assuming ImageElement and HotspotElement types exist here
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Interface for Text Element specific props
interface TextContentProps {
  element: TextElement;
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onFinishEditing: () => void;
}

// Component to render Text Element content (viewing and editing)
export function TextElementContent({ element, isEditing, editableInputRef, onFinishEditing }: TextContentProps) {
  if (isEditing) {
    return (
      <Textarea
        ref={editableInputRef as React.RefObject<HTMLTextAreaElement>}
        defaultValue={element.content}
        style={{
          // Inherited/dynamic styles
          fontSize: element.fontSize ? `${element.fontSize}px` : 'inherit',
          color: element.fontColor || 'inherit',
          fontWeight: element.fontWeight || 'inherit',
          fontStyle: element.fontStyle || 'inherit',
          textAlign: element.align || 'left',

          // Layout & Appearance styles
          width: '100%',
          height: '100%',
          resize: 'none',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          padding: '4px', // Ensures text isn't flush against the border
          boxSizing: 'border-box' // Include padding in width/height calculation
        }}
        onKeyDown={(e) => {
          // Finish editing on Escape key
          if (e.key === 'Escape') {
            onFinishEditing();
            e.preventDefault();
          }
          // Allow default behavior for Enter (creates newline) unless Shift is also pressed
          // (This prevents accidental submission if Enter is meant for newlines)
          // Or remove this block if Enter should *always* submit/finish editing
          // if (e.key === 'Enter' && !e.shiftKey) {
          //   onFinishEditing();
          //   e.preventDefault();
          // }
        }}
        // Optional: Finish editing when clicking outside
        onBlur={onFinishEditing}
      />
    );
  }

  // Viewing mode: Display text within a div
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
        overflow: 'hidden', // Hide overflow text (consider 'auto' for scrollbars)
        display: 'flex', // Use flexbox for alignment
        alignItems: 'flex-start', // Align inner content div to the top
        justifyContent: 'flex-start', // Align inner content div to the left
        whiteSpace: 'pre-wrap', // <<< THIS IS THE KEY FIX for newlines
        wordBreak: 'break-word' // Break long words if necessary
      }}
    >
      {/* Using a nested div ensures text alignment respects parent flex settings */}
      {/* Using 'pre-wrap' on parent makes this inner div respect newlines in content */}
      <div style={{ width: '100%' }}>
        {element.content || '\u00A0'} {/* Display content or a non-breaking space to maintain height */}
      </div>
    </div>
  );
}

// Interface for Button Element specific props
interface ButtonContentProps {
  element: ButtonElement;
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onFinishEditing: () => void;
}

// Component to render Button Element content (viewing and editing)
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
          // Finish editing on Escape or Enter key
          if (e.key === 'Escape' || e.key === 'Enter') {
            onFinishEditing();
            e.preventDefault();
          }
        }}
         // Optional: Finish editing when clicking outside
        onBlur={onFinishEditing}
      />
    );
  }

  // Viewing mode: Display styled button div
  return (
    <div
      className={`w-full h-full flex items-center justify-center text-sm // Adjust text size as needed
        ${element.style === "primary" ? "bg-primary text-primary-foreground hover:bg-primary/90" : // Added hover effect
          element.style === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : // Added hover effect
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground" // Example default/outline style
        }`}
      style={{
        borderRadius: '4px', // Consistent border radius
        cursor: 'pointer', // Indicate interactivity
        padding: '4px', // Add padding
        boxSizing: 'border-box',
        transition: 'colors' // Smooth transition for hover effects
      }}
    >
      {element.label || 'Button'} {/* Default text if label is empty */}
    </div>
  );
}

// Interface for Image Element specific props
interface ImageContentProps {
  element: ImageElement; // Use the specific ImageElement type
}

// Component to render Image Element content
export function ImageElementContent({ element }: ImageContentProps) {
  return (
    <img
      src={element.src}
      alt={element.alt || "Slide image"}
      style={{
        width: '100%',
        height: '100%',
        objectFit: element.objectFit || 'contain', // Use objectFit from element or default to 'contain'
        display: 'block' // Prevents extra space below image
      }}
      draggable={false} // Prevent native browser image dragging
    />
  );
}

// Interface for Hotspot Element specific props
interface HotspotContentProps {
  element: HotspotElement; // Use the specific HotspotElement type
}

// Component to render Hotspot Element content
export function HotspotElementContent({ element }: HotspotContentProps) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center border-2 border-dashed border-primary hover:border-primary/80 hover:bg-primary/10 ${ // Added hover effect
        element.shape === "circle" ? "rounded-full" : ""
      } cursor-pointer`} // Add cursor pointer
      title={element.tooltip} // Use tooltip for hover text
      style={{ boxSizing: 'border-box', transition: 'border-color, background-color' }} // Ensure border is inside, add transition
    >
      {/* Hotspots are typically invisible, so no inner content needed unless for editor view */}
      {/* <div className="opacity-50 text-xs">Hotspot</div> */}
    </div>
  );
}


// General interface for rendering any element's content
interface ElementContentProps {
  element: SlideElement;
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onFinishEditing: () => void;
}

// Main component that switches based on element type
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
      // Editing state isn't typically applicable to the image content itself here
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
       // Editing state isn't typically applicable to the hotspot content itself here
      return <HotspotElementContent element={element} />;
    // Add cases for other element types (Shape, Video, etc.) here
    // case "shape":
    //   return <ShapeElementContent element={element} />; // Example
    default:
      // Provide a fallback for unknown or unsupported types
      // Ensure the default case handles the element type assertion correctly if needed
      // const _exhaustiveCheck: never = element; // Uncomment for exhaustive type checking
      return <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs p-2 text-center">Unsupported Element Type: { (element as any).type }</div>;
  }
}