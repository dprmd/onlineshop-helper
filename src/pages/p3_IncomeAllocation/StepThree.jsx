import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCRUD } from "@/context/CRUDContext";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import WordInBracket from "../../components/WordInBracket";
import { useIncomeAllocation } from "../../context/IncomeAllocationContext";
import { useWithdrawalRecords } from "../../context/WithdrawalRecordsContext";
import {
  day,
  dayName,
  fullDayWage,
  halfDayWage,
  metode,
  splitBillEmaIki,
} from "../../lib/variables";
import {
  createDocument,
  getDocument,
  updateDocument,
} from "../../services/firebase/docService";
import {
  combineDateTimeToMs,
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
    totalWithdraw,
    setTotalWithdraw,
    totalHPP,
    setTotalHPP,
    dailyWage,
    setDailyWage,
    totalBill,
    setTotalBill,
    bills,
    setBills,
    isTikTok,
    setIsTikTok,
    modifiedSetorBarang,
    whichSupplier,
  } = useIncomeAllocation();
  const navigate = useNavigate();
  const {
    fetchWithdrawals,
    ATWithdrawals,
    setATWithdrawals,
    ATBills,
    ATSetor,
    setSetorAT,
    ATProfit,
    setATProfit,
    fetchAT,
    ATInitialFetch,
  } = useWithdrawalRecords();
  const { supplier } = useCRUD();

  // State
  const [loadingSave, setLoadingSave] = useState(false);

  // Bill Temporary
  const [addBill, setAddBill] = useState(false);
  const [billName, setBillName] = useState("");
  const [billPrice, setBillPrice] = useState("");

  // Other
  const [alreadyCalculated, setAlreadyCalculated] = useState(false);
  const [work, setWork] = useState(day === 0 ? false : true);
  const [workingTime, setWorkingTime] = useState("Full Day");
  const [simpleMode, setSimpleMode] = useState(true);
  const choosedSupplier = supplier.find((s) => s.id === whichSupplier);

  // Time
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const now = new Date();
  const getCurrentTime = () => {
    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  const [time, setTime] = useState(getCurrentTime());
  const [date, setDate] = useState(now);

  // Start
  const [grossProfit, setGrossProfit] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  // Variables
  const [uangAdeSiska, setUangAdeSiska] = useState(0);
  const [uangEmaIki, setUangEmaIki] = useState(0);
  const [uangCapital, setUangCapital] = useState(0);
  const [uangDanaDarurat, setUangDanaDarurat] = useState(0);
  const [uangKeinginan, setUangKeinginan] = useState(0);
  const [uangInvestasi, setUangInvestasi] = useState(0);
  const [uangUntukSedekah, setUangUntukSedekah] = useState(0);

  // Function
  const calculateNow = (e) => {
    e.preventDefault();

    // hitung gaji harian
    let dailyWageTemp = 0;
    if (work) {
      if (workingTime === "Full Day") {
        dailyWageTemp = fullDayWage;
        setDailyWage(fullDayWage);
      } else {
        dailyWageTemp = halfDayWage;
        setDailyWage(halfDayWage);
      }
    } else {
      dailyWageTemp = 0;
      setDailyWage(0);
    }

    // Komisi Kotor
    const getGrossProfit = raw(totalWithdraw) - raw(totalHPP);
    setGrossProfit(getGrossProfit);

    // Hitung Total Tagihan Lainnya
    const totalOtherBills = bills.reduce((acc, cur) => {
      return acc + raw(cur.billPrice);
    }, 0);
    setTotalBill(totalOtherBills);

    // Hitung Total Untuk Ade Siska
    let untukAdeSiska = 0;
    if (isTikTok) {
      untukAdeSiska = raw(totalHPP) - totalOtherBills;
    } else {
      untukAdeSiska =
        raw(totalWithdraw) -
        (splitBillEmaIki.uko + getGrossProfit) -
        totalOtherBills;
    }
    if (work) {
      setUangAdeSiska(untukAdeSiska - dailyWageTemp);
    } else {
      setUangAdeSiska(untukAdeSiska);
    }

    // Hitung Uang Untuk Ma Iki Dari Komisi Kotor
    const moneyForEmaIki = splitBillEmaIki.uko + splitBillEmaIki.adi;
    setUangEmaIki(moneyForEmaIki);

    // Hitung Sedekah
    const almostNetProfit = getGrossProfit - splitBillEmaIki.adi;
    const uangSedekah = Math.round((metode.sedekah / 100) * almostNetProfit);
    setUangUntukSedekah(uangSedekah);

    // Total Komisi Bersih
    const totalNetProfit = getGrossProfit - (splitBillEmaIki.adi + uangSedekah);
    setNetProfit(totalNetProfit);

    // Pembagian Ke Rekening Yang Berbeda
    const allocation = {
      uangCapital: Math.round(metode.capital / 100) * totalNetProfit,
      uangDanaDarurat: Math.round((metode.danaDarurat / 100) * totalNetProfit),
      uangKeinginan: Math.round((metode.keinginan / 100) * totalNetProfit),
      uangInvestasi: Math.round((metode.investasi / 100) * totalNetProfit),
    };

    // Hitung uang sisa allocation
    const totalAllocation =
      allocation.uangCapital +
      allocation.uangDanaDarurat +
      allocation.uangKeinginan +
      allocation.uangInvestasi;
    const sisaPembagian = totalNetProfit - totalAllocation;

    setUangCapital(allocation.uangCapital + sisaPembagian);
    setUangDanaDarurat(allocation.uangDanaDarurat);
    setUangKeinginan(allocation.uangKeinginan);
    setUangInvestasi(allocation.uangInvestasi);

    // Render
    setAlreadyCalculated(true);
  };

  const saveToFirebase = async () => {
    const tiktokCollectionName = "penghasilanJualanOnlineTikTok";
    const shopeeCollectionName = "penghasilanJualanOnlineShopee";
    const platform = isTikTok ? "tiktok" : "shopee";
    const lastSaveShopee = "shopeeLastSave";
    const lastSaveTiktok = "tiktokLastSave";

    const saveNow = async () => {
      const areYouSure = confirm(
        "Apakah Anda Yakin Menyimpan Dokumen Ke Firebase ?",
      );

      setLoadingSave(true);

      if (areYouSure) {
        const updateTiktokDoc = async () => {
          // Data Penghasilan TikTok Yang Akan Di Simpan
          const tiktokWithdrawal = {
            totalWithdraw: raw(totalWithdraw),
            supplier: toCamelCase(choosedSupplier.name),
            totalHPP: {
              total: raw(totalHPP),
              soldProducts: modifiedSetorBarang.filter(
                (produk) => produk.setor > 0,
              ),
            },
            bill: {
              billList: bills,
              totalBill,
            },
            profit: {
              total: grossProfit,
            },
            totalSetor: uangAdeSiska,
          };

          await createDocument(
            "saveNotePenghasilanTikTok",
            tiktokCollectionName,
            tiktokWithdrawal,
            "Berhasil Menyimpan Note Penghasilan",
            true,
            combineDateTimeToMs(date, time),
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
            ATWithdrawals: ATWithdrawals.tiktok + raw(totalWithdraw),
            ATBills: ATBills.tiktok + totalBill,
            ATSetor: ATSetor.tiktok + uangAdeSiska,
            ATProfit: ATProfit.tiktok + grossProfit,
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
          // Data Penghasilan Shopee Yang Akan Di Simpan
          const shopeeWithdrawal = {
            totalWithdraw: raw(totalWithdraw),
            supplier: toCamelCase(choosedSupplier.name),
            totalHPP: {
              total: raw(totalHPP),
              soldProducts: modifiedSetorBarang.filter(
                (produk) => produk.setor > 0,
              ),
            },
            bill: {
              billList: bills,
              totalBill,
            },
            totalSetor: uangAdeSiska,
            uangEmaIki,
            profit: {
              total: grossProfit,
              netProfit,
              capital: uangCapital,
              danaDarurat: uangDanaDarurat,
              uangKeinginan: uangKeinginan,
              uangInvestasi: uangInvestasi,
              sedekah: uangUntukSedekah,
            },
            splitBillEmaIki: splitBillEmaIki,
            gajiAdi: dailyWage,
          };
          await createDocument(
            "saveNotePenghasilanShopee",
            "penghasilanJualanOnlineShopee",
            shopeeWithdrawal,
            "Berhasil Menyimpan Note Penghasilan",
            true,
            combineDateTimeToMs(date, time),
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
            ATWithdrawals: ATWithdrawals.shopee + raw(totalWithdraw),
            ATBills: ATBills.shopee + totalBill,
            ATSetor: ATSetor.shopee + uangAdeSiska,
            ATProfit: ATProfit.shopee + grossProfit,
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
        setATWithdrawals((prev) => ({
          ...prev,
          [platform]: prev[platform] + raw(totalWithdraw),
        }));
        ATBills((prev) => ({
          ...prev,
          [platform]: prev[platform] + totalBill,
        }));
        setSetorAT((prev) => ({
          ...prev,
          [platform]: prev[platform] + uangAdeSiska,
        }));
        setATProfit((prev) => ({
          ...prev,
          [platform]: prev[platform] + grossProfit,
        }));

        fetchWithdrawals(platform, 7);
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

    const cekIfBillNameExist = bills.some(
      (bill) => bill.identifier === toCamelCase(billName),
    );

    if (cekIfBillNameExist) {
      alert("Maaf Tagihan Sudah Ada, Beri Nama Lain");
      setBillName("");
    } else {
      const newBill = {
        identifier: toCamelCase(billName),
        billName,
        billPrice,
      };

      setBills((prevBills) => [...prevBills, newBill]);

      setBillName("");
      setBillPrice("");
      setAddBill(false);
      setAlreadyCalculated(false);
    }
  };

  useEffect(() => {
    if (isTikTok) {
      setDailyWage(0);
      setWork(false);
      console.log("mode tiktok aktif, kini gaji jadi 0");
    }
  }, [isTikTok]);

  useEffect(() => {
    if (!whichSupplier) {
      navigate("/incomeAllocation");
    }

    if (ATInitialFetch) {
      fetchAT();
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col py-3">
      <LoadingOverlay show={loadingSave} text="Loading . . ." />
      <form
        className="border-slate-400 rounded-md w-max mx-auto mt-3 max-w-[800px]"
        onSubmit={calculateNow}
        id="incomeAllocation"
      >
        <Card className="min-w-[380px]">
          <CardHeader>
            <CardTitle>Alokasi Pemasukan</CardTitle>

            <Dialog open={addBill} onOpenChange={setAddBill}>
              <DialogTrigger>
                {/* Tombol Tambahkan Tagihan Lainnya */}
                <CardAction>
                  <div
                    className="border px-2 py-[2px] text-[12px] rounded-sm bg-gray-900 text-white"
                    onClick={() => {
                      setAddBill(!addBill);
                    }}
                  >
                    + Bill
                  </div>
                </CardAction>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Tagihan Lainnya</DialogTitle>
                </DialogHeader>
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
                        value={billPrice}
                        type="text"
                        required
                        onChange={(e) => {
                          const number = validateNumber(e);
                          if (!number) {
                            setBillPrice("");
                          } else {
                            setBillPrice(formatNumber(number));
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
                  setAlreadyCalculated(false);
                }}
              />
            </div>

            {/* Tombol On Off Kerja */}
            {!isTikTok && (
              <div className="flex items-center justify-between input-components">
                <span>Kerja Hari Ini</span>
                <Switch
                  checked={work}
                  onCheckedChange={() => {
                    setWork(!work);
                    setAlreadyCalculated(false);
                  }}
                />
              </div>
            )}

            {/* Berapa Lama Kerja  */}
            {work && !isTikTok ? (
              <div className="flex items-center justify-between input-components">
                <span>Berapa Lama Kerja :</span>
                <Select
                  value={workingTime}
                  onValueChange={(e) => {
                    setWorkingTime(e);
                    setAlreadyCalculated(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Berapa Lama ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Full Day">Satu Hari Full</SelectItem>
                      <SelectItem value="Half Day">Setengah Hari</SelectItem>
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
              <FieldGroup className="mx-auto max-w-xs flex-row">
                {/* Date Picker */}
                <Field>
                  <FieldLabel htmlFor="date-picker">Hari</FieldLabel>
                  <Popover
                    open={datePickerOpen}
                    onOpenChange={setDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-32 justify-between font-normal border border-gray-500"
                      >
                        {date ? format(date, "PPP") : "Hari Apa ?"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        defaultMonth={date}
                        onSelect={(date) => {
                          setDate(date);
                          setDatePickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>

                {/* Time Picker */}
                <Field className="w-32">
                  <FieldLabel htmlFor="time-picker">Jam</FieldLabel>
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                {/* Total Withdraw */}
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
                    value={totalWithdraw}
                    onChange={(e) => {
                      setAlreadyCalculated(false);
                      const number = validateNumber(e);
                      if (!number) {
                        setTotalWithdraw("");
                      } else {
                        setTotalWithdraw(formatNumber(number));
                      }
                    }}
                  />
                </Field>

                {/* Total HPP */}
                <Field>
                  <FieldLabel htmlFor="totalHPP">
                    Total Penghasilan HPP
                  </FieldLabel>
                  <Input
                    id="totalHPP"
                    autoComplete="off"
                    type="text"
                    required
                    placeholder="0"
                    value={totalHPP}
                    disabled
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Tagihan Lainnya */}
            {bills.length > 0 && (
              <div className="input-components border rounded-md">
                <FieldSet>
                  <FieldLegend>List Tagihan</FieldLegend>
                  <FieldGroup>
                    {bills.map((bill, index) => (
                      <Field>
                        <FieldLabel>{bill.billName}</FieldLabel>
                        <div className="flex gap-x-1">
                          <Input
                            value={bill.billPrice}
                            placeholder="0"
                            onChange={(e) => {
                              setAlreadyCalculated(false);
                              setBills((prev) => {
                                const newBill = [...prev];
                                newBill[index] = {
                                  ...newBill[index],
                                  billPrice: e.target.value,
                                };
                                return newBill;
                              });
                            }}
                          />
                          <Button
                            className="bi bi-trash"
                            onClick={() => {
                              setAlreadyCalculated(false);
                              setBills((prev) => {
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
                  navigate("/incomeAllocation/calculateHPP");
                }}
              >
                Kembali
              </Button>

              {/* Hitung Sekarang */}
              <Button
                type="submit"
                className="bg-green-700"
                form="incomeAllocation"
              >
                Hitung
              </Button>

              {/* Simpan Ke Firebase*/}
              {alreadyCalculated && (
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
      {alreadyCalculated && !isTikTok ? (
        <div className="flex flex-col max-w-[700px]">
          <div className="border border-gray-200 rounded-md p-4 mt-4 flex flex-col gap-y-4 mx-2">
            <div>
              {/* Judul */}
              <b className="text-lg">Ringkasan</b>
              <p>
                Total Penghasilan Dari Shopee :{" "}
                <b>{formatNumber(totalWithdraw)}</b>
              </p>
              <p>
                Total Penghasilan HPP : <b>{formatNumber(totalHPP)}</b>
              </p>
              {totalBill > 0 && (
                <p>
                  Tagihan Lainnya : <b>{formatNumber(totalBill)}</b>{" "}
                  {!simpleMode && (
                    <WordInBracket
                      kalimat={bills.map((bill) => bill.billName).join(", ")}
                    />
                  )}
                </p>
              )}
              <p>
                Komisi Kotor : <b>{formatNumber(grossProfit)}</b>
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
                    ${work ? "- Gaji Per Hari" : ""} ${
                      totalBill > 0 ? "- Total Tagihan Lainnya" : ""
                    }`}
                  />
                )}
              </p>
              <p>
                Uang Untuk Ema Iki : <b>{formatNumber(uangEmaIki)}</b>
                {!simpleMode && (
                  <WordInBracket
                    kalimat={`Uko ${formatNumber(
                      splitBillEmaIki.uko,
                    )} + Adi ${formatNumber(splitBillEmaIki.adi)}`}
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
                      {formatNumber(grossProfit - splitBillEmaIki.adi)}
                    </span>
                    <span>)</span>
                  </span>
                )}
              </p>
              <p>
                Komisi Bersih : <b>{formatNumber(netProfit)}</b>
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
                        work ? " + Gaji Perhari" : ""
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
                        splitBillEmaIki.adi +
                        splitBillEmaIki.uko +
                        (work ? dailyWage : 0),
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
                              grossProfit - splitBillEmaIki.adi,
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
                              grossProfit - splitBillEmaIki.adi,
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
                              grossProfit - splitBillEmaIki.adi,
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
                              grossProfit - splitBillEmaIki.adi,
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
                              grossProfit - splitBillEmaIki.adi,
                            )}`}
                          />
                        )}
                      </li>
                      {work && (
                        <li>
                          Catat Pemasukan Uang Capital
                          <WordInBracket kalimat={"Gaji"} />
                          Sebesar <b>{formatNumber(dailyWage)}</b>
                        </li>
                      )}
                      <li>
                        Edit Rekening Ema Iki Dengan Menambahkan Nominal Sebesar{" "}
                        <b>
                          {formatNumber(
                            splitBillEmaIki.uko + splitBillEmaIki.adi,
                          )}
                        </b>
                      </li>
                      {totalBill > 0 && (
                        <li>
                          Ada Uang Tagihan Lainnya Sebesar{" "}
                          <b>{formatNumber(totalBill)}</b>
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
                        {work && (
                          <li>
                            <span>
                              Rekening Capital
                              <WordInBracket kalimat={"Gaji"} />
                            </span>
                            <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                            <b>{formatNumber(dailyWage)}</b>
                          </li>
                        )}
                        <li>
                          <span>Edit Rekening Ema Iki</span>
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>
                            {formatNumber(
                              splitBillEmaIki.uko + splitBillEmaIki.adi,
                            )}
                          </b>
                        </li>
                        {totalBill > 0 && (
                          <li>
                            <span>
                              Ada Uang Tagihan Lainnya Sebesar{" "}
                              <b>{formatNumber(totalBill)}</b>
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
                  <b>{formatNumber(netProfit)}</b>
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
                    UKO : <b>{formatNumber(splitBillEmaIki.uko)}</b>
                  </li>
                  <li>
                    ADI : <b>{formatNumber(splitBillEmaIki.adi)}</b>
                  </li>
                </ol>
                <span>
                  {workingTime === "Full Day" && (
                    <span>
                      Gaji Full Hari : <b>{formatNumber(fullDayWage)}</b>
                    </span>
                  )}
                  {workingTime === "Half Day" && (
                    <span>
                      Gaji Setengah Hari : <b>{formatNumber(halfDayWage)}</b>
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
      {alreadyCalculated && isTikTok ? (
        <div className="flex flex-col max-w-[700px]">
          <div className="border border-gray-400 rounded-md p-4 mt-4 flex flex-col gap-y-4 mx-2">
            <div>
              {/* Judul */}
              <b className="text-lg">Ringkasan</b>
              <p>
                Total Penghasilan Dari TikTok :{" "}
                <b>{formatNumber(totalWithdraw)}</b>
              </p>
              <p>
                Total Penghasilan HPP : <b>{formatNumber(totalHPP)}</b>
              </p>
              {totalBill > 0 && (
                <p>
                  Tagihan Lainnya : <b>{formatNumber(totalBill)}</b>{" "}
                  {!simpleMode && (
                    <WordInBracket
                      kalimat={bills.map((bill) => bill.billName).join(", ")}
                    />
                  )}
                </p>
              )}
              <p>
                Setor Untuk Ade Siska :{" "}
                <b>{formatNumber(raw(totalHPP) - totalBill)}</b>
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
                      <b>{formatNumber(raw(totalHPP) - totalBill)}</b>
                    </div>
                  ) : (
                    // Ribet Mode
                    <div>
                      Transfer Uang Ke <b>SeaBank Ade Siska</b> Sebesar{" "}
                      <b>{formatNumber(raw(totalHPP) - totalBill)}</b>
                    </div>
                  )}
                </li>

                {/* Transfer Uang Ke Seabank Adi Permadi*/}
                <li>
                  {simpleMode ? "Transfer" : "Transfer Uang"} Ke{" "}
                  <b>SeaBank Adi Permadi</b> Sebesar{" "}
                  <b>{formatNumber(grossProfit)}</b>
                </li>

                {/* Catat Pemasukan Ke Dana Darurat */}
                <div className="mb-6">
                  {!simpleMode && (
                    <>
                      <li>
                        Catat Pemasukan Uang Capital Sebesar{" "}
                        <b>{formatNumber(grossProfit)}</b>
                      </li>
                      {totalBill > 0 && (
                        <li>
                          Ada Uang Tagihan Lainnya Sebesar{" "}
                          <b>{formatNumber(totalBill)}</b>
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
                            <b>{formatNumber(grossProfit)}</b>
                          </li>
                          {totalBill > 0 && (
                            <li>
                              <span>
                                Ada Uang Tagihan Lainnya Sebesar{" "}
                                <b>{formatNumber(totalBill)}</b>
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
                        <b>{formatNumber(grossProfit)}</b>
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
