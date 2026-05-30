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
import { useSecurity } from "@/context/SecurityContext";
import { useWarehouse } from "@/context/WarehouseContext";
import { raw, separateNumber } from "@/utils/generalFunction";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddBatchProduction() {
  const { addProduction, products, getProductList } = useWarehouse();
  const navigate = useNavigate();
  const { setOpenPin } = useSecurity();

  // Batch State
  const [product, setProduct] = useState({
    productRelationId: "",
    productVariantId: "",
    shippingCost: 0,
    materials: [],
  });
  const whichProduct = useMemo(() => {
    return products.find((p) => p.id === product.productRelationId);
  }, [product.productRelationId]);
  const [confirmCutPieces, setConfirmCutPieces] = useState(false);

  const handleCutPieces = async () => {
    const shippingCost = product.shippingCost ? raw(product.shippingCost) : 0;
    const batch = {
      status: "cutting",
      productVariantId: product.productVariantId,
      productRelationId: product.productRelationId,
      shippingCost,
      materials: product.materials.map((m) => ({
        ...m,
        price: raw(m.price),
        qty: Number(m.qty),
        total: raw(m.price) * Number(m.qty),
      })),
      totalFabricCost:
        product.materials.reduce((acc, cur) => {
          return acc + raw(cur.price) * Number(cur.qty);
        }, 0) + shippingCost,
      time: [{ name: "Di Potong Pada", time: Date.now() }],
    };

    setOpenPin({
      open: true,
      actionOnMatch: async () => {
        await addProduction(batch);
        navigate("/warehouse/productionHistory");
      },
    });
  };

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-y-4">
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
              <Link to="/warehouse">Gudang Saya</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/warehouse/productionHistory">Riwayat Produksi</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Batch</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
              Produk Yang Akan Dibuat : <b>{product.productName}</b>
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

      {products.length === 0 && (
        <div className="text-center flex flex-col justify-center items-center gap-y-2">
          <p className="text-lg">Kamu Belum Menambahkan Produk</p>
          <Button asChild>
            <Link
              to={{
                pathname: "/warehouse/products",
                search: "?addProduct=true",
              }}
            >
              Tambah Produk
            </Link>
          </Button>
        </div>
      )}

      {products.length > 0 && (
        <FieldSet className="min-w-[400px] max-w-[400px] border p-4 rounded-md bg-gray-50">
          <form>
            <FieldGroup>
              {/* Produk Yang Akan Dibuat */}
              <Field>
                <FieldLabel>Produk Yang Akan Dibuat</FieldLabel>
                <Select
                  value={product.productRelationId}
                  onValueChange={(v) => {
                    setProduct((prev) => ({
                      ...prev,
                      productRelationId: v,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {products.map((prod) => (
                        <SelectItem value={prod.id} key={prod.id}>
                          {prod.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {/* Variasi Produk Yang Akan Di Buat */}
              {whichProduct?.isHaveVariant && (
                <Field>
                  <FieldLabel>Variasi Yang Akan Dibuat</FieldLabel>
                  <Select
                    value={product.productVariantId}
                    onValueChange={(v) => {
                      setProduct((prev) => ({
                        ...prev,
                        productVariantId: v,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Variasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {whichProduct.variation.map((variant) => (
                          <SelectItem value={variant.id} key={variant.id}>
                            {variant.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}

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
                                  return {
                                    ...mm,
                                    materialName: e.target.value,
                                  };
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
                          type="number"
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
                  disabled={!product.productRelationId}
                >
                  Tambah Kain
                </Button>
                {product.materials.length > 0 && (
                  <Field>
                    <FieldLabel>Ongkos Kirim (opsional)</FieldLabel>
                    <Input
                      required
                      value={product.shippingCost}
                      onChange={(e) => {
                        setProduct((prev) => ({
                          ...prev,
                          shippingCost: separateNumber(e),
                        }));
                      }}
                    />
                  </Field>
                )}
              </Field>
              <Field className="flex flex-row justify-end">
                <Button
                  type="button"
                  className="max-w-fit"
                  variant={"outline"}
                  asChild
                >
                  <Link to="/warehouse/productionHistory">Kembali</Link>
                </Button>
                <Button
                  className="max-w-fit"
                  type="button"
                  onClick={() => {
                    if (product.productRelationId === "") {
                      toast.warning("Mohon Pilih Produk");
                    } else if (
                      product.productRelationId &&
                      whichProduct.isHaveVariant &&
                      product.productVariantId === ""
                    ) {
                      toast.warning("Mohon Pilih Variasi");
                    } else if (product.materials.length === 0) {
                      toast.warning("Mohon Gunakan Bahan");
                    } else {
                      const checkMaterials = product.materials.map((m) => {
                        if (m.materialName && m.qty && m.type && m.price) {
                          return "yes";
                        } else {
                          return "no";
                        }
                      });

                      if (checkMaterials.includes("no")) {
                        toast.warning("Mohon Masukan Info Kain Dengan Benar");
                        return;
                      } else {
                        setProduct((prev) => ({
                          ...prev,
                          materials: [...product.materials],
                        }));
                        setConfirmCutPieces(true);
                      }
                    }
                  }}
                >
                  Potong
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </FieldSet>
      )}
    </div>
  );
}
