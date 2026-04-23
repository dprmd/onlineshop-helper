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
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWarehouse } from "@/context/WarehouseContext";
import { raw, separateNumber } from "@/utils/generalFunction";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddBatchProduction() {
  const { addProduction } = useWarehouse();
  const navigate = useNavigate();

  // Batch State
  const [product, setProduct] = useState({
    name: "",
    materials: [],
  });
  const [confirmCutPieces, setConfirmCutPieces] = useState(false);

  const handleCutPieces = async () => {
    const cuttingAt = new Date().getTime();
    const batch = {
      status: "cutting",
      name: product.name,
      materials: {
        listMaterial: product.materials.map((m) => ({
          ...m,
          price: raw(m.price),
          qty: Number(m.qty),
          total: raw(m.price) * Number(m.qty),
        })),
        total: product.materials.reduce((acc, cur) => {
          return acc + raw(cur.price) * Number(cur.qty);
        }, 0),
      },
      time: {
        startCutting: cuttingAt,
      },
    };

    await addProduction(batch);
    navigate("/warehouse/productionHistory");
  };

  return (
    <div className="flex justify-center">
      {/* Dialog Konfirmasi Potong */}
      <AlertDialog open={confirmCutPieces} onOpenChange={setConfirmCutPieces}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potong Kain ?</AlertDialogTitle>
            <AlertDialogDescription>
              Berikan Kain Ini Ke Tukang Potong
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-gray-500 text-[12px]">
            <p>
              Produk Yang Akan Dibuat : <b>{product.name}</b>
            </p>
            <p>Bahan : </p>
            <ul>
              {product.materials.map((m) => (
                <li className="font-bold" key={m.id}>
                  {m.materialName} {m.qty} {m.type} Rp {m.price}
                </li>
              ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleCutPieces}>
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FieldSet className="min-w-[400px] max-w-[400px] border p-4 rounded-md bg-gray-50">
        <form>
          <FieldGroup>
            {/* Produk Yang Akan Dibuat */}
            <Field>
              <FieldLabel>Produk Yang Akan Dibuat</FieldLabel>
              <Input
                required
                value={product.name}
                placeholder="Masukan Nama Produk"
                onChange={(e) => {
                  setProduct((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
            </Field>

            {/* Materials */}
            <Field>
              <FieldLabel>Bahan</FieldLabel>
              {product.materials?.map((m, i) => (
                <Field
                  key={`materials-${i}`}
                  className="border border-gray-300 px-2 py-1 rounded-sm"
                >
                  <Field className="flex flex-row">
                    <div>
                      <FieldLabel>Nama Kain</FieldLabel>
                      <Input
                        className="text-sm"
                        value={product.materials[i].materialName}
                        onChange={(e) => {
                          setProduct((prod) => ({
                            ...prod,
                            materials: prod.materials.map((mm) => {
                              if (mm.id === m.id) {
                                return { ...mm, materialName: e.target.value };
                              } else {
                                return mm;
                              }
                            }),
                          }));
                        }}
                        placeholder=". . . . ."
                      />
                    </div>
                    <div>
                      <FieldLabel>Harga</FieldLabel>
                      <Input
                        className="text-sm"
                        placeholder="0"
                        value={product.materials[i].price}
                        onChange={(e) => {
                          setProduct((prod) => ({
                            ...prod,
                            materials: prod.materials.map((mm) => {
                              if (mm.id === m.id) {
                                return { ...mm, price: separateNumber(e) };
                              } else {
                                return mm;
                              }
                            }),
                          }));
                        }}
                      />
                    </div>
                  </Field>
                  <Field className="flex flex-row">
                    <div className="min-w-fit">
                      <FieldLabel>Quantity</FieldLabel>
                      <Input
                        className="text-sm"
                        placeholder="0"
                        value={product.materials[i].qty}
                        onChange={(e) => {
                          setProduct((prod) => ({
                            ...prod,
                            materials: prod.materials.map((mm) => {
                              if (mm.id === m.id) {
                                return { ...mm, qty: e.target.value };
                              } else {
                                return mm;
                              }
                            }),
                          }));
                        }}
                      />
                    </div>
                    <div className="min-w-fit">
                      <FieldLabel>Type</FieldLabel>
                      <Select
                        value={product.materials[i].type}
                        className="w-[100%]"
                        onValueChange={(v) => {
                          setProduct((prod) => ({
                            ...prod,
                            materials: prod.materials.map((mm) => {
                              if (mm.id === m.id) {
                                return { ...mm, type: v };
                              } else {
                                return mm;
                              }
                            }),
                          }));
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
                    </div>
                    <div className="max-w-fit">
                      <FieldLabel>Act</FieldLabel>
                      <Button
                        className="bi bi-trash"
                        onClick={() => {
                          setProduct((prod) => ({
                            ...prod,
                            materials: prod.materials.filter(
                              (mm) => mm.id !== m.id,
                            ),
                          }));
                        }}
                      />
                    </div>
                  </Field>
                </Field>
              ))}
              <Button
                type="button"
                size={"xs"}
                className="max-w-fit"
                onClick={() => {
                  setProduct((prod) => ({
                    ...prod,
                    materials: [
                      ...prod.materials,
                      {
                        id: new Date().getTime(),
                        materialName: "",
                        qty: "",
                        type: "",
                        price: "",
                      },
                    ],
                  }));
                }}
                disabled={!product.name}
              >
                Tambah Kain
              </Button>
            </Field>
            <Field className="flex flex-row justify-end">
              <Button
                type="button"
                className="max-w-fit"
                variant={"outline"}
                onClick={() => {
                  navigate("/warehouse/productionHistory");
                }}
              >
                Kembali
              </Button>
              <Button
                className="max-w-fit"
                type="button"
                onClick={() => {
                  if (product.materials.length === 0) {
                    toast.warning("Mohon Gunakan Bahan");
                    return;
                  }

                  const checkMaterials = product.materials.filter((m) => {
                    return m.materialName && m.qty && m.type && m.price;
                  });

                  if (checkMaterials.length === 0) {
                    toast.warning("Mohon Masukan Info Kain Dengan Benar");
                    return;
                  } else {
                    setProduct((prev) => ({
                      ...prev,
                      materials: [...checkMaterials],
                    }));
                    setConfirmCutPieces(true);
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
