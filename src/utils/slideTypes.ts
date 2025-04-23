
import { v4 as uuidv4 } from 'uuid';

export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'hotspot';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  text?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  src?: string;
  alt?: string;
  url?: string;
  buttonText?: string;
  buttonColor?: string;
  textColor?: string;
  // Additional properties for specific element types
  content?: string;
  label?: string;
  action?: string;
  style?: string;
  tooltip?: string;
  shape?: string;
  // Add these missing properties
  fontStyle?: string;
  align?: 'left' | 'center' | 'right';
}

// Define type aliases for specific element types
export type TextElement = SlideElement & {
  type: 'text';
  content: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: string;
  fontStyle?: string;
  align?: 'left' | 'center' | 'right';
};

export type ImageElement = SlideElement & {
  type: 'image';
  src: string;
  alt?: string;
  objectFit?: string;
};

export type ButtonElement = SlideElement & {
  type: 'button';
  label: string;
  action: string;
  style?: string;
};

export type HotspotElement = SlideElement & {
  type: 'hotspot';
  tooltip?: string;
  shape?: string;
};

export interface Slide {
  id: string;
  title: string;
  order: number;
  background: string;
  elements: SlideElement[];
}

export interface Scene {
  id: string;
  title: string;
  slides: Slide[];
  // Optional properties for workflow visualization
  workflowX?: number;
  workflowY?: number;
}

export interface Project {
  id: string;
  title: string;
  scenes: Scene[];
  currentSceneId: string;
  currentSlideId: string;
  isNewProject?: boolean; // Added flag to indicate if this is a new project
}
