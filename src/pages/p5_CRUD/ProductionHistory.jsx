import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCRUD } from "@/context/CRUDContext";
import { formatNumber, formatTanggal } from "@/utils/generalFunction";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductionHistory() {
  const {
    productionHistory,
    getProductionHistory,
    productionHistoryInitialFetch,
    productsInitialFetch,
    getProductList,
  } = useCRUD();
  const navigate = useNavigate();

  useEffect(() => {
    if (productionHistoryInitialFetch) {
      getProductionHistory();
    }

    if (productsInitialFetch) {
      getProductList();
    }
  }, []);

  return (
    <div>
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

      {productionHistory.length > 0 && (
        <div>
          {productionHistory.map((batch) => (
            <BatchProductionCard batch={batch} />
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
    <Card className="max-w-[400px]">
      <CardHeader>
        <CardTitle>{batch.product.name}</CardTitle>
        <CardDescription>
          <p>
            {batch.status === "cutting" &&
              `Dipotong Pada ${formatTanggal(batch.time.startCutting)}`}
          </p>
          <p>Status : {getStatus(batch.status)}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          List Bahan - Total Belanja Bahan : Rp{" "}
          {formatNumber(batch.materials.total)}
        </p>
        <ul>
          {batch?.materials.listMaterial.map((material) => (
            <li
              key={material.id}
              className="border px-2 py-1 rounded my-1 border-gray-400"
            >
              <p>Nama : {material.materialName}</p>
              <p>
                Qty : {material.qty} {material.type}
              </p>
              <p>
                Harga Per {material.type} : Rp {formatNumber(material.price)}
              </p>
              <p>Total : Rp {formatNumber(material.total)}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
