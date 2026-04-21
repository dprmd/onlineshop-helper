import { useUI } from "@/context/UIContext";
import { collectionName } from "@/services/firebase/firebase";
import { isEqual } from "lodash";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "../services/firebase/docService";
import { raw, toCamelCase } from "../utils/generalFunction";

const CRUDContext = createContext();

export function CRUDProvider({ children }) {
  const { setLoading } = useUI();

  // Supplier State
  const [supplier, setSupplier] = useState([]);
  const [isFetchingSupplier, setIsFetchingSupplier] = useState(false);
  const [isSupplierFetched, setIsSupplierFetched] = useState(false);

  // Products State
  const [products, setProducts] = useState([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isProductsFetched, setIsProductsFetched] = useState(false);

  // Production History State
  const [productionHistory, setProductionHistory] = useState([]);
  const [isProductionHistoryFetched, setIsProductionHistoryFetched] =
    useState(false);
  const [isFetchingProductionHistory, setIsFetchingProductionHistory] =
    useState(false);

  // Create Function

  const addProduct = async (product) => {
    setLoading(true);

    const newProduct = {
      ...product,
      identifier: toCamelCase(product.name),
      hpp: product.hpp ? raw(product.hpp) : 0,
      variation: product.variation
        ? product.variation.map((p) => ({ ...p, hpp: raw(p.hpp) }))
        : [],
    };

    const { docId, success, error, message } = await createDocument(
      "Menambahkan Produk Baru",
      collectionName.products,
      newProduct,
      "Berhasil Menambahkan Produk",
    );

    if (success) {
      // Optimistic Updates
      setProducts((prev) => {
        return [
          {
            ...newProduct,
            id: docId,
          },
          ...prev,
        ];
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

  // Read Function

  const getSupplierList = async () => {
    if (isSupplierFetched || isFetchingSupplier) return;

    setIsFetchingSupplier(true);
    setLoading(true);

    const {
      data: supplierList,
      success,
      error,
      message,
    } = await getDocuments(
      "Ambil List Supplier",
      collectionName.supplier,
      "newToOld",
    );

    if (success) {
      setSupplier(supplierList);
      setIsSupplierFetched(true);
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
    setIsFetchingSupplier(false);
  };

  const checkSupplierIfExist = (supplierName) => {
    const exist = supplier.find(
      (v) => v.username === toCamelCase(supplierName),
    );
    return exist ? true : false;
  };

  const getProductList = async () => {
    if (isProductsFetched || isFetchingProducts) return;

    setIsFetchingProducts(true);
    setLoading(true);

    const {
      data: productList,
      success,
      error,
      message,
    } = await getDocuments(
      "Ambil List Produk",
      collectionName.products,
      "newToOld",
    );

    if (success) {
      setIsProductsFetched(true);
      setProducts([...productList]);
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
    setIsFetchingProducts(false);
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

  // Update Function

  const updateProductDebt = async (supplierId, productDebt, actionType) => {
    setLoading(true);

    const {
      data: supplierObject,
      error,
      success,
    } = await getDocument(
      "Mengambil Data Supplier",
      collectionName.supplier,
      supplierId,
    );

    if (success) {
      const previousDebt = supplierObject.productDebt;

      const merged = productDebt.map((debt) => {
        const sameDebt = previousDebt.find(
          (b) => b.identifier === debt.identifier,
        );

        if (sameDebt) {
          let history = {
            changeType: "",
            changes: [],
          };
          let summary = 0;
          if (actionType === "addDebt") {
            summary = sameDebt.remaining + debt.remaining;
            history.changeType = "addDebt";
            history.changes.push({
              name: debt.name,
              before: sameDebt.remaining,
              after: summary,
              changes: debt.remaining,
            });
          }
          if (actionType === "reduceDebt") {
            summary = sameDebt.remaining - debt.remaining;
            history.changeType = "reduceDebt";
            history.changes.push({
              name: debt.name,
              before: sameDebt.remaining,
              after: summary,
              changes: debt.remaining,
            });
          }
          return {
            ...sameDebt,
            remaining: summary,
            debtChanges: [...sameDebt.debtChanges, history],
          };
        } else {
          return debt;
        }
      });

      let unmondifiedDebt = [];

      previousDebt.forEach((debt) => {
        if (!merged.find((d) => d.identifier === debt.identifier)) {
          unmondifiedDebt.push(debt);
        }
      });

      const removedZeroDebt = [...unmondifiedDebt, ...merged].filter(
        (p) => p.remaining > 0,
      );

      await updateDocument(
        "Update Supplier Data",
        collectionName.supplier,
        supplierId,
        {
          ...supplierObject,
          productDebt: removedZeroDebt,
        },
        "Berhasil Mengupdate Supplier",
      );

      // Optimistic Update
      setSupplier((prev) => {
        return prev.map((s) => {
          if (s.id === supplierId) {
            return {
              ...s,
              productDebt: removedZeroDebt,
            };
          } else {
            return s;
          }
        });
      });
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
  };

  const editProduct = async (productId, product) => {
    setLoading(true);

    const productBefore = products.find((p) => p.id === productId);
    const editedProduct = {
      ...productBefore,
      name: product.name,
      identifier: toCamelCase(product.name),
      hpp: product.hpp ? raw(product.hpp) : 0,
      isHaveVariation: product.isHaveVariation,
      variation: product.variation
        ? product.variation.map((p) => ({ ...p, hpp: raw(p.hpp) }))
        : [],
    };

    if (isEqual({ ...editedProduct, id: productId }, productBefore)) {
      toast.info("Produk Tidak Di Edit");
      setLoading(false);
      return;
    }

    const { success, error, message } = await updateDocument(
      "Edit Produk",
      collectionName.products,
      productId,
      editedProduct,
      "Berhasil Edit Produk",
    );

    if (success) {
      // Optimistic Update
      setProducts((prev) => {
        return prev.map((p) => {
          if (p.id === productId) {
            return { ...editedProduct, id: productId };
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

  // Delete Function

  const deleteProduct = async (docId) => {
    setLoading(true);

    const { success, error, message } = await deleteDocument(
      "Menghapus Produk",
      collectionName.products,
      docId,
      "Berhasil Menghapus Produk",
    );

    if (success) {
      setProducts((prev) => {
        return prev.filter((p) => p.id !== docId);
      });
      toast.success(message);
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <CRUDContext.Provider
      value={{
        supplier,
        setSupplier,
        checkSupplierIfExist,
        getSupplierList,
        updateProductDebt,
        products,
        setProducts,
        getProductList,
        addProduct,
        editProduct,
        deleteProduct,
        productionHistory,
        getProductionHistory,
        addProduction,
      }}
    >
      {children}
    </CRUDContext.Provider>
  );
}

export const useCRUD = () => useContext(CRUDContext);
