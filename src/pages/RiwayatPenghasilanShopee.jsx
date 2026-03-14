import { Link } from "react-router-dom";
import PenghasilanShopeeCard from "../components/PenghasilanShopeeCard";
import { usePenghasilan } from "../context/PenghasilanContext";
import FilterList from "../components/FilterList";

export default function RiwayatPenghasilanShopee() {
  const { penghasilanShopee } = usePenghasilan();

  console.log(penghasilanShopee);

  return (
    <div className="px-5 py-4">
      <h1 className="text-xl">Riwayat Penghasilan Shopee</h1>

      <FilterList platform={"shopee"} />

      <div className="flex flex-wrap gap-4 py-3">
        {penghasilanShopee.map((data) => (
          <PenghasilanShopeeCard data={data} key={data.id} />
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
