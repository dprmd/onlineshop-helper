import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSecurity } from "@/context/SecurityContext";
import { useWarehouse } from "@/context/WarehouseContext";
import { formatDate } from "@/utils/generalFunction";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";

export default function Products() {
  const [searchParams] = useSearchParams();
  const {
    addNewProduct,
    editProduct,
    archiveProduct,
    products,
    getProductList,
  } = useWarehouse();
  const initialProduct = {
    id: "",
    createdAt: undefined,
    createdAtMs: "",
    type: "", // addProduct, editProduct
    dialogOpen: false,
    dialogTitle: "",
    name: "",
    baseSKU: "",
    isHaveVariant: false,
    variation: [],
  };
  const [product, setProduct] = useState(initialProduct);
  const { setOpenPin } = useSecurity();
  const [deleteProductDialog, setDeleteProductDialog] = useState({
    open: false,
    idToDelete: "",
  });

  const findDuplikatBaseSKU = (skuName) => {
    const findIt = products.find((p) => p.baseSKU === skuName);

    if (findIt) return true;
    else return false;
  };

  const handleSaveProduct = () => {
    const productBefore = products.find((p) => p.id === product.id);
    const newProduct = {
      name: product.name,
      isHaveVariant: product.isHaveVariant,
      variation: [...product.variation],
      baseSKU: product.baseSKU,
      archived: false,
    };

    const saveNow = () => {
      setOpenPin({
        open: true,
        actionOnMatch: async () => {
          if (product.type === "addProduct") {
            await addNewProduct(newProduct);
          }
          if (product.type === "editProduct") {
            await editProduct({
              ...newProduct,
              createdAtMs: product.createdAtMs,
            });
          }

          setProduct(initialProduct);
        },
      });
    };

    if (
      product.type === "editProduct" &&
      isEqual(productBefore, {
        ...newProduct,
        id: product.id,
        createdAt: product.createdAt,
        createdAtMs: product.createdAtMs,
      })
    ) {
      toast.warning("Tidak Ada Perubahan, Produk Tidak Di Edit");
      return;
    } else if (product.name.length === 0) {
      toast.warning("Mohon Masukan Nama Produk");
    } else if (product.isHaveVariant && product.variation.length === 0) {
      toast.warning("Mohon Tambahkan Variasi");
      return;
    } else if (product.baseSKU.length === 0) {
      toast.warning("Mohon Isi Nama SKU Induk");
    } else if (
      product.type === "addProduct" &&
      findDuplikatBaseSKU(product.baseSKU)
    ) {
      toast.warning("Nama SKU Induk Sudah Terdaftar");
    } else if (product.isHaveVariant && product.variation.length > 0) {
      const isContainsUndefined = product.variation.map((variation) => {
        if (variation.name.length === 0) {
          return "yes";
        } else {
          return "no";
        }
      });

      if (isContainsUndefined.includes("yes")) {
        toast.warning("Mohon Isi Nama Variasi");
      } else {
        saveNow();
      }
    } else if (!product.isHaveVariant) {
      saveNow();
    }
  };

  useEffect(() => {
    getProductList();

    const dialogAddProduct = searchParams.get("addProduct");

    if (dialogAddProduct === "true") {
      setProduct((prev) => ({
        ...prev,
        dialogOpen: true,
        dialogTitle: "Tambah Produk",
      }));
    }
  }, []);
  return (
    <div className="flex flex-col justify-center items-center gap-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/warehouse">Gudang Saya</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Produk</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {products.length === 0 && (
        <p className="text-gray-400 text-center">
          Belum Menambahkan Produk Apapun
        </p>
      )}

      <Button
        onClick={() => {
          setProduct((prev) => ({
            ...prev,
            type: "addProduct",
            dialogOpen: true,
            dialogTitle: "Tambah Produk",
            name: "",
            isHaveVariant: false,
            variation: [],
          }));
        }}
      >
        Tambah Produk
      </Button>

      {/* Alert Dialog Hapus */}
      <AlertDialog
        open={deleteProductDialog.open}
        onOpenChange={(v) => {
          if (!v) {
            setDeleteProductDialog({ open: v, idToDelete: "" });
          } else {
            setDeleteProductDialog((prev) => ({ ...prev, open: v }));
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arsipkan Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Arsipkan Produk Ini, Produk Bisa Di Pulihkan Nanti
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button
              onClick={() => {
                setOpenPin({
                  open: true,
                  actionOnMatch: async () => {
                    await archiveProduct(deleteProductDialog.idToDelete);
                    setDeleteProductDialog({ open: false, idToDelete: "" });
                  },
                });
              }}
            >
              Lanjutkan
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Add Product */}
      <Dialog
        open={product.dialogOpen}
        onOpenChange={(v) => {
          if (v) {
            setProduct((prev) => ({ ...prev, dialogOpen: v }));
          } else {
            setProduct({ ...initialProduct, dialogOpen: v });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{product.dialogTitle}</DialogTitle>
          </DialogHeader>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Nama Produk</FieldLabel>
                <Input
                  placeholder="Nama Produk . . ."
                  value={product.name}
                  onChange={(e) => {
                    setProduct((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>SKU Induk</FieldLabel>
                <Input
                  placeholder="SKU . . ."
                  disabled={product.type === "editProduct"}
                  value={product.baseSKU}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (findDuplikatBaseSKU(value)) {
                      toast.warning("SKU Sudah Di Gunakan");
                      setProduct((prev) => ({
                        ...prev,
                        baseSKU: value,
                        isHaveVariant: false,
                      }));
                    } else {
                      setProduct((prev) => ({
                        ...prev,
                        baseSKU: value,
                      }));
                    }
                  }}
                />
              </Field>
              <Field className="flex flex-row">
                <Switch
                  disabled={product.type === "editProduct"}
                  checked={product.isHaveVariant}
                  onCheckedChange={(v) => {
                    if (!v) {
                      setProduct((prev) => ({
                        ...prev,
                        isHaveVariant: v,
                        variation: [],
                      }));
                    } else {
                      setProduct((prev) => ({
                        ...prev,
                        isHaveVariant: v,
                      }));
                    }
                  }}
                />
                <FieldLabel>Hidupkan Variasi</FieldLabel>
              </Field>
              {product.isHaveVariant && (
                <div>
                  {product.variation.map((variant) => (
                    <Field key={variant.id} className="mt-1">
                      <FieldLabel>Nama Variasi</FieldLabel>
                      <div className="flex gap-x-2">
                        <Input
                          value={variant.name}
                          onChange={(e) => {
                            setProduct((prev) => ({
                              ...prev,
                              variation: prev.variation.map((variation) => {
                                if (variation.id === variant.id) {
                                  return {
                                    ...variation,
                                    name: e.target.value,
                                    sku: `${product.baseSKU}-${e.target.value.toUpperCase()}`,
                                  };
                                } else {
                                  return variation;
                                }
                              }),
                            }));
                          }}
                        />
                        <Button
                          className="bi bi-trash"
                          onClick={() => {
                            setProduct((prev) => ({
                              ...prev,
                              variation: prev.variation.filter(
                                (variation) => variation.id !== variant.id,
                              ),
                            }));
                          }}
                        />
                      </div>
                    </Field>
                  ))}
                  <Button
                    size={"xs"}
                    className="mt-2"
                    onClick={() => {
                      setProduct((prev) => ({
                        ...prev,
                        variation: [
                          ...prev.variation,
                          {
                            id: uuidv7(),
                            name: "",
                            stock: { qcPassed: 0, defect: 0, lost: 0 },
                          },
                        ],
                      }));
                    }}
                  >
                    Tambah Variasi
                  </Button>
                </div>
              )}
            </FieldGroup>
          </FieldSet>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Batal</Button>
            </DialogClose>
            <Button onClick={handleSaveProduct}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List Produk */}
      {products.length > 0 && (
        <ul className="flex flex-wrap justify-center items-center gap-y-3">
          {products.map((prod) => {
            if (!prod.archived) {
              return (
                <li className="min-w-[380px] max-w-[380px]" key={prod.baseSKU}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{prod.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <p>SKU Induk : {prod.baseSKU}</p>
                        <p>Dibuat Pada : {formatDate(prod.createdAtMs)}</p>
                        <p>
                          Per Variasi : {prod.isHaveVariant ? "Ya" : "Tidak"}
                        </p>
                        {prod.isHaveVariant && (
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <p className="border px-2 py-1 my-1 rounded-xl max-w-fit hover:bg-gray-200 cursor-pointer">
                                Banyak Variasi : {prod.variation.length} Variasi
                              </p>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <ul className="px-2 py-2 border border-gray-200 rounded-md flex flex-col gap-y-2">
                                {prod.variation.map((variant) => (
                                  <li
                                    key={variant.id}
                                    className="border rounded-md px-2 py-1 flex flex-col text-gray-500"
                                  >
                                    <span>Nama Variasi : {variant.name}</span>
                                    <span>Informasi Stock</span>
                                    <span>
                                      - Ready {variant.stock.qcPassed} Pcs
                                    </span>
                                    <span>
                                      - Cacat {variant.stock.defect} Pcs
                                    </span>
                                    <span>
                                      - Hilang {variant.stock.lost} Pcs
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-x-2">
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          setProduct({
                            id: prod.id,
                            createdAt: prod.createdAt,
                            createdAtMs: prod.createdAtMs,
                            dialogOpen: true,
                            type: "editProduct",
                            dialogTitle: "Edit Product",
                            baseSKU: prod.baseSKU,
                            isHaveVariant: prod.isHaveVariant,
                            name: prod.name,
                            variation: prod.variation,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          setDeleteProductDialog({
                            open: true,
                            idToDelete: prod.id,
                          });
                        }}
                      >
                        Arsipkan
                      </Button>
                    </CardFooter>
                  </Card>
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
}
