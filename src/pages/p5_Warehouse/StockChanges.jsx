import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWarehouse } from "@/context/WarehouseContext";
import { useEffect } from "react";

const getCardUi = (obj) => {
  let ui = {
    title: "",
    description: "",
  };

  if (obj.type === "PRODUCTION") {
    ui.title = "Produksi Barang";
    ui.description = `Menambahkan Stock Sebanyak ${obj.stockChanges.qcPassed} Pcs`;
  }

  return ui;
};

export default function StockChanges() {
  const { stockChanges, getStockChanges } = useWarehouse();

  console.log(stockChanges[0]);

  useEffect(() => {
    getStockChanges();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      {stockChanges.map((changesObj) => {
        const ui = getCardUi(changesObj);
        return (
          <Card className="min-w-[380px] max-w-[380px]" key={changesObj.id}>
            <CardHeader className="text-center">
              <CardTitle>{ui.title}</CardTitle>
              <CardDescription>
                {changesObj.productName} - {changesObj.variantName}
              </CardDescription>
              <CardDescription>{ui.description}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter></CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
