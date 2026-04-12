import LoadingOverlay from "@/components/LoadingOverlay";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <TooltipProvider>
      <UIContext.Provider value={{ loading, setLoading }}>
        <LoadingOverlay show={loading} />
        {children}
      </UIContext.Provider>
    </TooltipProvider>
  );
}

export const useUI = () => useContext(UIContext);
