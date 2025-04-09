
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RibbonMenuAccordionProps {
  title: string;
  children: React.ReactNode;
}

export function RibbonMenuAccordion({
  title,
  children,
}: RibbonMenuAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="relative"
    >
      <CollapsibleTrigger className="font-medium px-4 py-2 flex items-center gap-1 hover:bg-accent rounded-sm transition-colors">
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="absolute top-full left-0 bg-background border rounded-md shadow-md z-50 py-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
