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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDebt } from "../../context/DebtContext";
import { formatNumber } from "../../utils/generalFunction";
import { sortHppRange } from "@/pages/p5_Debt/Products";

export default function UpdateProductDebt() {
  const navigate = useNavigate();
  const {
    supplier,
    getSupplierList,
    updateProductDebt,
    products,
    getProductList,
  } = useDebt();
  const [whichSupplier, setWhichSupplier] = useState("");
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [confirmChangeDialog, setConfirmChangeDialog] = useState(false);
  const produk = useMemo(() => {
    return products.map((p) => ({ ...p, checked: false, remaining: 0 }));
  }, [products]);
  const [cloneProduk, setCloneProduk] = useState([]);
  const [choosedProduk, setChoosedProduk] = useState([]);
  const [notChoosedProduk, setNotChoosedProduk] = useState([]);
  const [productDebt, setProductDebt] = useState([]);
  const choosedSupplier = useMemo(() => {
    return supplier.find((s) => s.id === whichSupplier);
  }, [supplier, whichSupplier]);
  const [actionType, setActionType] = useState("");

  const handleChooseProduct = () => {
    const choosed = cloneProduk.filter((p) => p.checked);
    const notChoosed = cloneProduk.filter((p) => !p.checked);

    setChoosedProduk((prev) => {
      return choosed.map((p) => {
        const hasAddedBefore = prev.find(
          (pc) => pc.identifier === p.identifier,
        );
        if (hasAddedBefore) {
          return hasAddedBefore;
        } else {
          return p;
        }
      });
    });
    setNotChoosedProduk(notChoosed);
    setAddItemDialog(false);
  };

  const handleUpdateDebt = (e) => {
    e.preventDefault();

    // validasi
    if (choosedProduk.length === 0) {
      toast.info("Mohon Tambah Barang Terlebih Dahulu");
      return;
    } else if (!whichSupplier) {
      toast.info("Mohon Pilih Supplier Terlebih Dahulu");
      return;
    }

    // sort terlebih dahulu
    const debt = choosedProduk
      .map((produk) => ({
        identifier: produk.identifier,
        name: produk.name,
        hpp: produk.hpp,
        remaining: Number(produk.remaining),
      }))
      .filter((produk) => produk.remaining > 0);

    if (debt.length === 0) {
      toast.info("Mohon Masukan Jumlah Produk Yang Di Pinjam");
      return;
    }

    setConfirmChangeDialog(true);
    setProductDebt([...debt]);
  };

  useEffect(() => {
    getSupplierList();
    getProductList();
  }, []);

  useEffect(() => {
    setCloneProduk([...products]);
    setNotChoosedProduk([...products]);
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg font-bold my-2">Anda Belum Menambahkan Produk</p>
        <Button onClick={() => navigate("/debt/products")}>
          Tambah Sekarang
        </Button>
      </div>
    );
  }

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
              <Link to="/debt">Hutang Barang</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Perubahan Hutang</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* jika supplier kosong */}
      {supplier.length === 0 && (
        <div className="text-center text-lg font-bold flex flex-col justify-center items-center gap-y-2">
          <div>
            <p>Anda Belum Menambahkan Supplier</p>
            <p>Tolong Tambahkan Terlebih Dahulu</p>
          </div>
          <Button
            size="lg"
            onClick={() => {
              navigate("/debt/supplier");
            }}
          >
            Tambah Sekarang
          </Button>
        </div>
      )}

      {/* jika supplier ada */}
      {supplier.length > 0 && (
        <div className="flex flex-col justify-center items-center">
          <FieldSet className="px-3 py-2 border rounded-md">
            <FieldLegend>Update Hutang Barang</FieldLegend>
            <FieldDescription>
              Tambah atau Kurangi Hutang Barang ke Supplier
            </FieldDescription>
            <FieldGroup>
              {/* Action */}
              <Field>
                <FieldLabel>Action</FieldLabel>
                <Select required onValueChange={setActionType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipe Aksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="addDebt">
                        Tambah Hutang Barang
                      </SelectItem>
                      <SelectItem value="reduceDebt">
                        Kurangi Hutang Barang
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {/* Choose Supplier */}
              <Field>
                <FieldLabel>Supplier</FieldLabel>
                <Select required onValueChange={setWhichSupplier}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Siapa Suppliernya" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {supplier.map((s) => (
                        <SelectItem value={s.id} key={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              {choosedProduk.length > 0 && (
                <Field>
                  {choosedProduk.length > 0 && (
                    <FieldLabel>Pilih Barang</FieldLabel>
                  )}
                  <form className="min-w-[200px] max-w-[350px]">
                    {/* isi quantity produk */}
                    {choosedProduk.map((produk) => (
                      <div
                        className="border px-2 py-3 flex gap-x-2 justify-between"
                        key={produk.identifier}
                      >
                        <FieldLabel htmlFor={produk.identifier}>
                          {produk.name}{" "}
                          <span className="text-[10px] text-gray-400">
                            <span>
                              {
                                choosedSupplier?.productDebt.find(
                                  (p) => p.identifier === produk.identifier,
                                )?.remaining
                              }
                            </span>
                          </span>
                        </FieldLabel>
                        <div>
                          <input
                            type="number"
                            value={produk.remaining}
                            placeholder="0"
                            onChange={(e) => {
                              setChoosedProduk((prev) => {
                                return prev.map((p) => {
                                  if (p.identifier === produk.identifier) {
                                    return {
                                      ...produk,
                                      remaining: e.target.value,
                                    };
                                  }

                                  return p;
                                });
                              });
                            }}
                            className="px-2 py-1 outline-1 outline-gray-400 rounded-md max-w-[100px]"
                          />
                          <button
                            className="bg-gray-800 text-white px-2 py-1 mx-1 rounded-md"
                            type="button"
                            onClick={() => {
                              setCloneProduk((prev) => {
                                const notChoosed = prev.map((p) => {
                                  if (p.identifier === produk.identifier) {
                                    return {
                                      ...produk,
                                      checked: false,
                                      remaining: 0,
                                    };
                                  }

                                  return p;
                                });

                                setNotChoosedProduk(
                                  notChoosed.filter((p) => !p.checked),
                                );

                                return notChoosed;
                              });
                              setChoosedProduk((prev) => {
                                return prev.filter(
                                  (p) => p.identifier !== produk.identifier,
                                );
                              });
                            }}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </form>
                </Field>
              )}
              <Field>
                {choosedProduk.length === 0 && (
                  <FieldLabel>Pilih Barang</FieldLabel>
                )}
                <Dialog open={addItemDialog} onOpenChange={setAddItemDialog}>
                  {notChoosedProduk.length > 0 && (
                    <DialogTrigger asChild>
                      <Button className="my-2">Tambah Barang</Button>
                    </DialogTrigger>
                  )}
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Tambah Barang</DialogTitle>
                    </DialogHeader>
                    <FieldSet>
                      <FieldGroup className="flex gap-y-1">
                        {notChoosedProduk.map((produk) => (
                          <Field
                            key={produk.identifier}
                            orientation="horizontal"
                            className="border py-3 px-2 rounded-md"
                          >
                            <Checkbox
                              id={produk.identifier}
                              name={produk.identifier}
                              checked={produk.checked}
                              onCheckedChange={(e) => {
                                setCloneProduk((prev) => {
                                  return prev.map((p) => {
                                    if (p.identifier === produk.identifier) {
                                      return { ...p, checked: e };
                                    }

                                    return p;
                                  });
                                });
                                setNotChoosedProduk((prev) => {
                                  return prev.map((p) => {
                                    if (p.identifier === produk.identifier) {
                                      return { ...p, checked: e };
                                    }

                                    return p;
                                  });
                                });
                              }}
                            />
                            <FieldLabel htmlFor={produk.identifier}>
                              {produk.name}
                              <span className="text-[10px] text-gray-400">
                                {!produk.isHaveVariation &&
                                  formatNumber(produk.hpp)}
                                {sortHppRange(produk.variation)[0]}
                                {sortHppRange(produk.variation).length > 1
                                  ? " - "
                                  : null}
                                {sortHppRange(produk.variation).length > 1 &&
                                  sortHppRange(produk.variation).reverse()[0]}
                              </span>
                            </FieldLabel>
                          </Field>
                        ))}
                      </FieldGroup>
                    </FieldSet>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                      </DialogClose>
                      <Button type="button" onClick={handleChooseProduct}>
                        Simpan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Field>
              <Field>
                <div className="flex justify-end items-center">
                  {/* button tambah sekarang */}
                  <div>
                    <Button
                      type="button"
                      className="bg-green-700"
                      onClick={handleUpdateDebt}
                      disabled={actionType === ""}
                    >
                      {actionType === "addDebt" && "Tambah Hutang Sekarang"}
                      {actionType === "reduceDebt" && "Kurangi Hutang Sekarang"}
                      {actionType === "" && "Pilih Action"}
                    </Button>
                  </div>

                  {/* peringatan sebelum menambahkan hutang barang */}
                  <div>
                    <AlertDialog
                      open={confirmChangeDialog}
                      onOpenChange={setConfirmChangeDialog}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Apakah Kamu Yakin ?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                          <span className="block">
                            <span className="block">
                              <span className="block">
                                Tujuan :{" "}
                                {actionType === "addDebt" &&
                                  "Penambahan Hutang Barang"}{" "}
                                {actionType === "reduceDebt" &&
                                  "Pengurangan Hutang Barang"}
                              </span>
                              Supplier : <span>{choosedSupplier?.name}</span>
                            </span>
                            <span>
                              <span className="block">
                                {choosedProduk
                                  .filter((p) => p.remaining > 0)
                                  .map((p) => (
                                    <span key={p.identifier} className="block">
                                      {p.name} x {p.remaining}
                                    </span>
                                  ))}
                              </span>
                            </span>
                          </span>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              updateProductDebt(
                                whichSupplier,
                                productDebt,
                                actionType,
                              );
                              setChoosedProduk([]);
                              setNotChoosedProduk(produk);
                              setCloneProduk(produk);
                              toast.success(
                                actionType === "addDebt"
                                  ? "Berhasil Menambahkan Hutang Produk"
                                  : "Berhasil Mengurangi Hutang Produk",
                              );
                            }}
                          >
                            Lanjutkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      )}
    </div>
  );
}
