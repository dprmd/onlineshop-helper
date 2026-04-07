import LoadingOverlay from "@/components/LoadingOverlay";
import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <UIContext.Provider value={{ loading, setLoading }}>
      <LoadingOverlay show={loading} />
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
