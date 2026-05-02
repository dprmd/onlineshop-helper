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
        { id: docId, ...batchProduction },
        ...prev,
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

  const completeCut = async (batch, result, cutterPayment, packingCost) => {
    setLoading(true);

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
        startSewing: now + 60 * 1000,
      },
      operationalCosts: {
        worker: [
          {
            id: new Date().getTime(),
            role: "Tukang Potong",
            payment: raw(cutterPayment),
          },
        ],
        packingCost: raw(packingCost),
        total: raw(cutterPayment) + raw(packingCost),
      },
      hpp: Math.round(
        (Number(result) * raw(cutterPayment) +
          Number(result) * raw(packingCost) +
          batch.totalFabricCost) /
          Number(result),
      ),
    };

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

  const completeSewing = async (batch) => {
    setLoading(true);

    const now = new Date().getTime();

    const updatedBatch = {
      ...batch,
      status: "toPack",
      time: {
        ...batch.time,
        endSewing: now,
        startPacking: now + 60 * 1000,
      },
    };

    const { success, message } = await updateDocument(
      `Menandai ${batch.productName}-${batch.id} Selesai Dijahit`,
      collectionName.productionHistory,
      batch.id,
      updatedBatch,
      `Berhasil Menandai ${batch.productName}-${batch.id} Selesai Dijahit`,
    );

    if (success) {
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

  const completePacking = async (batch, qc) => {
    const updatedBatch = {
      ...batch,
      status: "inStock",
      stock: {
        ...batch.stock,
        onWarehouse: Number(qc.qcPassed),
        damaged: Number(qc.damaged),
        missing: Number(qc.missing),
      },
    };

    console.log(updatedBatch);
  };

  const addProductionCost = async (batch) => {
    setLoading(true);

    const targetBatch = productionHistory.find((b) => b.id === batch.batchId);

    const newCost = batch.workerPayments.reduce((acc, wrkr) => {
      return acc + raw(wrkr.payment);
    }, 0);

    const currentWorker = targetBatch.operationalCosts.worker;
    const newWorker = batch.workerPayments.map((wrkr) => {
      return {
        ...wrkr,
        payment: raw(wrkr.payment),
      };
    });

    const cutResult = targetBatch.stock.cutResult;
    const totalNewWorkerCost = [...currentWorker, ...newWorker].reduce(
      (acc, cur) => {
        return acc + cur.payment * cutResult;
      },
      0,
    );

    const updatedBatch = {
      ...targetBatch,
      operationalCosts: {
        ...targetBatch.operationalCosts,
        total: targetBatch.operationalCosts.total + newCost,
        worker: [...currentWorker, ...newWorker],
      },
      hpp: Math.round(
        (totalNewWorkerCost +
          targetBatch.operationalCosts.packingCost * cutResult +
          targetBatch.totalFabricCost) /
          cutResult,
      ),
    };

    const { success, message } = await updateDocument(
      "Menambahkan Biaya Produksi",
      collectionName.productionHistory,
      batch.batchId,
      updatedBatch,
      "Berhasil Menambahkan Biaya Produksi",
    );

    if (success) {
      setProductionHistory((prev) => {
        return prev.map((b) => {
          if (b.id === batch.batchId) {
            return updatedBatch;
          } else {
            return b;
          }
        });
      });
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
        completeSewing,
        completePacking,
        addProductionCost,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export const useWarehouse = () => useContext(WarehouseContext);
