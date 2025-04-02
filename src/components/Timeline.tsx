
import { useState } from "react";
import { Eye, Loader } from "lucide-react";
import { Slide, TimelineItem } from "@/utils/slideTypes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimelineProps {
  currentSlide: Slide;
}

export function Timeline({ currentSlide }: TimelineProps) {
  const [tab, setTab] = useState("timeline");
  
  // Create some demo timeline items if none exist
  const timelineItems = currentSlide.timelineItems || [
    { id: '1', name: 'Button 6', type: 'button', startTime: 0, duration: 3 },
    { id: '2', name: 'Button 5', type: 'button', startTime: 0, duration: 3 },
    { id: '3', name: 'Button 4', type: 'button', startTime: 0, duration: 3 },
    { id: '4', name: 'Picture 3', type: 'image', startTime: 0, duration: 3 },
    { id: '5', name: 'Picture 2', type: 'image', startTime: 0, duration: 3 },
    { id: '6', name: 'Picture 1', type: 'image', startTime: 0, duration: 3 },
  ];
  
  // Create time markers (in seconds)
  const timeMarkers = Array.from({ length: 23 }, (_, i) => i + 1);
  
  return (
    <div className="w-full bg-white border-t flex flex-col">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="h-8 bg-white border-b rounded-none gap-2 p-1">
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
        
        <div className="flex bg-white p-0 h-[200px] overflow-y-auto">
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
              {timelineItems.map((item, index) => (
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
              ))}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
