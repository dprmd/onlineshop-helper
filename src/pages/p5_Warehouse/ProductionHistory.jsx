import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebt } from "@/context/DebtContext";
import { useWarehouse } from "@/context/WarehouseContext";
import {
  formatNumber,
  formatTanggal,
  separateNumber,
} from "@/utils/generalFunction";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProductionHistory() {
  const { productionHistory, getProductionHistory, completeCut } =
    useWarehouse();
  const { getProductList } = useDebt();
  const navigate = useNavigate();
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    batch: {},
    result: 0,
    cutterPayment: 0,
  });

  useEffect(() => {
    getProductionHistory();
    getProductList();
  }, []);

  const markAsCompleteCut = (batch) => {
    setAlertDialog((prev) => ({
      ...prev,
      open: true,
      batch: batch,
    }));
  };

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

      {/* Alert Dialog */}
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(v) => {
          setAlertDialog((prev) => ({ ...prev, open: v }));
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Kamu Yakin ?</AlertDialogTitle>
            <AlertDialogDescription>
              Tandai <b>{alertDialog.batch.productName}</b> Selesai Dipotong
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Hasil Potong</FieldLabel>
                <Input
                  type="number"
                  required
                  value={alertDialog.result}
                  onChange={(e) => {
                    setAlertDialog((prev) => ({
                      ...prev,
                      result: e.target.value,
                    }));
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Bayar Pemotong Per PCS</FieldLabel>
                <Input
                  required
                  value={alertDialog.cutterPayment}
                  onChange={(e) => {
                    setAlertDialog((prev) => ({
                      ...prev,
                      cutterPayment: separateNumber(e),
                    }));
                  }}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!alertDialog.cutterPayment) {
                  toast.warning("Berapa Bayaran Pemotong ?");
                }
                if (!alertDialog.result) {
                  toast.warning("Berapa Potong Yang Didapat ?");
                } else {
                  completeCut(
                    alertDialog.batch,
                    alertDialog.result,
                    alertDialog.cutterPayment,
                  );
                  setAlertDialog((prev) => ({
                    ...prev,
                    cutterPayment: 0,
                    result: 0,
                  }));
                }
              }}
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                onClick={() => navigate("/warehouse/addBatchProduction")}
              >
                Buat Batch Produksi
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              {productionHistory.map((batch) => (
                <BatchProductionCard
                  batch={batch}
                  key={batch.id}
                  markAsCompleteCut={markAsCompleteCut}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getStatus = (batch) => {
  switch (batch.status) {
    case "cutting":
      return {
        status: "Di Potong",
        description: `Di Potong Pada ${formatTanggal(batch.time.startCutting)}`,
      };
    case "sewing":
      return {
        status: "Di Jahit",
        description: `Di Jahit Pada ${formatTanggal(batch.time.startSewing)}`,
      };
  }
};

const BatchProductionCard = ({ batch, markAsCompleteCut }) => {
  return (
    <>
      <Card className="min-w-[380px] max-w-[380px] h-fit">
        <CardHeader>
          <CardTitle>
            {batch.productName} - {batch.id}
          </CardTitle>
          <CardDescription>
            <p>Status : {getStatus(batch).status}</p>
            {batch.shippingCost && (
              <p>Ongkos Kirim : Rp {formatNumber(batch.shippingCost)}</p>
            )}
            <p>Total Belanja Bahan : Rp {formatNumber(batch.totalCost)}</p>
            {batch.status !== "cutting" && (
              <div>
                <p>Hasil Potong : {batch.stock.cutResult} Pcs</p>
                <Collapsible>
                  <CollapsibleTrigger>
                    <div className="underline cursor-pointer">
                      Biaya Pembuatan : RP{" "}
                      {formatNumber(batch.operationalCosts.total)}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="px-2 py-1 rounded-md">
                      {batch.operationalCosts.worker.map((w) => (
                        <li>
                          - {w.workerType} : Rp {formatNumber(w.payment)}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
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
                {batch?.materials.map((material) => (
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
        <CardFooter>
          {batch.status === "cutting" && (
            <Button
              className="cursor-pointer bg-green-700 hover:bg-green-600"
              onClick={() => markAsCompleteCut(batch)}
            >
              Tandai Selesai Di Potong <i className="bi bi-check-circle" />{" "}
            </Button>
          )}
          {batch.status === "sewing" && (
            <div>
              <Button className="bg-green-700 hover:bg-green-600">
                Biaya Pembuatan
                <i className="bi bi-plus-circle" />
              </Button>
              <Button
                className="cursor-pointer bg-orange-700 hover:bg-orange-600"
                onClick={() => markAsCompleteCut(batch)}
              >
                Selesai Di Jahit <i className="bi bi-check-circle" />{" "}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
};
