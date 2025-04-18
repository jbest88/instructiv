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
}

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
}

export interface Project {
  id: string;
  title: string;
  scenes: Scene[];
  currentSceneId: string;
  currentSlideId: string;
  isNewProject?: boolean; // Added flag to indicate if this is a new project
}
