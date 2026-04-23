import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import MonthPicker from "@/components/ui/month-picker";
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
import { formatNumber } from "@/utils/generalFunction";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useWithdrawalRecords } from "../../context/WithdrawalRecordsContext";
import { useUI } from "@/context/UIContext";

export default function FilterList({ platform }) {
  const {
    fetchWithdrawals,
    sortByLimitUnderSeven,
    fetchWithdrawalsByDate,
    fetchWithdrawalsByMonth,
    shopeeWithdrawals,
    tiktokWithdrawals,
  } = useWithdrawalRecords();
  const { loading } = useUI();

  const [setor, setSetor] = useState({
    shopee: 0,
    tiktok: 0,
  });
  const [profit, setProfit] = useState({
    shopee: 0,
    tiktok: 0,
  });
  const [withdrawals, setWithdrawals] = useState({
    shopee: 0,
    tiktok: 0,
  });
  const [bills, setBills] = useState({
    shopee: 0,
    tiktok: 0,
  });

  const [customShow, setCustomShow] = useState(false);
  const [customList, setCustomList] = useState("default");
  const [limitOffPage, setLimitOffPage] = useState("");
  const [pickMonth, setPickMonth] = useState("");
  const now = new Date();
  const [date, setDate] = useState({
    from: new Date(now.getFullYear(), now.getMonth(), now.getDay()),
    to: "",
  });
  const [datePicker, setDatePicker] = useState(false);

  const handleShowByLastDay = async (e) => {
    e.preventDefault();
    if (limitOffPage <= 7) {
      sortByLimitUnderSeven(platform, Number(limitOffPage));
    } else {
      await fetchWithdrawals(platform, Number(limitOffPage));
    }
  };

  const handleShowByDate = async (e) => {
    e.preventDefault();
    await fetchWithdrawalsByDate(platform, date.from, date.to);
  };

  const handleShowByMonth = async (e) => {
    e.preventDefault();
    const [year, month] = [pickMonth.getFullYear(), pickMonth.getMonth()];
    await fetchWithdrawalsByMonth(platform, year, month);
  };

  useEffect(() => {
    if (customList === "default") {
      sortByLimitUnderSeven(platform, 7);
      setLimitOffPage("");
    }
  }, [customList]);

  useEffect(() => {
    const letMeCount = (arr, type) => {
      const keyMap = {
        withdraw: (item) => item.totalWithdraw,
        setor: (item) => item.totalSetor,
        profit: (item) => item.profit?.total,
        bill: (item) => item.bill?.totalBill || 0,
      };

      const getter = keyMap[type];
      if (!getter) return 0;

      return arr.reduce((acc, curr) => acc + getter(curr), 0);
    };

    const sW = letMeCount(shopeeWithdrawals, "withdraw");
    const sS = letMeCount(shopeeWithdrawals, "setor");
    const sP = letMeCount(shopeeWithdrawals, "profit");
    const sB = letMeCount(shopeeWithdrawals, "bill");
    const tW = letMeCount(tiktokWithdrawals, "withdraw");
    const tS = letMeCount(tiktokWithdrawals, "setor");
    const tP = letMeCount(tiktokWithdrawals, "profit");
    const tB = letMeCount(tiktokWithdrawals, "bill");
    setSetor({ tiktok: tS, shopee: sS });
    setProfit({ tiktok: tP, shopee: sP });
    setWithdrawals({ shopee: sW, tiktok: tW });
    setBills({ shopee: sB, tiktok: tB });
  }, [shopeeWithdrawals, tiktokWithdrawals]);

  return (
    <div className="max-w-[400px]">
      {shopeeWithdrawals.length > 0 || tiktokWithdrawals.length > 0 ? (
        <div className="py-2">
          <p className="font-bold text-md">
            Total Penghasilan : {formatNumber(withdrawals[platform])}
          </p>
          <p className="font-bold text-md">
            Total Tagihan : {formatNumber(bills[platform])}
          </p>
          <p className="font-bold text-md">
            Total Setor : {formatNumber(setor[platform])}
          </p>
          <p className="font-bold text-md">
            Total Untung : {formatNumber(profit[platform])}
          </p>
        </div>
      ) : null}

      {/* Selector Filter */}
      {customShow && customList !== "default" && (
        <FieldSet className="max-w-[300px]">
          <FieldGroup>
            <Field className="flex flex-row">
              <FieldLabel>Tampilkan</FieldLabel>
              <Select
                className="flex-1"
                value={customList}
                onValueChange={setCustomList}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="byDay">Berdasarkan Hari</SelectItem>
                    <SelectItem value="byDate">Berdasarkan Tanggal</SelectItem>
                    <SelectItem value="byMonth">Berdasarkan Bulan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>
      )}

      {/* Default Filter */}
      {customList === "default" && (
        <div>
          <span className="block">Hanya Menampilkan 7 Data Terbaru</span>
          <Button
            onClick={() => {
              setCustomShow(true);
              setCustomList("byDay");
            }}
          >
            Show Other Filter
          </Button>
        </div>
      )}

      {/* Sort By Day */}
      {customShow && customList === "byDay" && (
        <div className="flex my-2">
          <form
            onSubmit={handleShowByLastDay}
            className="flex justify-between min-w-[300px] items-center"
          >
            <input
              type="text"
              className="border-1 border-black w-10 text-center px-[4px] focus:outline-none text-sm"
              value={limitOffPage}
              onChange={(e) => {
                setLimitOffPage(e.target.value);
              }}
              required
              placeholder="0"
            />
            <span>Hari Terakhir</span>
            <Button type="submit" disabled={loading ? true : false}>
              Tampilkan
            </Button>
          </form>
        </div>
      )}

      {/* Sort By Start date & End date */}
      {customShow && customList === "byDate" && (
        <form onSubmit={handleShowByDate} className="my-2">
          <FieldSet className="max-w-[300px]">
            <FieldGroup>
              <Field>
                <Popover open={datePicker} onOpenChange={setDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-range"
                      className="justify-center px-2.5 font-normal"
                    >
                      <CalendarIcon />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd LLL y")} -{" "}
                            {format(date.to, "dd LLL y")}
                          </>
                        ) : (
                          format(date.from, "dd LLL y")
                        )
                      ) : (
                        <span>Pilih Tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto mx-5 p-2">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                    <Field className="flex flex-row justify-end items-end">
                      <Button
                        size={"xs"}
                        className="max-w-fit"
                        onClick={(e) => {
                          setDatePicker(false);
                          handleShowByDate(e);
                        }}
                      >
                        Pilih Waktu
                      </Button>
                    </Field>
                  </PopoverContent>
                </Popover>
                <Button type="submit" disabled={loading ? true : false}>
                  Tampilkan
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      )}

      {/* Sort By Month */}
      {customShow && customList === "byMonth" && (
        <div className="flex flex-col">
          <form onSubmit={handleShowByMonth}>
            <FieldSet className="max-w-[300px] my-2">
              <FieldGroup>
                <Field>
                  <MonthPicker
                    value={pickMonth}
                    onChange={setPickMonth}
                    className="w-[300px]"
                  />
                  <Button
                    type="submit"
                    onClick={() => {
                      console.log(pickMonth);
                    }}
                  >
                    Tampilkan
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      )}
    </div>
  );
}
