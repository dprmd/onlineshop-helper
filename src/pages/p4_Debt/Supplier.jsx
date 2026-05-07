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
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebt } from "../../context/DebtContext";
import { formatNumber } from "@/utils/generalFunction";

export default function Supplier() {
  const { supplier, addNewSupplier, deleteSupplier, getSupplierList } =
    useDebt();

  const [dialogAddSupplier, setDialogAddSupplier] = useState({
    open: false,
    supplierName: "",
  });
  const [dialogDeleteSupplier, setDialogDeleteSupplier] = useState({
    open: false,
    supplierId: "",
  });

  const handleSaveSupplier = async (e) => {
    e.preventDefault();

    await addNewSupplier({
      supplierName: dialogAddSupplier.supplierName,
      onSuccess: () => {
        setDialogAddSupplier({ open: false, supplierName: "" });
      },
    });
  };

  const handleDeleteSupplier = async () => {
    await deleteSupplier({
      supplierId: dialogDeleteSupplier.supplierId,
      onSuccess: () => {
        setDialogDeleteSupplier({ open: false, supplierId: "" });
      },
    });
  };

  useEffect(() => {
    getSupplierList();
  }, []);

  return (
    <div className=" flex flex-col justify-center items-center gap-y-4">
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
            <BreadcrumbPage>Supplier</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* If Supplier Length Equal to Zero */}
      {supplier.length === 0 && (
        <div className="text-center flex flex-col justify-center items-center gap-y-3">
          <h3 className="text-lg">Anda Belum Memiliki Supplier</h3>
        </div>
      )}

      <DialogAddSupplier
        dialog={dialogAddSupplier}
        setDialog={setDialogAddSupplier}
        onSubmit={handleSaveSupplier}
      />

      <DialogDeleteSupplier
        dialog={dialogDeleteSupplier}
        setDialog={setDialogDeleteSupplier}
        onDelete={handleDeleteSupplier}
      />

      {/* If Supplier Length Greater than Zero */}
      {supplier.length > 0 && (
        <div className="text-center">
          <div className="flex gap-2 flex-wrap justify-center">
            {supplier.map((supp) => (
              <Card key={supp.id} className="min-w-[380px]">
                <CardHeader>
                  <div>
                    <p>Nama : {supp.name}</p>
                    {supp.productDebt.length === 0 && (
                      <p className="text-[12px] text-gray-400">
                        Anda Belum Mempunyai Hutang Ke Supplier Ini
                      </p>
                    )}
                    {supp.productDebt.length > 0 && (
                      <>
                        <p className="text-gray-500">Daftar Hutang Barang</p>
                        <i className="bi bi-arrow-down text-[10px]"></i>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    {supp.productDebt.map((barang) => (
                      <p className="text-[12px] text-gray-400" key={barang.id}>
                        {barang.name} {barang.remaining} Pcs
                      </p>
                    ))}
                  </div>
                  <p className="my-2 text-[13px] text-gray-600">
                    Total Hutang Barang : Rp{" "}
                    {formatNumber(
                      supp.productDebt.reduce((acc, cur) => {
                        return acc + cur.remaining * cur.hpp;
                      }, 0),
                    )}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center items-center">
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className="bi bi-trash rounded-md"
                    onClick={() => {
                      setDialogDeleteSupplier({
                        open: true,
                        supplierId: supp.id,
                      });
                    }}
                  >
                    Hapus Supplier
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

const DialogAddSupplier = ({ onSubmit, dialog, setDialog }) => {
  return (
    <Dialog
      open={dialog.open}
      onOpenChange={(v) => {
        setDialog((prev) => ({ ...prev, open: v }));
      }}
    >
      <DialogTrigger asChild>
        <Button>Tambah Supplier</Button>
      </DialogTrigger>
      <form id="addSupplier" onSubmit={onSubmit}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Tambah Supplier</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Nama</Label>
              <Input
                id="name-1"
                name="name"
                required
                value={dialog.supplierName}
                onChange={(e) => {
                  setDialog((prev) => ({
                    ...prev,
                    supplierName: e.target.value,
                  }));
                }}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" form="addSupplier">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

const DialogDeleteSupplier = ({ dialog, setDialog, onDelete }) => {
  return (
    <AlertDialog
      open={dialog.open}
      onOpenChange={(v) => {
        setDialog((prev) => ({ ...prev, open: v }));
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Supplier</AlertDialogTitle>
          <AlertDialogDescription>
            Menghapus Supplier Akan Menghapus Juga Semua Data Yang Terkait
            Dengan Supplier Ini
          </AlertDialogDescription>
          <AlertDialogDescription>Apakah Anda Yakin ?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
