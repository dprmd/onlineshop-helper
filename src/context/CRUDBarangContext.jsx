import { useUI } from "@/context/UIContext";
import { getDocuments } from "../services/firebase/docService";
import { toCamelCase } from "../utils/generalFunction";
import { createContext, useContext, useEffect, useState } from "react";

const CRUDBarangContext = createContext();

export function CRUDBarangProvider({ children }) {
  const { loading, setLoading } = useUI();
  const [initialFetch, setInitialFetch] = useState(true);
  const [supplier, setSupplier] = useState([]);
  const [error, setError] = useState(null);

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
      }}
    >
      {children}
    </CRUDBarangContext.Provider>
  );
}

export const useCRUDBarang = () => useContext(CRUDBarangContext);
