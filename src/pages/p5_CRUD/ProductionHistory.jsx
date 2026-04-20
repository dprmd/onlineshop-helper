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
import { useCRUD } from "@/context/CRUDContext";
import { formatNumber, formatTanggal } from "@/utils/generalFunction";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProductionHistory() {
  const { productionHistory, getProductionHistory, getProductList } = useCRUD();
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
              <Link to="/crud">CRUD</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Riwayat Produksi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {productionHistory.length === 0 && (
        <div className="text-center">
          <p className="text-xl text-gray-600 my-2">
            Tidak Ada Riwayat Produksi
          </p>
          <Button
            type="submit"
            onClick={() => navigate("/crud/addBatchProduction")}
          >
            Buat Batch Produksi
          </Button>
        </div>
      )}

      <div className="text-center">
        <Button
          type="submit"
          onClick={() => navigate("/crud/addBatchProduction")}
        >
          Buat Batch Produksi
        </Button>
      </div>
      {productionHistory.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {productionHistory.map((batch) => (
            <BatchProductionCard batch={batch} key={batch.id} />
          ))}
        </div>
      )}
    </div>
  );
}

const getStatus = (status) => {
  if (status === "cutting") {
    return "Di Potong";
  }
};

const BatchProductionCard = ({ batch }) => {
  return (
    <Card className="min-w-[380px] max-w-[380px] h-fit">
      <CardHeader>
        <CardTitle>{batch.product.name}</CardTitle>
        <CardDescription>
          <p>
            {batch.status === "cutting" &&
              `Dipotong Pada ${formatTanggal(batch.time.startCutting)}`}
          </p>
          <p>Status : {getStatus(batch.status)}</p>
          <p>Total Belanja Bahan : Rp {formatNumber(batch.materials.total)}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible>
          <CollapsibleTrigger className="underline">
            <Button variant={"outline"}>List Kain</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul>
              {batch?.materials.listMaterial.map((material) => (
                <li
                  key={material.id}
                  className="border px-2 py-1 rounded my-1 border-gray-300"
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
