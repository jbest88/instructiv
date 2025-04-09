
import { useState, useRef } from "react";
import { Eye, ChevronUp, ChevronDown } from "lucide-react";
import { Slide, TimelineItem, SlideElement } from "@/utils/slideTypes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePanels } from "@/contexts/PanelContext";
import { useProject } from "@/contexts/project";

interface TimelineProps {
  currentSlide: Slide;
}

export function Timeline({ currentSlide }: TimelineProps) {
  const [tab, setTab] = useState("timeline");
  const { timelineOpen, setTimelineOpen } = usePanels();
  const { handleUpdateSlide, selectedElementId } = useProject();
  
  // Refs for timeline item dragging
  const timelineRef = useRef<HTMLDivElement>(null);
  const [dragTarget, setDragTarget] = useState<{ id: string, type: 'start' | 'end' | 'move' } | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  
  // Use the slide's timelineItems or create from elements if not available
  const timelineItems = currentSlide.timelineItems || 
    currentSlide.elements.map(element => createTimelineItemFromElement(element));
  
  // Create time markers (in seconds)
  const timeMarkers = Array.from({ length: 30 }, (_, i) => i + 1);
  
  // Create a timeline item from an element if it doesn't exist
  function createTimelineItemFromElement(element: SlideElement): TimelineItem {
    return {
      id: `tl-${element.id}`,
      name: getElementName(element),
      type: element.type,
      startTime: 0,
      duration: 5, // Default 5 seconds duration
      linkedElementId: element.id
    };
  }
  
  // Get a display name for element based on type and properties
  function getElementName(element: SlideElement): string {
    if (element.type === "text") {
      return element.content.substring(0, 20) || "Text";
    } else if (element.type === "button") {
      return element.label || "Button";
    } else if (element.type === "image") {
      return "Image" + (element.alt ? `: ${element.alt.substring(0, 15)}` : "");
    } else {
      return "Hotspot";
    }
  }
  
  // Calculate pixel position from time value
  function timeToPosition(time: number): number {
    return time * 40; // 40px per second
  }
  
  // Calculate time value from pixel position
  function positionToTime(position: number): number {
    return Math.max(0, position / 40); // 40px per second
  }
  
  // Handle dragging start of timeline item
  function handleDragStart(
    e: React.MouseEvent, 
    id: string, 
    type: 'start' | 'end' | 'move'
  ) {
    e.preventDefault();
    setDragTarget({ id, type });
    setDragStartX(e.clientX);
    
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  }
  
  // Handle dragging movement
  function handleDragMove(e: MouseEvent) {
    if (!dragTarget || !timelineRef.current) return;
    
    const timelineRect = timelineRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStartX;
    const item = timelineItems.find(item => item.id === dragTarget.id);
    
    if (!item) return;
    
    const newItems = [...timelineItems];
    const itemIndex = newItems.findIndex(i => i.id === dragTarget.id);
    
    // Create a copy of the item for modification
    const updatedItem = {...newItems[itemIndex]};
    
    // Update based on drag type
    if (dragTarget.type === 'start') {
      const newStartTime = Math.max(0, item.startTime + positionToTime(deltaX));
      const maxStart = item.startTime + item.duration - 0.5; // Maintain minimum duration
      
      updatedItem.startTime = Math.min(newStartTime, maxStart);
      updatedItem.duration = item.duration - (updatedItem.startTime - item.startTime);
    } 
    else if (dragTarget.type === 'end') {
      const newDuration = Math.max(0.5, item.duration + positionToTime(deltaX));
      updatedItem.duration = newDuration;
    }
    else if (dragTarget.type === 'move') {
      const newStartTime = Math.max(0, item.startTime + positionToTime(deltaX));
      updatedItem.startTime = newStartTime;
    }
    
    // Update the item in the array
    newItems[itemIndex] = updatedItem;
    
    // Update slide with new timeline items
    handleUpdateSlide({
      timelineItems: newItems
    });
    
    // Reset for next move
    setDragStartX(e.clientX);
  }
  
  // Handle end of dragging
  function handleDragEnd() {
    setDragTarget(null);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  }
  
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
        <div className="bg-white p-0 h-[220px] overflow-y-auto">
          {/* Timeline ruler */}
          <div className="w-full" ref={timelineRef}>
            {/* Time markers */}
            <div className="flex h-5 border-b pl-14 pr-2">
              {timeMarkers.map((time) => (
                <div key={time} className="w-[40px] text-[10px] text-center border-r">
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
                timelineItems.map((item, index) => {
                  const startPosition = timeToPosition(item.startTime);
                  const width = timeToPosition(item.duration);
                  
                  return (
                    <div key={item.id} className="flex items-center h-10 border-b">
                      <div className="w-12 flex justify-center border-r">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="w-12 flex justify-center items-center border-r">
                        <input type="checkbox" className="h-3 w-3" />
                      </div>
                      <div className="w-40 text-xs p-1 border-r truncate">
                        {item.name}
                      </div>
                      
                      {/* Timeline bar with draggable edges */}
                      <div className="flex-1 relative h-full pl-1">
                        <div 
                          className={`absolute top-1.5 h-6 bg-blue-100 border border-blue-500 rounded flex items-center text-[10px] ${
                            item.linkedElementId === selectedElementId ? 'border-blue-700 bg-blue-200' : ''
                          }`} 
                          style={{ 
                            left: `${startPosition}px`, 
                            width: `${width}px`,
                            cursor: 'move'
                          }}
                          onMouseDown={(e) => handleDragStart(e, item.id, 'move')}
                        >
                          <div className="px-1 truncate flex-1">
                            {width > 50 ? item.name : ''}
                          </div>
                          
                          {/* Left resizer for start time */}
                          <div 
                            className="absolute left-0 top-0 w-3 h-full cursor-ew-resize"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, item.id, 'start');
                            }}
                          ></div>
                          
                          {/* Right resizer for end time */}
                          <div 
                            className="absolute right-0 top-0 w-3 h-full cursor-ew-resize"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, item.id, 'end');
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
