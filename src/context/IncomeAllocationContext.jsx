import { useUI } from "@/context/UIContext";
import { config } from "@/lib/variables";
import { getDocument } from "@/services/firebase/docService";
import { collectionName } from "@/services/firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
const date = new Date();
const today = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(date);

const IncomeAllocationContext = createContext();

export function IncomeAllocationProvider({ children }) {
  // All State
  const { setLoading } = useUI();
  const [totalWithdraw, setTotalWithdraw] = useState("");
  const [totalHPP, setTotalHPP] = useState("");
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
  const [shopeeHasSaveToFirebase, setShopeeHasSaveToFirebase] = useState(false);
  const [tiktokHasSaveToFirebase, setTiktokHasSaveToFirebase] = useState(false);

  const sinkronLastSave = async () => {
    const lastSaveShopee = "shopeeLastSave";
    const lastSaveTiktok = "tiktokLastSave";

    setLoading(true);

    const tiktokLastSave = await getDocument(
      "Ambil Last Save TikTok",
      collectionName.withdrawals.tiktok,
      lastSaveTiktok,
    );
    if (tiktokLastSave.success) {
      if (tiktokLastSave.data.time === today) {
        setTiktokHasSaveToFirebase(true);
      } else {
        setTiktokHasSaveToFirebase(false);
      }
      setLoading(false);
    } else {
      toast.error(tiktokLastSave.message);
      console.log(tiktokLastSave.error);
      setLoading(false);
    }

    const shopeeLastSave = await getDocument(
      "Ambil Last Save Shopee",
      collectionName.withdrawals.shopee,
      lastSaveShopee,
    );
    if (shopeeLastSave.success) {
      if (shopeeLastSave.data.time === today) {
        setShopeeHasSaveToFirebase(true);
      } else {
        setShopeeHasSaveToFirebase(false);
      }
      setLoading(false);
    } else {
      toast.error(shopeeLastSave.message);
      console.log(shopeeLastSave.error);
      setLoading(false);
    }
  };

  useEffect(() => {
    sinkronLastSave();
  }, []);

  return (
    <IncomeAllocationContext.Provider
      value={{
        totalWithdraw,
        setTotalWithdraw,
        totalHPP,
        setTotalHPP,
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
        shopeeHasSaveToFirebase,
        setShopeeHasSaveToFirebase,
        tiktokHasSaveToFirebase,
        setTiktokHasSaveToFirebase,
      }}
    >
      {children}
    </IncomeAllocationContext.Provider>
  );
}

export const useIncomeAllocation = () => useContext(IncomeAllocationContext);
