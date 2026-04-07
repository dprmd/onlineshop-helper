import { UIProvider } from "@/context/UIContext";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { AlokasiPemasukanProvider } from "./context/AlokasiPemasukanContext";
import { CatatanPenghasilanProvider } from "./context/CatatanPenghasilanContext";
import { CRUDBarangProvider } from "./context/CRUDBarangContext";
import Home from "./pages/p1_Home/Home";
import PerhitunganProfit from "./pages/p2_PerhitunganProfit/PerhitunganProfit";
import StepOne from "./pages/p3_AlokasiPemasukan/StepOne";
import StepThree from "./pages/p3_AlokasiPemasukan/StepThree";
import StepTwo from "./pages/p3_AlokasiPemasukan/StepTwo";
import Penghasilan from "./pages/p4_Penghasilan/Penghasilan";
import RiwayatPenghasilanShopee from "./pages/p4_Penghasilan/RiwayatPenghasilanShopee";
import RiwayatPenghasilanTikTok from "./pages/p4_Penghasilan/RiwayatPenghasilanTikTok";
import TotalPenghasilan from "./pages/p4_Penghasilan/TotalPenghasilan";
import CRUDBarang from "./pages/p5_CRUDBarang/CRUDBarang";
import Supplier from "./pages/p5_CRUDBarang/Supplier";
import TambahHutangBarang from "./pages/p5_CRUDBarang/TambahHutangBarang";

const router = createHashRouter([
  {
    path: "/",
    children: [
      // Page 1
      { index: true, element: <Home /> },

      // Page 2
      { path: "perhitunganProfit", element: <PerhitunganProfit /> },

      // Page 3
      {
        path: "alokasiPemasukan",
        children: [
          { index: true, element: <StepOne /> },
          { path: "calculateHPP", element: <StepTwo /> },
          { path: "summary", element: <StepThree /> },
        ],
      },

      // Page 4
      {
        path: "penghasilan",
        children: [
          { index: true, element: <Penghasilan /> },
          { path: "totalPenghasilan", element: <TotalPenghasilan /> },
          { path: "shopee", element: <RiwayatPenghasilanShopee /> },
          { path: "tiktok", element: <RiwayatPenghasilanTikTok /> },
        ],
      },

      // Page 5
      {
        path: "crudBarang",
        children: [
          { index: true, element: <CRUDBarang /> },
          { path: "supplier", element: <Supplier /> },
          { path: "tambahHutangBarang", element: <TambahHutangBarang /> },
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
    <UIProvider>
      <CRUDBarangProvider>
        <CatatanPenghasilanProvider>
          <AlokasiPemasukanProvider>
            <RouterProvider router={router} />
          </AlokasiPemasukanProvider>
        </CatatanPenghasilanProvider>
      </CRUDBarangProvider>
    </UIProvider>
  );
}
