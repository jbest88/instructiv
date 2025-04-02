import { v4 as uuidv4 } from "uuid";
import { Project, Scene, Slide, ButtonElement, TextElement, ImageElement } from "@/utils/slideTypes";

export function createDefaultSlide(title: string, order: number): Slide {
  return {
    id: `slide-${uuidv4()}`,
    title,
    elements: [],
    background: '#ffffff',
    order
  };
}

export function createTelSlide(): Slide {
  const slideId = `slide-${uuidv4()}`;
  
  // Create the main title
  const titleElement: TextElement = {
    id: `text-${uuidv4()}`,
    type: "text",
    content: "Technology Enabled Learning",
    x: 520,
    y: 200,
    width: 800,
    height: 70,
    fontSize: 48,
    fontColor: "#ffffff",
    fontWeight: "bold",
    align: "center"
  };
  
  // Create scenario 1
  const scenario1Title: TextElement = {
    id: `text-${uuidv4()}`,
    type: "text",
    content: "Scenario 1:\nHooked Track",
    x: 610,
    y: 315,
    width: 150,
    height: 60,
    fontSize: 18,
    fontColor: "#333333",
    fontWeight: "medium",
    align: "center"
  };
  
  // Create scenario 2
  const scenario2Title: TextElement = {
    id: `text-${uuidv4()}`,
    type: "text",
    content: "Scenario 2:\nData Fusion",
    x: 800,
    y: 315,
    width: 150,
    height: 60,
    fontSize: 18,
    fontColor: "#333333",
    fontWeight: "medium",
    align: "center"
  };
  
  // Create scenario 3
  const scenario3Title: TextElement = {
    id: `text-${uuidv4()}`,
    type: "text",
    content: "Scenario 3:\nManual Tracking",
    x: 990,
    y: 315,
    width: 150,
    height: 60,
    fontSize: 18,
    fontColor: "#333333",
    fontWeight: "medium",
    align: "center"
  };
  
  // Create scenario images
  const scenario1Image: ImageElement = {
    id: `image-${uuidv4()}`,
    type: "image",
    src: "/placeholder.svg",
    alt: "Hooked Track",
    x: 610,
    y: 390,
    width: 150,
    height: 90
  };
  
  const scenario2Image: ImageElement = {
    id: `image-${uuidv4()}`,
    type: "image",
    src: "/placeholder.svg",
    alt: "Data Fusion",
    x: 800,
    y: 390,
    width: 150,
    height: 90
  };
  
  const scenario3Image: ImageElement = {
    id: `image-${uuidv4()}`,
    type: "image",
    src: "/placeholder.svg",
    alt: "Manual Tracking",
    x: 990,
    y: 390,
    width: 150,
    height: 90
  };
  
  // Create debug buttons
  const debugButton1: ButtonElement = {
    id: `button-${uuidv4()}`,
    type: "button",
    label: "Debug",
    action: "debug",
    x: 610,
    y: 495,
    width: 80,
    height: 30,
    style: "primary"
  };
  
  const debugButton2: ButtonElement = {
    id: `button-${uuidv4()}`,
    type: "button",
    label: "Debug",
    action: "debug",
    x: 800,
    y: 495,
    width: 80,
    height: 30,
    style: "primary"
  };
  
  const debugButton3: ButtonElement = {
    id: `button-${uuidv4()}`,
    type: "button",
    label: "Debug",
    action: "debug",
    x: 990,
    y: 495,
    width: 80,
    height: 30,
    style: "primary"
  };
  
  // Create footer elements
  const brandLogo: ImageElement = {
    id: `image-${uuidv4()}`,
    type: "image",
    src: "/placeholder.svg",
    alt: "Company Logo",
    x: 635,
    y: 540,
    width: 100,
    height: 30
  };
  
  const authorText: TextElement = {
    id: `text-${uuidv4()}`,
    type: "text",
    content: "SMITH, J.\n01234567",
    x: 1050,
    y: 535,
    width: 100,
    height: 50,
    fontSize: 14,
    fontColor: "#ffffff",
    fontWeight: "medium",
    align: "right"
  };
  
  return {
    id: slideId,
    title: "Home",
    elements: [
      titleElement,
      scenario1Title, scenario2Title, scenario3Title,
      scenario1Image, scenario2Image, scenario3Image,
      debugButton1, debugButton2, debugButton3,
      brandLogo, authorText
    ],
    background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
    order: 1,
    timelineItems: [
      { id: '1', name: 'Button 6', type: 'button', startTime: 0, duration: 3 },
      { id: '2', name: 'Button 5', type: 'button', startTime: 0, duration: 3 },
      { id: '3', name: 'Button 4', type: 'button', startTime: 0, duration: 3 },
      { id: '4', name: 'Picture 3', type: 'image', startTime: 0, duration: 3 },
      { id: '5', name: 'Picture 2', type: 'image', startTime: 0, duration: 3 },
      { id: '6', name: 'Picture 1', type: 'image', startTime: 0, duration: 3 },
    ]
  };
}

export function createDefaultScene(title: string, order: number): Scene {
  let firstSlide: Slide;
  
  if (title === "HOME" && order === 1) {
    firstSlide = createTelSlide();
  } else {
    firstSlide = createDefaultSlide(`${title} Slide 1`, 1);
  }
  
  const secondSlide = createDefaultSlide(`${title} Slide 2`, 2);
  
  return {
    id: `scene-${uuidv4()}`,
    title,
    slides: [firstSlide, secondSlide],
    order
  };
}

export function createDefaultProject(): Project {
  // Create an empty project with no default scenes
  return {
    id: `project-${uuidv4()}`,
    title: "New Project",
    scenes: [],
    currentSceneId: "",
    currentSlideId: ""
  };
}
