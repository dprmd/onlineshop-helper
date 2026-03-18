import { listProduk } from "../lib/variables";
import { createContext, useContext, useEffect, useState } from "react";

const AlokasiPemasukanContext = createContext();

export function AlokasiPemasukanProvider({ children }) {
  // All State
  const [totalPenghasilan, setTotalPenghasilan] = useState("");
  const [penghasilanHPP, setPenghasilanHPP] = useState("");
  const [produk, setProduk] = useState(listProduk);
  const produkInArray = Object.values(produk);
  const [isTikTok, setIsTikTok] = useState(false);

  // calculateHPP Context
  const [showConclusion, setShowConclusion] = useState(false);
  const [submitOrder, setSubmitOrder] = useState(1);

  // summary Context
  const [gajiHarian, setGajiHarian] = useState(0);
  const [totalTagihan, setTotalTagihan] = useState(0);
  const [tagihan, setTagihan] = useState([]);

  return (
    <AlokasiPemasukanContext.Provider
      value={{
        totalPenghasilan,
        setTotalPenghasilan,
        penghasilanHPP,
        setPenghasilanHPP,
        produk,
        setProduk,
        produkInArray,
        isTikTok,
        setIsTikTok,
        showConclusion,
        setShowConclusion,
        submitOrder,
        setSubmitOrder,
        gajiHarian,
        setGajiHarian,
        totalTagihan,
        setTotalTagihan,
        tagihan,
        setTagihan,
      }}
    >
      {children}
    </AlokasiPemasukanContext.Provider>
  );
}

export const useAlokasiPemasukan = () => useContext(AlokasiPemasukanContext);
