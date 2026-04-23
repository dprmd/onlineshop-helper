import { useUI } from "@/context/UIContext";
import { getDocuments } from "@/services/firebase/docService";
import { collectionName } from "@/services/firebase/firebase";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const WarehouseContext = createContext();

export function WarehouseProvider({ children }) {
  const { setLoading } = useUI();

  // Production History State
  const [productionHistory, setProductionHistory] = useState([]);
  const [isProductionHistoryFetched, setIsProductionHistoryFetched] =
    useState(false);
  const [isFetchingProductionHistory, setIsFetchingProductionHistory] =
    useState(false);

  const addProduction = async (batchProduction) => {
    setLoading(true);

    const { docId, success, message } = await createDocument(
      "Simpan Batch Produksi",
      collectionName.productionHistory,
      batchProduction,
      "Berhasil Menambahkan Batch Ke Riwayat Produksi",
    );

    if (success) {
      setProductionHistory((prev) => [
        ...prev,
        { id: docId, ...batchProduction },
      ]);
      toast.success(message);
    } else {
      toast.error(message);
    }

    setLoading(false);
  };

  const getProductionHistory = async () => {
    if (isProductionHistoryFetched || isFetchingProductionHistory) return;

    setIsFetchingProductionHistory(true);
    setLoading(true);

    const {
      data: productionList,
      success,
      error,
      message,
    } = await getDocuments(
      "Ambil Riwayat Produksi",
      collectionName.productionHistory,
      "newToOld",
    );

    if (success) {
      setProductionHistory([...productionList]);
      setIsProductionHistoryFetched(true);
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
    setIsFetchingProductionHistory(false);
  };
  return (
    <WarehouseContext.Provider
      value={{
        productionHistory,
        getProductionHistory,
        addProduction,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export const useWarehouse = () => useContext(WarehouseContext);
