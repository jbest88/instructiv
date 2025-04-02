
import { 
  Copy, FilePlus, FileText, Redo, Undo, 
  AlignCenter, AlignLeft, AlignRight, 
  Bold, Italic, Underline, Type,
  Image, Square, Play, 
  ListOrdered, ListX, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slide } from "@/utils/slideTypes";

interface ToolbarProps {
  onPreview: () => void;
  openSlides?: { id: string; title: string }[];
  currentSlideId?: string; 
  onSelectSlide?: (slideId: string) => void;
  onCloseSlide?: (slideId: string) => void;
}

export function Toolbar({ 
  onPreview, 
  openSlides = [], 
  currentSlideId,
  onSelectSlide,
  onCloseSlide
}: ToolbarProps) {
  return (
    <div className="w-full bg-[#f3f2f1] border-b flex flex-col">
      {/* Main toolbar with tabs */}
      <div className="flex items-center px-2 h-8 bg-[#f3f2f1] gap-1">
        <div className="bg-blue-500 text-white px-3 py-1 text-xs font-semibold">FILE</div>
        <div className="bg-[#f3f2f1] hover:bg-gray-200 px-3 py-1 text-xs font-semibold">HOME</div>
        <div className="bg-[#f3f2f1] hover:bg-gray-200 px-3 py-1 text-xs font-semibold">INSERT</div>
        <div className="bg-[#f3f2f1] hover:bg-gray-200 px-3 py-1 text-xs font-semibold">SLIDES</div>
        <div className="bg-[#f3f2f1] hover:bg-gray-200 px-3 py-1 text-xs font-semibold">DESIGN</div>
        <div className="bg-[#f3f2f1] hover:bg-gray-200 px-3 py-1 text-xs font-semibold">TRANSITIONS</div>
        <div className="bg-[#f3f2f1] hover:bg-gray-200 px-3 py-1 text-xs font-semibold">ANIMATIONS</div>
        <div className="bg-[#f3f2f1] hover:bg-gray-200 px-3 py-1 text-xs font-semibold">VIEW</div>
        <div className="bg-[#f3f2f1] hover:bg-gray-200 px-3 py-1 text-xs font-semibold">HELP</div>
      </div>

      {/* Edit toolbar with all the editing options */}
      <div className="flex items-stretch h-24 bg-white border-b">
        {/* Clipboard section */}
        <div className="flex flex-col items-center justify-center border-r px-4 py-2 w-24">
          <div className="flex flex-col items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FilePlus size={16} />
            </Button>
            <span className="text-xs">Paste</span>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Copy size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <FilePlus size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <FileText size={12} />
            </Button>
          </div>
          <span className="text-[10px] mt-1">Clipboard</span>
        </div>

        {/* Slides section */}
        <div className="flex flex-col items-center justify-center border-r px-4 py-2 w-32">
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-12 w-12 bg-gray-100">
                <FilePlus size={16} />
              </Button>
              <span className="text-xs">New Slide</span>
            </div>
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Play size={12} />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <FilePlus size={12} />
              </Button>
            </div>
          </div>
          <span className="text-[10px] mt-2">Slide</span>
        </div>

        {/* Text editing section */}
        <div className="flex flex-col border-r px-4 py-2">
          <div className="text-xs font-semibold mb-1">Text Styles</div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Bold size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Italic size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Underline size={12} />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Type size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Image size={12} />
            </Button>
          </div>
          <div className="text-xs font-semibold mt-2 mb-1">Font</div>
        </div>

        {/* Paragraph section */}
        <div className="flex flex-col border-r px-4 py-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <AlignLeft size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <AlignCenter size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <AlignRight size={12} />
            </Button>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ListOrdered size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ListX size={12} />
            </Button>
          </div>
          <div className="text-xs font-semibold mt-2">Paragraph</div>
        </div>

        {/* Drawing section */}
        <div className="flex flex-col items-center justify-center border-r px-4 py-2 w-32">
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Square size={16} />
              </Button>
              <span className="text-xs">Drawing</span>
            </div>
          </div>
        </div>

        {/* Publish section */}
        <div className="flex flex-col items-center justify-center px-4 py-2 w-32">
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-12 w-12" onClick={onPreview}>
                <Play size={16} />
              </Button>
              <span className="text-xs">Preview</span>
            </div>
          </div>
          <span className="text-[10px] mt-2">Publish</span>
        </div>
      </div>

      {/* Slide navigation tabs */}
      <div className="flex items-center h-8 bg-[#f3f2f1] border-b px-2 gap-2">
        <div className="bg-gray-200 px-2 py-1 text-xs font-medium rounded">
          STORY VIEW
        </div>
        
        {openSlides.map(slide => (
          <div 
            key={slide.id}
            className={`relative flex items-center ${
              currentSlideId === slide.id ? "bg-blue-500 text-white" : "bg-gray-200"
            } px-2 py-1 text-xs font-medium rounded group`}
            onClick={() => onSelectSlide && onSelectSlide(slide.id)}
          >
            {slide.title}
            <button 
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onCloseSlide && onCloseSlide(slide.id);
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
