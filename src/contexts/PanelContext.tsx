
import { createContext, useContext, useState, ReactNode } from "react";

type PanelContextType = {
  toolboxOpen: boolean;
  setToolboxOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
  // Start with panels closed
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PanelContext.Provider
      value={{
        toolboxOpen,
        setToolboxOpen,
        sidebarOpen,
        setSidebarOpen,
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
