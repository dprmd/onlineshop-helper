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
import { useDebt } from "@/context/DebtContext";
import { raw, separateNumber } from "@/utils/generalFunction";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddBatchProduction() {
  const { products, getProductList, addProduction } = useDebt();
  const navigate = useNavigate();

  // Batch State
  const [materials, setMaterials] = useState([]);
  const [confirmCutPieces, setConfirmCutPieces] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const choosedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProduct);
  }, [products, selectedProduct]);
  const choosedVariant = useMemo(() => {
    if (choosedProduct?.isHaveVariation) {
      return choosedProduct.variation.find((v) => v.name === selectedVariant);
    } else {
      return;
    }
  }, [choosedProduct, selectedVariant]);

  const handleCutPieces = async () => {
    const cuttingAt = new Date().getTime();
    const batch = {
      status: "cutting",
      product: choosedProduct,
      choosedVariant,
      materials: {
        listMaterial: materials.map((m) => ({
          ...m,
          price: raw(m.price),
          qty: Number(m.qty),
          total: raw(m.price) * Number(m.qty),
        })),
        total: materials.reduce((acc, cur) => {
          return acc + raw(cur.price) * Number(cur.qty);
        }, 0),
      },
      time: {
        startCutting: cuttingAt,
      },
    };

    await addProduction(batch);
    navigate("/debt/productionHistory");
  };

  useEffect(() => {
    getProductList();
  });

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
              Produk Yang Akan Dibuat : <b>{choosedProduct?.name}</b>
            </p>
            <p>Bahan : </p>
            <ul>
              {materials.map((m) => (
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

            {/* Variasi, Jika Ada */}
            {choosedProduct?.isHaveVariation && (
              <Field>
                <FieldLabel>Variasi</FieldLabel>
                <Select
                  value={selectedVariant}
                  onValueChange={setSelectedVariant}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Variasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {choosedProduct?.variation.map((v) => (
                        <SelectItem key={v.name} value={v.name}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {!choosedVariant && (
                  <FieldError>Mohon Pilih Variasi </FieldError>
                )}
              </Field>
            )}

            {/* Materials */}
            <Field>
              <FieldLabel>Bahan</FieldLabel>
              {materials?.map((m, i) => (
                <Field
                  key={`materials-${i}`}
                  className="border border-gray-300 px-2 py-1 rounded-sm"
                >
                  <Field className="flex flex-row">
                    <div>
                      <FieldLabel>Nama Kain</FieldLabel>
                      <Input
                        className="text-sm"
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
                    </div>
                    <div>
                      <FieldLabel>Harga</FieldLabel>
                      <Input
                        className="text-sm"
                        placeholder="0"
                        value={materials[i].price}
                        onChange={(e) => {
                          console.log(e.target.value);
                          setMaterials((prev) => {
                            return prev.map((mm) => {
                              if (mm.id === m.id) {
                                return {
                                  ...mm,
                                  price: separateNumber(e),
                                };
                              } else {
                                return mm;
                              }
                            });
                          });
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
                    </div>
                    <div className="min-w-fit">
                      <FieldLabel>Type</FieldLabel>
                      <Select
                        value={materials[i].type}
                        className="w-[100%]"
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
                    </div>
                    <div className="max-w-fit">
                      <FieldLabel>Act</FieldLabel>
                      <Button
                        className="bi bi-trash"
                        onClick={() => {
                          setMaterials((prev) => {
                            return prev.filter((mm) => mm.id !== m.id);
                          });
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
                  setMaterials((prev) => [
                    ...prev,
                    {
                      id: new Date().getTime(),
                      materialName: "",
                      qty: "",
                      type: "",
                      price: "",
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
                  navigate("/debt/productionHistory");
                }}
              >
                Kembali
              </Button>
              <Button
                className="max-w-fit"
                type="button"
                onClick={() => {
                  if (!choosedProduct) {
                    toast.warning("Mohon Pilih Produk Yang Akan Dibuat");
                    return;
                  } else if (materials.length === 0) {
                    toast.warning("Mohon Gunakan Bahan");
                    return;
                  }

                  const checkMaterials = materials.filter((m) => {
                    return m.materialName && m.qty && m.type && m.price;
                  });

                  if (checkMaterials.length === 0) {
                    toast.warning("Mohon Masukan Info Kain Dengan Benar");
                    return;
                  } else {
                    setMaterials([...checkMaterials]);
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
