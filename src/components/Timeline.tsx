
import { useState, useRef, useEffect } from "react";
import { Eye, ChevronUp, ChevronDown, Lock, Unlock } from "lucide-react";
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
  
  // State for timeline scale and position
  const [timelineScale, setTimelineScale] = useState(40); // pixels per second
  const [timelineDuration, setTimelineDuration] = useState(30); // seconds
  
  // Create or update timeline items from elements if needed
  useEffect(() => {
    // If slide has no timeline items, create them from elements
    if (!currentSlide.timelineItems || currentSlide.timelineItems.length === 0) {
      const newTimelineItems = currentSlide.elements.map(element => 
        createTimelineItemFromElement(element)
      );
      
      if (newTimelineItems.length > 0) {
        handleUpdateSlide({
          timelineItems: newTimelineItems
        });
      }
    } else {
      // Check for new elements that don't have timeline items
      const existingElementIds = currentSlide.timelineItems.map(item => item.linkedElementId);
      const elementsWithoutTimeline = currentSlide.elements.filter(
        element => !existingElementIds.includes(element.id)
      );
      
      if (elementsWithoutTimeline.length > 0) {
        const newItems = elementsWithoutTimeline.map(element => 
          createTimelineItemFromElement(element)
        );
        
        handleUpdateSlide({
          timelineItems: [...(currentSlide.timelineItems || []), ...newItems]
        });
      }
    }
  }, [currentSlide.elements]);
  
  // Use the slide's timelineItems or create from elements if not available
  const timelineItems = currentSlide.timelineItems || 
    currentSlide.elements.map(element => createTimelineItemFromElement(element));
  
  // Create time markers (in seconds)
  const timeMarkers = Array.from({ length: timelineDuration }, (_, i) => i + 1);
  
  // Create a timeline item from an element if it doesn't exist
  function createTimelineItemFromElement(element: SlideElement): TimelineItem {
    return {
      id: `tl-${element.id}`,
      name: getElementName(element),
      type: element.type,
      startTime: 0,
      duration: 5, // Default 5 seconds duration
      linkedElementId: element.id,
      isLocked: false,
      isVisible: true
    };
  }
  
  // Get a display name for element based on type and properties
  function getElementName(element: SlideElement): string {
    if (element.type === "text") {
      const textContent = element.content || "Text";
      return textContent.length > 20 ? textContent.substring(0, 20) + "..." : textContent;
    } else if (element.type === "button") {
      const label = element.label || "Button";
      return label.length > 20 ? label.substring(0, 20) + "..." : label;
    } else if (element.type === "image") {
      return "Image" + (element.alt ? `: ${element.alt.substring(0, 15)}` : "");
    } else {
      return "Hotspot";
    }
  }
  
  // Calculate pixel position from time value
  function timeToPosition(time: number): number {
    return time * timelineScale;
  }
  
  // Calculate time value from pixel position
  function positionToTime(position: number): number {
    return Math.max(0, position / timelineScale);
  }
  
  // Toggle element visibility
  function toggleElementVisibility(itemId: string) {
    const item = timelineItems.find(item => item.id === itemId);
    if (!item) return;
    
    const newItems = [...timelineItems];
    const itemIndex = newItems.findIndex(i => i.id === itemId);
    
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      isVisible: !newItems[itemIndex].isVisible
    };
    
    // Update slide with updated timelineItems
    handleUpdateSlide({
      timelineItems: newItems
    });
  }
  
  // Toggle element lock state
  function toggleElementLock(itemId: string) {
    const item = timelineItems.find(item => item.id === itemId);
    if (!item) return;
    
    const newItems = [...timelineItems];
    const itemIndex = newItems.findIndex(i => i.id === itemId);
    
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      isLocked: !newItems[itemIndex].isLocked
    };
    
    // Update slide with updated timelineItems
    handleUpdateSlide({
      timelineItems: newItems
    });
  }
  
  // Handle dragging start of timeline item
  function handleDragStart(
    e: React.MouseEvent, 
    id: string, 
    type: 'start' | 'end' | 'move'
  ) {
    e.preventDefault();
    
    // Check if item is locked
    const item = timelineItems.find(item => item.id === id);
    if (item?.isLocked) return;
    
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
      
      // If duration increased, check if we need to extend timeline
      if (updatedItem.startTime + updatedItem.duration > timelineDuration - 2) {
        setTimelineDuration(prevDuration => Math.max(prevDuration, 
          Math.ceil(updatedItem.startTime + updatedItem.duration) + 5));
      }
    }
    else if (dragTarget.type === 'move') {
      const newStartTime = Math.max(0, item.startTime + positionToTime(deltaX));
      updatedItem.startTime = newStartTime;
      
      // If item moved near end, check if we need to extend timeline
      if (updatedItem.startTime + updatedItem.duration > timelineDuration - 2) {
        setTimelineDuration(prevDuration => Math.max(prevDuration, 
          Math.ceil(updatedItem.startTime + updatedItem.duration) + 5));
      }
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
  
  // Increase timeline scale (zoom in)
  function zoomInTimeline() {
    setTimelineScale(prev => Math.min(prev + 10, 100));
  }
  
  // Decrease timeline scale (zoom out)
  function zoomOutTimeline() {
    setTimelineScale(prev => Math.max(prev - 10, 20));
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
        
        {/* Timeline zoom controls */}
        <div className="flex items-center mr-1 gap-1">
          <Button variant="ghost" size="icon" onClick={zoomOutTimeline} className="h-6 w-6">
            <span className="text-xs font-bold">-</span>
          </Button>
          <span className="text-xs">{timelineScale}px/s</span>
          <Button variant="ghost" size="icon" onClick={zoomInTimeline} className="h-6 w-6">
            <span className="text-xs font-bold">+</span>
          </Button>
        </div>
        
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-2">
            {!timelineOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="bg-white p-0 h-[220px] overflow-y-auto">
          {/* Timeline ruler */}
          <div className="w-full overflow-x-auto" ref={timelineRef}>
            {/* Time markers */}
            <div className="flex h-5 border-b pl-36 pr-2 sticky top-0 bg-white z-10">
              {timeMarkers.map((time) => (
                <div 
                  key={time} 
                  className="text-[10px] text-center border-r flex-shrink-0"
                  style={{ width: `${timelineScale}px` }}
                >
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
                  
                  // Get the associated element to check if it exists
                  const element = currentSlide.elements.find(el => el.id === item.linkedElementId);
                  if (!element) return null; // Skip items with no associated element
                  
                  return (
                    <div key={item.id} className="flex items-center h-10 border-b">
                      {/* Visibility toggle */}
                      <div className="w-10 flex justify-center border-r">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${!item.isVisible ? 'text-gray-400' : 'text-blue-500'}`}
                          onClick={() => toggleElementVisibility(item.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Lock toggle */}
                      <div className="w-10 flex justify-center border-r">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${item.isLocked ? 'text-blue-500' : 'text-gray-400'}`}
                          onClick={() => toggleElementLock(item.id)}
                        >
                          {item.isLocked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Element name */}
                      <div 
                        className={`w-16 text-xs p-1 border-r truncate ${
                          item.linkedElementId === selectedElementId ? 'bg-blue-50 font-medium' : ''
                        }`}
                      >
                        {item.name}
                      </div>
                      
                      {/* Timeline bar with draggable edges */}
                      <div className="flex-1 relative h-full pl-1">
                        <div 
                          className={`absolute top-1.5 h-6 bg-blue-100 border border-blue-500 rounded flex items-center text-[10px] ${
                            item.linkedElementId === selectedElementId ? 'border-blue-700 bg-blue-200' : ''
                          } ${item.isLocked ? 'opacity-50' : ''}`} 
                          style={{ 
                            left: `${startPosition}px`, 
                            width: `${width}px`,
                            cursor: item.isLocked ? 'not-allowed' : 'move'
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
