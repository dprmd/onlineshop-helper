import { Button } from "@/components/ui/button";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber, raw, validateNumber } from "../../utils/generalFunction";

// Helper Function
const percentFrom = (percent, total) => {
  return (percent / 100) * total;
};

export default function PerhitunganProfit() {
  // State
  const navigate = useNavigate();
  const [sudahHitung, setSudahHitung] = useState(false);

  // Admin Shopee
  const biayaPerPesanan = 1250;
  const biayaPengiriman = 350;
  const [admin, setAdmin] = useState({
    adminShopee: 8,
    adminPromoExtra: 4.5,
    adminGratisOngkirExtra: 5.5,
    komisiAMS: 10,
  });

  // Input
  const [hargaJual, setHargaJual] = useState("");
  const [voucher, setVoucher] = useState("0");

  // State Untuk Menutup dan Membuka Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialog, setDialog] = useState({
    title: "",
    identifier: "",
  });

  // Output
  const [totalKomisiSaya, setTotalKomisiSaya] = useState(0);
  const [totalAdminShopee, setTotalAdminShopee] = useState(0);
  const [totalKomisiAMS, setTotalKomisiAMS] = useState(0);
  const [totalKomisiSayaDipotongAMS, setTotalKomisiSayaDipotongAMS] =
    useState(0);
  const [totalKomisiSayaDipotongAMSBaru, setTotalKomisiSayaDipotongAMSBaru] =
    useState(0);

  const hitung = (e) => {
    e.preventDefault();
    const totalAdmin =
      Math.round(
        percentFrom(
          admin.adminShopee +
            admin.adminPromoExtra +
            admin.adminGratisOngkirExtra,
          raw(hargaJual),
        ),
      ) +
      biayaPerPesanan +
      biayaPengiriman;
    const hargaFinal = raw(hargaJual) - totalAdmin - raw(voucher);
    const totalKomisiAMSDidapat = percentFrom(admin.komisiAMS, raw(hargaJual));

    setTotalKomisiSaya(hargaFinal);
    setTotalAdminShopee(totalAdmin);
    setTotalKomisiAMS(totalKomisiAMSDidapat);
    setTotalKomisiSayaDipotongAMS(hargaFinal - totalKomisiAMSDidapat);
    setTotalKomisiSayaDipotongAMSBaru(hargaFinal - totalKomisiAMSDidapat / 2);
    setSudahHitung(true);
  };

  const localStorageInit = (
    localStorageIdentifier,
    realValueSetterFunc,
    initValue,
  ) => {
    if (localStorage.getItem(localStorageIdentifier)) {
      const value = localStorage.getItem(localStorageIdentifier);
      realValueSetterFunc((prev) => ({
        ...prev,
        [localStorageIdentifier]: Number(value),
      }));
    } else {
      localStorage.setItem(localStorageIdentifier, initValue);
    }
  };

  const handleChangeAdminShopee = (e) => {
    e.preventDefault();
    setAdmin((prev) => {
      return {
        adminShopee: Number(prev.adminShopee),
        adminPromoExtra: Number(prev.adminPromoExtra),
        adminGratisOngkirExtra: Number(prev.adminGratisOngkirExtra),
        komisiAMS: Number(prev.komisiAMS),
      };
    });
    setDialogOpen(false);
  };

  useEffect(() => {
    // localStorage Init
    localStorageInit("adminShopee", setAdmin, "8");
    localStorageInit("adminPromoExtra", setAdmin, "4.5");
    localStorageInit("adminGratisOngkirExtra", setAdmin, "5.5");
    localStorageInit("komisiAMS", setAdmin, "10");
  }, []);

  // Html Css Data
  const keterangan = [
    { label: "Admin Shopee", value: `${admin.adminShopee} %` },
    { label: "Admin Promo Extra", value: `${admin.adminPromoExtra} %` },
    {
      label: "Admin Gratis Ongkir Extra",
      value: `${admin.adminGratisOngkirExtra} %`,
    },
    {
      label: "Komisi Affiliate",
      value: `${admin.komisiAMS} %`,
    },
    {
      label: "Biaya Per Pesanan",
      value: `Rp ${formatNumber(biayaPerPesanan)}`,
    },
    {
      label: "Biaya Program Hemat Biaya Kirim",
      value: `Rp ${formatNumber(biayaPengiriman)}`,
    },
  ];

  return (
    <div className="flex justify-center items-center flex-col gap-y-3 py-3 mx-2">
      {/* Dialog Ubah Admin shopee */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <form onSubmit={handleChangeAdminShopee} id={dialog.identifier}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{dialog.title}</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor={dialog.identifier}>Berapa Persen</Label>
                <Input
                  id={dialog.identifier}
                  type="number"
                  placeholder="0"
                  value={admin[dialog.identifier]}
                  onChange={(e) => {
                    setAdmin((prev) => ({
                      ...prev,
                      [dialog.identifier]: e.target.value,
                    }));
                    localStorage.setItem(
                      dialog.identifier,
                      Number(e.target.value),
                    );
                  }}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit" form={dialog.identifier}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* Judul */}
      <h3 className="text-2xl font-bold">Perhitungan Profit Shopee</h3>

      <form
        className="border border-gray-400 rounded-md pb-4"
        onSubmit={hitung}
      >
        <div className="input-components w-full">
          {/* Pengisian Sebelum Menghitung */}
          <div className="text-center">
            <h2 className="font-bold">PENTING DI ISI</h2>
            <small className="text-sm text-gray-500">
              Klik Ikon Pensil Untuk Mengubah
            </small>
          </div>
          {/* Hitung */}
          <div className="border border-gray-400 rounded-md px-2 py-1">
            {keterangan.map((item, index) => (
              <div className="flex justify-between gap-x-10" key={index}>
                <span>{item.label}</span>
                <span className="font-bold">
                  {item.value}
                  {/* Pencil Ikon Untuk Ubah Admin Shopee */}
                  {index === 0 && (
                    <i
                      className="bi bi-pencil ml-2 hover:bg-black hover:text-white p-1 rounded-md"
                      onClick={() => {
                        setDialog({
                          identifier: "adminShopee",
                          title: "Ubah Admin Shopee",
                        });
                        setDialogOpen(true);
                      }}
                    ></i>
                  )}
                  {/* Pencil Ikon Untuk Ubah Admin Promo Extra */}
                  {index === 1 && (
                    <i
                      className="bi bi-pencil ml-2 hover:bg-black hover:text-white p-1 rounded-md"
                      onClick={() => {
                        setDialog({
                          identifier: "adminPromoExtra",
                          title: "Ubah Admin Promo Extra",
                        });
                        setDialogOpen(true);
                      }}
                    ></i>
                  )}
                  {/* Pencil Ikon Untuk Ubah Admin Gratis Ongkir Extra */}
                  {index === 2 && (
                    <i
                      className="bi bi-pencil ml-2 hover:bg-black hover:text-white p-1 rounded-md"
                      onClick={() => {
                        setDialog({
                          identifier: "adminGratisOngkirExtra",
                          title: "Ubah Admin Gratis Ongkir Extra",
                        });
                        setDialogOpen(true);
                      }}
                    ></i>
                  )}
                  {/* Pencil Ikon Untuk Ubah Komisi AMS */}
                  {index === 3 && (
                    <i
                      className="bi bi-pencil ml-2 hover:bg-black hover:text-white p-1 rounded-md"
                      onClick={() => {
                        setDialog({
                          identifier: "komisiAMS",
                          title: "Ubah Komisi AMS",
                        });
                        setDialogOpen(true);
                      }}
                    ></i>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Harga Jual */}
        <div className="input-components">
          <label htmlFor="HargaJual">Harga Jual : </label>
          <input
            type="text"
            id="HargaJual"
            value={hargaJual}
            required={true}
            className="max-w-[200px]"
            placeholder="Isi Harga Jual . . ."
            onChange={(e) => {
              const number = validateNumber(e);
              if (!number) {
                setHargaJual("");
              } else {
                setHargaJual(formatNumber(number));
              }
            }}
          />
        </div>

        {/* Voucher */}
        <div className="input-components">
          <label htmlFor="voucher">Voucher (Jika Ada) : </label>
          <input
            type="text"
            id="voucher"
            value={voucher}
            className="max-w-[200px]"
            placeholder="Masukan Voucher . . ."
            onChange={(e) => {
              const number = validateNumber(e);
              if (!number) {
                setVoucher("");
              } else {
                setVoucher(formatNumber(number));
              }
            }}
          />
        </div>

        {/* Button */}
        <div className="px-3 flex gap-x-2 mt-4">
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            Kembali
          </Button>
          <Button type="submit" className="bg-green-700">
            Hitung
          </Button>
        </div>
      </form>

      {sudahHitung && (
        <div className="border border-gray-400 rounded-md p-4">
          <div className="flex flex-col text-gray-500 text-[12px]">
            <small>
              Biaya Admin Star : Rp{" "}
              {formatNumber(
                Math.round(percentFrom(admin.adminShopee, raw(hargaJual))),
              )}
            </small>
            <small>
              Biaya Admin Promo Extra : Rp{" "}
              {formatNumber(
                Math.round(percentFrom(admin.adminPromoExtra, raw(hargaJual))),
              )}
            </small>
            <small>
              Biaya Admin Gratis Ongkir Extra : Rp{" "}
              {formatNumber(
                Math.round(
                  percentFrom(admin.adminGratisOngkirExtra, raw(hargaJual)),
                ),
              )}
            </small>
            <small>
              Biaya Per Pesanan : Rp {formatNumber(Math.round(biayaPerPesanan))}
            </small>
            <small>
              Biaya Program Hemat Kirim : Rp{" "}
              {formatNumber(Math.round(biayaPengiriman))}
            </small>
          </div>
          <span>
            Total Admin Shopee Sebesar{" "}
            <b>{formatNumber(Math.round(totalAdminShopee))}</b>
          </span>
          <p>
            Komisi Affiliate : <b>{formatNumber(Math.round(totalKomisiAMS))}</b>
          </p>
          <p>
            Komisi Affiliate Baru :{" "}
            <b>{formatNumber(Math.round(totalKomisiAMS / 2))}</b>
          </p>
          <p>
            Penghasilan Akhir :{" "}
            <b>{formatNumber(Math.round(totalKomisiSaya))}</b>
          </p>
          <p>
            Penghasilan Setelah Dipotong Affiliate :{" "}
            <b>{formatNumber(Math.round(totalKomisiSayaDipotongAMS))}</b>
          </p>
          <p>
            Penghasilan Setelah Dipotong Affiliate Baru:{" "}
            <b>{formatNumber(Math.round(totalKomisiSayaDipotongAMSBaru))}</b>
          </p>
        </div>
      )}
    </div>
  );
}
