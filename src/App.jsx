import { createHashRouter, RouterProvider } from "react-router-dom";
import { PenghasilanProvider } from "./context/PenghasilanContext";
import AlokasiPemasukan from "./pages/AlokasiPemasukan";
import CatatanPenghasilan from "./pages/CatatanPenghasilan";
import Home from "./pages/Home";
import PerhitunganProfit from "./pages/PerhitunganProfit";
import RiwayatPenghasilanShopee from "./pages/RiwayatPenghasilanShopee";
import RiwayatPenghasilanTikTok from "./pages/RiwayatPenghasilanTikTok";

const router = createHashRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      { path: "PerhitunganProfit", element: <PerhitunganProfit /> },
      { path: "AlokasiPemasukan", element: <AlokasiPemasukan /> },
      {
        path: "CatatanPenghasilan",
        children: [
          { index: true, element: <CatatanPenghasilan /> },
          { path: "Shopee", element: <RiwayatPenghasilanShopee /> },
          { path: "TikTok", element: <RiwayatPenghasilanTikTok /> },
        ],
      },
      // Contoh nested route
      // {
      //   path: "PerhitunganKomisiKotor",
      //   children: [
      //     { index: true, Component: PerhitunganKomisiKotor },
      //     { path: "UbahInformasiProduk", Component: UbahInformasiProduk },
      //   ],
      // },
    ],
  },
]);

export default function App() {
  return (
    <PenghasilanProvider>
      <RouterProvider router={router} />
    </PenghasilanProvider>
  );
}
