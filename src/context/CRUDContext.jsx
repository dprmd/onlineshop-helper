import { useUI } from "@/context/UIContext";
import { createContext, useContext, useState } from "react";
import {
  getDocument,
  getDocuments,
  updateDocument,
} from "../services/firebase/docService";
import { toCamelCase } from "../utils/generalFunction";

const CRUDContext = createContext();

export function CRUDProvider({ children }) {
  const { loading, setLoading } = useUI();
  const [initialFetch, setInitialFetch] = useState(true);
  const [supplier, setSupplier] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  const getSupplierList = async () => {
    setLoading(true);
    setInitialFetch(false);
    const data = await getDocuments(
      "Ambil List Supplier",
      "supplier",
      "newToOld",
    );

    if (data.success) {
      setSupplier(data.data);
    } else {
      setError(data.error);
      console.log(data.error);
    }

    setLoading(false);
  };

  const checkSupplierIfExist = (supplierName) => {
    const exist = supplier.find(
      (v) => v.username === toCamelCase(supplierName),
    );
    return exist ? true : false;
  };

  const addProductDebt = async (supplierId, productDebt) => {
    setLoading(true);
    const { data: supplierObject } = await getDocument(
      "Mengambil Data Supplier",
      "supplier",
      supplierId,
    );

    const previousDebt = supplierObject.productDebt;

    const merged = productDebt.map((debt) => {
      const sameDebt = previousDebt.find(
        (b) => b.identifier === debt.identifier,
      );

      if (sameDebt) {
        return { ...sameDebt, remaining: sameDebt.remaining + debt.remaining };
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

    await updateDocument(
      "Update Supplier Data",
      "supplier",
      supplierId,
      {
        ...supplierObject,
        productDebt: [...unmondifiedDebt, ...merged],
      },
      "Berhasil Mengupdate Supplier",
    );
    setSupplier((prev) => {
      return prev.map((s) => {
        if (s.id === supplierId) {
          return {
            ...s,
            productDebt: [...unmondifiedDebt, ...merged],
          };
        } else {
          return s;
        }
      });
    });

    setLoading(false);
  };

  const getProductList = async () => {};

  return (
    <CRUDContext.Provider
      value={{
        loading,
        setLoading,
        error,
        setError,
        supplier,
        setSupplier,
        checkSupplierIfExist,
        getSupplierList,
        initialFetch,
        addProductDebt,
        products,
        setProducts,
        getProductList,
      }}
    >
      {children}
    </CRUDContext.Provider>
  );
}

export const useCRUD = () => useContext(CRUDContext);
