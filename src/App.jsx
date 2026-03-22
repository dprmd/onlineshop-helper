import { createHashRouter, RouterProvider } from "react-router-dom";
import { PenghasilanProvider } from "./context/PenghasilanContext";
import CatatanPenghasilan from "./pages/CatatanPenghasilan";
import Home from "./pages/Home";
import TotalPenghasilan from "./pages/TotalPenghasilan";
import PerhitunganProfit from "./pages/PerhitunganProfit";
import RiwayatPenghasilanShopee from "./pages/RiwayatPenghasilanShopee";
import RiwayatPenghasilanTikTok from "./pages/RiwayatPenghasilanTikTok";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import { AlokasiPemasukanProvider } from "./context/AlokasiPemasukanContext";

const router = createHashRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      { path: "PerhitunganProfit", element: <PerhitunganProfit /> },
      {
        path: "AlokasiPemasukan",
        children: [
          { index: true, element: <StepOne /> },
          { path: "calculateHPP", element: <StepTwo /> },
          { path: "summary", element: <StepThree /> },
        ],
      },
      {
        path: "CatatanPenghasilan",
        children: [
          { index: true, element: <CatatanPenghasilan /> },
          {path: "totalPenghasilan", element: <TotalPenghasilan />},
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
      <AlokasiPemasukanProvider>
        <RouterProvider router={router} />
      </AlokasiPemasukanProvider>
    </PenghasilanProvider>
  );
}
