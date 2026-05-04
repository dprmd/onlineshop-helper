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
  DialogDescription,
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
import { useSecurity } from "@/context/SecurityContext";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useDebt } from "../../context/DebtContext";
import { formatNumber } from "../../utils/generalFunction";

export default function UpdateProductDebt() {
  const {
    supplier,
    getSupplierList,
    updateProductDebt,
    productsDebt,
    getProductDebtList,
    getDebtChanges,
  } = useDebt();
  const { setOpenPin } = useSecurity();
  const [whichSupplier, setWhichSupplier] = useState("");
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [confirmChangeDialog, setConfirmChangeDialog] = useState(false);
  const produk = useMemo(() => {
    return productsDebt.map((p) => ({ ...p, checked: false }));
  }, [productsDebt]);
  const [cloneProduk, setCloneProduk] = useState([]);
  const [choosedProduct, setChoosedProduct] = useState([]);
  const [notChoosedProduct, setNotChoosedProduct] = useState([]);
  const [productDebt, setProductDebt] = useState([]);
  const choosedSupplier = useMemo(() => {
    return supplier.find((s) => s.id === whichSupplier);
  }, [supplier, whichSupplier]);
  const [actionType, setActionType] = useState("");

  const handleChooseProduct = () => {
    const choosed = cloneProduk.filter((p) => p.checked);
    const notChoosed = cloneProduk.filter((p) => !p.checked);

    setChoosedProduct((prev) => {
      return choosed.map((p) => {
        const hasAddedBefore = prev.find((pc) => pc.id === p.id);
        if (hasAddedBefore) {
          return hasAddedBefore;
        } else {
          return p;
        }
      });
    });
    setNotChoosedProduct(notChoosed);
    setAddItemDialog(false);
  };

  const handleUpdateDebt = (e) => {
    e.preventDefault();

    // sort terlebih dahulu
    const debt = choosedProduct.map((produk) => ({
      id: produk.id,
      identifier: produk.identifier,
      name: produk.name,
      hpp: produk.hpp,
      remaining: Number(produk.remaining),
    }));
    const removedZeroDebt = debt.filter((produk) => produk.remaining > 0);
    const findZeroDebt = debt.map((d) => {
      if (d.remaining === 0) {
        return "yes";
      } else {
        return "no";
      }
    });

    if (removedZeroDebt.length === 0 || findZeroDebt.includes("yes")) {
      toast.info("Mohon Masukan Jumlah Produk");
      return;
    }

    setProductDebt([...removedZeroDebt]);
    setConfirmChangeDialog(true);
  };

  useEffect(() => {
    getSupplierList();
    getProductDebtList();
  }, []);

  useEffect(() => {
    if (whichSupplier) {
      getDebtChanges(whichSupplier, true);
    }
  }, [whichSupplier]);

  useEffect(() => {
    if (actionType === "addDebt") {
      setCloneProduk([...productsDebt]);
      setNotChoosedProduct([...productsDebt]);
    }

    if (actionType === "reduceDebt") {
      setCloneProduk([...choosedSupplier?.productDebt]);
      setNotChoosedProduct([...choosedSupplier?.productDebt]);
    }
  }, [productsDebt, actionType, whichSupplier]);

  if (productsDebt.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg font-bold my-2">Anda Belum Menambahkan Produk</p>
        <Button asChild>
          <Link to="/debt/productsDebt">Tambah Sekarang</Link>
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
          <Button asChild>
            <Link to="/debt/supplier">Tambah Sekarang</Link>
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

              {/* Action */}
              {whichSupplier && (
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
              )}

              {choosedProduct.length > 0 && (
                <Field>
                  {choosedProduct.length > 0 && (
                    <FieldLabel>Pilih Barang</FieldLabel>
                  )}
                  <form className="min-w-[200px] max-w-[350px]">
                    {/* isi quantity produk */}
                    {choosedProduct.map((produk) => (
                      <div
                        className="border px-2 py-3 flex gap-x-2 justify-between"
                        key={produk.id}
                      >
                        <FieldLabel htmlFor={produk.id}>
                          {produk.name}{" "}
                          <span className="text-[10px] text-gray-400">
                            <span>
                              {
                                choosedSupplier?.productDebt.find(
                                  (p) => p.id === produk.id,
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
                              setChoosedProduct((prev) => {
                                return prev.map((p) => {
                                  if (p.id === produk.id) {
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
                                  if (p.id === produk.id) {
                                    return {
                                      ...produk,
                                      checked: false,
                                      remaining: 0,
                                    };
                                  }

                                  return p;
                                });

                                setNotChoosedProduct(
                                  notChoosed.filter((p) => !p.checked),
                                );

                                return notChoosed;
                              });
                              setChoosedProduct((prev) => {
                                return prev.filter((p) => p.id !== produk.id);
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
                {choosedProduct.length === 0 && (
                  <FieldLabel>Pilih Barang</FieldLabel>
                )}
                {actionType === "reduceDebt" &&
                notChoosedProduct.length === 0 &&
                choosedProduct.length === 0 ? (
                  <p className="text-[12px]">
                    Anda Tidak Mempunyai Hutang Ke Supplier Ini
                  </p>
                ) : null}
                <Dialog open={addItemDialog} onOpenChange={setAddItemDialog}>
                  {notChoosedProduct.length > 0 && (
                    <DialogTrigger asChild>
                      <Button
                        className="my-2"
                        disabled={actionType === "" && !whichSupplier}
                      >
                        Tambah Barang
                      </Button>
                    </DialogTrigger>
                  )}
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Tambah Barang</DialogTitle>
                      {actionType === "addDebt" && (
                        <DialogDescription className="text-[12px]">
                          Produk Tidak Ada ?{" "}
                          <Link to="/debt/productsDebt">Tambah Produk</Link>
                        </DialogDescription>
                      )}
                    </DialogHeader>
                    <FieldSet>
                      <FieldGroup className="flex gap-y-1">
                        {notChoosedProduct.map((produk) => (
                          <Field
                            key={produk.id}
                            orientation="horizontal"
                            className="border py-3 px-2 rounded-md"
                          >
                            <Checkbox
                              id={produk.id}
                              name={produk.id}
                              checked={produk.checked}
                              onCheckedChange={(e) => {
                                setCloneProduk((prev) => {
                                  return prev.map((p) => {
                                    if (p.id === produk.id) {
                                      return { ...p, checked: e };
                                    }

                                    return p;
                                  });
                                });
                                setNotChoosedProduct((prev) => {
                                  return prev.map((p) => {
                                    if (p.id === produk.id) {
                                      return { ...p, checked: e };
                                    }

                                    return p;
                                  });
                                });
                              }}
                            />
                            <FieldLabel htmlFor={produk.id}>
                              {produk.name}
                              <span className="text-[10px] text-gray-400">
                                {formatNumber(produk.hpp)}
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
                                {choosedProduct
                                  .filter((p) => p.remaining > 0)
                                  .map((p) => (
                                    <span key={p.id} className="block">
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
                              setOpenPin({
                                open: true,
                                actionOnMatch: async () => {
                                  await updateProductDebt(
                                    whichSupplier,
                                    productDebt,
                                    actionType,
                                  );
                                  setChoosedProduct([]);
                                  setNotChoosedProduct(produk);
                                  setCloneProduk(produk);
                                },
                              });
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
