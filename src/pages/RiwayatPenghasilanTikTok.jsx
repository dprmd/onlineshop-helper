import { Link } from "react-router-dom";
import { usePenghasilan } from "../context/PenghasilanContext";
import PenghasilanTikTokCard from "../components/PenghasilanTikTokCard";

export default function RiwayatPenghasilanTikTok() {
  const { penghasilanTikTok } = usePenghasilan();
  console.log(penghasilanTikTok);

  return (
    <div className="px-5 py-4">
      <h1 className="text-xl">Riwayat Penghasilan TikTok</h1>
      <span className="text-sm text-gray-400">
        Hanya Menampilkan List Dalam 10 Hari Terakhir
      </span>

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
