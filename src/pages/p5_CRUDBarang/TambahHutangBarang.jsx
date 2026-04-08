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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCRUDBarang } from "../../context/CRUDBarangContext";
import { listProduk } from "../../lib/variables";
import { formatNumber } from "../../utils/generalFunction";

export default function TambahHutangBarang() {
  const navigate = useNavigate();
  const { supplier, getSupplierList, initialFetch, tambahHutangBarang } =
    useCRUDBarang();
  const [whichSupplier, setWhichSupplier] = useState("");
  const [dialogTambahBarang, setDialogTambahBarang] = useState(false);
  const [dialogTambahHutang, setDialogTambahHutang] = useState(false);
  const produk = Object.entries(listProduk).map((v) => ({
    ...v[1],
    checked: false,
  }));
  const [cloneProduk, setCloneProduk] = useState(produk);
  const [choosedProduk, setChoosedProduk] = useState([]);
  const [notChoosedProduk, setNotChoosedProduk] = useState(produk);
  const [hutangBarang, setHutangBarang] = useState([]);

  const handlePilihProduk = () => {
    const choosed = cloneProduk.filter((p) => p.checked);
    const notChoosed = cloneProduk.filter((p) => !p.checked);

    setChoosedProduk(choosed);
    setNotChoosedProduk(notChoosed);
    setDialogTambahBarang(false);
  };

  const handleTambahHutangSekarang = () => {
    // validasi
    if (choosedProduk.length === 0) {
      alert("Mohon Tambah Barang Terlebih Dahulu");
      return;
    } else if (!whichSupplier) {
      alert("Mohon Pilih Supplier Terlebih Dahulu");
      return;
    }

    // sort terlebih dahulu
    const hutang = choosedProduk
      .map((produk) => ({
        identifier: produk.identifier,
        name: produk.name,
        hpp: produk.hpp,
        terjual: Number(produk.terjual),
      }))
      .filter((produk) => produk.terjual > 0);

    if (hutang.length === 0) {
      alert("Mohon Masukan Jumlah Produk Yang Di Pinjam");
      return;
    }

    setDialogTambahHutang(true);
    setHutangBarang([...hutang]);
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
              <Link to="/crudBarang">CRUD</Link>
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
              navigate("/crudBarang/supplier");
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
                            value={produk.terjual}
                            placeholder="0"
                            onChange={(e) => {
                              setChoosedProduk((prev) => {
                                return prev.map((p) => {
                                  if (p.identifier === produk.identifier) {
                                    return {
                                      ...produk,
                                      terjual: e.target.value,
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
                                    return { ...produk, checked: false };
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
                <Dialog
                  open={dialogTambahBarang}
                  onOpenChange={setDialogTambahBarang}
                >
                  {notChoosedProduk.length > 0 && (
                    <DialogTrigger asChild>
                      <Button className="my-2">Tambah Barang</Button>
                    </DialogTrigger>
                  )}
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Tambah Barang</DialogTitle>
                    </DialogHeader>
                    <div>
                      {notChoosedProduk.map((produk) => (
                        <Field
                          key={produk.identifier}
                          orientation="horizontal"
                          className="my-1 border py-3 px-2 rounded-md"
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
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                      </DialogClose>
                      <Button type="button" onClick={handlePilihProduk}>
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
                      onClick={handleTambahHutangSekarang}
                    >
                      Tambah Hutang Sekarang
                    </Button>
                  </div>

                  {/* peringatan sebelum menambahkan hutang barang */}
                  <div>
                    <AlertDialog
                      open={dialogTambahHutang}
                      onOpenChange={setDialogTambahHutang}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Apakah Kamu Yakin ?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                          <div>
                            <div>
                              Supplier :{" "}
                              <span>
                                {
                                  supplier.find((s) => s.id == whichSupplier)
                                    ?.name
                                }
                              </span>
                            </div>
                            <div>
                              <div>
                                {choosedProduk
                                  .filter((p) => p.terjual > 0)
                                  .map((p) => (
                                    <div key={p.identifier}>
                                      {p.name} x {p.terjual}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              tambahHutangBarang(whichSupplier, hutangBarang);
                              setChoosedProduk([]);
                              setNotChoosedProduk(produk);
                              setCloneProduk(produk);
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
