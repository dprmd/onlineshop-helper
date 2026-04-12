import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
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
import { useCRUD } from "../../context/CRUDContext";
import { createDocument } from "../../services/firebase/docService";
import { toCamelCase } from "../../utils/generalFunction";

export default function Supplier() {
  const {
    supplier,
    setSupplier,
    checkSupplierIfExist,
    getSupplierList,
    initialFetch,
  } = useCRUD();

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
        {
          username: toCamelCase(supplierName),
          name: supplierName,
          productDebt: [],
        },
        "Berhasil Menambahkan Supplier",
      );
      setSupplier([
        ...supplier,
        {
          id: newSupplier.docId,
          name: supplierName,
          username: toCamelCase(supplierName),
          productDebt: [],
        },
      ]);
      setSupplierName("");
      setDialogAddSupplier(false);
      alert("Berhasil Menyimpan Supplier");
    }
  };

  useEffect(() => {
    if (initialFetch) {
      getSupplierList();
    }
  }, []);

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
              <Link to="/crud">CRUD</Link>
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
          <div className="flex gap-2 flex-wrap justify-center py-2">
            {supplier.map((supplier) => (
              <Card key={supplier.id} className="min-w-[380px]">
                <CardHeader>
                  <p>Nama : {supplier.name}</p>
                  {supplier.productDebt.length === 0 && (
                    <p className="text-[12px] text-gray-400">
                      Anda Belum Mempunyai Hutang Ke Supplier Ini
                    </p>
                  )}
                  {supplier.productDebt.length > 0 && (
                    <>
                      <p className="text-gray-500">Daftar Hutang Barang</p>
                      <i className="bi bi-arrow-down text-[10px]"></i>
                      {supplier.productDebt.map((barang) => (
                        <p
                          className="text-[12px] text-gray-400"
                          key={barang.identifier}
                        >
                          {barang.name} {barang.remaining} Pcs
                        </p>
                      ))}
                    </>
                  )}
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
