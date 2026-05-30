import { useUI } from "@/context/UIContext";
import {
  createDocument,
  createDocumentById,
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

  // Products State
  const [products, setProducts] = useState([]);
  const [isProductsFetched, setIsProductsFetched] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  // Production History State
  const [productionHistory, setProductionHistory] = useState([]);
  const [isProductionHistoryFetched, setIsProductionHistoryFetched] =
    useState(false);
  const [isFetchingProductionHistory, setIsFetchingProductionHistory] =
    useState(false);

  // Stock Changes State
  const [stockChanges, setStockChanges] = useState([]);
  const [isStockChangesFetched, setIsStockChangesFetched] = useState(false);
  const [isFetchingStockChanges, setIsFetchingStockChanges] = useState(false);

  const writeStockChanges = async (
    productId,
    variantId,
    stockChanges = { qcPassed: 0, defect: 0, lost: 0 },
    reference = { type: "", id: "" },
  ) => {
    // Update Stock Produk
    const theProduct = products.find((p) => p.id === productId);
    const theVariant = theProduct.variation.find((v) => v.id === variantId);
    const stockBefore = theVariant.stock;
    const stockAfter = {
      ...stockBefore,
      qcPassed: stockBefore.qcPassed + stockChanges.qcPassed,
      defect: stockBefore.defect + stockChanges.defect,
      lost: stockBefore.lost + stockChanges.lost,
    };

    const getModifiedStock = () => {
      if (theProduct.isHaveVariant) {
        return {
          ...theProduct,
          variation: theProduct.variation.map((p) => {
            if (p.id === variantId) return { ...p, stock: stockAfter };
            else return p;
          }),
        };
      } else {
        toast.error("Produk Ini Tidak Punya Variant");
      }
    };

    const modifiedStock = getModifiedStock();
    const updateProductStock = await updateDocument(
      `Menambahkan Stok Ke Produk ${productId}, Ready: ${stockChanges.qcPassed}, Cacat: ${stockChanges.defect}, Hilang: ${stockChanges.lost}`,
      collectionName.myProducts,
      productId,
      modifiedStock,
      `Berhasil Menambahkan Stok Ke Produk ${productId}, Ready: ${stockChanges.qcPassed}, Cacat: ${stockChanges.defect}, Hilang: ${stockChanges.lost}`,
    );

    if (updateProductStock.success) {
      setProducts((prev) => {
        return prev.map((p) => {
          if (p.id === productId) {
            return modifiedStock;
          } else {
            return p;
          }
        });
      });
      toast.success(updateProductStock.message);
    } else {
      toast.error(updateProductStock.message);
      console.log(updateProductStock.error);
    }

    // Tambah Ke Riwayat Perubahan Stock
    const newStockChanges = {
      productId: productId,
      productName: theProduct.name,
      variantName: theVariant.name,
      variantId: variantId,
      type: reference.type,
      stockBefore: stockBefore,
      stockChanges: stockChanges,
      stockAfter: stockAfter,
      reference,
    };

    const addNewStockChanges = await createDocument(
      "Tambah Riwayat Perubahan Stock",
      collectionName.stockChanges,
      newStockChanges,
      "Berhasil Menambahkan Perubahan Stock",
    );

    if (addNewStockChanges.success) {
      setStockChanges((prev) => {
        return [
          {
            id: addNewStockChanges.docId,
            createdAtMs: addNewStockChanges.createdAtMs,
          },
          ...prev,
        ];
      });
      toast.success(addNewStockChanges.message);
    } else {
      toast.error(addNewStockChanges.message);
      console.log(addNewStockChanges.error);
    }
  };

  const getStockChanges = async () => {
    if (isStockChangesFetched || isFetchingStockChanges) return;

    setLoading(true);
    setIsFetchingStockChanges(true);

    const { success, error, message, data } = await getDocuments(
      "Mengambil Riwayat Perubahan Stok",
      collectionName.stockChanges,
      "newToOld",
      { limit: true, howMuch: 30 },
    );

    if (success) {
      setStockChanges([...data]);
      setIsStockChangesFetched(true);
    } else {
      toast.error(message);
      console.log(error);
    }

    setIsFetchingStockChanges(false);
    setLoading(false);
  };

  const getProductList = async (force = false) => {
    const getNow = async () => {
      setIsFetchingProducts(true);
      setLoading(true);

      const {
        data: productList,
        success,
        error,
        message,
      } = await getDocuments(
        "Ambil List Produk Saya",
        collectionName.myProducts,
        "newToOld",
      );

      if (success) {
        setProducts([...productList]);
        setIsProductsFetched(true);
      } else {
        toast.error(message);
        console.log(error);
      }

      setLoading(false);
      setIsFetchingProducts(false);
    };

    if (force) {
      getNow();
    } else {
      if (isFetchingProducts || isProductsFetched) return;
      else {
        getNow();
      }
    }
  };

  const editProduct = async (editedProduct) => {
    setLoading(true);

    const productId = editedProduct.baseSKU;

    const { success, error, message } = await updateDocument(
      `Mengedit Produk ${productId}`,
      collectionName.myProducts,
      productId,
      editedProduct,
      `Berhasil Mengedit Produk ${productId}`,
    );

    if (success) {
      setProducts((prev) => {
        return prev.map((p) => {
          if (p.id === productId) {
            return editedProduct;
          } else {
            return p;
          }
        });
      });
      toast.success(message);
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
  };

  const addNewProduct = async (product) => {
    const productId = product.baseSKU;

    setLoading(true);
    const { success, error, message, createdAtMs } = await createDocumentById(
      "Tambah Produk Baru",
      collectionName.myProducts,
      productId,
      product,
      "Berhasil Menambahkan Produk",
    );

    if (success) {
      setProducts((prev) => {
        return [{ id: productId, createdAtMs, ...product }, ...prev];
      });
      toast.success(message);
    } else {
      toast.error(message);
      console.log(error);
    }
    setLoading(false);
  };

  const archiveProduct = async (productId) => {
    setLoading(true);

    const { success, error, message } = await updateDocument(
      `Mengarsipkan Produk ${productId}`,
      collectionName.myProducts,
      productId,
      { archived: true },
      `Berhasil Mengarsipkan Produk ${productId}`,
    );

    if (success) {
      setProducts((prev) => {
        return prev.map((p) => {
          if (p.id === productId) {
            return { ...p, archived: true };
          } else {
            return p;
          }
        });
      });
      toast.success(message);
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
  };

  const addProduction = async (batchProduction) => {
    setLoading(true);

    const { docId, success, error, message, createdAtMs } =
      await createDocument(
        "Simpan Batch Produksi",
        collectionName.productionHistory,
        batchProduction,
        "Berhasil Menambahkan Batch Ke Riwayat Produksi",
      );

    if (success) {
      setProductionHistory((prev) => [
        { id: docId, createdAtMs, ...batchProduction },
        ...prev,
      ]);
      toast.success(message);
    } else {
      toast.error(message);
      console.log(error);
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
      },
      time: [
        ...batch.time,
        { name: "Selesai Di Potong", time: now },
        { name: "Mulai Di Jahit", time: now + 60 * 1000 },
      ],
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

    const { success, error, message } = await updateDocument(
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
      console.log(error);
    }

    setLoading(false);
  };

  const completeSewing = async (batch) => {
    setLoading(true);

    const productRelation = products.find(
      (p) => p.id === batch.productRelationId,
    );

    const now = new Date().getTime();

    const updatedBatch = {
      ...batch,
      status: "toPack",
      time: [
        ...batch.time,
        { name: "Selesai Jahit", time: now },
        { name: "Mulai Packing", time: now + 60 * 1000 },
      ],
    };

    const { success, error, message } = await updateDocument(
      `Menandai ${productRelation.id}-${batch.id} Selesai Dijahit`,
      collectionName.productionHistory,
      batch.id,
      updatedBatch,
      `Berhasil Menandai ${productRelation.id}-${batch.id} Selesai Dijahit`,
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
      console.log(error);
    }

    setLoading(false);
  };

  const completePacking = async (batch, qc) => {
    const batchId = batch.id;
    const skuId = batch.productRelationId;
    const variantId = batch.productVariantId;

    const updatedBatch = {
      ...batch,
      status: "ready",
      stock: {
        ...batch.stock,
        qcPassed: Number(qc.qcPassed),
        defect: Number(qc.defect),
        lost: Number(qc.lost),
      },
      time: [
        ...batch.time,
        { name: "Selesai Packing", time: new Date().getTime() },
      ],
    };

    // Update Batch
    const { success, error, message } = await updateDocument(
      `Menandai ${skuId}-${batch.id} Selesai Di Packing`,
      collectionName.productionHistory,
      batchId,
      updatedBatch,
      `Berhasil Menandai ${skuId}-${batch.id} Selesai Di Packing`,
    );

    if (success) {
      setProductionHistory((prev) => {
        return prev.map((b) => {
          if (b.id === updatedBatch.id) {
            return updatedBatch;
          } else {
            return b;
          }
        });
      });
      toast.success(message);
    } else {
      toast.error(message);
      console.log(error);
    }

    // update stock product dan riwayat stok
    await writeStockChanges(
      skuId,
      variantId,
      {
        qcPassed: updatedBatch.stock.qcPassed,
        defect: updatedBatch.stock.defect,
        lost: updatedBatch.stock.lost,
      },
      { type: "PRODUCTION", id: batchId },
    );
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

    const { success, error, message } = await updateDocument(
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
      toast.success(message);
    } else {
      toast.error(message);
      console.log(error);
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
        products,
        getProductList,
        addNewProduct,
        editProduct,
        archiveProduct,
        stockChanges,
        getStockChanges,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export const useWarehouse = () => useContext(WarehouseContext);
