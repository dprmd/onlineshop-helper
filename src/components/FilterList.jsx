import { formatNumber } from "../utils/generalFunction";
import { usePenghasilan } from "../context/PenghasilanContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FilterList({ platform }) {
  const {
    refetch: fetchPenghasilan,
    sortByLimitUnderSeven,
    fetchPenghasilanByDate,
    fetchPenghasilanByMonth,
    penghasilanShopee,
    penghasilanTikTok,
  } = usePenghasilan();
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState({
    shopee: 0,
    tiktok: 0,
  });
  const [worth, setWorth] = useState({
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
      await fetchPenghasilan(platform, Number(limitOffPage));
    }
  };

  const handleShowByDate = async (e) => {
    e.preventDefault();
    await fetchPenghasilanByDate(platform, startDate, endDate);
  };

  const handleShowByMonth = async (e) => {
    e.preventDefault();
    const [year, month] = pickMonth.split("-");
    await fetchPenghasilanByMonth(platform, Number(year), Number(month));
  };

  useEffect(() => {
    if (customList === "default") {
      sortByLimitUnderSeven(platform, 7);
      setLimitOffPage("");
    }
  }, [customList]);

  useEffect(() => {
    const shopeeDeposit = penghasilanShopee.reduce((acc, cur) => {
      return acc + cur.uangAdeSiska;
    }, 0);
    const tiktokDeposit = penghasilanTikTok.reduce((acc, cur) => {
      return acc + cur.penghasilanHPP.total - cur.tagihan.totalTagihan;
    }, 0);
    setDeposit({ tiktok: tiktokDeposit, shopee: shopeeDeposit });

    const shopeeWorth = penghasilanShopee.reduce((acc, cur) => {
      return (
        acc +
        cur.komisiAdi.total -
        cur.komisiAdi.sedekah -
        cur.patunganUntukEma.adi
      );
    }, 0);
    const tiktokWorth = penghasilanTikTok.reduce((acc, cur) => {
      return acc + cur.komisiAdi.total;
    }, 0);
    setWorth({ tiktok: tiktokWorth, shopee: shopeeWorth });
  }, [penghasilanShopee, penghasilanTikTok]);

  return (
    <div className="text-sm text-gray-400">
      <div className="py-2">
        <p className="font-bold text-md">
          Total Setor : {formatNumber(deposit[platform]) || "0"}
        </p>
        <p className="font-bold text-md">
          Total Untung : {formatNumber(worth[platform]) || "0"}
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

      <button
        type="button"
        onClick={() => {
          navigate("/CatatanPenghasilan");
        }}
        className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300 mt-2"
      >
        Kembali
      </button>
    </div>
  );
}
