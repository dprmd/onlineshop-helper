import { useUI } from "@/context/UIContext";
import {
  getDaftarPenghasilan,
  getDaftarPenghasilanByDate,
  getDaftarPenghasilanByMonth,
  getDocument,
} from "../services/firebase/docService";
import { createContext, useContext, useEffect, useState } from "react";

const CatatanPenghasilanContext = createContext();

export function CatatanPenghasilanProvider({ children }) {
  const [penghasilanShopee, setPenghasilanShopee] = useState([]);
  const [penghasilanShopeeTemp, setPenghasilanShopeeTemp] = useState([]);
  const [penghasilanTikTok, setPenghasilanTikTok] = useState([]);
  const [penghasilanTikTokTemp, setPenghasilanTikTokTemp] = useState([]);

  // Shopee
  const dummy = { shopee: 0, tiktok: 0 };
  const [penghasilanAT, setPenghasilanAT] = useState(dummy);
  const [tagihanAT, setTagihanAT] = useState(dummy);
  const [setorAT, setSetorAT] = useState(dummy);
  const [untungAT, setUntungAT] = useState(dummy);

  // Loading & Error & Initial Fetch
  const { loading, setLoading } = useUI();
  const [error, setError] = useState(null);
  const [totalInitialFetch, setTotalInitialFetch] = useState(true);
  const [shopeeInitialFetch, setShopeeInitialFetch] = useState(true);
  const [tiktokInitialFetch, setTiktokInitialFetch] = useState(true);

  const fetchAT = async () => {
    setLoading(true);
    setTotalInitialFetch(false);
    const { shopee, tiktok } = await getDocument(
      "Mengambil Document Catatan Penghasilan All Time",
      "penghasilanAllTime",
      "CatatanPenghasilanAllTime",
    ).then((data) => data.data);

    setPenghasilanAT({
      shopee: shopee.penghasilanAT,
      tiktok: tiktok.penghasilanAT,
    });
    setTagihanAT({
      shopee: shopee.tagihanAT,
      tiktok: tiktok.tagihanAT,
    });
    setSetorAT({
      shopee: shopee.setorAT,
      tiktok: tiktok.setorAT,
    });
    setUntungAT({
      shopee: shopee.untungAT,
      tiktok: tiktok.untungAT,
    });
    setLoading(false);
  };

  const fetchPenghasilan = async (platform, limit) => {
    setLoading(true);
    const data = await getDaftarPenghasilan(platform, "newToOld", limit);
    if (data.success) {
      if (platform === "shopee") {
        setShopeeInitialFetch(false);
        setPenghasilanShopee(data.data);
        setPenghasilanShopeeTemp(data.data);
      } else {
        setTiktokInitialFetch(false);
        setPenghasilanTikTok(data.data);
        setPenghasilanTikTokTemp(data.data);
      }
    } else {
      setError(data.error);
      console.log(data.error);
    }

    setLoading(false);
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
        setPenghasilanShopee(data.data);
      } else {
        setPenghasilanTikTok(data.data);
      }
    } else {
      setError(data.error);
      console.log(data.error);
    }

    setLoading(false);
  };

  const fetchPenghasilanByMonth = async (platform, year, month) => {
    setLoading(true);
    const data = await getDaftarPenghasilanByMonth(
      platform,
      "newToOld",
      year,
      month,
    );
    if (data.success) {
      if (platform === "shopee") {
        setPenghasilanShopee(data.data);
      } else {
        setPenghasilanTikTok(data.data);
      }
    } else {
      setError(data.error);
      console.log(data.error);
    }

    setLoading(false);
  };

  const sortByLimitUnderSeven = (platform, num) => {
    if (platform === "shopee") {
      setPenghasilanShopee(penghasilanShopeeTemp.slice(0, num));
    }

    if (platform === "tiktok") {
      setPenghasilanTikTok(penghasilanTikTokTemp.slice(0, num));
    }
  };

  return (
    <CatatanPenghasilanContext.Provider
      value={{
        penghasilanShopee,
        penghasilanTikTok,
        setPenghasilanShopee,
        setPenghasilanTikTok,
        loading,
        error,
        fetchPenghasilan,
        sortByLimitUnderSeven,
        fetchPenghasilanByDate,
        fetchPenghasilanByMonth,
        penghasilanAT,
        setPenghasilanAT,
        tagihanAT,
        setTagihanAT,
        setorAT,
        setSetorAT,
        untungAT,
        setUntungAT,
        fetchAT,
        totalInitialFetch,
        setTotalInitialFetch,
        shopeeInitialFetch,
        setShopeeInitialFetch,
        tiktokInitialFetch,
        setTiktokInitialFetch,
      }}
    >
      {children}
    </CatatanPenghasilanContext.Provider>
  );
}

export const useCatatanPenghasilan = () =>
  useContext(CatatanPenghasilanContext);
