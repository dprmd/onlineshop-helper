import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import DialogUbahValue from "../components/DialogUbahValue";
import { formatNumber, raw, validateNumber } from "../utils/generalFunction";

// Helper Function
const percentFrom = (percent, total) => {
  return (percent / 100) * total;
};

const PerhitunganProfit = () => {
  // State
  const navigate = useNavigate();
  const [sudahHitung, setSudahHitung] = useState(false);

  // Perubahan Data
  const [perubahanAdminShopee, setPerubahanAdminShopee] = useState("");
  const [perubahanAdminPromoExtra, setPerubahanAdminPromoExtra] = useState("");
  const [perubahanAdminGratisOngkirExtra, setPerubahanAdminGratisOngkirExtra] =
    useState("");
  const [perubahanKomisiAMS, setPerubahanKomisiAMS] = useState("");

  // State Untuk Menutup dan Membuka Dialog
  const [ubahAdminShopee, setUbahAdminShopee] = useState(false);
  const [ubahAdminPromoExtra, setUbahAdminPromoExtra] = useState(false);
  const [ubahAdminGratisOngkirExtra, setUbahAdminGratisOngkirExtra] =
    useState(false);
  const [ubahKomisiAMS, setUbahKomisiAMS] = useState(false);

  // Admin Shopee
  const biayaPerPesanan = 1250;
  const biayaPengiriman = 350;
  const [adminShopee, setAdminShopee] = useState(8);
  const [adminPromoExtra, setAdminPromoExtra] = useState(4.5);
  const [adminGratisOngkirExtra, setAdminGratisOngkirExtra] = useState(5.5);
  const [komisiAMS, setKomisiAMS] = useState(10);

  // Input
  const [hargaJual, setHargaJual] = useState("");
  const [voucher, setVoucher] = useState("0");

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
          adminShopee + adminPromoExtra + adminGratisOngkirExtra,
          raw(hargaJual)
        )
      ) +
      biayaPerPesanan +
      biayaPengiriman;
    const hargaFinal = raw(hargaJual) - totalAdmin - raw(voucher);
    const totalKomisiAMSDidapat = percentFrom(komisiAMS, raw(hargaJual));

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
    tempValueSetterFunc,
    initValue
  ) => {
    if (localStorage.getItem(localStorageIdentifier)) {
      const value = localStorage.getItem(localStorageIdentifier);
      realValueSetterFunc(Number(value));
      tempValueSetterFunc(value);
    } else {
      localStorage.setItem(localStorageIdentifier, initValue);
    }
  };

  useEffect(() => {
    // localStorage Init
    localStorageInit(
      "adminShopee",
      setAdminShopee,
      setPerubahanAdminShopee,
      "8"
    );
    localStorageInit(
      "adminPromoExtra",
      setAdminPromoExtra,
      setPerubahanAdminPromoExtra,
      "4.5"
    );
    localStorageInit(
      "adminGratisOngkirExtra",
      setAdminGratisOngkirExtra,
      setPerubahanAdminGratisOngkirExtra,
      "5.5"
    );
    localStorageInit("komisiAMS", setKomisiAMS, setPerubahanKomisiAMS, "10");
  }, []);

  // Html Css Data
  const keterangan = [
    { label: "Admin Shopee", value: `${adminShopee} %` },
    { label: "Admin Promo Extra", value: `${adminPromoExtra} %` },
    {
      label: "Admin Gratis Ongkir Extra",
      value: `${adminGratisOngkirExtra} %`,
    },
    {
      label: "Komisi Affiliate",
      value: `${komisiAMS} %`,
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
      {/* dialog ubah admin shopee percent */}
      {ubahAdminShopee && (
        <DialogUbahValue
          title="Ubah Admin Shopee"
          changeOpenStateFunction={setUbahAdminShopee}
          changeValueFunction={setPerubahanAdminShopee}
          localStorageIdentifier="adminShopee"
          realStateChangeFunction={setAdminShopee}
          valueState={perubahanAdminShopee}
        />
      )}
      {ubahAdminPromoExtra && (
        <DialogUbahValue
          title="Ubah Admin Promo Extra"
          changeOpenStateFunction={setUbahAdminPromoExtra}
          changeValueFunction={setPerubahanAdminPromoExtra}
          localStorageIdentifier="adminPromoExtra"
          realStateChangeFunction={setAdminPromoExtra}
          valueState={perubahanAdminPromoExtra}
        />
      )}
      {ubahAdminGratisOngkirExtra && (
        <DialogUbahValue
          title="Ubah Admin Gratis Ongkir Extra"
          changeOpenStateFunction={setUbahAdminGratisOngkirExtra}
          changeValueFunction={setPerubahanAdminGratisOngkirExtra}
          localStorageIdentifier="adminGratisOngkirExtra"
          realStateChangeFunction={setAdminGratisOngkirExtra}
          valueState={perubahanAdminGratisOngkirExtra}
        />
      )}
      {ubahKomisiAMS && (
        <DialogUbahValue
          title="Ubah Komisi Affiliate"
          changeOpenStateFunction={setUbahKomisiAMS}
          changeValueFunction={setPerubahanKomisiAMS}
          localStorageIdentifier="komisiAMS"
          realStateChangeFunction={setKomisiAMS}
          valueState={perubahanKomisiAMS}
        />
      )}

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
                        setUbahAdminShopee(true);
                      }}
                    ></i>
                  )}
                  {/* Pencil Ikon Untuk Ubah Admin Promo Extra */}
                  {index === 1 && (
                    <i
                      className="bi bi-pencil ml-2 hover:bg-black hover:text-white p-1 rounded-md"
                      onClick={() => {
                        setUbahAdminPromoExtra(true);
                      }}
                    ></i>
                  )}
                  {/* Pencil Ikon Untuk Ubah Admin Gratis Ongkir Extra */}
                  {index === 2 && (
                    <i
                      className="bi bi-pencil ml-2 hover:bg-black hover:text-white p-1 rounded-md"
                      onClick={() => {
                        setUbahAdminGratisOngkirExtra(true);
                      }}
                    ></i>
                  )}
                  {/* Pencil Ikon Untuk Ubah Komisi AMS */}
                  {index === 3 && (
                    <i
                      className="bi bi-pencil ml-2 hover:bg-black hover:text-white p-1 rounded-md"
                      onClick={() => {
                        setUbahKomisiAMS(true);
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
              setHargaJual(formatNumber(number));
            }}
          />
        </div>

        {/* Voucher */}
        <div className="input-components">
          <label htmlFor="voucher">Voucher (Jika Ada) : </label>
          <input
            type="number"
            id="voucher"
            value={voucher}
            className="max-w-[200px]"
            placeholder="Masukan Voucher . . ."
            onChange={(e) => {
              const number = validateNumber(e);
              setVoucher(formatNumber(number));
            }}
          />
        </div>

        {/* Button */}
        <div className="px-3 flex gap-x-2 mt-4">
          <button
            type="button"
            className="bg-red-600 hover:bg-red-400 px-2 py-1 rounded-md"
            onClick={() => {
              navigate("/");
            }}
          >
            Kembali
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-400 px-2 py-1 rounded-md"
          >
            Kalkulasikan
          </button>
        </div>
      </form>

      {sudahHitung && (
        <div className="border border-gray-400 rounded-md p-4">
          <div className="flex flex-col text-gray-500 text-[12px]">
            <small>
              Biaya Admin Star : Rp{" "}
              {formatNumber(
                Math.round(percentFrom(adminShopee, raw(hargaJual)))
              )}
            </small>
            <small>
              Biaya Admin Promo Extra : Rp{" "}
              {formatNumber(
                Math.round(percentFrom(adminPromoExtra, raw(hargaJual)))
              )}
            </small>
            <small>
              Biaya Admin Gratis Ongkir Extra : Rp{" "}
              {formatNumber(
                Math.round(percentFrom(adminGratisOngkirExtra, raw(hargaJual)))
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
};

export default PerhitunganProfit;
