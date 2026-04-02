import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCRUDBarang } from "../../context/CRUDBarangContext";
import { createDocument } from "../../services/firebase/docService";
import { toCamelCase } from "../../utils/generalFunction";

export default function Supplier() {
  const { supplier, setSupplier, checkSupplierIfExist } = useCRUDBarang();

  const [supplierName, setSupplierName] = useState("");
  const [dialogAddSupplier, setDialogAddSupplier] = useState(false);

  const handleSaveSupplier = async (e) => {
    e.preventDefault();

    // Cek jika supplier name supplier ada di firebase
    const checkedSupplierName = checkSupplierIfExist(supplierName);

    if (checkedSupplierName) {
      alert("Nama Supplier Telah Ada");
    } else {
      const newSupplier = await createDocument(
        "Menambahkan Supplier Baru",
        "supplier",
        { username: toCamelCase(supplierName), name: supplierName },
        "Berhasil Menambahkan Supplier",
      );
      setSupplier([
        ...supplier,
        {
          docId: newSupplier.docId,
          name: supplierName,
          username: toCamelCase(supplierName),
        },
      ]);
      setSupplierName("");
      setDialogAddSupplier(false);
      alert("Berhasil Menyimpan Supplier");
    }
  };

  return (
    <div className="px-3 py-2">
      {/* If Supplier Length Equal to Zero */}
      {supplier.length === 0 && (
        <div className="text-center">
          <h3 className="text-xl">Anda Belum Memiliki Supplier</h3>
          <DialogAddSupplier
            dialog={dialogAddSupplier}
            setDialog={setDialogAddSupplier}
            supplierName={supplierName}
            setSupplierName={setSupplierName}
            onSubmit={handleSaveSupplier}
          />
        </div>
      )}

      {/* If Supplier Length Greater than Zero */}
      {supplier.length > 0 && (
        <div className="text-center">
          <h3 className="text-xl">List Supplier</h3>
          <ul className="list-disc text-left px-3 py-2">
            {supplier.map((supplier) => (
              <li id={supplier.docId}>{supplier.name}</li>
            ))}
          </ul>
          <DialogAddSupplier
            dialog={dialogAddSupplier}
            setDialog={setDialogAddSupplier}
            supplierName={supplierName}
            setSupplierName={setSupplierName}
            onSubmit={handleSaveSupplier}
          />
        </div>
      )}
      <Link
        to="/crudBarang"
        className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300"
      >
        Kembali
      </Link>
    </div>
  );
}

const DialogAddSupplier = ({
  onSubmit,
  supplierName,
  setSupplierName,
  dialog,
  setDialog,
}) => {
  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <form id="addSupplier" onSubmit={onSubmit}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="bg-green-400 my-3 hover:bg-green-300"
          >
            Tambah Supplier
          </Button>
        </DialogTrigger>
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
                value={supplierName}
                onChange={(e) => {
                  setSupplierName(e.target.value);
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
