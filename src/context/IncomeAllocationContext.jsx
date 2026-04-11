import { createContext, useContext, useState } from "react";
import { listProduk } from "../lib/variables";

const IncomeAllocationContext = createContext();

export function IncomeAllocationProvider({ children }) {
  // All State
  const [totalWithdraw, setTotalWithdraw] = useState("");
  const [totalHPP, setTotalHPP] = useState("");
  const [produk, setProduk] = useState(listProduk);
  const [isTikTok, setIsTikTok] = useState(false);
  const [whichSupplier, setWhichSupplier] = useState("");

  // calculateHPP Context
  const [showConclusion, setShowConclusion] = useState(false);
  const [submitOrder, setSubmitOrder] = useState(1);

  // summary Context
  const [dailyWage, setDailyWage] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [bills, setBills] = useState([]);
  const [modifiedSetorBarang, setModifiedSetorBarang] = useState([]);

  return (
    <IncomeAllocationContext.Provider
      value={{
        totalWithdraw,
        setTotalWithdraw,
        totalHPP,
        setTotalHPP,
        produk,
        setProduk,
        isTikTok,
        setIsTikTok,
        showConclusion,
        setShowConclusion,
        submitOrder,
        setSubmitOrder,
        dailyWage,
        setDailyWage,
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
    </IncomeAllocationContext.Provider>
  );
}

export const useIncomeAllocation = () => useContext(IncomeAllocationContext);
