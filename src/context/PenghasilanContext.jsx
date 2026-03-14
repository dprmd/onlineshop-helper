import {
  getDaftarPenghasilan,
  getDaftarPenghasilanByDate,
} from "../services/firebase/docService";
import { createContext, useContext, useEffect, useState } from "react";

const PenghasilanContext = createContext();

export function PenghasilanProvider({ children }) {
  const [penghasilanShopee, setPenghasilanShopee] = useState([]);
  const [penghasilanShopeeTemp, setPenghasilanShopeeTemp] = useState([]);
  const [penghasilanTikTok, setPenghasilanTikTok] = useState([]);
  const [penghasilanTikTokTemp, setPenghasilanTikTokTemp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPenghasilan = async (platform, limit) => {
    setLoading(true);
    const data = await getDaftarPenghasilan(platform, "newToOld", limit);
    if (data.success) {
      if (platform === "shopee") {
        setPenghasilanShopee(data.data);
        setPenghasilanShopeeTemp(data.data);
      } else {
        setPenghasilanTikTok(data.data);
        setPenghasilanTikTokTemp(data.data);
      }
      setLoading(false);
    } else {
      setError(data.error);
      setLoading(false);
      console.log(data.error);
    }
  };

  const fetchPenghasilanByDate = async (platform, start, end) => {
    setLoading(true);
    const data = await getDaftarPenghasilanByDate(
      platform,
      "newToOld",
      start,
      end,
    );
    if (data.success) {
      if (platform === "shopee") {
        console.log(data);
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

  const sortByLimitUnderTen = (platform, num) => {
    if (platform === "shopee") {
      setPenghasilanShopee(penghasilanShopeeTemp.slice(0, num));
    }

    if (platform === "tiktok") {
      setPenghasilanTikTok(penghasilanTikTokTemp.slice(0, num));
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
        sortByLimitUnderTen,
        fetchPenghasilanByDate,
      }}
    >
      {children}
    </PenghasilanContext.Provider>
  );
}

export const usePenghasilan = () => useContext(PenghasilanContext);
