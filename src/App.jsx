import { createBrowserHistory } from "history";
import { createHashRouter, RouterProvider } from "react-router";
import AlokasiPemasukan from "./pages/AlokasiPemasukan";
import CatatanPenghasilan from "./pages/CatatanPenghasilan";
import Home from "./pages/Home";
import PerhitunganProfit from "./pages/PerhitunganProfit";
import RiwayatPenghasilanShopee from "./pages/RiwayatPenghasilanShopee";
import RiwayatPenghasilanTikTok from "./pages/RiwayatPenghasilanTikTok";
import { PenghasilanProvider } from "./context/PenghasilanContext";

// nested route example
// import PerhitunganKomisiKotor from "./pages/PerhitunganKomisiKotor";
// import UbahInformasiProduk from "./pages/UbahInformasiProduk";

const history = createBrowserHistory({
  window,
  basename: "/adi",
});

const router = createHashRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "PerhitunganProfit", Component: PerhitunganProfit },
      { path: "AlokasiPemasukan", Component: AlokasiPemasukan },
      {
        path: "CatatanPenghasilan",
        children: [
          { index: true, Component: CatatanPenghasilan },
          { path: "Shopee", Component: RiwayatPenghasilanShopee },
          { path: "TikTok", Component: RiwayatPenghasilanTikTok },
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
  { history },
]);

const App = () => {
  return (
    <PenghasilanProvider>
      <RouterProvider router={router} />
    </PenghasilanProvider>
  );
};

export default App;
