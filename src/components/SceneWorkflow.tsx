
import React, { useRef, useEffect, useState } from "react";
import { useProject } from "@/contexts/project";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, ZoomIn, ZoomOut } from "lucide-react";
import { Scene, Slide, SlideElement } from "@/utils/slideTypes";

export function SceneWorkflow() {
  const { project, currentScene, handleSelectScene, handleSelectSlide } = useProject();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  // Find button elements with nextSlide or goToScene actions
  const findSceneConnections = () => {
    const connections: {
      fromSceneId: string;
      fromSlideId: string;
      toSceneId: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[] = [];
    
    // In a real implementation, we would analyze all button elements with actions
    // that link to other scenes/slides and build the connections array
    
    return connections;
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
    
    // Draw scene nodes
    const sceneSpacing = 250;
    const sceneWidth = 180;
    const sceneHeight = 120;
    
    project.scenes.forEach((scene, index) => {
      const x = 200 + (index % 3) * sceneSpacing;
      const y = 150 + Math.floor(index / 3) * sceneSpacing;
      
      // Draw scene node
      ctx.fillStyle = scene.id === project.currentSceneId ? "#d4e6ff" : "#f1f5f9";
      ctx.strokeStyle = scene.id === project.currentSceneId ? "#2563eb" : "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, sceneWidth, sceneHeight, 8);
      ctx.fill();
      ctx.stroke();
      
      // Draw scene title
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(scene.title, x + sceneWidth / 2, y + 25);
      
      // Draw slide count
      ctx.font = "12px sans-serif";
      ctx.fillText(`${scene.slides.length} slide${scene.slides.length !== 1 ? 's' : ''}`, x + sceneWidth / 2, y + 45);
      
      // Store scene position for connection drawing
      scene.workflowX = x + sceneWidth / 2;
      scene.workflowY = y + sceneHeight / 2;
    });
    
    // Draw connections between scenes
    const connections = findSceneConnections();
    connections.forEach(conn => {
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(conn.x1, conn.y1);
      ctx.bezierCurveTo(
        conn.x1 + (conn.x2 - conn.x1) / 2, conn.y1,
        conn.x1 + (conn.x2 - conn.x1) / 2, conn.y2,
        conn.x2, conn.y2
      );
      ctx.stroke();
      
      // Draw arrow
      const arrowSize = 8;
      const angle = Math.atan2(conn.y2 - conn.y1, conn.x2 - conn.x1);
      ctx.beginPath();
      ctx.moveTo(conn.x2, conn.y2);
      ctx.lineTo(
        conn.x2 - arrowSize * Math.cos(angle - Math.PI / 6),
        conn.y2 - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        conn.x2 - arrowSize * Math.cos(angle + Math.PI / 6),
        conn.y2 - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = "#94a3b8";
      ctx.fill();
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
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);
      canvas.addEventListener('wheel', handleWheel);
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isDragging, lastMousePos, zoom]);
  
  // Render canvas whenever dependencies change
  useEffect(() => {
    renderWorkflow();
  }, [project, zoom, pan]);
  
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
        <h2 className="text-lg font-medium">Scene Workflow</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))} title="Zoom Out">
            <ZoomOut size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setZoom(prev => Math.min(2.5, prev + 0.1))} title="Zoom In">
            <ZoomIn size={18} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
            Reset View
          </Button>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 overflow-hidden relative">
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-move"
        />
      </div>
    </div>
  );
}
