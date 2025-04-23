
import { v4 as uuidv4 } from "uuid";
import { 
  SlideElement,
  TextElement,
  ImageElement,
  ButtonElement,
  HotspotElement 
} from "@/utils/slideTypes";

// Create a text element with default properties
export const createTextElement = (): TextElement => ({
  id: `text-${uuidv4()}`,
  type: "text",
  content: "New Text",
  x: 200,
  y: 200,
  width: 300,
  height: 50,
  fontSize: 16,
  fontColor: "#333333",
  rotation: 0,
  zIndex: 0
});

// Create an image element with default properties
export const createImageElement = (): ImageElement => ({
  id: `image-${uuidv4()}`,
  type: "image",
  src: "/placeholder.svg",
  alt: "Placeholder image",
  x: 200,
  y: 200,
  width: 200,
  height: 150,
  rotation: 0,
  zIndex: 0
});

// Create a button element with default properties
export const createButtonElement = (): ButtonElement => ({
  id: `button-${uuidv4()}`,
  type: "button",
  label: "Button",
  action: "nextSlide",
  style: "primary",
  x: 200,
  y: 200,
  width: 150,
  height: 50,
  rotation: 0,
  zIndex: 0
});

// Create a hotspot element with default properties
export const createHotspotElement = (): HotspotElement => ({
  id: `hotspot-${uuidv4()}`,
  type: "hotspot",
  tooltip: "Hotspot information",
  shape: "circle",
  x: 200,
  y: 200,
  width: 60,
  height: 60,
  rotation: 0,
  zIndex: 0
});

// Factory function to create any element type
export const createElement = (type: SlideElement['type']): SlideElement => {
  switch (type) {
    case "text":
      return createTextElement();
    case "image":
      return createImageElement();
    case "button":
      return createButtonElement();
    case "hotspot":
      return createHotspotElement();
    default:
      throw new Error(`Unsupported element type: ${type}`);
  }
};
