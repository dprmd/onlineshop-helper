import { getDaftarPenghasilan } from "../services/firebase/docService";
import { createContext, useContext, useEffect, useState } from "react";

const PenghasilanContext = createContext();

export function PenghasilanProvider({ children }) {
  const [penghasilanShopee, setPenghasilanShopee] = useState([]);
  const [penghasilanTikTok, setPenghasilanTikTok] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPenghasilan = async (typePenghasilan, limit) => {
    setLoading(true);
    const data = await getDaftarPenghasilan(typePenghasilan, "newToOld", limit);
    if (data.success) {
      if (typePenghasilan === "shopee") {
        setPenghasilanShopee(data.data);
      } else {
        setPenghasilanTikTok(data.data);
      }
      setLoading(false);
    } else {
      setError(data.error);
      setLoading(false);
      console.log(data.error);
    }
  };

  useEffect(() => {
    fetchPenghasilan("shopee", 10);
    fetchPenghasilan("tiktok", 10);
  }, []);

  return (
    <PenghasilanContext.Provider
      value={{
        penghasilanShopee,
        penghasilanTikTok,
        setPenghasilanShopee,
        setPenghasilanTikTok,
        loading,
        error,
        refetch: fetchPenghasilan,
      }}
    >
      {children}
    </PenghasilanContext.Provider>
  );
}

export const usePenghasilan = () => useContext(PenghasilanContext);
