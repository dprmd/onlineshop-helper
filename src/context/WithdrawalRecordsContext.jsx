import { useUI } from "@/context/UIContext";
import { createContext, useContext, useState } from "react";
import {
  getWithdrawalList,
  getWithdrawalListByDate,
  getWithdrawalListByMonth,
  getDocument,
} from "../services/firebase/docService";

const WithdrawalRecordsContext = createContext();

export function WithdrawalRecordsProvider({ children }) {
  const [shopeeWithdrawals, setShopeeWithdrawals] = useState([]);
  const [shopeeWithdrawals_temp, setShopeeWithdrawals_temp] = useState([]);
  const [tiktokWithdrawals, setTiktokWithdrawals] = useState([]);
  const [tiktokWithdrawals_temp, setTiktokWithdrawals_temp] = useState([]);

  // Shopee
  const dummy = { shopee: 0, tiktok: 0 };
  const [ATWithdrawals, setATWithdrawals] = useState(dummy);
  const [ATBills, setATBills] = useState(dummy);
  const [ATSetor, setSetorAT] = useState(dummy);
  const [ATProfit, setATProfit] = useState(dummy);

  // Loading & Error & Initial Fetch
  const { loading, setLoading } = useUI();
  const [error, setError] = useState(null);
  const [ATInitialFetch, setATInitialFetch] = useState(true);
  const [shopeeInitialFetch, setShopeeInitialFetch] = useState(true);
  const [tiktokInitialFetch, setTiktokInitialFetch] = useState(true);

  const fetchAT = async () => {
    setLoading(true);
    setATInitialFetch(false);
    const { shopee, tiktok } = await getDocument(
      "Mengambil Document Catatan Penghasilan All Time",
      "penghasilanAllTime",
      "CatatanPenghasilanAllTime",
    ).then((data) => data.data);

    setATWithdrawals({
      shopee: shopee.ATWithdrawals,
      tiktok: tiktok.ATWithdrawals,
    });
    setATBills({
      shopee: shopee.ATBills,
      tiktok: tiktok.ATBills,
    });
    setSetorAT({
      shopee: shopee.ATSetor,
      tiktok: tiktok.ATSetor,
    });
    setATProfit({
      shopee: shopee.ATProfit,
      tiktok: tiktok.ATProfit,
    });
    setLoading(false);
  };

  const fetchWithdrawals = async (platform, limit) => {
    setLoading(true);
    const data = await getWithdrawalList(platform, "newToOld", limit);
    if (data.success) {
      if (platform === "shopee") {
        setShopeeInitialFetch(false);
        setShopeeWithdrawals(data.data);
        setShopeeWithdrawals_temp(data.data);
      } else {
        setTiktokInitialFetch(false);
        setTiktokWithdrawals(data.data);
        setTiktokWithdrawals_temp(data.data);
      }
    } else {
      setError(data.error);
      console.log(data.error);
    }

    setLoading(false);
  };

  const fetchWithdrawalsByDate = async (platform, start, end) => {
    setLoading(true);
    const data = await getWithdrawalListByDate(
      platform,
      "newToOld",
      start,
      end,
    );
    if (data.success) {
      if (platform === "shopee") {
        setShopeeWithdrawals(data.data);
      } else {
        setTiktokWithdrawals(data.data);
      }
    } else {
      setError(data.error);
      console.log(data.error);
    }

    setLoading(false);
  };

  const fetchWithdrawalsByMonth = async (platform, year, month) => {
    setLoading(true);
    const data = await getWithdrawalListByMonth(
      platform,
      "newToOld",
      year,
      month,
    );
    if (data.success) {
      if (platform === "shopee") {
        setShopeeWithdrawals(data.data);
      } else {
        setTiktokWithdrawals(data.data);
      }
    } else {
      setError(data.error);
      console.log(data.error);
    }

    setLoading(false);
  };

  const sortByLimitUnderSeven = (platform, num) => {
    if (platform === "shopee") {
      setShopeeWithdrawals(shopeeWithdrawals_temp.slice(0, num));
    }

    if (platform === "tiktok") {
      setTiktokWithdrawals(tiktokWithdrawals_temp.slice(0, num));
    }
  };

  return (
    <WithdrawalRecordsContext.Provider
      value={{
        shopeeWithdrawals,
        tiktokWithdrawals,
        setShopeeWithdrawals,
        setTiktokWithdrawals,
        loading,
        error,
        fetchWithdrawals,
        sortByLimitUnderSeven,
        fetchWithdrawalsByDate,
        fetchWithdrawalsByMonth,
        ATWithdrawals,
        setATWithdrawals,
        ATBills,
        setATBills,
        ATSetor,
        setSetorAT,
        ATProfit,
        setATProfit,
        fetchAT,
        ATInitialFetch,
        setATInitialFetch,
        shopeeInitialFetch,
        setShopeeInitialFetch,
        tiktokInitialFetch,
        setTiktokInitialFetch,
      }}
    >
      {children}
    </WithdrawalRecordsContext.Provider>
  );
}

export const useWithdrawalRecords = () => useContext(WithdrawalRecordsContext);
