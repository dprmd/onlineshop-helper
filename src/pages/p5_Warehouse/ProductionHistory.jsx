import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSecurity } from "@/context/SecurityContext";
import { useWarehouse } from "@/context/WarehouseContext";
import {
  formatDate,
  formatNumber,
  formatTanggal,
  separateNumber,
} from "@/utils/generalFunction";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function ProductionHistory() {
  const {
    productionHistory,
    getProductionHistory,
    completeCut,
    completeSewing,
    completePacking,
    addProductionCost,
  } = useWarehouse();
  const { setOpenPin } = useSecurity();
  const [alertDialogMissingProduct, setAlertDialogMissingProduct] =
    useState(false);
  const initialAlertDialog = {
    open: false,
    status: "",
    batch: {},
    result: 0,
    cutterPayment: 0,
    packingCost: 0,
    qc: {
      quota: 0,
      qcPassed: 0,
      damaged: 0,
      missing: 0,
    },
  };
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const initialEditedBatch = {
    openAddCost: false,
    batchId: "",
    workerPayments: [],
  };
  const [editedBatch, setEditedBatch] = useState(initialEditedBatch);

  const markAsCompleteCut = (batch) => {
    setAlertDialog((prev) => ({
      ...prev,
      open: true,
      batch,
      status: "completeCut",
    }));
  };

  const markAsCompleteSewing = (batch) => {
    setAlertDialog((prev) => ({
      ...prev,
      open: true,
      batch: batch,
      status: "completeSewing",
    }));
  };

  const markAsCompletePacking = (batch) => {
    setAlertDialog((prev) => ({
      ...prev,
      open: true,
      qc: {
        ...prev.qc,
        quota: batch.stock.cutResult,
      },
      batch: batch,
      status: "completePacking",
    }));
  };

  const handleCompleteCut = () => {
    if (!alertDialog.result) {
      toast.warning("Berapa Potong Yang Didapat ?");
    } else if (!alertDialog.cutterPayment) {
      toast.warning("Berapa Bayaran Pemotong ?");
    } else if (!alertDialog.packingCost) {
      toast.warning("Berapa Biaya Packing ?");
    } else {
      setOpenPin({
        open: true,
        actionOnMatch: async () => {
          await completeCut(
            alertDialog.batch,
            alertDialog.result,
            alertDialog.cutterPayment,
            alertDialog.packingCost,
          );
          setAlertDialog(initialAlertDialog);
        },
      });
    }
  };

  const handleCompleteSewing = () => {
    setOpenPin({
      open: true,
      actionOnMatch: async () => {
        await completeSewing(alertDialog.batch);
        setAlertDialog(initialAlertDialog);
      },
    });
  };

  const handleCompletePacking = () => {
    const totalMustBe = alertDialog.batch.stock.cutResult;
    const qcPassed = Number(alertDialog.qc.qcPassed);
    const damaged = Number(alertDialog.qc.damaged);
    const checkTotal = qcPassed + damaged === totalMustBe;
    const missingMarked = Number(alertDialog.qc.missing) > 0;

    if (qcPassed === 0) {
      toast.warning("Mohon Masukan Jumlah Produk Yang Lolos Quality Control");
    } else if (!checkTotal && !missingMarked) {
      setAlertDialogMissingProduct(true);
    } else {
      setOpenPin({
        open: true,
        actionOnMatch: async () => {
          await completePacking(alertDialog.batch, alertDialog.qc);
          setAlertDialog(initialAlertDialog);
        },
      });
    }
  };

  useEffect(() => {
    getProductionHistory();
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

      {/* Dialog Tambah Biaya Pembuatan*/}
      <Dialog
        open={editedBatch.openAddCost}
        onOpenChange={(v) => {
          setEditedBatch({ ...initialEditedBatch, openAddCost: v });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Biaya Pembuatan</DialogTitle>
          </DialogHeader>
          <div>
            {editedBatch.workerPayments.length > 0 && (
              <FieldSet>
                <FieldGroup>
                  {editedBatch.workerPayments.map((wrkr, i) => (
                    <div className="flex flex-row gap-x-2" key={i}>
                      <Field>
                        <FieldLabel>Role</FieldLabel>
                        <Input
                          value={wrkr.role}
                          required
                          onChange={(e) => {
                            setEditedBatch((batch) => ({
                              ...batch,
                              workerPayments: batch.workerPayments.map(
                                (wrkrr) => {
                                  if (wrkrr.id === wrkr.id) {
                                    return {
                                      ...wrkrr,
                                      role: e.target.value,
                                    };
                                  } else {
                                    return wrkrr;
                                  }
                                },
                              ),
                            }));
                          }}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Bayaran per PCS</FieldLabel>
                        <Input
                          value={wrkr.payment}
                          required
                          onChange={(e) => {
                            setEditedBatch((batch) => ({
                              ...batch,
                              workerPayments: batch.workerPayments.map(
                                (wrkrr) => {
                                  if (wrkrr.id === wrkr.id) {
                                    return {
                                      ...wrkrr,
                                      payment: separateNumber(e),
                                    };
                                  } else {
                                    return wrkrr;
                                  }
                                },
                              ),
                            }));
                          }}
                        />
                      </Field>
                      <Field className="max-w-[40px]">
                        <FieldLabel>Act</FieldLabel>
                        <Button
                          className="bi bi-trash"
                          onClick={() => {
                            setEditedBatch((batch) => ({
                              ...batch,
                              workerPayments: batch.workerPayments.filter(
                                (wrkrr) => wrkrr.id !== wrkr.id,
                              ),
                            }));
                          }}
                        />
                      </Field>
                    </div>
                  ))}
                </FieldGroup>
              </FieldSet>
            )}
            <Button
              className="my-2"
              onClick={() => {
                setEditedBatch((prev) => {
                  return {
                    ...prev,
                    workerPayments: [
                      ...prev.workerPayments,
                      {
                        id: new Date().getTime(),
                        role: "",
                        payment: "",
                      },
                    ],
                  };
                });
              }}
            >
              Tambah Biaya
            </Button>
            <Button
              onClick={() => {
                if (editedBatch.workerPayments.length === 0) {
                  toast.warning("Tidak Menambah Biaya Apapun");
                  setEditedBatch(initialEditedBatch);
                  return;
                }

                const validateWorker = editedBatch.workerPayments.map((w) => {
                  if (w.role && w.payment) {
                    return "yes";
                  } else {
                    return "no";
                  }
                });

                if (validateWorker.includes("no")) {
                  toast.warning("Mohon Masukan Info Biaya Dengan Benar");
                  return;
                } else {
                  setOpenPin({
                    open: true,
                    actionOnMatch: async () => {
                      await addProductionCost(editedBatch);
                      setEditedBatch(initialEditedBatch);
                    },
                  });
                }
              }}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Missing Product */}
      <AlertDialog
        open={alertDialogMissingProduct}
        onOpenChange={setAlertDialogMissingProduct}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quantitas Produk Tidak Sama</AlertDialogTitle>
            <AlertDialogDescription>
              <p>Jumlah Produk Yang Kamu Masukan Tidak Sama</p>
              <p>
                Harus Ada Total{" "}
                {formatNumber(alertDialog.batch?.stock?.cutResult)} Pcs
              </p>
              <p>Apa Mungkin Produk Hilang ?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setAlertDialogMissingProduct(false);
              }}
            >
              Kembali
            </Button>
            <Button
              type="button"
              onClick={() => {
                const totalMustBe = alertDialog.batch.stock.cutResult;
                const qcPassed = Number(alertDialog.qc.qcPassed);
                const damaged = Number(alertDialog.qc.damaged);
                const merged = qcPassed + damaged;

                setAlertDialog((prev) => ({
                  ...prev,
                  qc: {
                    ...prev.qc,
                    missing: totalMustBe - merged,
                  },
                }));

                setAlertDialogMissingProduct(false);
              }}
            >
              Tandai Hilang
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              Tandai <b>{alertDialog.batch.productName}</b> Selesai{" "}
              {alertDialog.status === "completeCut" && "Di Potong"}{" "}
              {alertDialog.status === "completeSewing" && "Di Jahit"}
              {alertDialog.status === "completeSewing" && (
                <p>Cek Juga Apakah Biaya Pembuatan Sudah Fix</p>
              )}
              {alertDialog.status === "completePacking" && "Di Packing"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {alertDialog.status === "completeCut" && (
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
                <Field>
                  <FieldLabel>Biaya Packing Per PCS</FieldLabel>
                  <Input
                    required
                    value={alertDialog.packingCost}
                    onChange={(e) => {
                      setAlertDialog((prev) => ({
                        ...prev,
                        packingCost: separateNumber(e),
                      }));
                    }}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          )}
          {alertDialog.status === "completePacking" && (
            <FieldSet>
              <p className="text-sm text-gray-500">
                Total Harus Ada{" "}
                {formatNumber(alertDialog.batch?.stock?.cutResult)} Pcs
                <br />
                {alertDialog.qc.missing > 0 && (
                  <p className="text-sm text-gray-500">
                    Di Tandai Hilang {formatNumber(alertDialog.qc.missing)} Pcs
                    <i className="mx-1 bi bi-check-circle" />
                  </p>
                )}
              </p>
              <FieldGroup>
                <Field>
                  <FieldLabel>Produk Lolos Quality Control</FieldLabel>
                  <Input
                    value={alertDialog.qc.qcPassed}
                    type="number"
                    onChange={(e) => {
                      let newValue = 0;
                      let updatedQuota = 0;
                      const realQuota = alertDialog.batch.stock.cutResult;
                      const value = Number(e.target.value);
                      const damaged = Number(alertDialog.qc.damaged);
                      const alocatedQuota = realQuota - damaged;

                      if (value > alocatedQuota) {
                        newValue = alocatedQuota;
                      } else {
                        newValue = e.target.value;
                        updatedQuota = alocatedQuota - value;
                      }

                      setAlertDialog((prev) => ({
                        ...prev,
                        qc: {
                          ...prev.qc,
                          qcPassed: newValue,
                          quota: updatedQuota,
                          missing: 0,
                        },
                      }));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel>Produk Rusak / Cacat</FieldLabel>
                  <Input
                    value={alertDialog.qc.damaged}
                    type="number"
                    onChange={(e) => {
                      let newValue = 0;
                      let updatedQuota = 0;
                      const realQuota = alertDialog.batch.stock.cutResult;
                      const value = Number(e.target.value);
                      const qcPassed = Number(alertDialog.qc.qcPassed);
                      const alocatedQuota = realQuota - qcPassed;

                      if (value > alocatedQuota) {
                        newValue = alocatedQuota;
                      } else {
                        newValue = e.target.value;
                        updatedQuota = alocatedQuota - value;
                      }

                      setAlertDialog((prev) => ({
                        ...prev,
                        qc: {
                          ...prev.qc,
                          damaged: newValue,
                          quota: updatedQuota,
                          missing: 0,
                        },
                      }));
                    }}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button
              type="button"
              onClick={() => {
                switch (alertDialog.status) {
                  case "completeCut":
                    handleCompleteCut();
                    return;
                  case "completeSewing":
                    handleCompleteSewing();
                    return;
                  case "completePacking":
                    handleCompletePacking();
                    return;
                  default:
                    return;
                }
              }}
            >
              Lanjutkan
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Jika Tidak Ada Riwayat Produksi */}
      {productionHistory.length === 0 && (
        <div className="text-center">
          <p className="text-xl text-gray-600 my-2">
            Tidak Ada Riwayat Produksi
          </p>
        </div>
      )}

      <Button type="submit" asChild>
        <Link to="/warehouse/addBatchProduction">Buat Batch Produksi</Link>
      </Button>

      {/* List Riwayat Produksi */}
      <div>
        {productionHistory.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {productionHistory.map((batch) => (
              <BatchProductionCard
                batch={batch}
                key={batch.id}
                markAsCompleteCut={markAsCompleteCut}
                markAsCompleteSewing={markAsCompleteSewing}
                markAsCompletePacking={markAsCompletePacking}
                openDialogAddCost={setEditedBatch}
              />
            ))}
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
    case "toPack":
      return {
        status: "Sedang Di Packing",
        description: "Packing, Hitung Produk Cacat + Input Stock Ke Gudang",
      };
    default:
      return {
        status: "Tidak Ada Informasi",
        description: "Tidak Ada Informasi",
      };
  }
};

const getTimeKey = (key) => {
  switch (key) {
    case "startCutting":
      return "Di Potong Pada";
    case "endCutting":
      return "Selesai Di Potong";
    case "startSewing":
      return "Mulai Jahit";
    case "endSewing":
      return "Selesai Jahit";
    case "startPacking":
      return "Mulai Packing";
    case "endPacking":
      return "Selesai Packing";
  }
};

const BatchProductionCard = ({
  batch,
  markAsCompleteCut,
  markAsCompleteSewing,
  markAsCompletePacking,
  openDialogAddCost,
}) => {
  const getProductVariant = () => {
    if (batch.productRelation.isHaveVariant) {
      return batch.productRelation.variation.find(
        (v) => v.id === batch.productVariantId,
      ).name;
    } else {
      return null;
    }
  };

  return (
    <Card className="min-w-[380px] max-w-[380px] h-fit">
      <CardHeader>
        <CardTitle>
          {batch.productRelation.id}{" "}
          {getProductVariant() && `- ${getProductVariant()}`}
        </CardTitle>
        <CardDescription>
          <p>Status : {getStatus(batch).status}</p>
          {batch.status !== "cutting" && (
            <div>
              <p>Hasil Potong : {batch.stock.cutResult} Pcs</p>
              <p>HPP : Rp {formatNumber(batch.hpp)}</p>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-2">
          <Collapsible>
            <CollapsibleTrigger>
              <div className="border px-2 py-1 rounded-lg border-gray-300 cursor-pointer hover:bg-gray-100">
                Total Belanja Bahan : Rp {formatNumber(batch.totalFabricCost)}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul>
                {batch.shippingCost !== 0 && (
                  <li className="px-2 py-1 my-1 border-1 border-gray-200 rounded-lg text-gray-500">
                    <p>Ongkos Kirim : Rp {formatNumber(batch.shippingCost)}</p>
                  </li>
                )}
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
          {batch.status !== "cutting" && (
            <Collapsible>
              <CollapsibleTrigger>
                <div className="border px-2 py-1 rounded-lg border-gray-300 cursor-pointer hover:bg-gray-100">
                  Biaya Pembuatan : Rp{" "}
                  {formatNumber(batch.operationalCosts.total)}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="px-2 py-1 rounded-xl border my-1">
                  {batch.operationalCosts.worker.map((w, i) => (
                    <li key={i}>
                      - {w.role} : Rp {formatNumber(w.payment)}
                    </li>
                  ))}
                  <li>
                    - Packing : Rp{" "}
                    {formatNumber(batch.operationalCosts.packingCost)}
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )}
          <Collapsible>
            <CollapsibleTrigger>
              <div className="border px-2 py-1 rounded-lg border-gray-300 cursor-pointer hover:bg-gray-100">
                Informasi Waktu
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul>
                {Object.entries(batch?.time)
                  .sort((a, b) => a[1] - b[1])
                  .map((time, i) => (
                    <li
                      key={i}
                      className="px-2 py-1 my-1 border-1 border-gray-200 rounded-lg text-gray-500 flex justify-between items-center"
                    >
                      <p>{getTimeKey(time[0])}</p>
                      <p>{formatDate(time[1])}</p>
                    </li>
                  ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      <CardFooter>
        {batch.status === "cutting" && (
          <Button
            className="bg-green-700 hover:bg-green-600"
            onClick={() => markAsCompleteCut(batch)}
            key={1}
          >
            Tandai Selesai Di Potong <i className="bi bi-check-circle" />{" "}
          </Button>
        )}
        {batch.status === "sewing" && (
          <div>
            <Button
              className="bg-green-700 hover:bg-green-600"
              onClick={() => {
                openDialogAddCost((prev) => ({
                  ...prev,
                  openAddCost: true,
                  batchId: batch.id,
                }));
              }}
              key={2}
            >
              <i className="bi bi-plus-circle" />
              Biaya Pembuatan
            </Button>
            <Button
              className="bg-orange-700 hover:bg-orange-600"
              onClick={() => markAsCompleteSewing(batch)}
              key={3}
            >
              <i className="bi bi-check-circle" />
              Selesai Di Jahit{" "}
            </Button>
          </div>
        )}
        {batch.status === "toPack" && (
          <Button
            className="bg-cyan-600"
            key={4}
            onClick={() => markAsCompletePacking(batch)}
          >
            <i className="bi bi-check-circle" />
            Tandai Selesai Di Packing
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
