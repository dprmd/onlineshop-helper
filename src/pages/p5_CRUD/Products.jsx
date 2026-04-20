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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { useCRUD } from "@/context/CRUDContext";
import { formatNumber, separateNumber } from "@/utils/generalFunction";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const { products, getProductList, addProduct, editProduct, deleteProduct } =
    useCRUD();
  const [product, setProduct] = useState({
    name: "",
    hpp: "",
    isHaveVariation: false,
    variation: [],
    stock: 0,
  });
  console.log(product);
  const [idPToRemove, setIdPToRemove] = useState("");
  const [idPToEdit, setIdPToEdit] = useState("");
  const [dialog, setDialog] = useState({
    title: "",
    open: false,
    dialogMotive: "addProduct",
    confirmRemove: false,
  });

  const handleChangeProduct = async (e) => {
    e.preventDefault();

    if (dialog.dialogMotive === "addProduct") {
      await addProduct(product);
      // Reset State Produk
      setProduct((prev) => ({
        ...prev,
        name: "",
        hpp: "",
        isHaveVariation: false,
        variation: [],
        stock: 0,
      }));
    }

    if (dialog.dialogMotive === "editProduct") {
      await editProduct(idPToEdit, product);
      // Reset State Produk
      setProduct((prev) => ({
        ...prev,
        name: "",
        hpp: "",
        isHaveVariation: false,
        variation: [],
        stock: 0,
      }));
      setIdPToEdit("");
    }

    // Close Dialog
    setDialog((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-y-2">
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
              <Link to="/crud">CRUD</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Produk</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Dialog
        open={dialog.open}
        onOpenChange={(v) => {
          setDialog((prev) => ({ ...prev, open: v }));
          if (!v) {
            setProduct((prev) => ({
              ...prev,
              name: "",
              hpp: "",
              isHaveVariation: false,
              variation: [],
            }));
          }
        }}
      >
        <form onSubmit={handleChangeProduct} id="changeProduct">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialog.title}</DialogTitle>
            </DialogHeader>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Nama Produk</FieldLabel>
                  <Input
                    value={product.name}
                    onChange={(e) => {
                      setProduct((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }}
                  />
                </Field>
                {!product.isHaveVariation && (
                  <Field>
                    <div className="flex justify-between items-center">
                      <FieldLabel>HPP</FieldLabel>
                      {!product.isHaveVariation && (
                        <Button
                          size={"xs"}
                          type="button"
                          variant={"outline"}
                          onClick={() => {
                            setProduct((prev) => ({
                              ...prev,
                              isHaveVariation: true,
                            }));
                          }}
                        >
                          Per Variasi
                        </Button>
                      )}
                    </div>
                    <Input
                      value={product.hpp}
                      onChange={(e) => {
                        setProduct((prev) => {
                          const value = separateNumber(e);
                          return {
                            ...prev,
                            hpp: value,
                          };
                        });
                      }}
                    />
                  </Field>
                )}
                {product.isHaveVariation && (
                  <Field>
                    <FieldLabel>Variasi</FieldLabel>
                    {product.variation.map((variant, i) => (
                      <div className="flex justify-evenly" key={i}>
                        <div className="w-[48%]">
                          <Label className="text-sm">Nama Variasi</Label>
                          <Input
                            value={variant.name}
                            onChange={(e) => {
                              setProduct((prev) => {
                                return {
                                  ...prev,
                                  variation: prev.variation.map(
                                    (variantt, ii) => {
                                      if (ii === i) {
                                        return {
                                          ...variantt,
                                          name: e.target.value,
                                        };
                                      } else {
                                        return variantt;
                                      }
                                    },
                                  ),
                                };
                              });
                            }}
                          />
                        </div>
                        <div className="w-[48%]">
                          <Label className="text-sm">HPP</Label>
                          <Input
                            value={variant.hpp}
                            onChange={(e) => {
                              const value = separateNumber(e);
                              setProduct((prev) => {
                                return {
                                  ...prev,
                                  variation: prev.variation.map(
                                    (variantt, ii) => {
                                      if (ii === i) {
                                        return {
                                          ...variantt,
                                          hpp: value,
                                        };
                                      } else {
                                        return variantt;
                                      }
                                    },
                                  ),
                                };
                              });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant={"outline"}
                      size={"xs"}
                      onClick={() => {
                        setProduct((prev) => ({
                          ...prev,
                          hpp: 0,
                          variation: [...prev.variation, { name: "", hpp: "" }],
                        }));
                      }}
                    >
                      Tambah Variasi
                    </Button>
                  </Field>
                )}
              </FieldGroup>
            </FieldSet>
            <DialogFooter className="flex flex-row justify-end">
              <DialogClose asChild>
                <Button>Batal</Button>
              </DialogClose>
              <Button
                className="bg-green-800"
                type="submit"
                form="changeProduct"
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <AlertDialog
        open={dialog.confirmRemove}
        onOpenChange={(v) => {
          setDialog((prev) => ({ ...prev, confirmRemove: v }));
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus Produk Ini, Aksi Ini Tidak Dapat Di Batalkan
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteProduct(idPToRemove);
                setDialog((prev) => ({
                  ...prev,
                  confirmRemove: false,
                }));
                setIdPToRemove("");
              }}
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {products.length === 0 && (
        <div className="text-center">
          <h3 className="my-2">Produk Masih Kosong</h3>
          <Button
            onClick={() => {
              setDialog((prev) => ({
                ...prev,
                title: "Tambah Produk",
                open: true,
                dialogMotive: "addProduct",
              }));
            }}
          >
            Tambah Produk
          </Button>
        </div>
      )}

      {products.length > 0 && (
        <div className="flex flex-col justify-center items-center md:flex-wrap gap-y-2">
          <Button
            onClick={() => {
              setDialog((prev) => ({
                ...prev,
                title: "Tambah",
                open: true,
                dialogMotive: "addProduct",
              }));
            }}
          >
            Tambah Produk
          </Button>
          <div className="flex flex-col md:flex-wrap md:flex-row justify-center items-center gap-2">
            {products.map((prod) => (
              <Card className="min-w-[300px] max-w-[380px]" key={prod.id}>
                <CardContent>
                  <p>Nama Produk : {prod.name}</p>
                  <p>HPP : {formatNumber(prod.hpp)}</p>
                </CardContent>
                <CardFooter className="flex gap-x-1">
                  <Button
                    size={"xs"}
                    onClick={() => {
                      setProduct((prev) => ({
                        ...prev,
                        name: prod.name,
                        hpp: formatNumber(prod.hpp),
                        isHaveVariation: prod.isHaveVariation,
                        variation: [...prod.variation],
                      }));
                      setIdPToEdit(prod.id);
                      setDialog((prev) => ({
                        ...prev,
                        title: "Edit Produk",
                        open: true,
                        dialogMotive: "editProduct",
                      }));
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size={"xs"}
                    variant={"destructive"}
                    onClick={() => {
                      setIdPToRemove(prod.id);
                      setDialog((prev) => ({ ...prev, confirmRemove: true }));
                    }}
                  >
                    Hapus
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
