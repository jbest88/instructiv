
import { createContext, useContext, useState, ReactNode } from "react";

type PanelContextType = {
  sidebarOpen: boolean;
  toolboxOpen: boolean;
  timelineOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setToolboxOpen: (open: boolean) => void;
  setTimelineOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleToolbox: () => void;
  toggleTimeline: () => void;
};

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolboxOpen, setToolboxOpen] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleToolbox = () => setToolboxOpen(!toolboxOpen);
  const toggleTimeline = () => setTimelineOpen(!timelineOpen);

  const value = {
    sidebarOpen,
    toolboxOpen,
    timelineOpen,
    setSidebarOpen,
    setToolboxOpen,
    setTimelineOpen,
    toggleSidebar,
    toggleToolbox,
    toggleTimeline
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
