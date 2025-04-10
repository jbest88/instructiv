import { v4 as uuidv4 } from 'uuid';
import { Project, Scene, Slide } from './slideTypes';

export function createDefaultProject(): Project {
  const slideId = uuidv4();
  const sceneId = uuidv4();
  
  const slide: Slide = {
    id: slideId,
    title: 'Welcome',
    order: 0,
    background: '#ffffff',
    elements: []
  };
  
  const scene: Scene = {
    id: sceneId,
    title: 'Scene 1',
    slides: [slide]
  };
  
  return {
    id: uuidv4(),
    title: 'New Project',
    scenes: [scene],
    currentSceneId: sceneId,
    currentSlideId: slideId,
    isNewProject: true // Flag to indicate this is a new project
  };
}
