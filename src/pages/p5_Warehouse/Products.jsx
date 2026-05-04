import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function Products() {
  const { addNewProduct, products, getProductList } = useWarehouse();
  const initialProduct = {
    dialogOpen: false,
    dialogTitle: "",
    name: "",
    isHaveVariant: false,
    variation: [],
    batchRelation: [],
  };
  const [product, setProduct] = useState(initialProduct);
  const { setOpenPin } = useSecurity();

  const handleSaveProduct = () => {
    const saveNow = () => {
      const newProduct = {
        name: product.name,
        isHaveVariant: product.isHaveVariant,
        variation: [...product.variation],
      };

      setOpenPin({
        open: true,
        actionOnMatch: async () => {
          await addNewProduct(newProduct);
          setProduct(initialProduct);
        },
      });
    };

    if (product.name.length === 0) {
      toast.warning("Mohon Masukan Nama Produk");
      return;
    }
    if (product.isHaveVariant && product.variation.length === 0) {
      toast.warning("Mohon Tambahkan Variasi");
      return;
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
        return;
      } else {
        saveNow();
      }
    } else if (!product.isHaveVariant) {
      saveNow();
    }
  };

  useEffect(() => {
    getProductList();
  }, []);
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-y-2">
        <h2 className="text-xl font-bold text-center">List Produk</h2>
        {products.length === 0 && (
          <p className="text-gray-400 text-center">
            Belum Menambahkan Produk Apapun
          </p>
        )}
        <Button type="button" asChild>
          <Link to={"/warehouse"}>Kembali</Link>
        </Button>
        <Button
          onClick={() => {
            setProduct((prev) => ({
              ...prev,
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

        {/* Dialog Add Product */}
        <div>
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
                  <Field className="flex flex-row">
                    <Switch
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
                              { id: uuidv4(), name: "" },
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
        </div>

        {/* List Produk */}
        {products.length > 0 && (
          <ul>
            {products.map((prod) => (
              <li className="min-w-[380px] max-w-[380px]" key={prod.id}>
                <Card>
                  <CardContent>
                    <CardHeader>
                      <CardTitle>{prod.name}</CardTitle>
                      <div>
                        <p>ID Produk : {prod.id}</p>
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
                              <ul className="px-2 py-1 border border-gray-200 rounded-xl">
                                {prod.variation.map((variant) => (
                                  <li key={variant.id}>- {variant.name}</li>
                                ))}
                              </ul>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    </CardHeader>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
