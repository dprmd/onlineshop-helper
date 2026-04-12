import { UIProvider } from "@/context/UIContext";
import RootLayout from "@/layouts/RootLayout";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { CRUDProvider } from "./context/CRUDContext";
import { IncomeAllocationProvider } from "./context/IncomeAllocationContext";
import { WithdrawalRecordsProvider } from "./context/WithdrawalRecordsContext";
import Home from "./pages/p1_Home/Home";
import ProfitCalculation from "./pages/p2_ProfitCalculation/ProfitCalculation";
import StepOne from "./pages/p3_IncomeAllocation/StepOne";
import StepThree from "./pages/p3_IncomeAllocation/StepThree";
import StepTwo from "./pages/p3_IncomeAllocation/StepTwo";
import Withdrawals from "./pages/p4_Income/Income";
import IncomeTotal from "./pages/p4_Income/IncomeTotal";
import ShopeeWithdrawalRecords from "./pages/p4_Income/ShopeeWithdrawalRecords";
import TikTokWithdrawasRecords from "./pages/p4_Income/TikTokWithdrawalRecords";
import CRUD from "./pages/p5_CRUD/CRUD";
import Products from "./pages/p5_CRUD/Products";
import Supplier from "./pages/p5_CRUD/Supplier";
import TambahHutangBarang from "./pages/p5_CRUD/TambahHutangBarang";

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Page 1
      { index: true, element: <Home /> },

      // Page 2
      { path: "profitCalculation", element: <ProfitCalculation /> },

      // Page 3
      {
        path: "incomeAllocation",
        children: [
          { index: true, element: <StepOne /> },
          { path: "calculateHPP", element: <StepTwo /> },
          { path: "summary", element: <StepThree /> },
        ],
      },

      // Page 4
      {
        path: "income",
        children: [
          { index: true, element: <Withdrawals /> },
          { path: "total", element: <IncomeTotal /> },
          { path: "shopee", element: <ShopeeWithdrawalRecords /> },
          { path: "tiktok", element: <TikTokWithdrawasRecords /> },
        ],
      },

      // Page 5
      {
        path: "crud",
        children: [
          { index: true, element: <CRUD /> },
          { path: "supplier", element: <Supplier /> },
          { path: "addProductDebt", element: <TambahHutangBarang /> },
          { path: "products", element: <Products /> },
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
      <CRUDProvider>
        <WithdrawalRecordsProvider>
          <IncomeAllocationProvider>
            <RouterProvider router={router} />
          </IncomeAllocationProvider>
        </WithdrawalRecordsProvider>
      </CRUDProvider>
    </UIProvider>
  );
}
