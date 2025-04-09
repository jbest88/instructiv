
export interface ElementBase {
  id: string;
  type: "text" | "image" | "button" | "hotspot";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextElement extends ElementBase {
  type: "text";
  content: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: string;
  fontStyle?: string; // Added for italic support
  align?: "left" | "center" | "right";
}

export interface ImageElement extends ElementBase {
  type: "image";
  src: string;
  alt?: string;
}

export interface ButtonElement extends ElementBase {
  type: "button";
  label: string;
  action: "nextSlide" | "prevSlide" | "goToSlide" | "debug";
  targetSlideId?: string;
  style?: "primary" | "secondary" | "outline";
}

export interface HotspotElement extends ElementBase {
  type: "hotspot";
  tooltip: string;
  shape: "circle" | "rectangle";
}

export type SlideElement = TextElement | ImageElement | ButtonElement | HotspotElement;

export interface TimelineItem {
  id: string;
  name: string;
  type: "button" | "image" | "text" | "hotspot";
  startTime: number; // in seconds
  duration: number; // in seconds
  linkedElementId?: string;
  isLocked?: boolean; // Added property to lock timeline items
  isVisible?: boolean; // Added property to toggle visibility
}

export interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  background?: string;
  order: number;
  timelineItems?: TimelineItem[]; // Timeline items array
}

export interface Scene {
  id: string;
  title: string;
  slides: Slide[];
  order: number;
}

export interface Project {
  id: string;
  title: string;
  scenes: Scene[];
  currentSceneId: string;
  currentSlideId: string;
  createdAt?: string;
  updatedAt?: string;
}
