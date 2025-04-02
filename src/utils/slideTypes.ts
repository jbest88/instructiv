
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
}

export interface ImageElement extends ElementBase {
  type: "image";
  src: string;
  alt?: string;
}

export interface ButtonElement extends ElementBase {
  type: "button";
  label: string;
  action: "nextSlide" | "prevSlide" | "goToSlide";
  targetSlideId?: string;
  style?: "primary" | "secondary" | "outline";
}

export interface HotspotElement extends ElementBase {
  type: "hotspot";
  tooltip: string;
  shape: "circle" | "rectangle";
}

export type SlideElement = TextElement | ImageElement | ButtonElement | HotspotElement;

export interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  background?: string;
  order: number; // Added order property for sorting within a scene
}

export interface Scene {
  id: string;
  title: string;
  slides: Slide[];
  order: number; // Added order property for sorting scenes
}

export interface Project {
  id: string;
  title: string;
  scenes: Scene[];
  currentSceneId: string;
  currentSlideId: string;
}
