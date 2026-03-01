import { usePenghasilan } from "../context/PenghasilanContext";

export default function RiwayatPenghasilanShopee() {
  const { penghasilanShopee } = usePenghasilan();
  console.log(penghasilanShopee);
  return (
    <div>
      <div>Hello</div>
    </div>
  );
}
