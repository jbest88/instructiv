
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Project, Scene } from "@/utils/slideTypes";
import { createDefaultScene } from "@/utils/defaultSlides";

export function useProjectScenes(
  project: Project, 
  setProject: React.Dispatch<React.SetStateAction<Project>>,
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>
) {
  // Function to select a scene
  const handleSelectScene = (sceneId: string) => {
    if (!project || !project.scenes) return;
    
    const scene = project.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    setProject(prev => ({
      ...prev,
      currentSceneId: sceneId,
      currentSlideId: scene.slides && scene.slides[0] ? scene.slides[0].id : prev.currentSlideId
    }));
    setSelectedElementId(null);
  };
  
  // Function to add a new scene
  const handleAddScene = () => {
    if (!project || !project.scenes) return;
    
    const newSceneOrder = project.scenes.length + 1;
    const newScene = createDefaultScene(`Scene ${newSceneOrder}`, newSceneOrder);
    
    setProject(prev => {
      const newProject = {
        ...prev,
        scenes: [...prev.scenes, newScene],
        currentSceneId: newScene.id,
        currentSlideId: newScene.slides[0].id
      };
      return newProject;
    });
    
    toast.success("New scene added");
  };
  
  // Function to delete a scene
  const handleDeleteScene = (sceneId: string) => {
    if (!project || !project.scenes) return;
    
    if (project.scenes.length <= 1) {
      toast.error("Cannot delete the last scene");
      return;
    }
    
    const sceneIndex = project.scenes.findIndex(scene => scene.id === sceneId);
    const newScenes = project.scenes.filter(scene => scene.id !== sceneId);
    
    // If deleting the current scene, select the previous or next scene
    let newCurrentSceneId = project.currentSceneId;
    let newCurrentSlideId = project.currentSlideId;
    
    if (sceneId === project.currentSceneId) {
      const newIndex = sceneIndex > 0 ? sceneIndex - 1 : 0;
      newCurrentSceneId = newScenes[newIndex].id;
      newCurrentSlideId = newScenes[newIndex].slides[0]?.id || "";
    }
    
    setProject(prev => ({
      ...prev,
      scenes: newScenes,
      currentSceneId: newCurrentSceneId,
      currentSlideId: newCurrentSlideId
    }));
    
    toast.success("Scene deleted");
  };
  
  // Function to update scene properties
  const handleUpdateScene = (updates: Partial<Scene>) => {
    if (!project || !project.scenes) return;
    
    setProject(prev => {
      if (!prev || !prev.scenes) return prev;
      
      // Create a properly typed array of updated scenes
      const updatedScenes: Scene[] = prev.scenes.map(scene => {
        if (scene.id === prev.currentSceneId) {
          // Create a new scene with the updates
          const updatedScene: Scene = {
            ...scene,
            ...updates
          };
          return updatedScene;
        }
        return scene;
      });
      
      // Return a properly typed Project object
      return {
        ...prev,
        scenes: updatedScenes
      };
    });
  };

  return {
    handleSelectScene,
    handleAddScene,
    handleDeleteScene,
    handleUpdateScene
  };
}
