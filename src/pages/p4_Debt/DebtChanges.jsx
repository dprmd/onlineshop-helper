import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebt } from "@/context/DebtContext";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DebtChanges() {
  const navigate = useNavigate();
  const { debtChanges, getDebtChanges, getSupplierList } = useDebt();
  const { supplier } = useDebt();
  const [whichSupplier, setWhichSupplier] = useState("");
  const debtChangesList = useMemo(() => {
    if (!whichSupplier) return [];
    else {
      const check = debtChanges.find((c) => c.supplierId === whichSupplier);
      if (check) return check.changes;
      else return [];
    }
  }, [debtChanges, whichSupplier]);

  useEffect(() => {
    getSupplierList();
  }, []);

  useEffect(() => {
    getDebtChanges(whichSupplier);
  }, [whichSupplier]);

  return (
    <div className="text-center flex flex-col gap-y-4">
      <h3 className="font-bold text-xl">Daftar Perubahan Hutang Barang</h3>

      <div className="flex justify-center items-center">
        <Select
          className="flex-1"
          value={whichSupplier}
          onValueChange={setWhichSupplier}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {supplier.map((supp) => (
                <SelectItem key={supp.id} value={supp.id}>
                  {supp.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {whichSupplier && debtChangesList.length === 0 ? (
        <div>
          <p className="my-2">Kosong</p>
          <Button
            onClick={() => {
              navigate("/debt");
            }}
          >
            Kembali
          </Button>
        </div>
      ) : null}

      {whichSupplier && debtChangesList.length > 0 && (
        <div>
          <Button
            onClick={() => {
              navigate("/debt");
            }}
            className="max-w-fit"
          >
            Kembali
          </Button>
        </div>
      )}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {debtChangesList.map((debt, i) => (
          <DebtChangesCard key={i} debt={debt} />
        ))}
      </div>
    </div>
  );
}

const formatDate = (ms) => {
  const date = new Date(ms);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const DebtChangesCard = ({ debt }) => {
  const { supplier } = useDebt();
  const debtType = {
    addDebt: "Penambahan",
    reduceDebt: "Pengurangan",
    reduceDebtByWithdraw: "Pembayaran",
  };
  const choosedSupplier = useMemo(() => {
    return supplier.find((s) => s.id === debt.supplierId);
  }, [supplier, debt]);

  return (
    <Card className="min-w-[400px] max-w-[400px]">
      <CardHeader>
        <CardTitle>{debtType[debt.changeType]}</CardTitle>
        <p className="text-sm border border-gray-300 bg-gray-200 w-fit mx-auto px-2 py-1 rounded-lg">
          {formatDate(debt.createdAtMs)}
        </p>
        <p>Supplier : {choosedSupplier?.name}</p>
      </CardHeader>
      <CardContent>
        {debt.changes.map((debtProd) => (
          <div className="border p-2 rounded-md" key={debtProd.productName}>
            <p className="text-xs">{debtProd.productName}</p>
            <p className="text-xs">Perubahan : {debtProd.change}</p>
            <p className="text-xs">Sebelum : {debtProd.valueBefore}</p>
            <p className="text-xs">Sesudah : {debtProd.valueAfter}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
