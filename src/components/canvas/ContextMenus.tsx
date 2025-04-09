
import React from "react";
import { SlideElement } from "@/utils/slideTypes";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuHighlightGroup,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { 
  Scissors, 
  Copy, 
  ClipboardPaste, 
  PenSquare, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Plus, 
  Palette, 
  Link, 
  Square,
  Trash 
} from "lucide-react";

// Text context menu component
export function TextContextMenu({ 
  element, 
  onCut, 
  onCopy, 
  onPaste, 
  onExitEdit,
  onFontStyleChange,
  onParagraphStyleChange,
  onHyperlinkChange,
  onDeleteElement,
  isFontPopoverOpen,
  setIsFontPopoverOpen,
  isParagraphPopoverOpen,
  setIsParagraphPopoverOpen,
  isHyperlinkPopoverOpen,
  setIsHyperlinkPopoverOpen
}: { 
  element: SlideElement;
  onCut: (id: string) => void;
  onCopy: (id: string) => void;
  onPaste: (id: string) => void;
  onExitEdit: (id: string) => void;
  onFontStyleChange: (id: string, style: Partial<any>) => void;
  onParagraphStyleChange: (id: string, align: "left" | "center" | "right") => void;
  onHyperlinkChange: (id: string, url: string) => void;
  onDeleteElement: (id: string) => void;
  isFontPopoverOpen: boolean;
  setIsFontPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isParagraphPopoverOpen: boolean;
  setIsParagraphPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isHyperlinkPopoverOpen: boolean;
  setIsHyperlinkPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <ContextMenuContent className="w-64">
      {/* Cut, Copy, Paste section */}
      <ContextMenuItem onClick={() => onCut(element.id)}>
        <Scissors className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="underline">C</span>ut
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onCopy(element.id)}>
        <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="underline">C</span>opy
      </ContextMenuItem>
      
      {/* Paste Options section */}
      <ContextMenuHighlightGroup title="Paste Options:">
        <ContextMenuItem onClick={() => onPaste(element.id)}>
          <ClipboardPaste className="mr-2 h-4 w-4 text-orange-400" />
          Paste
        </ContextMenuItem>
      </ContextMenuHighlightGroup>
      
      <ContextMenuSeparator />
      
      {/* Exit Edit Text option */}
      <ContextMenuItem onClick={() => onExitEdit(element.id)}>
        <PenSquare className="mr-2 h-4 w-4 text-muted-foreground" />
        Exit Edit Text
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      {/* Font section */}
      <Popover open={isFontPopoverOpen} onOpenChange={setIsFontPopoverOpen}>
        <PopoverTrigger asChild>
          <ContextMenuItem onClick={() => setIsFontPopoverOpen(true)} className="cursor-default">
            <Type className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">F</span>ont...
          </ContextMenuItem>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Font Settings</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm">Size</label>
                  <Input 
                    type="number" 
                    min={8} 
                    max={72} 
                    defaultValue={element.type === "text" ? element.fontSize || 16 : 16}
                    onChange={(e) => onFontStyleChange(element.id, { fontSize: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm">Color</label>
                  <Input 
                    type="color" 
                    defaultValue={element.type === "text" ? element.fontColor || "#000000" : "#000000"}
                    onChange={(e) => onFontStyleChange(element.id, { fontColor: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.fontWeight === "bold" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => onFontStyleChange(element.id, { fontWeight: element.type === "text" && element.fontWeight === "bold" ? "normal" : "bold" })}
                >
                  B
                </button>
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.fontStyle === "italic" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => onFontStyleChange(element.id, { fontStyle: element.type === "text" && element.fontStyle === "italic" ? "normal" : "italic" })}
                >
                  I
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Paragraph section */}
      <Popover open={isParagraphPopoverOpen} onOpenChange={setIsParagraphPopoverOpen}>
        <PopoverTrigger asChild>
          <ContextMenuItem onClick={() => setIsParagraphPopoverOpen(true)} className="cursor-default">
            <AlignLeft className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">P</span>aragraph...
          </ContextMenuItem>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Paragraph Settings</h4>
              <div className="flex gap-2">
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.align === "left" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => onParagraphStyleChange(element.id, "left")}
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.align === "center" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => onParagraphStyleChange(element.id, "center")}
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button 
                  className={`px-2 py-1 border rounded ${element.type === "text" && element.align === "right" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => onParagraphStyleChange(element.id, "right")}
                >
                  <AlignRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <ContextMenuSeparator />
      
      {/* Style options */}
      <ContextMenuItem>
        <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
        Apply style
      </ContextMenuItem>
      <ContextMenuItem>
        <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
        Update style from selection
      </ContextMenuItem>
      <ContextMenuItem>
        <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
        Create custom style from selection...
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      {/* Hyperlink section */}
      <Popover open={isHyperlinkPopoverOpen} onOpenChange={setIsHyperlinkPopoverOpen}>
        <PopoverTrigger asChild>
          <ContextMenuItem onClick={() => setIsHyperlinkPopoverOpen(true)} className="cursor-default">
            <Link className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">H</span>yperlink...
          </ContextMenuItem>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Insert Hyperlink</h4>
              <Input 
                placeholder="https://example.com" 
                onChange={(e) => {}}
              />
              <div className="flex justify-end">
                <button 
                  className="px-2 py-1 bg-primary text-primary-foreground rounded"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="https://example.com"]') as HTMLInputElement;
                    if (input) {
                      onHyperlinkChange(element.id, input.value);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Format Shape option */}
      <ContextMenuItem>
        <Square className="mr-2 h-4 w-4 text-muted-foreground" />
        Format Shape
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      {/* Delete option */}
      <ContextMenuItem 
        onClick={() => onDeleteElement(element.id)} 
        className="text-red-500"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

// Default context menu for non-text elements
export function DefaultContextMenu({ 
  element, 
  onSelect,
  onEditText,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onDeleteInitiate
}: { 
  element: SlideElement;
  onSelect: (id: string) => void;
  onEditText: (id: string) => void;
  onDuplicate: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onDeleteInitiate: (id: string) => void;
}) {
  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={() => onSelect(element.id)}>Select</ContextMenuItem>
      {element.type === "text" && (
        <ContextMenuItem onClick={() => onEditText(element.id)}>Edit Text</ContextMenuItem>
      )}
      {element.type === "button" && (
        <ContextMenuItem onClick={() => onEditText(element.id)}>Edit Button</ContextMenuItem>
      )}
      <ContextMenuItem onClick={() => onDuplicate(element.id)}>Duplicate</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => onBringToFront(element.id)}>Bring to Front</ContextMenuItem>
      <ContextMenuItem onClick={() => onSendToBack(element.id)}>Send to Back</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem 
        onClick={() => onDeleteInitiate(element.id)} 
        className="text-red-500"
      >
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
