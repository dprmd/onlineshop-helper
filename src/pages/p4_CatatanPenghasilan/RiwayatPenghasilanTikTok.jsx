import { useCatatanPenghasilan } from "../../context/CatatanPenghasilanContext";
import FilterList from "./FilterList";
import PenghasilanTikTokCard from "./PenghasilanTikTokCard";

export default function RiwayatPenghasilanTikTok() {
  const { penghasilanTikTok } = useCatatanPenghasilan();

  return (
    <div className="px-5 py-4">
      <h1 className="text-xl">Riwayat Penghasilan TikTok</h1>
      <FilterList platform={"tiktok"} />

      <div className="flex flex-wrap gap-4 py-3">
        {penghasilanTikTok.map((data) => (
          <PenghasilanTikTokCard data={data} key={data.id} />
        ))}
      </div>
    </div>
  );
}
