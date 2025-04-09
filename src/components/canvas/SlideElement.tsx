
import React from "react";
import { SlideElement } from "@/utils/slideTypes";
import { ElementContent } from "./ElementContent";
import { ResizeHandles } from "./ResizeHandles";
import { TextContextMenu, DefaultContextMenu } from "./ContextMenus";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

interface SlideElementComponentProps {
  element: SlideElement;
  isSelected: boolean;
  isEditing: boolean;
  editableInputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, element: SlideElement) => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>, element: SlideElement) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement>, element: SlideElement) => void;
  onFinishEditing: () => void;
  // Context menu handlers
  onCut: (id: string) => void;
  onCopy: (id: string) => void;
  onPaste: (id: string) => void;
  onExitEdit: (id: string) => void;
  onFontStyleChange: (id: string, style: Partial<any>) => void;
  onParagraphStyleChange: (id: string, align: "left" | "center" | "right") => void;
  onHyperlinkChange: (id: string, url: string) => void;
  onDuplicate: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onSelect: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onDeleteInitiate: (id: string) => void;
  // State for popovers
  isFontPopoverOpen: boolean;
  setIsFontPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isParagraphPopoverOpen: boolean;
  setIsParagraphPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isHyperlinkPopoverOpen: boolean;
  setIsHyperlinkPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SlideElementComponent({
  element,
  isSelected,
  isEditing,
  editableInputRef,
  onMouseDown,
  onContextMenu,
  onDoubleClick,
  onFinishEditing,
  onCut,
  onCopy,
  onPaste,
  onExitEdit,
  onFontStyleChange,
  onParagraphStyleChange,
  onHyperlinkChange,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onSelect,
  onDeleteElement,
  onDeleteInitiate,
  isFontPopoverOpen,
  setIsFontPopoverOpen,
  isParagraphPopoverOpen,
  setIsParagraphPopoverOpen,
  isHyperlinkPopoverOpen,
  setIsHyperlinkPopoverOpen
}: SlideElementComponentProps) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
      <div
  onMouseDown={(e) => onMouseDown(e, element)}
  onContextMenu={(e) => onContextMenu(e, element)}
  onDoubleClick={(e) => onDoubleClick(e, element)}
  style={{
    ...baseStyle,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  }}
  className={`element ${isSelected ? 'outline outline-2 outline-primary' : ''}`}
>

          <ElementContent 
            element={element} 
            isEditing={isEditing} 
            editableInputRef={editableInputRef}
            onFinishEditing={onFinishEditing}
          />
          {isSelected && <ResizeHandles element={element} />}
        </div>
      </ContextMenuTrigger>
      
      {element.type === "text" ? (
        <TextContextMenu
          element={element}
          onCut={onCut}
          onCopy={onCopy}
          onPaste={onPaste}
          onExitEdit={onExitEdit}
          onFontStyleChange={onFontStyleChange}
          onParagraphStyleChange={onParagraphStyleChange}
          onHyperlinkChange={onHyperlinkChange}
          onDeleteElement={onDeleteElement}
          isFontPopoverOpen={isFontPopoverOpen}
          setIsFontPopoverOpen={setIsFontPopoverOpen}
          isParagraphPopoverOpen={isParagraphPopoverOpen}
          setIsParagraphPopoverOpen={setIsParagraphPopoverOpen}
          isHyperlinkPopoverOpen={isHyperlinkPopoverOpen}
          setIsHyperlinkPopoverOpen={setIsHyperlinkPopoverOpen}
        />
      ) : (
        <DefaultContextMenu
          element={element}
          onSelect={onSelect}
          onEditText={(id) => element.type === "button" ? onExitEdit(id) : onSelect(id)}
          onDuplicate={onDuplicate}
          onBringToFront={onBringToFront}
          onSendToBack={onSendToBack}
          onDeleteInitiate={onDeleteInitiate}
        />
      )}
    </ContextMenu>
  );
}
