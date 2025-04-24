
import { createContext, useContext, useState, ReactNode } from "react";

type PanelContextType = {
  toolboxOpen: boolean;
  setToolboxOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  ribbonOpen: boolean;
  setRibbonOpen: (open: boolean) => void;
  storyViewOpen: boolean;
  setStoryViewOpen: (open: boolean) => void;
  timelineOpen: boolean;
  setTimelineOpen: (open: boolean) => void;
};

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
  // Start with panels closed
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ribbonOpen, setRibbonOpen] = useState(false);
  const [storyViewOpen, setStoryViewOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);

  // Helper function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <PanelContext.Provider
      value={{
        toolboxOpen,
        setToolboxOpen,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        ribbonOpen,
        setRibbonOpen,
        storyViewOpen,
        setStoryViewOpen,
        timelineOpen,
        setTimelineOpen,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}

export function usePanels() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanels must be used within a PanelProvider");
  }
  return context;
}
