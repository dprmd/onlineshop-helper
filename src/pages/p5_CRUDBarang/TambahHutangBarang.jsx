import LoadingOverlay from "@/components/LoadingOverlay";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import { useCRUDBarang } from "../../context/CRUDBarangContext";
import { listProduk } from "../../lib/variables";
import { formatNumber } from "../../utils/generalFunction";
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

export default function TambahHutangBarang() {
  const { loading, supplier } = useCRUDBarang();
  const [whichSupplier, setWhichSupplier] = useState(null);
  const [dialogTambahBarang, setDialogTambahBarang] = useState(false);
  const produk = Object.entries(listProduk).map((v) => ({
    ...v[1],
    checked: false,
  }));
  const [cloneProduk, setCloneProduk] = useState(produk);
  const [choosedProduk, setChoosedProduk] = useState([]);
  const [notChoosedProduk, setNotChoosedProduk] = useState(produk);

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
    } else if (!whichSupplier) {
      alert("Mohon Pilih Supplier Terlebih Dahulu");
    }

    // sort terlebih dahulu
    const hutangProduk = choosedProduk
      .map((produk) => ({
        nama: produk.nama,
        terjual: Number(produk.terjual),
      }))
      .filter((produk) => produk.terjual > 0);

    if (hutangProduk.length === 0) {
      alert("Mohon Masukan Jumlah Produk Yang Di Pinjam");
    }
  };

  return (
    <div>
      {loading && <LoadingOverlay show={loading} />}
      <div className="px-3 py-2">
        {/* jika supplier kosong */}
        {supplier.length === 0 && (
          <div className="text-center text-lg font-bold">
            <p>Anda Belum Menambahkan Supplier</p>
            <p>Tolong Tambahkan Terlebih Dahulu</p>
          </div>
        )}

        {/* jika supplier ada */}
        {supplier.length > 0 && (
          <form className="min-w-[200px] max-w-[350px]">
            {/* select supplier */}
            <div className="px-2 py-3 my-2 flex justify-between">
              <label htmlFor="supplierName">Supplier : </label>
              <select
                value={whichSupplier}
                onChange={(e) => {
                  setWhichSupplier(e.target.value);
                }}
                id="supplierName"
                required
                className="outline-1 outline-gray-400 rounded-md"
              >
                <option value={null}>Siapa ?</option>
                {supplier.map((s) => (
                  <option key={s.docId} value={s.username}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* isi quantity produk */}
            {choosedProduk.length > 0 &&
              choosedProduk.map((produk) => (
                <div className="my-2 px-2 py-3 flex gap-x-2 justify-between">
                  <label htmlFor={produk.identifier}>{produk.nama} : </label>
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
                      className="border border-gray-400 bg-red-500 text-white px-2 py-1 mx-1 rounded-md"
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

            {/* dialog tambah produk */}
            <div>
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
                          {produk.nama}
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
            </div>

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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
