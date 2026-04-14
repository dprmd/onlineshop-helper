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
import { useCRUD } from "../../context/CRUDContext";
import { formatNumber } from "../../utils/generalFunction";

export default function ProductDebt() {
  const navigate = useNavigate();
  const {
    supplier,
    getSupplierList,
    supplierInitialFetch,
    addProductDebt,
    products,
    productsInitialFetch,
    getProductList,
  } = useCRUD();
  const [whichSupplier, setWhichSupplier] = useState("");
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [addDebtDialog, setAddDebtDialog] = useState(false);
  const produk = useMemo(() => {
    return products.map((p) => ({ ...p, checked: false, remaining: 0 }));
  });
  const [cloneProduk, setCloneProduk] = useState([]);
  const [choosedProduk, setChoosedProduk] = useState([]);
  const [notChoosedProduk, setNotChoosedProduk] = useState([]);
  const [productDebt, setProductDebt] = useState([]);

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

  const handleAddDebtNow = () => {
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

    setAddDebtDialog(true);
    setProductDebt([...debt]);
  };

  useEffect(() => {
    if (supplierInitialFetch) {
      getSupplierList();
    }

    if (productsInitialFetch) {
      getProductList();
    }
  }, []);

  useEffect(() => {
    setCloneProduk([...products]);
    setNotChoosedProduk([...products]);
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg font-bold my-2">Anda Belum Menambahkan Produk</p>
        <Button onClick={() => navigate("/crud/products")}>
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
              <Link to="/crud">CRUD</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Hutang</BreadcrumbPage>
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
              navigate("/crud/supplier");
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
            <FieldLegend>Tambah Hutang Barang</FieldLegend>
            <FieldDescription>
              Isi Dengan Barang Apa Saja Yang Di Pinjam Hari Ini
            </FieldDescription>
            <FieldGroup>
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
                          {produk.name}
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
                                      return { ...produk, checked: e };
                                    }

                                    return p;
                                  });
                                });
                                setNotChoosedProduk((prev) => {
                                  return prev.map((p) => {
                                    if (p.identifier === produk.identifier) {
                                      return { ...produk, checked: e };
                                    }

                                    return p;
                                  });
                                });
                              }}
                            />
                            <FieldLabel htmlFor={produk.identifier}>
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
                      onClick={handleAddDebtNow}
                    >
                      Tambah Hutang Sekarang
                    </Button>
                  </div>

                  {/* peringatan sebelum menambahkan hutang barang */}
                  <div>
                    <AlertDialog
                      open={addDebtDialog}
                      onOpenChange={setAddDebtDialog}
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
                              Supplier :{" "}
                              <span>
                                {
                                  supplier.find((s) => s.id == whichSupplier)
                                    ?.name
                                }
                              </span>
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
                              addProductDebt(whichSupplier, productDebt);
                              setChoosedProduk([]);
                              setNotChoosedProduk(produk);
                              setCloneProduk(produk);
                              toast.success(
                                "Berhasil Menambahkan Hutang Produk",
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
