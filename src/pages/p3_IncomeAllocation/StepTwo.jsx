import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCRUD } from "@/context/CRUDContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIncomeAllocation } from "../../context/IncomeAllocationContext";
import { formatNumber } from "../../utils/generalFunction";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function StepTwo() {
  const {
    totalHPP,
    setTotalHPP,
    showConclusion,
    setShowConclusion,
    submitOrder,
    setSubmitOrder,
    whichSupplier,
    modifiedSetorBarang,
    setModifiedSetorBarang,
  } = useIncomeAllocation();
  const navigate = useNavigate();
  const { supplier } = useCRUD();
  const productList = useMemo(() => {
    return supplier
      .find((s) => s.id === whichSupplier)
      ?.productDebt.map((p) => ({
        ...p,
        sold: 0,
      }));
  }, [supplier, whichSupplier]);
  const [setorBarang, setSetorBarang] = useState(productList);
  const [dialog, setDialog] = useState({
    open: false,
    currentValue: 0,
    newValue: 0,
  });

  // Function
  const handleReset = () => {
    setSetorBarang(productList);
    setTotalHPP("");
    setSubmitOrder(1);
    setShowConclusion(false);
    setModifiedSetorBarang(productList);
  };

  const handleCalculateHPP = (e) => {
    e.preventDefault();

    const total = setorBarang.reduce((acc, curr) => {
      return acc + Number(curr.sold) * Number(curr.hpp);
    }, 0);
    setTotalHPP(formatNumber(total));

    if (total === 0) {
      toast.info("Masukkan jumlah produk terjual terlebih dahulu!");
      setShowConclusion(false);
      return;
    }

    setModifiedSetorBarang([...setorBarang]);
    setShowConclusion(true);
    setSubmitOrder(2);
  };

  useEffect(() => {
    if (!whichSupplier) {
      navigate("/incomeAllocation");
    }

    if (modifiedSetorBarang.length > 0) {
      setSetorBarang([...modifiedSetorBarang]);
    }
  }, []);

  const handleSumSold = () => {
    const total = Number(dialog.newValue) + Number(dialog.currentValue);
    setSetorBarang((prev) => {
      return prev.map((prod) => {
        if (prod.identifier === dialog.product.identifier) {
          return { ...prod, sold: total };
        } else {
          return prod;
        }
      });
    });
    setDialog({
      open: false,
      currentValue: 0,
      newValue: 0,
      product: {},
    });
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleCalculateHPP}
        className="mt-4 border px-4 py-3 min-w-[380px] rounded-md"
      >
        <FieldSet>
          <FieldLegend>Setor Barang</FieldLegend>
          <FieldDescription>Masukan Barang Yang Akan Di Setor</FieldDescription>
          <FieldGroup>
            {productList?.map((p, i) => (
              <Field key={p.identifier}>
                <FieldLabel htmlFor={p.identifier}>
                  <span>{p.name}</span>
                  <span className="text-[10px] text-gray-400">
                    Sisa {p.remaining}
                  </span>
                </FieldLabel>
                <div className="flex gap-x-2">
                  <Input
                    id={p.identifier}
                    autoComplete="off"
                    placeholder="0"
                    value={setorBarang[i].sold}
                    onChange={(e) => {
                      setSubmitOrder(1);
                      setShowConclusion(false);
                      setSetorBarang((prev) => {
                        return prev.map((prod) => {
                          if (prod.identifier === p.identifier) {
                            if (Number(e.target.value) > p.remaining) {
                              return { ...prod, sold: p.remaining };
                            }
                            return { ...prod, sold: e.target.value };
                          } else {
                            return prod;
                          }
                        });
                      });
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setDialog({
                        open: true,
                        currentValue: setorBarang[i].sold,
                        product: p,
                      });
                    }}
                  >
                    +
                  </Button>
                </div>
              </Field>
            ))}
            {showConclusion && (
              <Field>
                <div className="border p-2 rounded-md text-center text-[12px]">
                  {setorBarang.map((barang) => {
                    if (Number(barang.sold > 0)) {
                      return (
                        <p key={barang.identifier}>
                          {barang.name} {barang.sold} x{" "}
                          {formatNumber(barang.hpp)} ={" "}
                          {formatNumber(barang.hpp * barang.sold)}
                        </p>
                      );
                    }
                  })}
                  Total Setor : {formatNumber(totalHPP)}
                </div>
              </Field>
            )}
            <Field>
              <Button
                type="button"
                onClick={() => {
                  navigate("/incomeAllocation");
                }}
              >
                Kembali
              </Button>
              <Button type="button" onClick={handleReset}>
                Reset All
              </Button>
              <Button type="submit">Hitung</Button>
              {submitOrder === 2 && (
                <Button
                  type="button"
                  onClick={() => {
                    navigate("/incomeAllocation/summary");
                  }}
                >
                  Selanjutnya
                </Button>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>
        <Dialog
          open={dialog.open}
          onOpenChange={(v) => {
            setDialog({
              open: v,
            });
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah</DialogTitle>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Terjual</FieldLabel>
                    <Input
                      value={dialog.newValue}
                      onChange={(e) => {
                        setDialog((prev) => ({
                          ...prev,
                          newValue: e.target.value,
                        }));
                      }}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Batal</Button>
              </DialogClose>
              <Button type="button" onClick={handleSumSold}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
}
