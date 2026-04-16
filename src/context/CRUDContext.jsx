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
import { toast } from "sonner";
import { isEqual } from "lodash";

const CRUDContext = createContext();

export function CRUDProvider({ children }) {
  const { setLoading } = useUI();

  // Supplier
  const [supplier, setSupplier] = useState([]);
  const [supplierInitialFetch, setSupplierInitialFetch] = useState(true);

  // Products
  const [products, setProducts] = useState([]);
  const [productsInitialFetch, setProductsInitalFetch] = useState(true);

  const getSupplierList = async () => {
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
      setSupplierInitialFetch(false);
      setSupplier([...supplierList]);
    } else {
      toast.error(message);
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
        collectionName.supplier,
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
      toast.error(message);
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
      message,
    } = await getDocuments(
      "Ambil List Produk",
      collectionName.products,
      "newToOld",
    );

    if (success) {
      setProductsInitalFetch(false);
      setProducts(productList);
    } else {
      toast.error(message);
      console.log(error);
    }

    setLoading(false);
  };

  const addProduct = async (product) => {
    setLoading(true);

    const newProduct = {
      ...product,
      identifier: toCamelCase(product.name),
      hpp: raw(product.hpp),
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

  const editProduct = async (productId, product) => {
    setLoading(true);

    console.log(products);

    const productBefore = products.find((p) => p.id === productId);
    const editedProduct = {
      ...productBefore,
      name: product.name,
      identifier: toCamelCase(product.name),
      hpp: raw(product.hpp),
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
      product,
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
