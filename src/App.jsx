import { createHashRouter, RouterProvider } from "react-router-dom";
import { AlokasiPemasukanProvider } from "./context/AlokasiPemasukanContext";
import { CatatanPenghasilanProvider } from "./context/CatatanPenghasilanContext";
import Home from "./pages/p1_Home/Home";
import PerhitunganProfit from "./pages/p2_PerhitunganProfit/PerhitunganProfit";
import StepOne from "./pages/p3_AlokasiPemasukan/StepOne";
import StepThree from "./pages/p3_AlokasiPemasukan/StepThree";
import StepTwo from "./pages/p3_AlokasiPemasukan/StepTwo";
import CatatanPenghasilan from "./pages/p4_CatatanPenghasilan/CatatanPenghasilan";
import RiwayatPenghasilanShopee from "./pages/p4_CatatanPenghasilan/RiwayatPenghasilanShopee";
import RiwayatPenghasilanTikTok from "./pages/p4_CatatanPenghasilan/RiwayatPenghasilanTikTok";
import TotalPenghasilan from "./pages/p4_CatatanPenghasilan/TotalPenghasilan";
import CRUDBarang from "./pages/p5_CRUDBarang/CRUDBarang";
import Supplier from "./pages/p5_CRUDBarang/Supplier";

const router = createHashRouter([
  {
    path: "/",
    children: [
      // Page 1
      { index: true, element: <Home /> },

      // Page 2
      { path: "PerhitunganProfit", element: <PerhitunganProfit /> },

      // Page 3
      {
        path: "AlokasiPemasukan",
        children: [
          { index: true, element: <StepOne /> },
          { path: "calculateHPP", element: <StepTwo /> },
          { path: "summary", element: <StepThree /> },
        ],
      },

      // Page 4
      {
        path: "CatatanPenghasilan",
        children: [
          { index: true, element: <CatatanPenghasilan /> },
          { path: "totalPenghasilan", element: <TotalPenghasilan /> },
          { path: "Shopee", element: <RiwayatPenghasilanShopee /> },
          { path: "TikTok", element: <RiwayatPenghasilanTikTok /> },
        ],
      },

      // Page 5
      {
        path: "CRUDBarang",
        children: [
          { index: true, element: <CRUDBarang /> },
          { path: "Supplier", element: <Supplier /> },
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
    <CatatanPenghasilanProvider>
      <AlokasiPemasukanProvider>
        <RouterProvider router={router} />
      </AlokasiPemasukanProvider>
    </CatatanPenghasilanProvider>
  );
}
