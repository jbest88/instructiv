
import { Project, Scene, Slide } from "./slideTypes";
import { v4 as uuidv4 } from "uuid";

// Create a default empty scene
export function createDefaultScene(title: string = "Scene 1", order: number = 1): Scene {
  const slideId = `slide-${uuidv4()}`;
  
  return {
    id: `scene-${uuidv4()}`,
    title,
    order,
    slides: [{
      id: slideId,
      title: "Slide 1",
      elements: [],
      background: '#ffffff',
      order: 1
    }]
  };
}

// Create a default project with a single scene and slide
export function createDefaultProject(): Project {
  // Create a unique ID for the project
  const projectId = `project-${uuidv4()}`;
  
  // Create a default scene
  const defaultScene = createDefaultScene();
  
  // Return the new project with the scene
  return {
    id: projectId,
    title: "New Project",
    scenes: [defaultScene],
    currentSceneId: defaultScene.id,
    currentSlideId: defaultScene.slides[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
