import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Link } from "react-router-dom";

const getCardUi = (obj) => {
  let ui = {
    title: "",
    description: "",
    qcPassedBefore: "",
    lostBefore: "",
    defectBefore: "",
    qcPassedAfter: "",
    lostAfter: "",
    defectAfter: "",
    changesType: "",
  };

  if (obj.type === "PRODUCTION") {
    ui.title = "Produksi Barang";
    ui.description = `Menambahkan Stock Sebanyak ${obj.stockChanges.qcPassed} Pcs`;
    ui.qcPassedBefore = `${obj.stockBefore.qcPassed} Pcs`;
    ui.lostBefore = `${obj.stockBefore.lost} Pcs`;
    ui.defectBefore = `${obj.stockBefore.defect} Pcs`;
    ui.qcPassedAfter = `${obj.stockAfter.qcPassed} Pcs`;
    ui.lostAfter = `${obj.stockAfter.lost} Pcs`;
    ui.defectAfter = `${obj.stockAfter.defect} Pcs`;
    ui.changesType = `${obj.type}`;
  }

  return ui;
};

export default function StockChanges() {
  const { stockChanges, getStockChanges } = useWarehouse();

  useEffect(() => {
    getStockChanges();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/warehouse">Gudang Saya</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Riwayat Perubahan Stok</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
              <CardContent>
                <div className="text-center">
                  <div className="px-2 py-1 rounded-md">
                    <p>Stok Sebelum</p>
                    <div className="flex justify-between px-2 py-1 rounded-md">
                      <span className="text-[12px] text-gray-500 flex gap-x-1">
                        <span className="bi bi-check-circle-fill text-green-500" />
                        {ui.qcPassedBefore}
                      </span>
                      <span className="text-[12px] text-gray-500 flex gap-x-1">
                        <span className="bi bi-x-circle-fill text-red-500" />
                        {ui.defectBefore}
                      </span>
                      <span className="text-[12px] text-gray-500 flex gap-x-1">
                        <span className="bi bi-question-circle-fill text-orange-500" />
                        {ui.lostBefore}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md">
                    <p>Stok Sesudah</p>
                    <div className="flex justify-between px-2 py-1 rounded-md bi">
                      <span className="text-[12px] text-gray-500 flex gap-x-1">
                        <span className="bi bi-check-circle-fill text-green-500" />
                        {ui.qcPassedAfter}
                      </span>
                      <span className="text-[12px] text-gray-500 flex gap-x-1">
                        <span className="bi bi-x-circle-fill text-red-500" />
                        {ui.defectAfter}
                      </span>
                      <span className="text-[12px] text-gray-500 flex gap-x-1">
                        <span className="bi bi-question-circle-fill text-orange-500" />
                        {ui.lostAfter}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div>
                  <p>Tipe Perubahan : {ui.changesType}</p>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
