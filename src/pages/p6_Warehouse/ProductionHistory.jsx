import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useDebt } from "@/context/DebtContext";
import { formatNumber, formatTanggal } from "@/utils/generalFunction";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProductionHistory() {
  const { productionHistory, getProductionHistory, getProductList } = useDebt();
  const navigate = useNavigate();

  useEffect(() => {
    getProductionHistory();
    getProductList();
  }, []);

  return (
    <div className="flex flex-col gap-y-4 justify-center items-center">
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
            <BreadcrumbPage>Riwayat Produksi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Jika Tidak Ada Riwayat Produksi */}
      {productionHistory.length === 0 && (
        <div className="text-center">
          <p className="text-xl text-gray-600 my-2">
            Tidak Ada Riwayat Produksi
          </p>
          <Button
            type="submit"
            onClick={() => navigate("/warehouse/addBatchProduction")}
          >
            Buat Batch Produksi
          </Button>
        </div>
      )}

      {/* List Riwayat Produksi */}
      <div>
        {productionHistory.length > 0 && (
          <div>
            <div className="text-center my-2">
              <Button
                type="submit"
                onClick={() => navigate("/debt/addBatchProduction")}
              >
                Buat Batch Produksi
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              {productionHistory.map((batch) => (
                <BatchProductionCard batch={batch} key={batch.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getStatus = (batch) => {
  if (batch.status === "cutting") {
    return {
      status: "Di Potong",
      description: `Di Potong Pada ${formatTanggal(batch.time.startCutting)}`,
    };
  }
};

const BatchProductionCard = ({ batch }) => {
  return (
    <Card className="min-w-[380px] max-w-[380px] h-fit">
      <CardHeader>
        <CardTitle>{batch.product.name}</CardTitle>
        <CardDescription>
          <p>Status : {getStatus(batch).status}</p>
          <p>Total Belanja Bahan : Rp {formatNumber(batch.materials.total)}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible>
          <CollapsibleTrigger>
            <div className="border px-2 py-1 rounded-lg border-gray-300 cursor-pointer hover:bg-gray-100">
              List Kain
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul>
              {batch?.materials.listMaterial.map((material) => (
                <li
                  key={material.id}
                  className="px-2 py-1 my-1 border-1 border-gray-200 rounded-lg text-gray-500"
                >
                  <p>Nama : {material.materialName}</p>
                  <p>
                    Qty : {material.qty} {material.type}
                  </p>
                  <p>
                    Harga Per {material.type} : Rp{" "}
                    {formatNumber(material.price)}
                  </p>
                  <p>Total : Rp {formatNumber(material.total)}</p>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
