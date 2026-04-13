import { useUI } from "@/context/UIContext";
import { createContext, useContext, useState } from "react";
import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "../services/firebase/docService";
import { raw, toCamelCase } from "../utils/generalFunction";
import { collectionName } from "@/services/firebase/firebase";

const CRUDContext = createContext();

export function CRUDProvider({ children }) {
  const { setLoading } = useUI();
  const [supplierInitialFetch, setSupplierInitialFetch] = useState(true);
  const [productsInitialFetch, setProductsInitalFetch] = useState(true);
  const [supplier, setSupplier] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  const getSupplierList = async () => {
    setLoading(true);
    const {
      data: supplierList,
      success,
      error,
    } = await getDocuments("Ambil List Supplier", "supplier", "newToOld");

    if (success) {
      setSupplierInitialFetch(false);
      setSupplier([...supplierList]);
    } else {
      setError(error);
      console.log(error);
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
    const {
      data: supplierObject,
      error,
      success,
    } = await getDocument("Mengambil Data Supplier", "supplier", supplierId);

    if (success) {
      const previousDebt = supplierObject.productDebt;

      const merged = productDebt.map((debt) => {
        const sameDebt = previousDebt.find(
          (b) => b.identifier === debt.identifier,
        );

        if (sameDebt) {
          return {
            ...sameDebt,
            remaining: sameDebt.remaining + debt.remaining,
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
      // Optimistic Update
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
    } else {
      setError(error);
      console.log(error);
    }

    setLoading(false);
  };

  const getProductList = async () => {
    setLoading(true);
    const {
      data: productList,
      success,
      error,
    } = await getDocuments(
      "Ambil List Produk",
      collectionName.products,
      "newToOld",
    );

    if (success) {
      setProductsInitalFetch(false);
      setProducts(productList);
    } else {
      setError(error);
      console.log(error);
    }

    setLoading(false);
  };

  const addProduct = async (product) => {
    setLoading(true);
    console.log(product);

    const { docId, success, error } = await createDocument(
      "Menambahkan Produk Baru",
      collectionName.products,
      {
        ...product,
        identifier: toCamelCase(product.name),
        hpp: raw(product.hpp),
      },
      "Berhasil Menambahkan Produk",
    );

    if (success) {
      setProducts((prev) => {
        return [
          {
            ...product,
            id: docId,
            hpp: raw(product.hpp),
            identifier: toCamelCase(product.name),
          },
          ...prev,
        ];
      });
    } else {
      setError(error);
      console.log(error);
    }

    setLoading(false);

    return { success };
  };

  const editProduct = async (editedProduct) => {
    setLoading(true);
    const docId = editedProduct.id;
    delete editedProduct.id;

    const { success, error } = await updateDocument(
      "Edit Produk",
      collectionName.products,
      docId,
      {
        ...editedProduct,
        identifier: toCamelCase(editedProduct.name),
        hpp: raw(editedProduct.hpp),
      },
      "Berhasil Edit Produk",
    );

    if (success) {
      setProducts((prev) => {
        return prev.map((p) => {
          if (p.id === docId) {
            return {
              ...editedProduct,
              identifier: toCamelCase(editedProduct.name),
              hpp: raw(editedProduct.hpp),
            };
          } else {
            return prev;
          }
        });
      });
    } else {
      setError(error);
      console.log(error);
    }

    setLoading(false);

    return { success };
  };

  const deleteProduct = async (docId) => {
    setLoading(true);

    const { success, error } = await deleteDocument(
      "Menghapus Produk",
      collectionName.products,
      docId,
      "Berhasil Menghapus Produk",
    );

    if (success) {
      setProducts((prev) => {
        return prev.filter((p) => p.id !== docId);
      });
    } else {
      setError(error);
      console.log(error);
    }

    setLoading(false);

    return { success };
  };

  return (
    <CRUDContext.Provider
      value={{
        error,
        setError,
        supplier,
        setSupplier,
        checkSupplierIfExist,
        getSupplierList,
        supplierInitialFetch,
        productsInitialFetch,
        addProductDebt,
        products,
        setProducts,
        getProductList,
        addProduct,
        editProduct,
        deleteProduct,
      }}
    >
      {children}
    </CRUDContext.Provider>
  );
}

export const useCRUD = () => useContext(CRUDContext);
