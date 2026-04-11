import { useEffect, useState } from "react";
import { useWithdrawalRecords } from "../../context/WithdrawalRecordsContext";
import { formatNumber } from "../../utils/generalFunction";

export default function FilterList({ platform }) {
  const {
    fetchWithdrawals,
    sortByLimitUnderSeven,
    fetchWithdrawalsByDate,
    fetchWithdrawalsByMonth,
    shopeeWithdrawals,
    tiktokWithdrawals,
    loading,
  } = useWithdrawalRecords();
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickMonth, setPickMonth] = useState("");

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
    await fetchWithdrawalsByDate(platform, startDate, endDate);
  };

  const handleShowByMonth = async (e) => {
    e.preventDefault();
    const [year, month] = pickMonth.split("-");
    await fetchWithdrawalsByMonth(platform, Number(year), Number(month));
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
    <div className="text-sm text-gray-400">
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

      {/* Selector Filter */}
      {customShow && customList !== "default" && (
        <div className="my-2">
          <label htmlFor="customList">Tampilkan : </label>
          <select
            name="customList"
            id="customList"
            value={customList}
            onChange={(e) => {
              setCustomList(e.target.value);
            }}
            className="outline-1 outline-black rounded-md mx-2"
          >
            <option value="default">Default</option>
            <option value="byDay">Berdasarkan Hari</option>
            <option value="byDate">Berdasarkan Tanggal</option>
            <option value="byMonth">Berdasarkan Bulan</option>
          </select>
        </div>
      )}

      {/* Default Filter */}
      {customList === "default" && (
        <div>
          <span className="block">Hanya Menampilkan 7 Data Terbaru</span>
          <button
            className="bg-gray-500 text-white px-[4px] rounded-md block"
            onClick={() => {
              setCustomShow(true);
              setCustomList("byDay");
            }}
          >
            Show Other Filter
          </button>
        </div>
      )}

      {/* Sort By Day */}
      {customShow && customList === "byDay" && (
        <div className="flex">
          <form onSubmit={handleShowByLastDay}>
            <input
              type="text"
              className="border-1 border-black w-10 text-center px-[4px] focus:outline-none mx-2 text-sm"
              value={limitOffPage}
              onChange={(e) => {
                setLimitOffPage(e.target.value);
              }}
              required
              placeholder="0"
            />
            <span>Hari Terakhir</span>
            <button
              className="bg-gray-500 rounded-md text-white mx-2 px-[4px] py-[2px]"
              type="submit"
              disabled={loading ? true : false}
            >
              Tampilkan
            </button>
          </form>
        </div>
      )}

      {/* Sort By Start date & End date */}
      {customShow && customList === "byDate" && (
        <div className="flex">
          <form onSubmit={handleShowByDate}>
            <div className="flex flex-col gap-y-2">
              <div>
                <label htmlFor="startDate" className="font-bold">
                  Dari :{" "}
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                  className="outline-1 outline-black rounded-md mx-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="font-bold">
                  Ke :{" "}
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                  className="outline-1 outline-black rounded-md mx-2"
                  required
                />
              </div>
            </div>
            <button
              className="bg-gray-500 rounded-md text-white my-1 px-[4px] py-[2px]"
              type="submit"
              disabled={loading ? true : false}
            >
              Tampilkan
            </button>
          </form>
        </div>
      )}

      {/* Sort By Month */}
      {customShow && customList === "byMonth" && (
        <div className="flex flex-col">
          <form onSubmit={handleShowByMonth}>
            <div>
              <div>
                <label htmlFor="month" className="font-bold">
                  Bulan :{" "}
                </label>
                <input
                  type="month"
                  id="month"
                  value={pickMonth}
                  onChange={(e) => {
                    setPickMonth(e.target.value);
                  }}
                  className="outline-1 outline-black rounded-md mx-2"
                  required
                />
              </div>
            </div>
            <button
              className="bg-gray-500 rounded-md text-white my-1 px-[4px] py-[2px]"
              type="submit"
            >
              Tampilkan
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
