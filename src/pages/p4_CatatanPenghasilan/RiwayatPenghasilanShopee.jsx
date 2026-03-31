import { usePenghasilan } from "../../context/CatatanPenghasilanContext";
import FilterList from "./FilterList";
import PenghasilanShopeeCard from "./PenghasilanShopeeCard";

export default function RiwayatPenghasilanShopee() {
  const { penghasilanShopee } = usePenghasilan();

  return (
    <div className="px-5 py-4">
      <h1 className="text-xl">Riwayat Penghasilan Shopee</h1>

      <FilterList platform={"shopee"} />

      <div className="flex flex-wrap gap-4 py-3">
        {penghasilanShopee.map((data) => (
          <PenghasilanShopeeCard data={data} key={data.id} />
        ))}
      </div>
    </div>
  );
}
