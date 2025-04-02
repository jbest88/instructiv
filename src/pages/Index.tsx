import { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createDefaultProject } from "@/utils/defaultSlides";
import { Project, Slide, SlideElement, TextElement, ImageElement, ButtonElement, HotspotElement } from "@/utils/slideTypes";
import { Sidebar } from "@/components/Sidebar";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SlideControls } from "@/components/SlideControls";
import { PreviewModal } from "@/components/PreviewModal";
import { ToolboxPanel } from "@/components/ToolboxPanel";
import { PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Project state
  const [project, setProject] = useState<Project>(createDefaultProject());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toolboxOpen, setToolboxOpen] = useState(true);
  
  // Get current slide and element
  const currentSlide = project.slides.find(slide => slide.id === project.currentSlideId) || project.slides[0];
  const selectedElement = selectedElementId
    ? currentSlide.elements.find(element => element.id === selectedElementId) || null
    : null;
  
  // Function to select a slide
  const handleSelectSlide = (slideId: string) => {
    setProject(prev => ({
      ...prev,
      currentSlideId: slideId
    }));
    setSelectedElementId(null);
  };
  
  // Function to add a new slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${uuidv4()}`,
      title: `Slide ${project.slides.length + 1}`,
      elements: [],
      background: '#ffffff'
    };
    
    setProject(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
      currentSlideId: newSlide.id
    }));
    
    toast.success("New slide added");
  };
  
  // Function to delete a slide
  const handleDeleteSlide = (slideId: string) => {
    if (project.slides.length <= 1) {
      toast.error("Cannot delete the last slide");
      return;
    }
    
    const slideIndex = project.slides.findIndex(slide => slide.id === slideId);
    const newSlides = project.slides.filter(slide => slide.id !== slideId);
    
    // If deleting the current slide, select the previous or next slide
    let newCurrentSlideId = project.currentSlideId;
    if (slideId === project.currentSlideId) {
      const newIndex = slideIndex > 0 ? slideIndex - 1 : 0;
      newCurrentSlideId = newSlides[newIndex].id;
    }
    
    setProject(prev => ({
      ...prev,
      slides: newSlides,
      currentSlideId: newCurrentSlideId
    }));
    
    toast.success("Slide deleted");
  };
  
  // Function to add an element to the current slide
  const handleAddElement = (type: SlideElement['type']) => {
    let newElement: SlideElement;
    
    // Create the appropriate element type based on the 'type' parameter
    if (type === "text") {
      newElement = {
        id: `text-${uuidv4()}`,
        type: "text",
        content: "New Text",
        x: 200,
        y: 200,
        width: 300,
        height: 50,
        fontSize: 16,
        fontColor: "#333333"
      };
    } else if (type === "image") {
      newElement = {
        id: `image-${uuidv4()}`,
        type: "image",
        src: "/placeholder.svg",
        alt: "Placeholder image",
        x: 200,
        y: 200,
        width: 200,
        height: 150
      };
    } else if (type === "button") {
      newElement = {
        id: `button-${uuidv4()}`,
        type: "button",
        label: "Button",
        action: "nextSlide",
        style: "primary",
        x: 200,
        y: 200,
        width: 150,
        height: 50
      };
    } else if (type === "hotspot") {
      newElement = {
        id: `hotspot-${uuidv4()}`,
        type: "hotspot",
        tooltip: "Hotspot information",
        shape: "circle",
        x: 200,
        y: 200,
        width: 60,
        height: 60
      };
    } else {
      // This should never happen, but TypeScript needs this
      throw new Error(`Unsupported element type: ${type}`);
    }
    
    setProject(prev => {
      const updatedSlides = prev.slides.map(slide => {
        if (slide.id === prev.currentSlideId) {
          return {
            ...slide,
            elements: [...slide.elements, newElement]
          };
        }
        return slide;
      });
      
      return {
        ...prev,
        slides: updatedSlides
      };
    });
    
    setSelectedElementId(newElement.id);
    toast.success(`${type} element added`);
  };
  
  // Function to update an element
  const handleUpdateElement = (elementId: string, updates: Partial<SlideElement>) => {
    setProject(prev => {
      const updatedSlides = prev.slides.map(slide => {
        if (slide.id === prev.currentSlideId) {
          const updatedElements = slide.elements.map(element => {
            if (element.id === elementId) {
              return { ...element, ...updates };
            }
            return element;
          });
          
          return {
            ...slide,
            elements: updatedElements
          };
        }
        return slide;
      });
      
      return {
        ...prev,
        slides: updatedSlides
      };
    });
  };
  
  // Function to update slide properties
  const handleUpdateSlide = (updates: Partial<Slide>) => {
    setProject(prev => {
      const updatedSlides = prev.slides.map(slide => {
        if (slide.id === prev.currentSlideId) {
          return { ...slide, ...updates };
        }
        return slide;
      });
      
      return {
        ...prev,
        slides: updatedSlides
      };
    });
  };
  
  // Save project to localStorage
  const handleSaveProject = () => {
    try {
      localStorage.setItem('narratifyProject', JSON.stringify(project));
      toast.success("Project saved successfully");
    } catch (error) {
      toast.error("Failed to save project");
      console.error("Save error:", error);
    }
  };
  
  // Load project from localStorage
  const handleLoadProject = () => {
    try {
      const savedProject = localStorage.getItem('narratifyProject');
      
      if (savedProject) {
        setProject(JSON.parse(savedProject));
        toast.success("Project loaded successfully");
      } else {
        toast.info("No saved project found");
      }
    } catch (error) {
      toast.error("Failed to load project");
      console.error("Load error:", error);
    }
  };
  
  // Load saved project on initial render
  useEffect(() => {
    const savedProject = localStorage.getItem('narratifyProject');
    if (savedProject) {
      try {
        setProject(JSON.parse(savedProject));
      } catch (error) {
        console.error("Error loading saved project:", error);
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header/Toolbar */}
      <header className="h-14 border-b bg-card flex items-center px-4 shrink-0">
        <h1 className="text-xl font-semibold">Narratify Studio</h1>
        <span className="text-muted-foreground ml-2">
          {project.title}
        </span>
      </header>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with slides */}
        <Sidebar 
          slides={project.slides}
          currentSlideId={project.currentSlideId}
          onSelectSlide={handleSelectSlide}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
        />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top toolbar */}
          <SlideControls 
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onAddElement={handleAddElement}
            onPreview={() => setIsPreviewOpen(true)}
            onSaveProject={handleSaveProject}
            onLoadProject={handleLoadProject}
          />
          
          {/* Editor canvas */}
          <div className="flex-1 overflow-hidden bg-muted relative">
            <div className="absolute inset-6 shadow-lg bg-white rounded-md overflow-hidden">
              <SlideCanvas 
                slide={currentSlide}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
              />
            </div>
            
            {/* Toolbox toggle button (only when closed) */}
            {!toolboxOpen && (
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setToolboxOpen(true)}
              >
                <PanelRightOpen size={16} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Right toolbox panel */}
        <ToolboxPanel 
          onAddElement={handleAddElement}
          currentSlide={currentSlide}
          onUpdateSlide={handleUpdateSlide}
          isOpen={toolboxOpen}
          onToggle={() => setToolboxOpen(!toolboxOpen)}
        />
      </div>
      
      {/* Preview modal */}
      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        slides={project.slides}
        initialSlideId={project.currentSlideId}
      />
    </div>
  );
};

export default Index;
