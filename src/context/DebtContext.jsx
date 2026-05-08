import { useSecurity } from "@/context/SecurityContext";
import { useUI } from "@/context/UIContext";
import { collectionName } from "@/services/firebase/firebase";
import { isEqual } from "lodash";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import {
  createDocument,
  deleteCollection,
  deleteDocument,
  getDebtChangeBySupplierId,
  getDocument,
  getDocuments,
  updateDocument,
} from "../services/firebase/docService";
import { raw, toCamelCase } from "../utils/generalFunction";

const DebtContext = createContext();

export function DebtProvider({ children }) {
  const { setLoading } = useUI();
  const { setOpenPin } = useSecurity();
  // Supplier State
  const [supplier, setSupplier] = useState([]);
  const [isFetchingSupplier, setIsFetchingSupplier] = useState(false);
  const [isSupplierFetched, setIsSupplierFetched] = useState(false);
  const [debtChanges, setDebtChanges] = useState([]);

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

  const addNewSupplier = async ({ supplierName, onSuccess = () => {} }) => {
    const addNow = async () => {
      const { success, error, message, docId, createdAtMs } =
        await createDocument(
          "Menambahkan Supplier Baru",
          collectionName.supplier,
          {
            username: toCamelCase(supplierName),
            name: supplierName,
            productDebt: [],
          },
          "Berhasil Menambahkan Supplier",
        );

      if (success) {
        setSupplier([
          {
            id: docId,
            createdAtMs: createdAtMs,
            name: supplierName,
            username: toCamelCase(supplierName),
            productDebt: [],
            debtChanges: [],
          },
          ...supplier,
        ]);
        toast.success(message);
        onSuccess();
      } else {
        toast.error(message);
        console.log(error);
      }
    };

    // Validasi
    if (!supplierName) {
      toast.warning("Masukan Nama Supplier");
      return;
    }

    const checkedSupplierName = supplier.find(
      (v) => v.username === toCamelCase(supplierName),
    );

    if (checkedSupplierName) {
      toast.error("Nama Supplier Telah Ada");
    } else {
      setOpenPin({
        open: true,
        actionOnMatch: addNow,
      });
    }
  };

  const deleteSupplier = async ({ supplierId, onSuccess = () => {} }) => {
    const deleteNow = async () => {
      const { success, error, message } = await deleteDocument(
        "Delete Supplier",
        collectionName.supplier,
        supplierId,
        "Berhasil Menghapus Supplier",
      );

      await deleteCollection(`${collectionName.debtChanges}-${supplierId}`);

      if (success) {
        setSupplier((prev) => {
          return prev.filter((s) => s.id !== supplierId);
        });
        toast.success(message);
        onSuccess();
      } else {
        toast.error(message);
        console.log(error);
      }
    };

    setOpenPin({
      open: true,
      actionOnMatch: deleteNow,
    });
  };

  const getDebtChanges = async (
    supplierId,
    limitOffPage = { limit: false, howMuch: 7 },
  ) => {
    if (!supplierId) return;

    const getNow = async () => {
      setLoading(true);

      const {
        success,
        data: debtChanges,
        error,
        message,
      } = await getDebtChangeBySupplierId(supplierId, "newToOld", limitOffPage);

      if (success) {
        setDebtChanges((prev) => {
          return [
            ...prev,
            {
              supplierId,
              changes: debtChanges,
            },
          ];
        });
      } else {
        toast.error(message);
        console.log(error);
      }

      setLoading(false);
    };

    const isDebtChangesExist = debtChanges.find(
      (c) => c.supplierId === supplierId,
    );

    if (!isDebtChangesExist) {
      getNow();
    }
  };

  const updateProductDebt = async (supplierId, productDebt, actionType) => {
    setLoading(true);

    const {
      data: supplierObject,
      error,
      success,
      message,
    } = await getDocument(
      "Mengambil Data Supplier",
      collectionName.supplier,
      supplierId,
    );

    if (success) {
      const previousDebt = supplierObject.productDebt;

      let debtChange = {
        supplierId,
        changeType: "",
        changes: [],
      };

      const merged = productDebt.map((debt) => {
        const sameDebt = previousDebt.find((b) => b.id === debt.id);

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
        if (!merged.find((d) => d.id === debt.id)) {
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

      const { docId: newDebtChangeId, createdAtMs: newDebtCreatedTime } =
        await createDocument(
          "Menyimpan Riwayat Perubahan Hutang",
          `${collectionName.debtChanges}-${supplierId}`,
          debtChange,
          "Berhasil Menyimpan Riwayat Perubahan Hutang",
        );
      debtChange.id = newDebtChangeId;
      debtChange.createdAtMs = newDebtCreatedTime;

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
        return prev.map((c) => {
          if (c.supplierId === supplierId) {
            return { ...c, changes: [debtChange, ...c.changes] };
          } else {
            return c;
          }
        });
      });

      if (actionType === "addDebt") {
        toast.success("Berhasil Menambah Hutang");
      } else if (actionType === "reduceDebt") {
        toast.success("Berhasil Mengurangi Hutang");
      }
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
  };

  const addProductDebt = async ({ productDebt, onSuccess = () => {} }) => {
    setLoading(true);

    const newProductDebt = {
      ...productDebt,
      identifier: toCamelCase(productDebt.name),
      hpp: raw(productDebt.hpp),
    };

    const isProductNameExist = productsDebt.find(
      (p) => p.identifier === newProductDebt.identifier,
    );

    if (!productDebt.name) {
      toast.warning("Isi Nama Produk");
    } else if (!productDebt.hpp) {
      toast.warning("Isi HPP Produk");
    } else if (isProductNameExist) {
      toast.warning("Nama Produk Sudah Ada, Gunakan Nama Lain");
    } else {
      setOpenPin({
        open: true,
        actionOnMatch: async () => {
          const { docId, success, error, message, createdAtMs } =
            await createDocument(
              "Menambahkan Produk Baru",
              collectionName.productsDebt,
              newProductDebt,
              "Berhasil Menambahkan Produk",
            );

          if (success) {
            // Optimistic Updates
            setProductsDebt((prev) => {
              return [
                {
                  ...newProductDebt,
                  id: docId,
                  createdAtMs,
                },
                ...prev,
              ];
            });
            toast.success(message);
            onSuccess();
          } else {
            toast.error(message);
            console.log(error);
          }
        },
      });
    }

    setLoading(false);
  };

  const getProductDebtList = async () => {
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

  const editProductDebt = async ({
    productId,
    productDebt,
    onSuccess = () => {},
  }) => {
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
    } else {
      setOpenPin({
        open: true,
        actionOnMatch: async () => {
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
            onSuccess();
          } else {
            toast.error(message);
            console.log(error);
          }
        },
      });
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
        addNewSupplier,
        deleteSupplier,
        getSupplierList,
        updateProductDebt,
        productsDebt,
        setProductsDebt,
        getProductDebtList,
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
