
import { v4 as uuidv4 } from "uuid";
import { Project, Scene, Slide } from "@/utils/slideTypes";

export function createDefaultSlide(title: string, order: number): Slide {
  return {
    id: `slide-${uuidv4()}`,
    title,
    elements: [],
    background: '#ffffff',
    order
  };
}

export function createDefaultScene(title: string, order: number): Scene {
  const defaultSlide = createDefaultSlide(`${title} Slide 1`, 1);
  
  return {
    id: `scene-${uuidv4()}`,
    title,
    slides: [defaultSlide],
    order
  };
}

export function createDefaultProject(): Project {
  const scene1 = createDefaultScene("Introduction", 1);
  
  return {
    id: `project-${uuidv4()}`,
    title: "New Project",
    scenes: [scene1],
    currentSceneId: scene1.id,
    currentSlideId: scene1.slides[0].id
  };
}
