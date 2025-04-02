
import { Project, Slide } from "./slideTypes";

export const createDefaultProject = (): Project => {
  const slides: Slide[] = [
    {
      id: "slide-1",
      title: "Welcome Slide",
      elements: [
        {
          id: "text-1",
          type: "text",
          content: "Welcome to Your Course",
          x: 200,
          y: 150,
          width: 400,
          height: 60,
          fontSize: 32,
          fontWeight: "bold",
          fontColor: "#333333"
        },
        {
          id: "text-2",
          type: "text",
          content: "Click the button below to continue",
          x: 250,
          y: 250,
          width: 300,
          height: 40,
          fontSize: 18,
          fontColor: "#666666"
        },
        {
          id: "button-1",
          type: "button",
          label: "Next Slide",
          action: "nextSlide",
          x: 325,
          y: 350,
          width: 150,
          height: 50,
          style: "primary"
        }
      ],
      background: "#ffffff"
    },
    {
      id: "slide-2",
      title: "Content Slide",
      elements: [
        {
          id: "text-1",
          type: "text",
          content: "Important Information",
          x: 200,
          y: 100,
          width: 400,
          height: 50,
          fontSize: 28,
          fontWeight: "bold",
          fontColor: "#333333"
        },
        {
          id: "text-2",
          type: "text",
          content: "This is where you can add key points about your topic. Make it engaging and concise.",
          x: 200,
          y: 180,
          width: 400,
          height: 80,
          fontSize: 16,
          fontColor: "#666666"
        },
        {
          id: "image-1",
          type: "image",
          src: "/placeholder.svg",
          alt: "Example image",
          x: 250,
          y: 300,
          width: 300,
          height: 200
        }
      ],
      background: "#f8f9fa"
    },
    {
      id: "slide-3",
      title: "Interactive Slide",
      elements: [
        {
          id: "text-1",
          type: "text",
          content: "Explore the Hotspots",
          x: 200,
          y: 80,
          width: 400,
          height: 50,
          fontSize: 28,
          fontWeight: "bold",
          fontColor: "#333333"
        },
        {
          id: "text-2",
          type: "text",
          content: "Click on the highlighted areas to learn more",
          x: 250,
          y: 150,
          width: 300,
          height: 40,
          fontSize: 16,
          fontColor: "#666666"
        },
        {
          id: "hotspot-1",
          type: "hotspot",
          tooltip: "This is hotspot 1 with important information",
          shape: "circle",
          x: 250,
          y: 250,
          width: 60,
          height: 60
        },
        {
          id: "hotspot-2",
          type: "hotspot",
          tooltip: "This is hotspot 2 with more details",
          shape: "rectangle",
          x: 400,
          y: 300,
          width: 100,
          height: 70
        }
      ],
      background: "#f0f4f8"
    }
  ];

  return {
    id: "project-1",
    title: "My First Course",
    slides,
    currentSlideId: slides[0].id
  };
};
