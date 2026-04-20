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
import { collectionName } from "@/services/firebase/firebase";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingOverlay from "../../components/LoadingOverlay";
import WordInBracket from "../../components/WordInBracket";
import { useIncomeAllocation } from "../../context/IncomeAllocationContext";
import { useWithdrawalRecords } from "../../context/WithdrawalRecordsContext";
import {
  config,
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
  capitalizeWords,
  combineDateTimeToMs,
  formatNumber,
  raw,
  separateNumber,
  toCamelCase,
} from "../../utils/generalFunction";
import { useMemo } from "react";

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
    shopeeHasSaveToFirebase,
    setShopeeHasSaveToFirebase,
    tiktokHasSaveToFirebase,
    setTiktokHasSaveToFirebase,
  } = useIncomeAllocation();
  const navigate = useNavigate();
  const {
    fetchWithdrawals,
    ATWithdrawals,
    setATWithdrawals,
    ATBills,
    setATBills,
    ATSetor,
    setATSetor,
    ATProfit,
    setATProfit,
    fetchAT,
    ATInitialFetch,
  } = useWithdrawalRecords();
  const { supplier, setSupplier } = useCRUD();

  // State
  const [loadingSave, setLoadingSave] = useState(false);

  // Bill Temporary
  const [dialogBill, setDialogBill] = useState({
    open: false,
    title: "",
    purpose: "",
    billName: "",
    billPrice: "",
    editedBillIndex: 0,
    nextActionName: "",
  });

  // Other
  const [alreadyCalculated, setAlreadyCalculated] = useState(false);
  const [work, setWork] = useState(day === 0 ? false : true);
  const [workingTime, setWorkingTime] = useState("Full Day");
  const [simpleMode, setSimpleMode] = useState(true);
  const choosedSupplier = useMemo(() => {
    return supplier.find((s) => s.id === whichSupplier);
  }, [supplier, whichSupplier]);
  const lastSave = {
    shopee: "shopeeLastSave",
    tiktok: "tiktokLastSave",
  };
  const [confirmSave, setConfirmSave] = useState(false);

  // Time
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const now = new Date();
  const getCurrentTime = () => {
    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  const [time, setTime] = useState(getCurrentTime());
  const [date, setDate] = useState(now);

  // Profit
  const [grossProfit, setGrossProfit] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  // Variables
  const [uangAdeSiska, setUangAdeSiska] = useState(0);
  const [uangEmaIki, setUangEmaIki] = useState(0);
  const [uangSaya, setUangSaya] = useState(0);
  const [uangDanaDarurat, setUangDanaDarurat] = useState(0);
  const [uangKeinginan, setUangKeinginan] = useState(0);
  const [uangModal, setUangModal] = useState(0);
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
      uangSaya: Math.round(metode.uangSaya / 100) * totalNetProfit,
      uangDanaDarurat: Math.round((metode.danaDarurat / 100) * totalNetProfit),
      uangKeinginan: Math.round((metode.keinginan / 100) * totalNetProfit),
      uangModal: Math.round((metode.modal / 100) * totalNetProfit),
    };

    // Hitung uang sisa allocation
    const totalAllocation =
      allocation.uangSaya +
      allocation.uangDanaDarurat +
      allocation.uangKeinginan +
      allocation.uangModal;
    const sisaPembagian = totalNetProfit - totalAllocation;

    setUangSaya(allocation.uangSaya + sisaPembagian);
    setUangDanaDarurat(allocation.uangDanaDarurat);
    setUangKeinginan(allocation.uangKeinginan);
    setUangModal(allocation.uangModal);

    // Render
    setAlreadyCalculated(true);
  };

  const syncLastSave = async () => {
    setLoadingSave(true);
    if (config.syncLastSave) {
      if (isTikTok) {
        const tiktokLastSave = await getDocument(
          "Ambil Last Save TikTok",
          collectionName.withdrawals.tiktok,
          lastSave.tiktok,
        );

        if (tiktokLastSave.data.time === today) {
          toast.error(
            "Kamu Sudah Menyimpan Dokument Penarikan TikTok Hari Ini, Kembali Lah Besok",
          );
        } else {
          setLoadingSave(false);
          setConfirmSave(true);
        }
      } else {
        const shopeeLastSave = await getDocument(
          "Ambil Last Save Shopee",
          collectionName.withdrawals.shopee,
          lastSave.shopee,
        );

        if (shopeeLastSave.data.time === today) {
          toast.error(
            "Kamu Sudah Menyimpan Withdraw Shopee Hari Ini, Kembali Lah Besok",
          );
        } else {
          setLoadingSave(false);
          setConfirmSave(true);
        }
      }
    } else {
      setLoadingSave(false);
      setConfirmSave(true);
    }
  };

  const saveToFirebase = async () => {
    setLoadingSave(true);

    const soldProducts = modifiedSetorBarang
      .map((p) => {
        delete p.remaining;
        return {
          ...p,
          sold: Number(p.sold),
        };
      })
      .filter((p) => p.sold > 0);

    const updateDocNow = async (platform, withdrawal) => {
      // Simpan Note Withdrawal
      await createDocument(
        `Save Nota Penghasilan ${capitalizeWords(platform)}`,
        collectionName.withdrawals[platform],
        withdrawal,
        `Berhasil Menyimpan Note Penghasilan ${capitalizeWords(platform)}`,
        true,
        combineDateTimeToMs(date, time),
      );

      // Update Last Save
      await updateDocument(
        `Update Last ${capitalizeWords(platform)}`,
        collectionName.withdrawals[platform],
        lastSave[platform],
        { time: today },
        `Berhasil Update ${capitalizeWords(platform)} Last Save`,
      );
      localStorage.setItem(lastSave[platform], today);

      // Update All Time
      const allTimeDoc = {
        ATWithdrawals: ATWithdrawals[platform] + raw(totalWithdraw),
        ATBills: ATBills[platform] + totalBill,
        ATSetor: ATSetor[platform] + uangAdeSiska,
        ATProfit: ATProfit[platform] + grossProfit,
      };
      await updateDocument(
        "Update All Time Document",
        collectionName.allTime,
        collectionName.allTimeDocId,
        {
          [platform]: allTimeDoc,
        },
        `Berhasil Mengupdate Document All Time ${capitalizeWords(platform)}`,
      );

      // Optimistic Update
      setATWithdrawals((prev) => ({
        ...prev,
        [platform]: prev[platform] + raw(totalWithdraw),
      }));
      setATBills((prev) => ({
        ...prev,
        [platform]: prev[platform] + totalBill,
      }));
      setATSetor((prev) => ({
        ...prev,
        [platform]: prev[platform] + uangAdeSiska,
      }));
      setATProfit((prev) => ({
        ...prev,
        [platform]: prev[platform] + grossProfit,
      }));

      fetchWithdrawals(platform, 7);
      setLoadingSave(false);
      if (isTikTok) {
        if (config.syncLastSave) {
          setTiktokHasSaveToFirebase(true);
        }
      } else {
        if (config.syncLastSave) {
          setShopeeHasSaveToFirebase(true);
        }
      }

      // Update Product Debt
      if (config.updateProductDebt) {
        const productDebt = choosedSupplier.productDebt;

        const payDebt = productDebt.map((debt) => {
          let tempDebt = debt;
          soldProducts.forEach((product) => {
            if (product.identifier === debt.identifier) {
              tempDebt = {
                ...debt,
                remaining: debt.remaining - product.sold,
              };
            }
          });

          return tempDebt;
        });

        await updateDocument(
          `Update Hutang Barang Ke ${capitalizeWords(choosedSupplier.name)} `,
          collectionName.supplier,
          choosedSupplier.id,
          { ...choosedSupplier, productDebt: payDebt },
          `Berhasil Update Catatan Hutang Barang Dari Supplier ${capitalizeWords(choosedSupplier.name)}`,
        );

        setSupplier((prev) => {
          return prev.map((supp) => {
            if (supp.id === whichSupplier) {
              return { ...supp, productDebt: payDebt };
            } else {
              return supp;
            }
          });
        });
      }
    };

    const updateTiktokDoc = async () => {
      // Data Penghasilan TikTok Yang Akan Di Simpan
      const tiktokWithdrawal = {
        totalWithdraw: raw(totalWithdraw),
        supplier: toCamelCase(choosedSupplier.name),
        totalHPP: {
          total: raw(totalHPP),
          soldProducts,
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
      await updateDocNow("tiktok", tiktokWithdrawal);
    };

    const updateShopeeDoc = async () => {
      // Data Penghasilan Shopee Yang Akan Di Simpan
      const shopeeWithdrawal = {
        totalWithdraw: raw(totalWithdraw),
        supplier: toCamelCase(choosedSupplier.name),
        totalHPP: {
          total: raw(totalHPP),
          soldProducts,
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
          uangSaya: uangSaya,
          danaDarurat: uangDanaDarurat,
          uangKeinginan: uangKeinginan,
          modal: uangModal,
          sedekah: uangUntukSedekah,
        },
        splitBillEmaIki: splitBillEmaIki,
        gajiAdi: dailyWage,
      };
      await updateDocNow("shopee", shopeeWithdrawal);
    };

    if (isTikTok) {
      await updateTiktokDoc();
    } else {
      await updateShopeeDoc();
    }

    toast.success("Berhasil Menyimpan Penarikan Dana");

    setLoadingSave(false);
  };

  const handleChangeBill = (e) => {
    e.preventDefault();
    const cekIfBillNameExist = bills.some(
      (bill) => bill.identifier === toCamelCase(dialogBill.billName),
    );

    if (cekIfBillNameExist) {
      toast.error("Nama Tagihan Sudah Ada, Beri Nama Lain");
    } else {
      const newBill = {
        identifier: toCamelCase(dialogBill.billName),
        billName: dialogBill.billName,
        billPrice: dialogBill.billPrice,
      };

      if (dialogBill.purpose === "addBill") {
        setBills((prevBills) => [...prevBills, newBill]);
      }
      if (dialogBill.purpose === "editBill") {
        setBills((prevBills) => {
          return prevBills.map((b, i) => {
            if (dialogBill.editedBillIndex === i) {
              return newBill;
            } else {
              return b;
            }
          });
        });
      }

      setDialogBill((prev) => ({
        ...prev,
        purpose: "",
        title: "",
        open: false,
        billName: "",
        billPrice: "",
      }));
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
    <div className="flex justify-center items-center flex-col">
      {/* Navigation */}
      <Button
        variant={"outline"}
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </Button>

      {/* Confirm Save to Firebase */}
      <AlertDialog open={confirmSave} onOpenChange={setConfirmSave}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
            <AlertDialogDescription>
              Kamu Akan Menyimpan Data Penarikan{" "}
              {isTikTok ? "TikTok" : "Shopee"} Hari Ini
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={saveToFirebase}>
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Bill */}
      <Dialog
        open={dialogBill.open}
        onOpenChange={(v) => setDialogBill((prev) => ({ ...prev, open: v }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogBill.title}</DialogTitle>
          </DialogHeader>
          <FieldSet>
            <form onSubmit={handleChangeBill}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Nama Tagihan</FieldLabel>
                  <Input
                    value={dialogBill.billName}
                    required
                    onChange={(e) => {
                      setDialogBill((prev) => ({
                        ...prev,
                        billName: e.target.value,
                      }));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel>Total Tagihan</FieldLabel>
                  <Input
                    value={dialogBill.billPrice}
                    type="text"
                    required
                    onChange={(e) => {
                      const value = separateNumber(e);
                      setDialogBill((prev) => ({ ...prev, billPrice: value }));
                    }}
                  />
                </Field>
                <Field>
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      onClick={() => {
                        setDialogBill((prev) => ({
                          ...prev,
                          open: false,
                          billName: "",
                          billPrice: "",
                        }));
                      }}
                    >
                      Batal
                    </Button>
                    <Button type="submit" className="bg-sky-700">
                      {dialogBill.nextActionName}
                    </Button>
                  </div>
                </Field>
              </FieldGroup>
            </form>
          </FieldSet>
        </DialogContent>
      </Dialog>

      {/* Loading */}
      <LoadingOverlay show={loadingSave} text="Loading . . ." />

      <form
        className="border-slate-400 rounded-md w-max mx-auto mt-3 max-w-[800px]"
        onSubmit={calculateNow}
        id="incomeAllocation"
      >
        <Card className="min-w-[380px]">
          <CardHeader>
            <CardTitle>Alokasi Pemasukan</CardTitle>
            <CardAction>
              <button
                type="button"
                className="border px-2 py-[2px] text-[12px] rounded-sm bg-gray-900 text-white"
                onClick={() => {
                  setDialogBill((prev) => ({
                    ...prev,
                    open: true,
                    title: "Tambah Tagihan Lainnya",
                    purpose: "addBill",
                    nextActionName: "Tambahkan",
                  }));
                }}
              >
                + Bill
              </button>
            </CardAction>
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
                      const value = separateNumber(e);
                      setTotalWithdraw(value);
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
                              const value = separateNumber(e);
                              setBills((prev) => {
                                const newBill = [...prev];
                                newBill[index] = {
                                  ...newBill[index],
                                  billPrice: value,
                                };
                                return newBill;
                              });
                            }}
                          />
                          <Button
                            type="button"
                            className="bi bi-pencil bg-green-800 hover:bg-green-700"
                            onClick={() => {
                              setDialogBill({
                                open: true,
                                purpose: "editBill",
                                title: "Edit Bill",
                                billName: bill.billName,
                                billPrice: bill.billPrice,
                                editedBillIndex: index,
                                nextActionName: "Simpan",
                              });
                            }}
                          />
                          <Button
                            type="button"
                            className="bi bi-trash bg-red-800 hover:bg-red-700"
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
                  onClick={syncLastSave}
                  className="bg-sky-700 cursor-d"
                  disabled={
                    isTikTok
                      ? tiktokHasSaveToFirebase
                        ? true
                        : false
                      : shopeeHasSaveToFirebase
                        ? true
                        : false
                  }
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

                {/* Transfer Uang Saya + Dana Darurat + Keinginan + Modal + Sedekah + Ema Iki*/}
                <li>
                  {simpleMode ? "Transfer" : "Transfer Uang"}{" "}
                  {!simpleMode && (
                    <WordInBracket
                      kalimat={`Uang Saya + Dana Darurat + Keinginan + Modal + Sedekah + Uang Ema Iki ${
                        work ? " + Gaji Perhari" : ""
                      }`}
                    />
                  )}{" "}
                  Ke <b>SeaBank Adi Permadi</b> Sebesar{" "}
                  <b>
                    {formatNumber(
                      uangSaya +
                        uangDanaDarurat +
                        uangModal +
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
                        Catat Pemasukan Uang Saya Sebesar{" "}
                        <b>{formatNumber(uangSaya)}</b>
                        {!simpleMode && (
                          <WordInBracket
                            kalimat={`${metode.uangSaya}% x ${formatNumber(
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
                        Catat Pemasukan Uang Modal Sebesar{" "}
                        <b>{formatNumber(uangModal)}</b>
                        {!simpleMode && (
                          <WordInBracket
                            kalimat={`${metode.modal}% x ${formatNumber(
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
                          Catat Pemasukan Uang Saya
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
                          <span>Rekening Uang Saya</span>{" "}
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>{formatNumber(uangSaya)}</b>
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
                          <span>Rekening Modal</span>
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>{formatNumber(uangModal)}</b>
                        </li>
                        <li>
                          <span>Rekening Sedekah</span>
                          <div className="bg-slate-900 flex-auto h-[2px] mx-1"></div>
                          <b>{formatNumber(uangUntukSedekah)}</b>
                        </li>
                        {work && (
                          <li>
                            <span>
                              Rekening Uang Saya
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
                {work && (
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
                )}
                <span>Metode Pembagian</span>
                <ol className="list-inside px-2">
                  <li>
                    Uang Saya : <b>{metode.uangSaya}%</b>
                  </li>
                  <li>
                    Dana Darurat : <b>{metode.danaDarurat}%</b>
                  </li>
                  <li>
                    Uang Keinginan : <b>{metode.keinginan}%</b>
                  </li>
                  <li>
                    Modal : <b>{metode.modal}%</b>
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
                        Catat Pemasukan Uang Saya Sebesar{" "}
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
                            <span>Rekening Uang Saya</span>{" "}
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
