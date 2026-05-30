import { DebtProvider } from "@/context/DebtContext";
import { SecurityProvider } from "@/context/SecurityContext";
import { UIProvider } from "@/context/UIContext";
import { WarehouseProvider } from "@/context/WarehouseContext";
import RootLayout from "@/layouts/RootLayout";
import NotFound from "@/pages/NotFound";
import ImagePromptRandomizer from "@/pages/p1_Tools/ImagePromptRandomizer/ImagePromptRandomizer";
import Tools from "@/pages/p1_Tools/Tools";
import DebtChanges from "@/pages/p3_Debt/DebtChanges";
import AddBatchProduction from "@/pages/p4_Warehouse/AddBatchProduction";
import MakeStockChanges from "@/pages/p4_Warehouse/MakeStockChanges";
import ProductionHistory from "@/pages/p4_Warehouse/ProductionHistory";
import Products from "@/pages/p4_Warehouse/Products";
import StockChanges from "@/pages/p4_Warehouse/StockChanges";
import Warehouse from "@/pages/p4_Warehouse/Warehouse";
import WithdrawCalculation from "@/pages/p4_Warehouse/WithdrawCalculation";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { IncomeAllocationProvider } from "./context/IncomeAllocationContext";
import { WithdrawalRecordsProvider } from "./context/WithdrawalRecordsContext";
import Home from "./pages/Home";
import ProfitCalculation from "./pages/p1_Tools/ProfitCalculation/ProfitCalculation";
import Withdrawals from "./pages/p2_Income/Income";
import IncomeTotal from "./pages/p2_Income/IncomeTotal";
import ShopeeWithdrawalRecords from "./pages/p2_Income/ShopeeWithdrawalRecords";
import TikTokWithdrawasRecords from "./pages/p2_Income/TikTokWithdrawalRecords";
import Debt from "./pages/p3_Debt/Debt";
import ProductsDebt from "./pages/p3_Debt/ProductsDebt";
import StepOne from "./pages/p3_Debt/StepOne";
import StepThree from "./pages/p3_Debt/StepThree";
import StepTwo from "./pages/p3_Debt/StepTwo";
import Supplier from "./pages/p3_Debt/Supplier";
import UpdateProductDebt from "./pages/p3_Debt/UpdateProductDebt";
import FullBody from "@/pages/p1_Tools/ImagePromptRandomizer/FullBody";
import UpperBody from "@/pages/p1_Tools/ImagePromptRandomizer/UpperBody";
import LowerBody from "@/pages/p1_Tools/ImagePromptRandomizer/LowerBody";
import NonTalent from "@/pages/p1_Tools/ImagePromptRandomizer/NonTalent";
import NonFashion from "@/pages/p1_Tools/ImagePromptRandomizer/NonFashion";

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },

      // Page 1
      {
        path: "tools",
        children: [
          { index: true, element: <Tools /> },
          { path: "profitCalculation", element: <ProfitCalculation /> },
          {
            path: "imagePromptRandomizer",
            children: [
              { index: true, element: <ImagePromptRandomizer /> },
              {
                path: "fullBody",
                element: <FullBody />,
              },
              {
                path: "upperBody",
                element: <UpperBody />,
              },
              {
                path: "lowerBody",
                element: <LowerBody />,
              },
              {
                path: "nonTalent",
                element: <NonTalent />,
              },
              {
                path: "nonFashion",
                element: <NonFashion />,
              },
            ],
          },
        ],
      },

      // Page 2
      {
        path: "income",
        children: [
          { index: true, element: <Withdrawals /> },
          { path: "total", element: <IncomeTotal /> },
          { path: "shopee", element: <ShopeeWithdrawalRecords /> },
          { path: "tiktok", element: <TikTokWithdrawasRecords /> },
        ],
      },

      // Page 3
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

      // Page 4
      {
        path: "warehouse",
        children: [
          { index: true, element: <Warehouse /> },
          { path: "productionHistory", element: <ProductionHistory /> },
          { path: "addBatchProduction", element: <AddBatchProduction /> },
          { path: "products", element: <Products /> },
          { path: "stockChanges", element: <StockChanges /> },
          { path: "withdrawCalculation", element: <WithdrawCalculation /> },
          { path: "makeStockChanges", element: <MakeStockChanges /> },
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
      <SecurityProvider>
        <WarehouseProvider>
          <DebtProvider>
            <WithdrawalRecordsProvider>
              <IncomeAllocationProvider>
                <RouterProvider router={router} />
              </IncomeAllocationProvider>
            </WithdrawalRecordsProvider>
          </DebtProvider>
        </WarehouseProvider>
      </SecurityProvider>
    </UIProvider>
  );
}
