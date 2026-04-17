import { Button } from "@/components/ui/button";
import { useCRUD } from "@/context/CRUDContext";
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
    </div>
  );
}
