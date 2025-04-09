
import React from "react";
import { SlideElement } from "@/utils/slideTypes";

interface ResizeHandlesProps {
  element: SlideElement;
}

export function ResizeHandles({ element }: ResizeHandlesProps) {
  const handles = [
    { position: 'n', style: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },
    { position: 's', style: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },
    { position: 'e', style: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
    { position: 'w', style: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
    { position: 'ne', style: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize' },
    { position: 'nw', style: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize' },
    { position: 'se', style: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize' },
    { position: 'sw', style: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize' }
  ];

  return (
    <>
      {handles.map(handle => (
        <div
          key={handle.position}
          className={`resize-handle absolute w-3 h-3 bg-primary rounded-full ${handle.style}`}
          data-handle={handle.position}
        />
      ))}
    </>
  );
}
