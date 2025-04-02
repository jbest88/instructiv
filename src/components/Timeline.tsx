
import { useState } from "react";
import { Eye, ChevronUp, ChevronDown } from "lucide-react";
import { Slide, TimelineItem } from "@/utils/slideTypes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePanels } from "@/contexts/PanelContext";

interface TimelineProps {
  currentSlide: Slide;
}

export function Timeline({ currentSlide }: TimelineProps) {
  const [tab, setTab] = useState("timeline");
  const { timelineOpen, setTimelineOpen } = usePanels();
  
  // Use the slide's timelineItems or an empty array instead of demo data
  const timelineItems = currentSlide.timelineItems || [];
  
  // Create time markers (in seconds)
  const timeMarkers = Array.from({ length: 23 }, (_, i) => i + 1);
  
  return (
    <Collapsible
      open={timelineOpen}
      onOpenChange={setTimelineOpen}
      className="w-full bg-white border-t flex flex-col"
    >
      <div className="flex items-center justify-between border-b p-1">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList className="h-8 bg-white rounded-none gap-2 p-1">
            <TabsTrigger 
              value="timeline" 
              className="h-6 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded px-3"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="states" 
              className="h-6 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded px-3"
            >
              States
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="h-6 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded px-3"
            >
              Notes
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-2">
            {!timelineOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="bg-white p-0 h-[180px] overflow-y-auto">
          {/* Timeline ruler */}
          <div className="w-full">
            {/* Time markers */}
            <div className="flex h-5 border-b pl-14 pr-2">
              {timeMarkers.map((time) => (
                <div key={time} className="flex-1 text-[10px] text-center border-r">
                  {time}s
                </div>
              ))}
            </div>
            
            {/* Timeline items */}
            <div className="timeline-items">
              {timelineItems.length === 0 ? (
                <div className="flex items-center justify-center h-36 text-muted-foreground">
                  No timeline items found for this slide
                </div>
              ) : (
                timelineItems.map((item, index) => (
                  <div key={item.id} className="flex items-center h-8 border-b">
                    <div className="w-12 flex justify-center border-r">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="w-12 flex justify-center items-center border-r">
                      <input type="checkbox" className="h-3 w-3" />
                    </div>
                    <div className="w-40 text-xs p-1 border-r">
                      {item.name}
                    </div>
                    
                    {/* Timeline bar */}
                    <div className="flex-1 relative h-full pl-1">
                      {item.type === 'button' ? (
                        <div className="absolute top-1 h-5 bg-blue-100 border border-blue-500 rounded flex items-center px-1 text-[10px]" style={{ width: '120px' }}>
                          Debug
                        </div>
                      ) : (
                        <div className="absolute top-1 h-5 bg-blue-100 border border-blue-500 rounded flex items-center px-1 text-[10px]" style={{ width: '120px' }}>
                          {item.name}.png
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
