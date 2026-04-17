import { Button } from "@/components/ui/button";
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function AddBatchProduction() {
  const { products, productsInitialFetch, getProductList } = useCRUD();
  const navigate = useNavigate();

  // Batch State
  const [materials, setMaterials] = useState([]);
  const [confirmCutPieces, setConfirmCutPieces] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const choosedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProduct);
  }, [products, selectedProduct]);

  useEffect(() => {
    if (productsInitialFetch) {
      getProductList();
    }
  });
  return (
    <div className="flex justify-center">
      {/* Dialog Konfirmasi Potong */}
      <AlertDialog open={confirmCutPieces} onOpenChange={setConfirmCutPieces}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FieldSet className="min-w-[400px] max-w-[400px] border p-4 rounded-md bg-gray-50">
        <form>
          <FieldGroup>
            {/* Produk Yang Akan Dibuat */}
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
                      <SelectItem key={p.id} value={p.id}>
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

            {/* Materials */}
            <Field>
              <FieldLabel>Bahan</FieldLabel>
              {materials?.map((m, i) => (
                <Field
                  className="flex flex-row justify-between items-center my-2"
                  key={`materials-${i}`}
                >
                  <Field>
                    <FieldLabel>Nama Kain</FieldLabel>
                    <Input
                      value={materials[i].materialName}
                      onChange={(e) => {
                        setMaterials((prev) => {
                          return prev.map((mm) => {
                            if (mm.id === m.id) {
                              return { ...mm, materialName: e.target.value };
                            } else {
                              return mm;
                            }
                          });
                        });
                      }}
                      placeholder=". . . . ."
                    />
                  </Field>
                  <Field className="flex-1">
                    <FieldLabel>Quantity</FieldLabel>
                    <Input
                      placeholder=". . ."
                      value={materials[i].qty}
                      onChange={(e) => {
                        setMaterials((prev) => {
                          return prev.map((mm) => {
                            if (mm.id === m.id) {
                              return { ...mm, qty: e.target.value };
                            } else {
                              return mm;
                            }
                          });
                        });
                      }}
                    />
                  </Field>
                  <Field className="flex-1">
                    <FieldLabel>Type</FieldLabel>
                    <Select
                      value={materials[i].type}
                      onValueChange={(v) => {
                        setMaterials((prev) => {
                          return prev.map((mm) => {
                            if (mm.id === m.id) {
                              return { ...mm, type: v };
                            } else {
                              return mm;
                            }
                          });
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="yard">Yard</SelectItem>
                          <SelectItem value="meter">Meter</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="max-w-[40px]">
                    <FieldLabel>Act</FieldLabel>
                    <Button
                      className="bi bi-trash"
                      onClick={() => {
                        setMaterials((prev) => {
                          return prev.filter((mm) => mm.id !== m.id);
                        });
                      }}
                    />
                  </Field>
                </Field>
              ))}
              <Button
                size={"xs"}
                className="max-w-fit"
                onClick={() => {
                  setMaterials((prev) => [
                    ...prev,
                    {
                      id: new Date().getTime(),
                      materialName: "",
                      qty: 0,
                      type: "",
                    },
                  ]);
                }}
                disabled={!selectedProduct}
              >
                Tambah Kain
              </Button>
            </Field>
            <Field className="flex flex-row justify-end">
              <Button
                className="max-w-fit"
                variant={"outline"}
                onClick={() => {
                  navigate("/crud/productionHistory");
                }}
              >
                Kembali
              </Button>
              <Button
                className="max-w-fit"
                onClick={() => {
                  if (!choosedProduct) {
                    toast.warning("Mohon Pilih Produk Yang Akan Dibuat");
                  } else if (materials.length === 0) {
                    toast.warning("Mohon Gunakan Bahan");
                  }
                }}
              >
                Potong
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}
