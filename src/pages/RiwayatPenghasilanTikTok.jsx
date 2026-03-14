import { Link } from "react-router-dom";
import { usePenghasilan } from "../context/PenghasilanContext";
import PenghasilanTikTokCard from "../components/PenghasilanTikTokCard";
import { useState } from "react";

export default function RiwayatPenghasilanTikTok() {
  const { penghasilanTikTok, refetch: fetchPenghasilan } = usePenghasilan();
  const [limitOffPage, setLimitOffPage] = useState("");

  const handleShowByNumber = async (e) => {
    e.preventDefault();
    await fetchPenghasilan("tiktok", Number(limitOffPage));
  };

  return (
    <div className="px-5 py-4">
      <h1 className="text-xl">Riwayat Penghasilan TikTok</h1>
      <div className="text-sm text-gray-400">
        <span>Hanya Menampilkan List Dalam 10 Hari Terakhir</span>
        <div className="flex">
          <span>Tampilkan Dalam</span>
          <form onSubmit={handleShowByNumber}>
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
              className="bg-gray-400 text-white mx-2 px-[4px] py-[2px]"
              type="submit"
            >
              Tampilkan
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3">
        {penghasilanTikTok.map((data) => (
          <PenghasilanTikTokCard data={data} key={data.id} />
        ))}
      </div>

      <Link
        to={"/CatatanPenghasilan"}
        className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300"
      >
        Kembali
      </Link>
    </div>
  );
}
