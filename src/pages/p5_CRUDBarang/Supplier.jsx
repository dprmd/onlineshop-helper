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
    <div className="px-4 py-3 flex flex-col justify-center items-center gap-y-4">
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
              <Link to="/crudBarang">CRUD</Link>
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
          <div>
            {supplier.map((supplier) => (
              <Card className="my-2 min-w-[350px]">
                <CardHeader>
                  <p>Nama : {supplier.name}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
          <DialogAddSupplier
            dialog={dialogAddSupplier}
            setDialog={setDialogAddSupplier}
            supplierName={supplierName}
            setSupplierName={setSupplierName}
            onSubmit={handleSaveSupplier}
          />
        </div>
      )}
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
          <Button size="lg">Tambah Supplier</Button>
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
