import { useWarehouse } from "@/context/WarehouseContext";
import { useEffect } from "react";

export default function StockChanges() {
  const { stockChanges, getStockChanges } = useWarehouse();

  useEffect(() => {
    getStockChanges();
  }, []);

  return (
    <div>
      <div>Guys</div>
    </div>
  );
}
