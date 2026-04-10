import { useUI } from "@/context/UIContext";
import {
  getDocument,
  getDocuments,
  updateDocument,
} from "../services/firebase/docService";
import { toCamelCase } from "../utils/generalFunction";
import { createContext, useContext, useEffect, useState } from "react";

const CRUDBarangContext = createContext();

export function CRUDBarangProvider({ children }) {
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

  const tambahHutangBarang = async (supplierId, hutangBarang) => {
    setLoading(true);
    const { data: supplierObject } = await getDocument(
      "Mengambil Data Supplier",
      "supplier",
      supplierId,
    );

    const hutangBarangBefore = supplierObject.hutangBarang;

    const merged = hutangBarang.map((barang) => {
      const sameBarang = hutangBarangBefore.find(
        (b) => b.identifier === barang.identifier,
      );

      if (sameBarang) {
        return { ...sameBarang, terjual: sameBarang.terjual + barang.terjual };
      } else {
        return barang;
      }
    });

    let barangNotEdited = [];

    hutangBarangBefore.forEach((barang) => {
      if (!merged.find((p) => p.identifier === barang.identifier)) {
        barangNotEdited.push(barang);
      }
    });

    await updateDocument(
      "Update Supplier Data",
      "supplier",
      supplierId,
      {
        ...supplierObject,
        hutangBarang: [...barangNotEdited, ...merged],
      },
      "Berhasil Mengupdate Supplier",
    );
    setSupplier((prev) => {
      return prev.map((s) => {
        if (s.id === supplierId) {
          return {
            ...s,
            hutangBarang: [...barangNotEdited, ...merged],
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
    <CRUDBarangContext.Provider
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
        tambahHutangBarang,
        products,
        setProducts,
        getProductList,
      }}
    >
      {children}
    </CRUDBarangContext.Provider>
  );
}

export const useCRUDBarang = () => useContext(CRUDBarangContext);
