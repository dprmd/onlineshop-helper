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
import { useCRUD } from "@/context/CRUDContext";
import { formatNumber, separateNumber } from "@/utils/generalFunction";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Products() {
  const {
    products,
    productsInitialFetch,
    getProductList,
    addProduct,
    editProduct,
    deleteProduct,
  } = useCRUD();
  const [product, setProduct] = useState({
    name: "",
    hpp: "",
  });
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
      setProduct((prev) => ({ ...prev, name: "", hpp: "" }));
    }

    if (dialog.dialogMotive === "editProduct") {
      await editProduct(idPToEdit, product);
      // Reset State Produk
      setProduct({ name: "", hpp: "" });
    }

    setDialog((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (productsInitialFetch) {
      getProductList();
    }
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
        }}
      >
        <form onSubmit={handleChangeProduct} id="addProduct">
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
                <Field>
                  <FieldLabel>Harga Produk</FieldLabel>
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
              </FieldGroup>
            </FieldSet>
            <DialogFooter className="flex flex-row justify-end">
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    setProduct((prev) => ({
                      ...prev,
                      name: "",
                      hpp: "",
                    }));
                  }}
                >
                  Batal
                </Button>
              </DialogClose>
              <Button className="bg-green-800" type="submit" form="addProduct">
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
                const deleteNow = await deleteProduct(idPToRemove);
                if (deleteNow.success) {
                  toast.info("Berhasil Menghapus Produk");
                } else {
                  toast.error("Gagal Menghapus Produk");
                }
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
