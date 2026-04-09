import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
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
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import WordInBracket from "../../components/WordInBracket";
import { useAlokasiPemasukan } from "../../context/AlokasiPemasukanContext";
import { useCatatanPenghasilan } from "../../context/CatatanPenghasilanContext";
import {
  day,
  dayName,
  gajiPerHariFull,
  gajiPerHariHalf,
  metode,
  patunganUntukEma,
} from "../../lib/variables";
import {
  createDocument,
  getDocument,
  updateDocument,
} from "../../services/firebase/docService";
import {
  formatNumber,
  raw,
  toCamelCase,
  validateNumber,
} from "../../utils/generalFunction";

// additional function
const date = new Date();
const today = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(date);

const StepThree = () => {
  // hooks
  const {
    totalPenghasilan,
    setTotalPenghasilan,
    penghasilanHPP,
    setPenghasilanHPP,
    gajiHarian,
    setGajiHarian,
    totalTagihan,
    setTotalTagihan,
    tagihan,
    setTagihan,
    isTikTok,
    setIsTikTok,
    produkInArray,
    whichSupplier,
  } = useAlokasiPemasukan();
  const navigate = useNavigate();
  const {
    fetchPenghasilan,
    penghasilanAT,
    setPenghasilanAT,
    tagihanAT,
    setTagihanAT,
    setorAT,
    setSetorAT,
    untungAT,
    setUntungAT,
    fetchAT,
    totalInitialFetch,
  } = useCatatanPenghasilan();

  // State
  const [loadingSave, setLoadingSave] = useState(false);
  const [addBill, setAddBill] = useState(false);
  const [billName, setBillName] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const [sudahHitung, setSudahHitung] = useState(false);
  const [kerja, setKerja] = useState(day === 0 ? false : true);
  const [waktuKerja, setWaktuKerja] = useState("Satu Hari Full");
  const [simpleMode, setSimpleMode] = useState(true);

  // Start
  const [komisiKotor, setKomisiKotor] = useState(0);
  const [komisiBersih, setKomisiBersih] = useState(0);

  // Variables
  const [uangAdeSiska, setUangAdeSiska] = useState(0);
  const [uangEmaIki, setUangEmaIki] = useState(0);
  const [uangCapital, setUangCapital] = useState(0);
  const [uangDanaDarurat, setUangDanaDarurat] = useState(0);
  const [uangKeinginan, setUangKeinginan] = useState(0);
  const [uangInvestasi, setUangInvestasi] = useState(0);
  const [uangUntukSedekah, setUangUntukSedekah] = useState(0);

  // Function
  const hitungSekarang = (e) => {
    e.preventDefault();

    // hitung gaji harian
    let gajiHarianTemp = 0;
    if (kerja) {
      if (waktuKerja === "Satu Hari Full") {
        gajiHarianTemp = gajiPerHariFull;
        setGajiHarian(gajiPerHariFull);
      } else {
        gajiHarianTemp = gajiPerHariHalf;
        setGajiHarian(gajiPerHariHalf);
      }
    } else {
      gajiHarianTemp = 0;
      setGajiHarian(0);
    }

    // Komisi Kotor
    const getKomisiKotor = raw(totalPenghasilan) - raw(penghasilanHPP);
    setKomisiKotor(getKomisiKotor);

    // Hitung Total Tagihan Lainnya
    const totalTagihanLainnya = tagihan.reduce((acc, cur) => {
      return acc + raw(cur.totalBill);
    }, 0);
    setTotalTagihan(totalTagihanLainnya);

    // Hitung Total Untuk Ade Siska
    let untukAdeSiska = 0;
    if (isTikTok) {
      untukAdeSiska = raw(penghasilanHPP) - totalTagihanLainnya;
    } else {
      untukAdeSiska =
        raw(totalPenghasilan) -
        (patunganUntukEma.uko + getKomisiKotor) -
        totalTagihanLainnya;
    }
    if (kerja) {
      setUangAdeSiska(untukAdeSiska - gajiHarianTemp);
    } else {
      setUangAdeSiska(untukAdeSiska);
    }

    // Hitung Uang Untuk Ma Iki Dari Komisi Kotor
    const uangUntukMaIki = patunganUntukEma.uko + patunganUntukEma.adi;
    setUangEmaIki(uangUntukMaIki);

    // Hitung Sedekah
    const sisaKomisiSemiBersih = getKomisiKotor - patunganUntukEma.adi;
    const uangSedekah = Math.round(
      (metode.sedekah / 100) * sisaKomisiSemiBersih,
    );
    setUangUntukSedekah(uangSedekah);

    // Total Komisi Bersih
    const totalKomisiBersih =
      getKomisiKotor - (patunganUntukEma.adi + uangSedekah);
    setKomisiBersih(totalKomisiBersih);

    // Pembagian Ke Rekening Yang Berbeda
    const pembagian = {
      uangCapital: Math.round(metode.capital / 100) * totalKomisiBersih,
      uangDanaDarurat: Math.round(
        (metode.danaDarurat / 100) * totalKomisiBersih,
      ),
      uangKeinginan: Math.round((metode.keinginan / 100) * totalKomisiBersih),
      uangInvestasi: Math.round((metode.investasi / 100) * totalKomisiBersih),
    };

    // Hitung uang sisa pembagian
    const totalPembagian =
      pembagian.uangCapital +
      pembagian.uangDanaDarurat +
      pembagian.uangKeinginan +
      pembagian.uangInvestasi;
    const sisaPembagian = totalKomisiBersih - totalPembagian;

    setUangCapital(pembagian.uangCapital + sisaPembagian);
    setUangDanaDarurat(pembagian.uangDanaDarurat);
    setUangKeinginan(pembagian.uangKeinginan);
    setUangInvestasi(pembagian.uangInvestasi);

    // Render
    setSudahHitung(true);
  };

  const saveToFirebase = async () => {
    const tiktokCollectionName = "penghasilanJualanOnlineTikTok";
    const shopeeCollectionName = "penghasilanJualanOnlineShopee";
    const platform = isTikTok ? "tiktok" : "shopee";
    const lastSaveShopee = "shopeeLastSave";
    const lastSaveTiktok = "tiktokLastSave";

    const saveNow = async () => {
      const konfirmasi = confirm(
        "Apakah Anda Yakin Menyimpan Dokumen Ke Firebase ?",
      );

      setLoadingSave(true);

      if (konfirmasi) {
        const updateTiktokDoc = async () => {
          // Data Penghasilan TikTok Yang Akan Di Simpan
          const penghasilanTikTok = {
            totalPenghasilan: raw(totalPenghasilan),
            penghasilanHPP: {
              total: raw(penghasilanHPP),
              produkTerjual: produkInArray.filter(
                (produk) => produk.terjual > 0,
              ),
            },
            tagihan: {
              listTagihan: tagihan,
              totalTagihan,
            },
            komisiAdi: {
              total: komisiKotor,
            },
            uangAdeSiska,
          };

          await createDocument(
            "saveNotePenghasilanTikTok",
            tiktokCollectionName,
            penghasilanTikTok,
            "Berhasil Menyimpan Note Penghasilan",
          );
          await updateDocument(
            "UpdateTikTokLastSave",
            tiktokCollectionName,
            lastSaveTiktok,
            { time: today },
            "Berhasil Update TikTok Last Save",
          );
          localStorage.setItem(lastSaveTiktok, today);

          // Update All Time Document Tiktok
          const tiktokAllTime = {
            penghasilanAT: penghasilanAT.tiktok + raw(totalPenghasilan),
            tagihanAT: tagihanAT.tiktok + totalTagihan,
            setorAT: setorAT.tiktok + uangAdeSiska,
            untungAT: untungAT.tiktok + komisiKotor,
          };
          await updateDocument(
            "UpdateAllTimeDocument",
            "penghasilanAllTime",
            "CatatanPenghasilanAllTime",
            {
              tiktok: tiktokAllTime,
            },
            "Berhasil Mengupdate Document All Time Shopee",
          );
        };

        const updateShopeeDoc = async () => {
          2;
          // Data Penghasilan Shopee Yang Akan Di Simpan
          const penghasilanShopee = {
            totalPenghasilan: raw(totalPenghasilan),
            penghasilanHPP: {
              total: raw(penghasilanHPP),
              produkTerjual: produkInArray.filter(
                (produk) => produk.terjual > 0,
              ),
            },
            tagihan: {
              listTagihan: tagihan,
              totalTagihan,
            },
            uangAdeSiska,
            uangEmaIki,
            komisiAdi: {
              total: komisiKotor,
              komisiBersih,
              capital: uangCapital,
              danaDarurat: uangDanaDarurat,
              uangKeinginan: uangKeinginan,
              uangInvestasi: uangInvestasi,
              sedekah: uangUntukSedekah,
            },
            patunganUntukEma,
            gajiAdi: gajiHarian,
          };
          await createDocument(
            "saveNotePenghasilanShopee",
            "penghasilanJualanOnlineShopee",
            penghasilanShopee,
            "Berhasil Menyimpan Note Penghasilan",
          );
          await updateDocument(
            "UpdateShopeeLastSave",
            shopeeCollectionName,
            lastSaveShopee,
            { time: today },
            "Berhasil Update Shopee Last Save",
          );
          localStorage.setItem(lastSaveShopee, today);

          // Update All Time Document Shopee
          const shopeeAllTime = {
            penghasilanAT: penghasilanAT.shopee + raw(totalPenghasilan),
            tagihanAT: tagihanAT.shopee + totalTagihan,
            setorAT: setorAT.shopee + uangAdeSiska,
            untungAT: untungAT.shopee + komisiKotor,
          };
          await updateDocument(
            "UpdateAllTimeDocument",
            "penghasilanAllTime",
            "CatatanPenghasilanAllTime",
            {
              shopee: shopeeAllTime,
            },
            "Berhasil Mengupdate Document All Time Shopee",
          );
        };

        if (isTikTok) {
          await updateTiktokDoc();
        } else {
          await updateShopeeDoc();
        }

        // Optimistic Update
        setPenghasilanAT((prev) => ({
          ...prev,
          [platform]: prev[platform] + raw(totalPenghasilan),
        }));
        setTagihanAT((prev) => ({
          ...prev,
          [platform]: prev[platform] + totalTagihan,
        }));
        setSetorAT((prev) => ({
          ...prev,
          [platform]: prev[platform] + uangAdeSiska,
        }));
        setUntungAT((prev) => ({
          ...prev,
          [platform]: prev[platform] + komisiKotor,
        }));

        fetchPenghasilan(platform, 7);
        setLoadingSave(false);
        alert("Berhasil Menyimpan Dokumen");
      }

      setLoadingSave(false);
    };

    const sinkronLastSave = async () => {
      if (isTikTok) {
        const tiktokLastSave = await getDocument(
          "Ambil Last Save TikTok",
          tiktokCollectionName,
          lastSaveTiktok,
        );

        if (tiktokLastSave.data.time === today) {
          alert("Kamu Sudah Menyimpan Penghasilan Hari Ini, Kembali Lah Besok");
        } else {
          saveNow();
        }
      } else {
        const shopeeLastSave = await getDocument(
          "Ambil Last Save Shopee",
          shopeeCollectionName,
          lastSaveShopee,
        );

        if (shopeeLastSave.data.time === today) {
          alert("Kamu Sudah Menyimpan Penghasilan Hari Ini, Kembali Lah Besok");
        } else {
          saveNow();
        }
      }
    };

    await sinkronLastSave();
  };

  const handleAddBill = (e) => {
    e.preventDefault();

    const cekIfBillNameExist = tagihan.some(
      (bill) => bill.identifier === toCamelCase(billName),
    );

    if (cekIfBillNameExist) {
      alert("Maaf Tagihan Sudah Ada, Beri Nama Lain");
      setBillName("");
    } else {
      const newBill = {
        identifier: toCamelCase(billName),
        billName,
        totalBill,
      };

      setTagihan((prevBills) => [...prevBills, newBill]);

      setBillName("");
      setTotalBill("");
      setAddBill(false);
      setSudahHitung(false);
    }
  };

  useEffect(() => {
    if (isTikTok) {
      setGajiHarian(0);
      setKerja(false);
      console.log("mode tiktok aktif, kini gaji jadi 0");
    }
  }, [isTikTok]);

  useEffect(() => {
    if (!whichSupplier) {
      navigate("/alokasiPemasukan");
    }

    if (totalInitialFetch) {
      fetchAT();
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col py-3">
      <LoadingOverlay show={loadingSave} text="Loading . . ." />
      <form
        className="border-slate-400 rounded-md w-max mx-auto mt-3 max-w-[800px]"
        onSubmit={hitungSekarang}
        id="alokasiPemasukan"
      >
        <Card className="min-w-[380px]">
          <CardHeader>
            <CardTitle>Alokasi Pemasukan</CardTitle>

            <Dialog open={addBill} onOpenChange={setAddBill}>
              <DialogTrigger>
                {/* Tombol Tambahkan Tagihan Lainnya */}
                <CardAction>
                  <Button
                    size={"xs"}
                    type="button"
                    onClick={() => {
                      setAddBill(!addBill);
                    }}
                  >
                    + Bill
                  </Button>
                </CardAction>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Tagihan Lainnya</DialogTitle>
                  <FieldSet>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Nama Tagihan</FieldLabel>
                        <Input
                          value={billName}
                          required
                          onChange={(e) => {
                            setBillName(e.target.value);
                          }}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Total Tagihan</FieldLabel>
                        <Input
                          value={totalBill}
                          type="text"
                          required
                          onChange={(e) => {
                            const number = validateNumber(e);
                            if (!number) {
                              setTotalBill("");
                            } else {
                              setTotalBill(formatNumber(number));
                            }
                          }}
                        />
                      </Field>
                      <Field>
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            onClick={() => {
                              setAddBill(false);
                            }}
                          >
                            Batal
                          </Button>
                          <Button
                            type="button"
                            onClick={handleAddBill}
                            className="bg-sky-700"
                          >
                            Tambahkan
                          </Button>
                        </div>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {/* Nama Hari */}
            <div className="flex items-center justify-between input-components">
              <span>Hari : {dayName[day]}</span>
            </div>

            {/* Tombol On Off Mode TikTok */}
            <div className="flex items-center justify-between input-components">
              <span>Mode TikTok</span>
              <Switch
                checked={isTikTok}
                onCheckedChange={() => {
                  setIsTikTok(!isTikTok);
                  setSudahHitung(false);
                }}
              />
            </div>

            {/* Tombol On Off Kerja */}
            {!isTikTok && (
              <div className="flex items-center justify-between input-components">
                <span>Kerja Hari Ini</span>
                <Switch
                  checked={kerja}
                  onCheckedChange={() => {
                    setKerja(!kerja);
                    setSudahHitung(false);
                  }}
                />
              </div>
            )}

            {kerja && !isTikTok ? (
              <div className="flex items-center justify-between input-components">
                <span>Berapa Lama Kerja :</span>
                <Select
                  value={waktuKerja}
                  onValueChange={(e) => {
                    setWaktuKerja(e);
                    setSudahHitung(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Berapa Lama ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Satu Hari Full">
                        Satu Hari Full
                      </SelectItem>
                      <SelectItem value="Setengah Hari">
                        Setengah Hari
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <></>
            )}

            {/* Tombol On Off Mode Simple */}
            <div className="flex items-center justify-between input-components">
              <span>Mode Simple</span>
              <Switch checked={simpleMode} onCheckedChange={setSimpleMode} />
            </div>

            <FieldSet className="input-components">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="penarikanDana">
                    Total Penarikan Dana
                  </FieldLabel>
                  <Input
                    id="penarikanDana"
                    autoComplete="off"
                    type="text"
                    required
                    placeholder="0"
                    value={totalPenghasilan}
                    onChange={(e) => {
                      setSudahHitung(false);
                      const number = validateNumber(e);
                      if (!number) {
                        setTotalPenghasilan("");
                      } else {
                        setTotalPenghasilan(formatNumber(number));
                      }
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="penghasilanHPP">
                    Total Penghasilan HPP
                  </FieldLabel>
                  <Input
                    id="penghasilanHPP"
                    autoComplete="off"
                    type="text"
                    required
                    placeholder="0"
                    value={penghasilanHPP}
                    onChange={(e) => {
                      setSudahHitung(false);
                      const number = validateNumber(e);
                      if (!number) {
                        setPenghasilanHPP("");
                      } else {
                        setPenghasilanHPP(number);
                      }
                    }}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Tagihan Lainnya */}
            {tagihan.length > 0 && (
              <div className="input-components border rounded-md">
                <FieldSet>
                  <FieldLegend>List Tagihan</FieldLegend>
                  <FieldGroup>
                    {tagihan.map((bill, index) => (
                      <Field>
                        <FieldLabel>{bill.billName}</FieldLabel>
                        <div className="flex gap-x-1">
                          <Input
                            value={bill.totalBill}
                            placeholder="0"
                            onChange={(e) => {
                              setSudahHitung(false);
                              setTagihan((prev) => {
                                const newBill = [...prev];
                                newBill[index] = {
                                  ...newBill[index],
                                  totalBill: e.target.value,
                                };
                                return newBill;
                              });
                            }}
                          />
                          <Button
                            className="bi bi-trash"
                            onClick={() => {
                              setSudahHitung(false);
                              setTagihan((prev) => {
                                return prev.filter((_, ind) => ind !== index);
                              });
                            }}
                          />
                        </div>
                      </Field>
                    ))}
                  </FieldGroup>
                </FieldSet>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            {/* Tombol Navigasi */}
            <CardAction>
              {/* Tombol Kembali ke StepTwo */}
              <Button
                type="button"
                onClick={() => {
                  navigate("/alokasiPemasukan/calculateHPP");
                }}
              >
                Kembali
              </Button>

              {/* Hitung Sekarang */}
              <Button
                type="submit"
                className="bg-green-700"
                form="alokasiPemasukan"
              >
                Hitung
              </Button>

              {/* Simpan Ke Firebase*/}
              {sudahHitung && (
                <Button
                  type="button"
                  onClick={saveToFirebase}
                  className="bg-sky-700"
                >
                  Simpan Ke Firebase
                </Button>
              )}
            </CardAction>
          </CardFooter>
        </Card>
      </form>

      {/* Tampilkan Saat Tombol Hitung Di Tekan */}

      {/* Shopee Conclusion */}
      {sudahHitung && !isTikTok ? (
        <div className="flex flex-col max-w-[700px]">
          <div className="border border-gray-200 rounded-md p-4 mt-4 flex flex-col gap-y-4 mx-2">
            <div>
              {/* Judul */}
              <b className="text-lg">Ringkasan</b>
              <p>
                Total Penghasilan Dari Shopee :{" "}
                <b>{formatNumber(totalPenghasilan)}</b>
              </p>
              <p>
                Total Penghasilan HPP : <b>{formatNumber(penghasilanHPP)}</b>
              </p>
              {totalTagihan > 0 && (
                <p>
                  Tagihan Lainnya : <b>{formatNumber(totalTagihan)}</b>{" "}
                  {!simpleMode && (
                    <WordInBracket
                      kalimat={tagihan.map((bill) => bill.billName).join(", ")}
                    />
                  )}
                </p>
              )}
              <p>
                Komisi Kotor : <b>{formatNumber(komisiKotor)}</b>
                {!simpleMode && (
                  <WordInBracket
                    kalimat={`Total Penghasilan Dari Shopee - Total Penghasilan HPP`}
                  />
                )}
              </p>
              <p>
                Setor Untuk Ade Siska : <b>{formatNumber(uangAdeSiska)}</b>
                {!simpleMode && (
                  <WordInBracket
                    kalimat={`Total Penghasilan HPP - Patungan Ema Uko
                    ${kerja ? "- Gaji Per Hari" : ""} ${
                      totalTagihan > 0 ? "- Total Tagihan Lainnya" : ""
                    }`}
                  />
                )}
              </p>
              <p>
                Uang Untuk Ema Iki : <b>{formatNumber(uangEmaIki)}</b>
                {!simpleMode && (
                  <WordInBracket
                    kalimat={`Uko ${formatNumber(
                      patunganUntukEma.uko,
                    )} + Adi ${formatNumber(patunganUntukEma.adi)}`}
                  />
                )}
              </p>
              <p>
                Uang Untuk Sedekah : <b>{formatNumber(uangUntukSedekah)}</b>
                {!simpleMode && (
                  <span className="mx-1">
                    <span>(</span>
                    <span className="text-gray-400 text-sm inline-block mx-1">
                      {metode.sedekah}% x{" "}
                      {formatNumber(komisiKotor - patunganUntukEma.adi)}
                    </span>
                    <span>)</span>
                  </span>
                )}
              </p>
              <p>
                Komisi Bersih : <b>{formatNumber(komisiBersih)}</b>
                {!simpleMode && (
                  <WordInBracket
                    kalimat={
                      "Komisi Kotor - Patungan Ema Adi - Uang Untuk Sedekah"
                    }
                  />
                )}
              </p>
            </div>

            {/* Next Step */}
            <div>
              {/* Judul */}
              <b className="text-lg">Yang Dilakukan Selanjutnya</b>
              <ol className="list-decimal ml-6">
                {/* Transfer Ke Ade Siska */}
                <li>
                  {simpleMode ? (
                    // Simple Mode
                    <div>
                      Transfer Ke <b>SeaBank Ade Siska</b>{" "}
                      <b>{formatNumber(uangAdeSiska)}</b>
                    </div>
                  ) : (
                    // Ribet Mode
                    <div>
                      Transfer Uang Ke <b>SeaBank Ade Siska</b> Sebesar{" "}
                      <b>{formatNumber(uangAdeSiska)}</b>
                    </div>
                  )}
                </li>

                {/* Transfer Uang Capital + Dana Darurat + Keinginan + Investasi + Sedekah + Ema Iki*/}
                <li>
                  {simpleMode ? "Transfer" : "Transfer Uang"}{" "}
                  {!simpleMode && (
                    <WordInBracket
                      kalimat={`Capital + Dana Darurat + Keinginan + Investasi + Sedekah + Uang Ema Iki ${
                        kerja ? " + Gaji Perhari" : ""
                      }`}
                    />
                  )}{" "}
                  Ke <b>SeaBank Adi Permadi</b> Sebesar{" "}
                  <b>
                    {formatNumber(
                      uangCapital +
                        uangDanaDarurat +
                        uangInvestasi +
                        uangKeinginan +
                        uangUntukSedekah +
                        patunganUntukEma.adi +
                        patunganUntukEma.uko +
                        (kerja ? gajiHarian : 0),
                    )}
                  </b>
                </li>

                {/* Catat Pemasukan Ke Aplikasi Catatan Keuangan */}
                <div className="mb-6">
                  {/* Ribet Mode */}
                  {!simpleMode && (
                    <>
                      <li>
                        Catat Pemasukan Uang Capital Sebesar{" "}
                        <b>{formatNumber(uangCapital)}</b>
                        {!simpleMode && (
                          <WordInBracket
                            kalimat={`${metode.capital}% x ${formatNumber(
                              komisiKotor - patunganUntukEma.adi,
                            )}`}
                          />
                        )}
                      </li>
                      <li>
                        Catat Pemasukan Uang Dana Darurat Sebesar{" "}
                        <b>{formatNumber(uangDanaDarurat)}</b>
                        {!simpleMode && (
                          <WordInBracket
                            kalimat={`${metode.danaDarurat}% x ${formatNumber(
                              komisiKotor - patunganUntukEma.adi,
                            )}`}
                          />
                        )}
                      </li>
                      <li>
                        Catat Pemasukan Uang Keinginan Sebesar{" "}
                        <b>{formatNumber(uangKeinginan)}</b>
                        {!simpleMode && (
                          <WordInBracket
                            kalimat={`${metode.keinginan}% x ${formatNumber(
                              komisiKotor - patunganUntukEma.adi,
                            )}`}
                          />
                        )}
                      </li>
                      <li>
                        Catat Pemasukan Uang Investasi Sebesar{" "}
                        <b>{formatNumber(uangInvestasi)}</b>
                        {!simpleMode && (
                          <WordInBracket
                            kalimat={`${metode.investasi}% x ${formatNumber(
                              komisiKotor - patunganUntukEma.adi,
                            )}`}
                          />
                        )}
                      </li>
                      <li>
                        Catat Pemasukan Uang Sedekah Sebesar{" "}
                        <b>{formatNumber(uangUntukSedekah)}</b>
                        {!simpleMode && (
                          <WordInBracket
                            kalimat={`${metode.sedekah}% x ${formatNumber(
                              komisiKotor - patunganUntukEma.adi,
                            )}`}
                          />
                        )}
                      </li>
                      {kerja && (
                        <li>
                          Catat Pemasukan Uang Capital
                          <WordInBracket kalimat={"Gaji"} />
                          Sebesar <b>{formatNumber(gajiHarian)}</b>
                        </li>
                      )}
                      <li>
                        Edit Rekening Ema Iki Dengan Menambahkan Nominal Sebesar{" "}
                        <b>
                          {formatNumber(
                            patunganUntukEma.uko + patunganUntukEma.adi,
                          )}
                        </b>
                      </li>
                      {totalTagihan > 0 && (
                        <li>
                          Ada Uang Tagihan Lainnya Sebesar{" "}
                          <b>{formatNumber(totalTagihan)}</b>
                          <br />
                          Mau Di Transfer Ke Mana ?
                          <br />
                        </li>
                      )}
                    </>
                  )}

                  {/* Simple Mode */}
                  {simpleMode && (
                    <li>
                      Catat Ke Aplikasi Keuangan :
                      <ol className="simplemodetransfer list-inside">
                        <li>
                          <span>Rekening Capital</span>{" "}
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>{formatNumber(uangCapital)}</b>
                        </li>
                        <li>
                          <span>Rekening Dana Darurat</span>{" "}
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>{formatNumber(uangDanaDarurat)}</b>
                        </li>
                        <li>
                          <span>Rekening Keinginan</span>{" "}
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>{formatNumber(uangKeinginan)}</b>
                        </li>
                        <li>
                          <span>Rekening Investasi</span>
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>{formatNumber(uangInvestasi)}</b>
                        </li>
                        <li>
                          <span>Rekening Sedekah</span>
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>{formatNumber(uangUntukSedekah)}</b>
                        </li>
                        {kerja && (
                          <li>
                            <span>
                              Rekening Capital
                              <WordInBracket kalimat={"Gaji"} />
                            </span>
                            <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                            <b>{formatNumber(gajiHarian)}</b>
                          </li>
                        )}
                        <li>
                          <span>Edit Rekening Ema Iki</span>
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>
                            {formatNumber(
                              patunganUntukEma.uko + patunganUntukEma.adi,
                            )}
                          </b>
                        </li>
                        {totalTagihan > 0 && (
                          <li>
                            <span>
                              Ada Uang Tagihan Lainnya Sebesar{" "}
                              <b>{formatNumber(totalTagihan)}</b>
                              <br />
                              Mau Di Transfer Ke Mana ?
                            </span>
                          </li>
                        )}
                      </ol>
                    </li>
                  )}
                </div>

                {/* Catat Komisi Bersih */}
                <li>
                  Catat Komisi Bersih Ke <b>Excel</b> Sebesar{" "}
                  <b>{formatNumber(komisiBersih)}</b>
                </li>
              </ol>
            </div>
            <div>
              {/* Judul */}
              <b className="text-lg">Catatan</b>
              <div className="flex flex-col">
                <span>Patungan Untuk Ema</span>
                <ol className="list-inside px-2">
                  <li>
                    UKO : <b>{formatNumber(patunganUntukEma.uko)}</b>
                  </li>
                  <li>
                    ADI : <b>{formatNumber(patunganUntukEma.adi)}</b>
                  </li>
                </ol>
                <span>
                  {waktuKerja === "Satu Hari Full" && (
                    <span>
                      Gaji Full Hari : <b>{formatNumber(gajiPerHariFull)}</b>
                    </span>
                  )}
                  {waktuKerja === "Setengah Hari" && (
                    <span>
                      Gaji Setengah Hari :{" "}
                      <b>{formatNumber(gajiPerHariHalf)}</b>
                    </span>
                  )}
                </span>
                <span>Metode Pembagian</span>
                <ol className="list-inside px-2">
                  <li>
                    Capital : <b>{metode.capital}%</b>
                  </li>
                  <li>
                    Dana Darurat : <b>{metode.danaDarurat}%</b>
                  </li>
                  <li>
                    Investasi : <b>{metode.investasi}%</b>
                  </li>
                  <li>
                    Sedekah : <b>{metode.sedekah}%</b>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* TikTok Conclusion */}
      {sudahHitung && isTikTok ? (
        <div className="flex flex-col max-w-[700px]">
          <div className="border border-gray-400 rounded-md p-4 mt-4 flex flex-col gap-y-4 mx-2">
            <div>
              {/* Judul */}
              <b className="text-lg">Ringkasan</b>
              <p>
                Total Penghasilan Dari TikTok :{" "}
                <b>{formatNumber(totalPenghasilan)}</b>
              </p>
              <p>
                Total Penghasilan HPP : <b>{formatNumber(penghasilanHPP)}</b>
              </p>
              {totalTagihan > 0 && (
                <p>
                  Tagihan Lainnya : <b>{formatNumber(totalTagihan)}</b>{" "}
                  {!simpleMode && (
                    <WordInBracket
                      kalimat={tagihan.map((bill) => bill.billName).join(", ")}
                    />
                  )}
                </p>
              )}
              <p>
                Setor Untuk Ade Siska :{" "}
                <b>{formatNumber(raw(penghasilanHPP) - totalTagihan)}</b>
              </p>
            </div>

            {/* Next Step */}
            <div>
              {/* Judul */}
              <b className="text-lg">Yang Dilakukan Selanjutnya</b>
              <ol className="list-decimal ml-6">
                {/* Transfer Ke Ade Siska */}
                <li>
                  {simpleMode ? (
                    // Simple Mode
                    <div>
                      Transfer Ke <b>SeaBank Ade Siska</b>{" "}
                      <b>{formatNumber(raw(penghasilanHPP) - totalTagihan)}</b>
                    </div>
                  ) : (
                    // Ribet Mode
                    <div>
                      Transfer Uang Ke <b>SeaBank Ade Siska</b> Sebesar{" "}
                      <b>{formatNumber(raw(penghasilanHPP) - totalTagihan)}</b>
                    </div>
                  )}
                </li>

                {/* Transfer Uang Ke Seabank Adi Permadi*/}
                <li>
                  {simpleMode ? "Transfer" : "Transfer Uang"} Ke{" "}
                  <b>SeaBank Adi Permadi</b> Sebesar{" "}
                  <b>{formatNumber(komisiKotor)}</b>
                </li>

                {/* Catat Pemasukan Ke Dana Darurat */}
                <div className="mb-6">
                  {!simpleMode && (
                    <>
                      <li>
                        Catat Pemasukan Uang Capital Sebesar{" "}
                        <b>{formatNumber(komisiKotor)}</b>
                      </li>
                      {totalTagihan > 0 && (
                        <li>
                          Ada Uang Tagihan Lainnya Sebesar{" "}
                          <b>{formatNumber(totalTagihan)}</b>
                          <br />
                          Mau Di Transfer Ke Mana ?
                          <br />
                        </li>
                      )}
                    </>
                  )}
                  {simpleMode && (
                    <>
                      <li>
                        Catat Ke Aplikasi Keuangan :
                        <ol className="simplemodetransfer list-inside">
                          <li>
                            <span>Rekening Capital</span>{" "}
                            <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                            <b>{formatNumber(komisiKotor)}</b>
                          </li>
                          {totalTagihan > 0 && (
                            <li>
                              <span>
                                Ada Uang Tagihan Lainnya Sebesar{" "}
                                <b>{formatNumber(totalTagihan)}</b>
                                <br />
                                Mau Di Transfer Ke Mana ?
                              </span>
                            </li>
                          )}
                        </ol>
                      </li>
                      {/* Catat Komisi Bersih */}
                      <br />
                      <li>
                        Catat Komisi Bersih Ke <b>Excel</b> Sebesar{" "}
                        <b>{formatNumber(komisiKotor)}</b>
                      </li>
                    </>
                  )}
                </div>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StepThree;
