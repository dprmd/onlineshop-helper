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
import { useDebt } from "@/context/DebtContext";
import { formatNumber, separateNumber } from "@/utils/generalFunction";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function ProductsDebt() {
  const {
    productsDebt,
    getProductList,
    addProductDebt,
    editProductDebt,
    deleteProductDebt,
  } = useDebt();
  const [productDebt, setProductDebt] = useState({
    name: "",
    hpp: "",
    stock: 0,
  });
  const [idPToRemove, setIdPToRemove] = useState("");
  const [idPToEdit, setIdPToEdit] = useState("");
  const [dialog, setDialog] = useState({
    title: "",
    open: false,
    dialogMotive: "addProductDebt",
    confirmRemove: false,
  });

  const handleChangeProduct = async (e) => {
    e.preventDefault();

    if (dialog.dialogMotive === "addProductDebt") {
      await addProductDebt(productDebt);
      // Reset State Produk
      setProductDebt((prev) => ({
        ...prev,
        name: "",
        hpp: "",
        stock: 0,
      }));
    }

    if (dialog.dialogMotive === "editProductDebt") {
      await editProductDebt(idPToEdit, productDebt);
      // Reset State Produk
      setProductDebt((prev) => ({
        ...prev,
        name: "",
        hpp: "",
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
              <Link to="/debt">Hutang Barang</Link>
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
            setProductDebt((prev) => ({
              ...prev,
              name: "",
              hpp: "",
              stock: 0,
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
                    value={productDebt.name}
                    required
                    onChange={(e) => {
                      setProductDebt((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }}
                  />
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                    <FieldLabel>HPP</FieldLabel>
                  </div>
                  <Input
                    value={productDebt.hpp}
                    required
                    onChange={(e) => {
                      setProductDebt((prev) => {
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
                await deleteProductDebt(idPToRemove);
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

      {/* Tampilkan Ini Jika Produk Kosong */}
      {productsDebt.length === 0 && (
        <div className="text-center">
          <h3 className="my-2">Produk Masih Kosong</h3>
          <Button
            onClick={() => {
              setDialog((prev) => ({
                ...prev,
                title: "Tambah Produk",
                open: true,
                dialogMotive: "addProductDebt",
              }));
            }}
          >
            Tambah Produk
          </Button>
        </div>
      )}

      {productsDebt.length > 0 && (
        // Tombol Tambah Produk
        <div className="flex flex-col justify-center items-center md:flex-wrap gap-y-2">
          <Button
            onClick={() => {
              setDialog((prev) => ({
                ...prev,
                title: "Tambah",
                open: true,
                dialogMotive: "addProductDebt",
              }));
            }}
          >
            Tambah Produk
          </Button>

          {/* List Produk */}
          <div className="flex flex-col md:flex-wrap md:flex-row justify-center items-center gap-2">
            {productsDebt.map((prod) => (
              <Card className="min-w-[300px] max-w-[380px]" key={prod.id}>
                <CardContent>
                  <p>Nama Produk : {prod.name}</p>
                  <p>HPP : {formatNumber(prod.hpp)}</p>
                </CardContent>
                <CardFooter className="flex gap-x-1">
                  <Button
                    size={"xs"}
                    onClick={() => {
                      setProductDebt((prev) => ({
                        ...prev,
                        name: prod.name,
                        hpp: formatNumber(prod.hpp),
                      }));
                      setIdPToEdit(prod.id);
                      setDialog((prev) => ({
                        ...prev,
                        title: "Edit Produk",
                        open: true,
                        dialogMotive: "editProductDebt",
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
