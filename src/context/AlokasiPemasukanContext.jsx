import { createContext, useContext, useState } from "react";
import { listProduk } from "../lib/variables";

const AlokasiPemasukanContext = createContext();

export function AlokasiPemasukanProvider({ children }) {
  // All State
  const [totalWithdraw, setTotalWithdraw] = useState("");
  const [totalHPP, setTotalHPP] = useState("");
  const [produk, setProduk] = useState(listProduk);
  const produkInArray = Object.values(produk);
  const [isTikTok, setIsTikTok] = useState(false);
  const [whichSupplier, setWhichSupplier] = useState("");

  // calculateHPP Context
  const [showConclusion, setShowConclusion] = useState(false);
  const [submitOrder, setSubmitOrder] = useState(1);

  // summary Context
  const [dailySalary, setDailySalary] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [bills, setBills] = useState([]);
  const [modifiedSetorBarang, setModifiedSetorBarang] = useState([]);

  return (
    <AlokasiPemasukanContext.Provider
      value={{
        totalWithdraw,
        setTotalWithdraw,
        totalHPP,
        setTotalHPP,
        produk,
        setProduk,
        produkInArray,
        isTikTok,
        setIsTikTok,
        showConclusion,
        setShowConclusion,
        submitOrder,
        setSubmitOrder,
        dailySalary,
        setDailySalary,
        totalBill,
        setTotalBill,
        bills,
        setBills,
        whichSupplier,
        setWhichSupplier,
        modifiedSetorBarang,
        setModifiedSetorBarang,
      }}
    >
      {children}
    </AlokasiPemasukanContext.Provider>
  );
}

export const useAlokasiPemasukan = () => useContext(AlokasiPemasukanContext);
