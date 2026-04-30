import { getDocument } from "@/services/firebase/docService";
import { collectionName } from "@/services/firebase/firebase";
import { compareSync } from "node_modules/bcryptjs/umd";
import { createContext, useContext } from "react";

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const comparePin = async (pin) => {
    const hashedPin = await getDocument(
      "Security Fetch",
      collectionName.security,
      "pin",
    );
    const isMatch = compareSync(pin, hashedPin);

    if (isMatch) {
      return {
        allow: true,
      };
    } else {
      return {
        allow: false,
      };
    }
  };

  return (
    <SecurityContext.Provider value={{ comparePin }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
