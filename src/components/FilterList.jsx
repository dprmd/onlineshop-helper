import { usePenghasilan } from "../context/PenghasilanContext";
import { useEffect, useState } from "react";

export default function FilterList({ platform }) {
  const {
    refetch: fetchPenghasilan,
    sortByLimitUnderTen,
    fetchPenghasilanByDate,
  } = usePenghasilan();
  const [limitOffPage, setLimitOffPage] = useState("");
  const [customShow, setCustomShow] = useState(false);
  const [customList, setCustomList] = useState("default");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleShowByDay = async (e) => {
    e.preventDefault();
    if (limitOffPage <= 10) {
      sortByLimitUnderTen(platform, Number(limitOffPage));
    } else {
      await fetchPenghasilan(platform, Number(limitOffPage));
    }
  };

  const handleShowByDate = async (e) => {
    e.preventDefault();
    await fetchPenghasilanByDate(platform, startDate, endDate);
    console.log(startDate);
    console.log(endDate);
  };

  useEffect(() => {
    if (customList === "default") {
      sortByLimitUnderTen(platform, 10);
      setLimitOffPage("");
    }
  }, [customList]);
  return (
    <div className="text-sm text-gray-400">
      {/* Selector Filter */}
      {customShow && customList !== "default" && (
        <div className="my-2">
          <select
            name="customList"
            id="customList"
            value={customList}
            onChange={(e) => {
              setCustomList(e.target.value);
            }}
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
          <span className="block">
            Hanya Menampilkan List Dalam 10 Hari Terakhir
          </span>
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
          <form onSubmit={handleShowByDay}>
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
            <div>
              <div>
                <label htmlFor="startDate" className="font-bold">
                  From :{" "}
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="font-bold">
                  To :{" "}
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
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
