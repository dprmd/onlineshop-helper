import { getDocuments } from "../services/firebase/docService";
import { toCamelCase } from "../utils/generalFunction";
import { createContext, useContext, useEffect, useState } from "react";

const CRUDBarangContext = createContext();

export function CRUDBarangProvider({ children }) {
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSupplierList = async () => {
    setLoading(true);
    const data = await getDocuments(
      "Ambil List Supplier",
      "supplier",
      "newToOld",
    );

    if (data.success) {
      setSupplier(data.data);
    } else {
      ``;
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

  useEffect(() => {
    getSupplierList();
  }, []);

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
      }}
    >
      {children}
    </CRUDBarangContext.Provider>
  );
}

export const useCRUDBarang = () => useContext(CRUDBarangContext);
