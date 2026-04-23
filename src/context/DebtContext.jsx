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

const DebtContext = createContext();

export function DebtProvider({ children }) {
  const { setLoading } = useUI();
  // Supplier State
  const [supplier, setSupplier] = useState([]);
  const [isFetchingSupplier, setIsFetchingSupplier] = useState(false);
  const [isSupplierFetched, setIsSupplierFetched] = useState(false);
  const [debtChanges, setDebtChanges] = useState([]);
  const [isFetchingDebtChanges, setIsFetchingDebtChanges] = useState(false);
  const [isDebtChangesFethced, setIsDebtChangesFetched] = useState(false);

  // Products State
  const [productsDebt, setProductsDebt] = useState([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isProductsFetched, setIsProductsFetched] = useState(false);

  // Supplier Function

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

  const getDebtChanges = async (supplierId, forceToFetch = false) => {
    const getNow = async () => {
      setIsFetchingDebtChanges(true);
      setLoading(true);

      const {
        success,
        data: debtChanges,
        error,
        message,
      } = await getDocuments(
        "Mengambil List Perubahan Hutang",
        `${collectionName.debtChanges}-${supplierId}`,
        "newToOld",
      );

      if (success) {
        setDebtChanges([...debtChanges]);
        setIsDebtChangesFetched(true);
      } else {
        toast.error(message);
        console.log(error);
      }

      setLoading(false);
      setIsFetchingDebtChanges(false);
    };

    if (forceToFetch) {
      getNow();
    } else if (isFetchingDebtChanges || isDebtChangesFethced) return;
    else {
      getNow();
    }
  };

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

      let debtChange = {
        id: "",
        supplierId,
        changeType: "",
        changes: [],
      };

      const merged = productDebt.map((debt) => {
        const sameDebt = previousDebt.find(
          (b) => b.identifier === debt.identifier,
        );

        let remaining = 0;

        if (sameDebt) {
          remaining = sameDebt.remaining;
        }

        let summary = 0;
        if (actionType === "addDebt") {
          summary = remaining + debt.remaining;
          debtChange.changeType = "addDebt";
          debtChange.changes.push({
            productName: debt.name,
            valueBefore: remaining,
            valueAfter: summary,
            change: debt.remaining,
          });
        }
        if (actionType === "reduceDebt") {
          summary = remaining - debt.remaining;
          debtChange.changeType = "reduceDebt";
          debtChange.changes.push({
            productName: debt.name,
            valueBefore: remaining,
            valueAfter: summary,
            change: debt.remaining,
          });

          if (sameDebt) {
            return {
              ...sameDebt,
              remaining: summary,
            };
          } else {
            return debt;
          }
        }

        if (sameDebt) {
          return {
            ...sameDebt,
            remaining: summary,
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

      const { docId: newDebtChangeId } = await createDocument(
        "Menyimpan Riwayat Perubahan Hutang",
        `${collectionName.debtChanges}-${supplierId}`,
        debtChange,
        "Berhasil Menyimpan Riwayat Perubahan Hutang",
      );
      debtChange.id = newDebtChangeId;

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
      setDebtChanges((prev) => {
        return [...prev, debtChange];
      });
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
  };

  // Products Function

  const addProductDebt = async (productDebt) => {
    setLoading(true);

    const newProduct = {
      ...productDebt,
      identifier: toCamelCase(productDebt.name),
      hpp: raw(productDebt.hpp),
    };

    const { docId, success, error, message } = await createDocument(
      "Menambahkan Produk Baru",
      collectionName.productsDebt,
      newProduct,
      "Berhasil Menambahkan Produk",
    );

    if (success) {
      // Optimistic Updates
      setProductsDebt((prev) => {
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
      "Ambil List Produk Hutang",
      collectionName.productsDebt,
      "newToOld",
    );

    if (success) {
      setIsProductsFetched(true);
      setProductsDebt([...productList]);
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
    setIsFetchingProducts(false);
  };

  const editProductDebt = async (productId, productDebt) => {
    setLoading(true);

    const productBefore = productsDebt.find((p) => p.id === productId);
    const editedProduct = {
      ...productBefore,
      name: productDebt.name,
      identifier: toCamelCase(productDebt.name),
      hpp: raw(productDebt.hpp),
    };

    if (isEqual({ ...editedProduct, id: productId }, productBefore)) {
      toast.info("Produk Tidak Di Edit");
      setLoading(false);
      return;
    }

    const { success, error, message } = await updateDocument(
      "Edit Produk",
      collectionName.productsDebt,
      productId,
      editedProduct,
      "Berhasil Edit Produk",
    );

    if (success) {
      // Optimistic Update
      setProductsDebt((prev) => {
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

  const deleteProductDebt = async (docId) => {
    setLoading(true);

    const { success, error, message } = await deleteDocument(
      "Menghapus Produk",
      collectionName.productsDebt,
      docId,
      "Berhasil Menghapus Produk",
    );

    if (success) {
      setProductsDebt((prev) => {
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
    <DebtContext.Provider
      value={{
        supplier,
        setSupplier,
        checkSupplierIfExist,
        getSupplierList,
        updateProductDebt,
        productsDebt,
        setProductsDebt,
        getProductList,
        addProductDebt,
        editProductDebt,
        deleteProductDebt,
        getDebtChanges,
        debtChanges,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
}

export const useDebt = () => useContext(DebtContext);
