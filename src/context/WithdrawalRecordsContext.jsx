import { useUI } from "@/context/UIContext";
import { createContext, useContext, useState } from "react";
import {
  getWithdrawalList,
  getWithdrawalListByDate,
  getWithdrawalListByMonth,
  getDocument,
} from "../services/firebase/docService";
import { collectionName } from "@/services/firebase/firebase";
import { toast } from "sonner";

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
  const [ATSetor, setATSetor] = useState(dummy);
  const [ATProfit, setATProfit] = useState(dummy);

  // Loading & Error & Initial Fetch
  const { setLoading } = useUI();
  const [isATFetched, setIsATFetched] = useState(false);
  const [isFetchingAT, setIsFetchingAT] = useState(false);
  const [isFetchingShopeeWithdrawals, setIsFetchingShopeeWithdrawals] =
    useState(false);
  const [isShopeeWithdrawalsFetched, setIsShopeeWithdrawalsFetched] =
    useState(false);
  const [isFetchingTiktokWithdrawals, setIsFetchingTiktokWithdrawals] =
    useState(false);
  const [isTiktokWithdrawalsFetched, setIsTiktokWithdrawalsFetched] =
    useState(false);

  const fetchAT = async () => {
    if (isFetchingAT || isATFetched) return;

    setIsFetchingAT(true);
    setLoading(true);

    const { data, error, success, message } = await getDocument(
      "Mengambil Document Catatan Penghasilan All Time",
      collectionName.allTime,
      collectionName.allTimeDocId,
    );

    if (success) {
      const { shopee, tiktok } = data;
      setATWithdrawals({
        shopee: shopee.ATWithdrawals,
        tiktok: tiktok.ATWithdrawals,
      });
      setATBills({
        shopee: shopee.ATBills,
        tiktok: tiktok.ATBills,
      });
      setATSetor({
        shopee: shopee.ATSetor,
        tiktok: tiktok.ATSetor,
      });
      setATProfit({
        shopee: shopee.ATProfit,
        tiktok: tiktok.ATProfit,
      });
      setIsATFetched(true);
    } else {
      console.log(message);
      console.log(error);
    }

    setLoading(false);
    setIsFetchingAT(false);
  };

  const fetchWithdrawals = async (platform, limit) => {
    setLoading(true);

    if (platform === "shopee") {
      if (isFetchingShopeeWithdrawals || isShopeeWithdrawalsFetched) return;

      setIsFetchingShopeeWithdrawals(true);

      const {
        data: withdrawalList,
        success,
        error,
        message,
      } = await getWithdrawalList(platform, "newToOld", limit);
      if (success) {
        setShopeeWithdrawals(withdrawalList);
        setShopeeWithdrawals_temp(withdrawalList);
        setIsShopeeWithdrawalsFetched(true);
      } else {
        toast.error(message);
        console.log(error);
      }

      setIsFetchingShopeeWithdrawals(false);
    }

    if (platform === "tiktok") {
      if (isFetchingTiktokWithdrawals || isTiktokWithdrawalsFetched) return;

      setIsFetchingTiktokWithdrawals(true);

      const {
        data: withdrawalList,
        success,
        error,
        message,
      } = await getWithdrawalList(platform, "newToOld", limit);
      if (success) {
        setTiktokWithdrawals(withdrawalList);
        setTiktokWithdrawals_temp(withdrawalList);
        setIsTiktokWithdrawalsFetched(true);
      } else {
        toast.error(message);
        console.log(error);
      }

      setIsFetchingTiktokWithdrawals(false);
    }

    setLoading(false);
  };

  const fetchWithdrawalsByDate = async (platform, start, end) => {
    setLoading(true);
    const {
      data: withdrawalList,
      success,
      error,
      message,
    } = await getWithdrawalListByDate(platform, "newToOld", start, end);

    if (success) {
      if (platform === "shopee") {
        setShopeeWithdrawals(withdrawalList);
      } else {
        setTiktokWithdrawals(withdrawalList);
      }
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
  };

  const fetchWithdrawalsByMonth = async (platform, year, month) => {
    setLoading(true);
    const {
      data: withdrawalList,
      success,
      error,
      message,
    } = await getWithdrawalListByMonth(platform, "newToOld", year, month);

    if (success) {
      if (platform === "shopee") {
        setShopeeWithdrawals(withdrawalList);
      } else {
        setTiktokWithdrawals(withdrawalList);
      }
    } else {
      toast.error(message);
      console.log(error);
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
        fetchWithdrawals,
        sortByLimitUnderSeven,
        fetchWithdrawalsByDate,
        fetchWithdrawalsByMonth,
        ATWithdrawals,
        setATWithdrawals,
        ATBills,
        setATBills,
        ATSetor,
        setATSetor,
        ATProfit,
        setATProfit,
        fetchAT,
      }}
    >
      {children}
    </WithdrawalRecordsContext.Provider>
  );
}

export const useWithdrawalRecords = () => useContext(WithdrawalRecordsContext);
