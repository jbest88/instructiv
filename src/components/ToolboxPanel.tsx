import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/project";
import {
  SlidersHorizontal,
  ImagePlus,
  Text,
  Circle,
  SquarePlus,
} from "lucide-react";

export function ToolboxPanel() {
  const { handleAddElement, selectedElement, handleUpdateElement } = useProject();
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleAccordionItem = (item: string) => {
    if (expanded.includes(item)) {
      setExpanded(expanded.filter((i) => i !== item));
    } else {
      setExpanded([...expanded, item]);
    }
  };

  return (
    <div className="border-b p-2 bg-background">
      <h2 className="text-sm font-medium">Toolbox</h2>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="elements">
          <AccordionTrigger onClick={() => toggleAccordionItem("elements")}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Elements
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" onClick={() => handleAddElement("text")}>
                <Text className="mr-2 h-4 w-4" />
                Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleAddElement("image")}>
                <ImagePlus className="mr-2 h-4 w-4" />
                Image
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleAddElement("button")}>
                <SquarePlus className="mr-2 h-4 w-4" />
                Button
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleAddElement("hotspot")}>
                <Circle className="mr-2 h-4 w-4" />
                Hotspot
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        {selectedElement && selectedElement.type === "text" && (
          <AccordionItem value="text-settings">
            <AccordionTrigger onClick={() => toggleAccordionItem("text-settings")}>
              <Text className="mr-2 h-4 w-4" />
              Text Settings
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2">
                <label htmlFor="text-content" className="text-sm">
                  Content
                </label>
                <input
                  type="text"
                  id="text-content"
                  className="border rounded p-1 text-sm"
                  value={selectedElement.content || ""}
                  onChange={(e) =>
                    handleUpdateElement(selectedElement.id, { content: e.target.value })
                  }
                />
                <label htmlFor="text-font-size" className="text-sm">
                  Font Size
                </label>
                <input
                  type="number"
                  id="text-font-size"
                  className="border rounded p-1 text-sm"
                  value={selectedElement.fontSize || 16}
                  onChange={(e) =>
                    handleUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })
                  }
                />
                <label htmlFor="text-font-color" className="text-sm">
                  Font Color
                </label>
                <input
                  type="color"
                  id="text-font-color"
                  className="border rounded p-1 text-sm"
                  value={selectedElement.fontColor || "#000000"}
                  onChange={(e) =>
                    handleUpdateElement(selectedElement.id, { fontColor: e.target.value })
                  }
                />
                <label htmlFor="text-align" className="text-sm">
                  Text Align
                </label>
                <select
                  id="text-align"
                  className="border rounded p-1 text-sm"
                  value={selectedElement.textAlign || "left"}
                  onChange={(e) =>
                    handleUpdateElement(selectedElement.id, { textAlign: e.target.value as "left" | "center" | "right" })
                  }
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
