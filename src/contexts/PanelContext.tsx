
import { createContext, useContext, useState, ReactNode } from "react";

type PanelContextType = {
  sidebarOpen: boolean;
  toolboxOpen: boolean;
  timelineOpen: boolean;
  ribbonOpen: boolean;
  storyViewOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setToolboxOpen: (open: boolean) => void;
  setTimelineOpen: (open: boolean) => void;
  setRibbonOpen: (open: boolean) => void;
  setStoryViewOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleToolbox: () => void;
  toggleTimeline: () => void;
  toggleRibbon: () => void;
  toggleStoryView: () => void;
};

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolboxOpen, setToolboxOpen] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [ribbonOpen, setRibbonOpen] = useState(true);
  const [storyViewOpen, setStoryViewOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleToolbox = () => setToolboxOpen(!toolboxOpen);
  const toggleTimeline = () => setTimelineOpen(!timelineOpen);
  const toggleRibbon = () => setRibbonOpen(!ribbonOpen);
  const toggleStoryView = () => setStoryViewOpen(!storyViewOpen);

  const value = {
    sidebarOpen,
    toolboxOpen,
    timelineOpen,
    ribbonOpen,
    storyViewOpen,
    setSidebarOpen,
    setToolboxOpen,
    setTimelineOpen,
    setRibbonOpen,
    setStoryViewOpen,
    toggleSidebar,
    toggleToolbox,
    toggleTimeline,
    toggleRibbon,
    toggleStoryView
  };

  return (
    <PanelContext.Provider value={value}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanels() {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error("usePanels must be used within a PanelProvider");
  }
  return context;
}
