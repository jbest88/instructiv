import React, { createContext, useState, useContext, ReactNode } from "react";

type PanelContextType = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toolboxOpen: boolean;
  setToolboxOpen: (open: boolean) => void;
  ribbonOpen: boolean;
  setRibbonOpen: (open: boolean) => void;
};

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolboxOpen, setToolboxOpen] = useState(true);
  const [ribbonOpen, setRibbonOpen] = useState(true); // Set to true by default
  
  const value = {
    sidebarOpen,
    setSidebarOpen,
    toolboxOpen,
    setToolboxOpen,
    ribbonOpen, 
    setRibbonOpen,
  };
  
  return (
    <PanelContext.Provider value={value}>
      {children}
    </PanelContext.Provider>
  );
};

export function usePanels() {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error("usePanels must be used within a PanelProvider");
  }
  return context;
}
