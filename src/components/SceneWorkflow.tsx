
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useProject } from "@/contexts/project";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, ZoomIn, ZoomOut, Workflow, Link } from "lucide-react";
import { Scene, Slide, SlideElement, ButtonElement } from "@/utils/slideTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

// Define a type for the scene positions used for hit detection
interface ScenePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

export function SceneWorkflow() {
  const { project, currentScene, handleSelectScene, handleSelectSlide } = useProject();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [selectedSceneForModal, setSelectedSceneForModal] = useState<Scene | null>(null);
  const navigate = useNavigate();
  
  // Create a ref to store scene positions for hit detection
  const scenePositionsRef = useRef<Map<string, ScenePosition>>(new Map());
  
  // Find connections between scenes based on button triggers
  const sceneConnections = useMemo(() => {
    const connections: {
      fromSceneId: string;
      fromSlideId: string;
      toSceneId: string;
      label?: string;
      fromTitle: string;
      toTitle: string;
    }[] = [];
    
    // Loop through all scenes and their slides to find button elements with goToScene actions
    project.scenes.forEach(scene => {
      if (!scene.slides) return;
      
      scene.slides.forEach(slide => {
        // Find button elements that may contain scene navigation actions
        const buttonElements = slide.elements.filter(
          element => element.type === 'button'
        ) as ButtonElement[];
        
        buttonElements.forEach(button => {
          // Check if the button has an action that points to another scene
          if (button.action && button.action.startsWith('goToScene:')) {
            const targetSceneId = button.action.split(':')[1];
            const targetScene = project.scenes.find(s => s.id === targetSceneId);
            
            if (targetScene) {
              connections.push({
                fromSceneId: scene.id,
                fromSlideId: slide.id,
                toSceneId: targetSceneId,
                label: button.label || 'Go to scene',
                fromTitle: scene.title,
                toTitle: targetScene.title
              });
            }
          }
        });
      });
    });
    
    return connections;
  }, [project.scenes]);

  // Function to handle double click on a scene
  const handleSceneDoubleClick = (sceneId: string) => {
    const scene = project.scenes.find(s => s.id === sceneId);
    if (scene) {
      setSelectedSceneForModal(scene);
    }
  };

  // Function to navigate to a specific slide
  const handleNavigateToSlide = (sceneId: string, slideId: string) => {
    handleSelectScene(sceneId);
    handleSelectSlide(slideId);
    setSelectedSceneForModal(null);
    navigate('/'); // Navigate back to the main editor
  };
  
  const renderWorkflow = () => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match container
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // Create a map to store scene positions
    const scenePositions = new Map<string, ScenePosition>();
    
    // Draw scene nodes
    const sceneSpacing = 250;
    const sceneWidth = 180;
    const sceneHeight = 120;
    
    project.scenes.forEach((scene, index) => {
      const x = 200 + (index % 3) * sceneSpacing;
      const y = 150 + Math.floor(index / 3) * sceneSpacing;
      
      // Store scene position
      scenePositions.set(scene.id, { 
        x: x + sceneWidth / 2, 
        y: y + sceneHeight / 2, 
        width: sceneWidth, 
        height: sceneHeight,
        left: x,
        top: y 
      });
      
      // Draw scene node
      ctx.fillStyle = scene.id === project.currentSceneId ? "#e0f2fe" : "#f8fafc";
      ctx.strokeStyle = scene.id === project.currentSceneId ? "#0ea5e9" : "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, sceneWidth, sceneHeight, 8);
      ctx.fill();
      ctx.stroke();
      
      // Draw scene title
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(scene.title, x + sceneWidth / 2, y + 30);
      
      // Draw slide count
      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${scene.slides.length} slide${scene.slides.length !== 1 ? 's' : ''}`, x + sceneWidth / 2, y + 50);
      
      // Draw connection count if any
      const outgoingConnections = sceneConnections.filter(conn => conn.fromSceneId === scene.id);
      const incomingConnections = sceneConnections.filter(conn => conn.toSceneId === scene.id);
      
      if (outgoingConnections.length > 0 || incomingConnections.length > 0) {
        ctx.fillStyle = "#64748b";
        ctx.font = "11px sans-serif";
        ctx.fillText(
          `${outgoingConnections.length} out · ${incomingConnections.length} in`, 
          x + sceneWidth / 2, 
          y + 70
        );
      }

      // Add "Double click to view slides" hint
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px sans-serif";
      ctx.fillText("Double click to view slides", x + sceneWidth / 2, y + 90);
    });
    
    // Update the ref with current positions for hit detection
    scenePositionsRef.current = scenePositions;
    
    // Draw connections between scenes
    ctx.lineWidth = 2;
    
    sceneConnections.forEach(conn => {
      const fromPos = scenePositions.get(conn.fromSceneId);
      const toPos = scenePositions.get(conn.toSceneId);
      
      if (fromPos && toPos) {
        // Draw connection line
        const startX = fromPos.x;
        const startY = fromPos.y;
        const endX = toPos.x;
        const endY = toPos.y;
        
        // Determine if this is a currentScene connection
        const isActive = conn.fromSceneId === project.currentSceneId || 
                          conn.toSceneId === project.currentSceneId;
        
        // Draw curved connection line
        ctx.beginPath();
        ctx.strokeStyle = isActive ? "#0ea5e9" : "#94a3b8";
        
        // Calculate control points for the curve
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const curvature = 0.2;
        const dx = endX - startX;
        const dy = endY - startY;
        const normLength = Math.sqrt(dx * dx + dy * dy);
        
        // Perpendicular offset for curve
        const offsetX = curvature * normLength * (dy / normLength);
        const offsetY = curvature * normLength * (-dx / normLength);
        
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, endX, endY);
        ctx.stroke();
        
        // Draw arrow
        const angle = Math.atan2(endY - (midY + offsetY), endX - (midX + offsetX));
        const arrowSize = 8;
        
        ctx.beginPath();
        ctx.fillStyle = isActive ? "#0ea5e9" : "#94a3b8";
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle - Math.PI / 6),
          endY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle + Math.PI / 6),
          endY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
        
        // Draw connection label
        if (conn.label) {
          ctx.font = "11px sans-serif";
          ctx.fillStyle = "#64748b";
          ctx.textAlign = "center";
          ctx.fillText(
            conn.label,
            midX + offsetX,
            midY + offsetY
          );
        }
      }
    });
    
    ctx.restore();
  };
  
  // Handle mouse interactions for pan and zoom
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomChange = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(0.5, Math.min(2.5, prev * zoomChange)));
    };

    // Handle scene double click
    const handleClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Get canvas position and size
      const rect = canvas.getBoundingClientRect();
      
      // Convert mouse position to canvas coordinates
      const mouseX = (e.clientX - rect.left) / zoom - pan.x / zoom;
      const mouseY = (e.clientY - rect.top) / zoom - pan.y / zoom;
      
      // Check if click is on a scene
      const scenePositions = scenePositionsRef.current;
      
      // Iterate over the Map entries
      for (const [sceneId, pos] of scenePositions.entries()) {
        if (
          mouseX >= pos.left &&
          mouseX <= pos.left + pos.width &&
          mouseY >= pos.top &&
          mouseY <= pos.top + pos.height
        ) {
          // Handle single vs double click
          if (e.detail === 2) { // Double click
            handleSceneDoubleClick(sceneId);
          } else { // Single click
            handleSelectScene(sceneId);
          }
          break;
        }
      }
    };
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);
      canvas.addEventListener('wheel', handleWheel);
      canvas.addEventListener('click', handleClick);
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [isDragging, lastMousePos, zoom, handleSelectScene]);
  
  // Render canvas whenever dependencies change
  useEffect(() => {
    renderWorkflow();
    
  }, [project, zoom, pan, sceneConnections]);
  
  // Update canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      renderWorkflow();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <Workflow className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-lg font-medium">Scene Workflow</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))} title="Zoom Out">
            <ZoomOut size={18} />
          </Button>
          <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={() => setZoom(prev => Math.min(2.5, prev + 0.1))} title="Zoom In">
            <ZoomIn size={18} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setZoom(1); setPan({ x: 50, y: 50 }); }}>
            Reset View
          </Button>
        </div>
      </div>
      
      {sceneConnections.length === 0 && (
        <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
          <div className="bg-blue-50 p-6 rounded-lg max-w-md">
            <Link className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Scene Connections</h3>
            <p className="text-gray-600 mb-4">
              Add buttons to slides with "goToScene:" actions to create connections between scenes.
              These connections will appear as lines in this workflow view.
            </p>
          </div>
        </div>
      )}
      
      <div ref={containerRef} className="flex-1 overflow-hidden relative">
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-move"
        />
      </div>

      {/* Slides modal */}
      {selectedSceneForModal && (
        <Dialog open={!!selectedSceneForModal} onOpenChange={(open) => !open && setSelectedSceneForModal(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Slides in {selectedSceneForModal.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4 max-h-[400px] overflow-y-auto p-2">
              {selectedSceneForModal.slides.map((slide) => (
                <div
                  key={slide.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => handleNavigateToSlide(selectedSceneForModal.id, slide.id)}
                >
                  <div className="font-medium mb-2">{slide.title}</div>
                  <div className="text-xs text-gray-500">{slide.elements.length} element(s)</div>
                  <div className="h-16 bg-gray-100 mt-2 rounded flex items-center justify-center text-xs text-gray-400">
                    Click to navigate
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
