import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCRUD } from "@/context/CRUDContext";
import { useEffect, useState } from "react";

export default function ProductionHistory() {
  const {
    productionHistory,
    getProductionHistory,
    productionHistoryInitialFetch,
    products,
    productsInitialFetch,
    getProductList,
  } = useCRUD();
  const [addProductionDialog, setAddProductionDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  console.log(selectedProduct);

  useEffect(() => {
    if (productionHistoryInitialFetch) {
      getProductionHistory();
    }

    if (productsInitialFetch) {
      getProductList();
    }
  }, []);

  return (
    <div>
      {productionHistory.length === 0 && (
        <div className="text-center">
          <p className="text-xl text-gray-600 my-2">
            Tidak Ada Riwayat Produksi
          </p>
          <Button type="submit" onClick={() => setAddProductionDialog(true)}>
            Buat Batch Produksi
          </Button>
        </div>
      )}

      <Dialog open={addProductionDialog} onOpenChange={setAddProductionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Produksi</DialogTitle>
            <DialogDescription>Buat Produksi Produk</DialogDescription>
          </DialogHeader>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Produk Yang Akan Dibuat</FieldLabel>
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                  disabled={products.length === 0}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {products.length === 0 && (
                  <FieldError>Mohon Tambah Produk Terlebih Dahulu</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Bahan</FieldLabel>
                <Input />
              </Field>
            </FieldGroup>
          </FieldSet>
        </DialogContent>
      </Dialog>
    </div>
  );
}
