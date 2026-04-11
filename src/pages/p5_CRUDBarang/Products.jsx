import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCRUD } from "@/context/CRUDContext";
import { useState } from "react";

export default function Products() {
  const { products } = useCRUD();

  const [productName, setProductName] = useState("");
  return (
    <div className="px-4 py-3">
      {products.length === 0 && (
        <div className="text-center">
          <h3>Produk Masih Kosong , Tambah Terlebih Dahulu</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Tambah Produk</Button>
            </DialogTrigger>
            <form>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Produk</DialogTitle>
                  <DialogDescription>Tambah produk baru</DialogDescription>
                </DialogHeader>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Nama Produk</FieldLabel>
                      <Input />
                    </Field>
                    <Field>
                      <FieldLabel>Harga Produk</FieldLabel>
                      <Input />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <DialogFooter className="flex flex-row justify-end">
                  <DialogClose asChild>
                    <Button>Batal</Button>
                  </DialogClose>
                  <Button className="bg-green-800">Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      )}
    </div>
  );
}
