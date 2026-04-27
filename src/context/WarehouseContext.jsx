import { useUI } from "@/context/UIContext";
import {
  createDocument,
  getDocuments,
  updateDocument,
} from "@/services/firebase/docService";
import { collectionName } from "@/services/firebase/firebase";
import { raw } from "@/utils/generalFunction";
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

  const completeCut = async (batch, result, cutterPayment) => {
    const now = new Date().getTime();

    const updatedBatch = {
      ...batch,
      status: "sewing",
      stock: {
        cutResult: Number(result),
        onWarehouse: 0,
      },
      time: {
        ...batch.time,
        endCutting: now,
        startSewing: now,
      },
      operationalCosts: {
        worker: [{ workerType: "Tukang Potong", payment: raw(cutterPayment) }],
        total: raw(cutterPayment),
      },
    };

    setLoading(true);

    const { success, message } = await updateDocument(
      "Mengupdate Batch",
      collectionName.productionHistory,
      batch.id,
      updatedBatch,
      "Berhasil Mengupdate Batch",
    );

    if (success) {
      // optimistic update
      setProductionHistory((prev) => {
        return prev.map((b) => {
          if (b.id === batch.id) {
            return updatedBatch;
          } else {
            return b;
          }
        });
      });
      toast.success(message);
    } else {
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <WarehouseContext.Provider
      value={{
        productionHistory,
        getProductionHistory,
        addProduction,
        completeCut,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export const useWarehouse = () => useContext(WarehouseContext);
