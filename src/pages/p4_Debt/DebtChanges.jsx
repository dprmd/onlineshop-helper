import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebt } from "@/context/DebtContext";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/utils/generalFunction";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DebtChanges() {
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
    <div className="text-center flex flex-col gap-y-4 justify-center items-center">
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
              <Link to="/debt">Hutang Barang</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Riwayat Perubahan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center items-center gap-4">
        {debtChangesList.map((debt, i) => (
          <DebtChangesCard key={i} debt={debt} />
        ))}
      </div>
    </div>
  );
}

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
