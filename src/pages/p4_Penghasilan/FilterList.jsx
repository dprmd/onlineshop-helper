import { useEffect, useState } from "react";
import { useCatatanPenghasilan } from "../../context/CatatanPenghasilanContext";
import { formatNumber } from "../../utils/generalFunction";

export default function FilterList({ platform }) {
  const {
    fetchPenghasilan,
    sortByLimitUnderSeven,
    fetchPenghasilanByDate,
    fetchPenghasilanByMonth,
    penghasilanShopee,
    penghasilanTikTok,
    loading,
  } = useCatatanPenghasilan();
  const [setor, setSetor] = useState({
    shopee: 0,
    tiktok: 0,
  });
  const [untung, setUntung] = useState({
    shopee: 0,
    tiktok: 0,
  });
  const [penghasilanAT, setPenghasilanAT] = useState({
    shopee: 0,
    tiktok: 0,
  });
  const [tagihanAT, setTagihanAT] = useState({
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
    // Perhitungan Setor
    const setorShopee = penghasilanShopee.reduce((acc, cur) => {
      return acc + cur.uangAdeSiska;
    }, 0);
    const setorTiktok = penghasilanTikTok.reduce((acc, cur) => {
      return acc + cur.uangAdeSiska;
    }, 0);
    setSetor({ tiktok: setorTiktok, shopee: setorShopee });

    // Perhitungan Untung
    const untungShopee = penghasilanShopee.reduce((acc, cur) => {
      return acc + cur.komisiAdi.total;
    }, 0);
    const untungTiktok = penghasilanTikTok.reduce((acc, cur) => {
      return acc + cur.komisiAdi.total;
    }, 0);
    setUntung({ tiktok: untungTiktok, shopee: untungShopee });

    // Perhitungan Penghasilan HPP
    const penghasilanHPPATShopee = penghasilanShopee.reduce((acc, cur) => {
      return acc + cur.totalPenghasilan;
    }, 0);
    const penghasilanHPPATTiktok = penghasilanTikTok.reduce((acc, cur) => {
      return acc + cur.totalPenghasilan;
    }, 0);
    setPenghasilanAT({
      shopee: penghasilanHPPATShopee,
      tiktok: penghasilanHPPATTiktok,
    });

    // Perhitungan Tagihan
    const tagihanATShopee = penghasilanShopee.reduce((acc, cur) => {
      return acc + cur.tagihan.totalTagihan;
    }, 0);
    const tagihanATTiktok = penghasilanTikTok.reduce((acc, cur) => {
      return acc + cur.tagihan.totalTagihan;
    }, 0);
    setTagihanAT({
      shopee: tagihanATShopee,
      tiktok: tagihanATTiktok,
    });
  }, [penghasilanShopee, penghasilanTikTok]);

  return (
    <div className="text-sm text-gray-400">
      <div className="py-2">
        <p className="font-bold text-md">
          Total Penghasilan : {formatNumber(penghasilanAT[platform])}
        </p>
        <p className="font-bold text-md">
          Total Tagihan : {formatNumber(tagihanAT[platform])}
        </p>
        <p className="font-bold text-md">
          Total Setor : {formatNumber(setor[platform])}
        </p>
        <p className="font-bold text-md">
          Total Untung : {formatNumber(untung[platform])}
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
