import { DebtProvider } from "@/context/DebtContext";
import { UIProvider } from "@/context/UIContext";
import { WarehouseProvider } from "@/context/WarehouseContext";
import RootLayout from "@/layouts/RootLayout";
import NotFound from "@/pages/NotFound";
import DebtChanges from "@/pages/p4_Debt/DebtChanges";
import AddBatchProduction from "@/pages/p5_Warehouse/AddBatchProduction";
import ProductionHistory from "@/pages/p5_Warehouse/ProductionHistory";
import Warehouse from "@/pages/p5_Warehouse/Warehouse";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { IncomeAllocationProvider } from "./context/IncomeAllocationContext";
import { WithdrawalRecordsProvider } from "./context/WithdrawalRecordsContext";
import Home from "./pages/p1_Home/Home";
import ProfitCalculation from "./pages/p2_ProfitCalculation/ProfitCalculation";
import Withdrawals from "./pages/p3_Income/Income";
import IncomeTotal from "./pages/p3_Income/IncomeTotal";
import ShopeeWithdrawalRecords from "./pages/p3_Income/ShopeeWithdrawalRecords";
import TikTokWithdrawasRecords from "./pages/p3_Income/TikTokWithdrawalRecords";
import Debt from "./pages/p4_Debt/Debt";
import ProductsDebt from "./pages/p4_Debt/ProductsDebt";
import StepOne from "./pages/p4_Debt/StepOne";
import StepThree from "./pages/p4_Debt/StepThree";
import StepTwo from "./pages/p4_Debt/StepTwo";
import Supplier from "./pages/p4_Debt/Supplier";
import UpdateProductDebt from "./pages/p4_Debt/UpdateProductDebt";

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Page 1
      { index: true, element: <Home /> },

      // Page 2
      { path: "profitCalculation", element: <ProfitCalculation /> },

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
        path: "debt",
        children: [
          { index: true, element: <Debt /> },
          { path: "supplier", element: <Supplier /> },
          { path: "updateProductDebt", element: <UpdateProductDebt /> },
          { path: "productsDebt", element: <ProductsDebt /> },
          { path: "debtChanges", element: <DebtChanges /> },
          {
            path: "incomeAllocation",
            children: [
              { index: true, element: <StepOne /> },
              { path: "calculateHPP", element: <StepTwo /> },
              { path: "summary", element: <StepThree /> },
            ],
          },
        ],
      },

      // Page 6
      {
        path: "warehouse",
        children: [
          { index: true, element: <Warehouse /> },
          { path: "productionHistory", element: <ProductionHistory /> },
          { path: "addBatchProduction", element: <AddBatchProduction /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <UIProvider>
      <WarehouseProvider>
        <DebtProvider>
          <WithdrawalRecordsProvider>
            <IncomeAllocationProvider>
              <RouterProvider router={router} />
            </IncomeAllocationProvider>
          </WithdrawalRecordsProvider>
        </DebtProvider>
      </WarehouseProvider>
    </UIProvider>
  );
}
