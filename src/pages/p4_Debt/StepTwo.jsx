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
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebt } from "@/context/DebtContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIncomeAllocation } from "../../context/IncomeAllocationContext";
import { formatNumber } from "../../utils/generalFunction";

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
  const { supplier } = useDebt();
  const productList = useMemo(() => {
    return supplier
      .find((s) => s.id === whichSupplier)
      ?.productDebt.map((p) => ({
        ...p,
        sold: 0,
      }));
  }, [supplier, whichSupplier]);
  const [setorBarang, setSetorBarang] = useState(productList);
  const [valueOnPopover, setValueOnPopover] = useState({
    value: 0,
    products: [],
    popList: {},
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
      navigate("/debt/incomeAllocation");
    }

    if (modifiedSetorBarang.length > 0) {
      setSetorBarang([...modifiedSetorBarang]);
    }
  }, []);

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
            {productList?.map((produk, i) => (
              <Field key={produk.identifier}>
                <FieldLabel htmlFor={produk.identifier} className="px-12">
                  <span>{produk.name}</span>
                  <span className="text-[10px] text-gray-400">
                    Sisa {produk.remaining}
                  </span>
                </FieldLabel>
                <div className="flex gap-x-2">
                  <Button
                    className="bi bi-x-circle"
                    type="button"
                    onClick={() => {
                      setSetorBarang((barang) => {
                        return barang.map((bar) => {
                          if (bar.identifier === produk.identifier) {
                            return { ...bar, sold: 0 };
                          } else {
                            return bar;
                          }
                        });
                      });
                      setShowConclusion(false);
                    }}
                  />
                  <Input
                    id={produk.identifier}
                    autoComplete="off"
                    placeholder="0"
                    value={setorBarang[i].sold}
                    onChange={(e) => {
                      setSubmitOrder(1);
                      setShowConclusion(false);
                      setSetorBarang((prev) => {
                        return prev.map((prod) => {
                          if (prod.identifier === produk.identifier) {
                            if (Number(e.target.value) > produk.remaining) {
                              return { ...prod, sold: produk.remaining };
                            }
                            return { ...prod, sold: e.target.value };
                          } else {
                            return prod;
                          }
                        });
                      });
                    }}
                  />
                  <Popover
                    open={valueOnPopover.popList[produk.identifier]}
                    onOpenChange={(v) => {
                      setValueOnPopover((prev) => {
                        return {
                          ...prev,
                          value: 0,
                          popList: {
                            ...prev.popList,
                            [produk.identifier]: v,
                          },
                        };
                      });
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => {
                          setValueOnPopover((prev) => {
                            return {
                              ...prev,
                              products: produk,
                              popList: {
                                ...prev.popList,
                                [produk.identifier]: true,
                              },
                            };
                          });
                        }}
                      >
                        +
                      </Button>
                    </PopoverTrigger>
                    {/* </PopoverTrigger> */}
                    <PopoverContent className="max-w-[100px]">
                      <PopoverHeader>
                        <PopoverTitle>Tambah</PopoverTitle>
                        <FieldSet>
                          <FieldGroup>
                            <Field>
                              <Input
                                value={valueOnPopover.value}
                                onChange={(e) => {
                                  setValueOnPopover((prev) => ({
                                    ...prev,
                                    value: e.target.value,
                                  }));
                                }}
                                onKeyUp={(e) => {
                                  if (e.key === "Enter") {
                                    const total =
                                      Number(valueOnPopover.value) +
                                      Number(setorBarang[i].sold);
                                    setSetorBarang((prev) => {
                                      return prev.map((prod) => {
                                        if (
                                          prod.identifier ===
                                          valueOnPopover.products.identifier
                                        ) {
                                          if (
                                            Number(total) > produk.remaining
                                          ) {
                                            return {
                                              ...prod,
                                              sold: produk.remaining,
                                            };
                                          } else {
                                            return { ...prod, sold: total };
                                          }
                                        } else {
                                          return prod;
                                        }
                                      });
                                    });
                                    setValueOnPopover((prev) => ({
                                      ...prev,
                                      popList: {
                                        ...prev.popList,
                                        [produk.identifier]: false,
                                      },
                                      value: 0,
                                    }));
                                  }
                                }}
                              />
                            </Field>
                          </FieldGroup>
                        </FieldSet>
                      </PopoverHeader>
                    </PopoverContent>
                  </Popover>
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
                  navigate("/debt/incomeAllocation");
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
                    navigate("/debt/incomeAllocation/summary");
                  }}
                >
                  Selanjutnya
                </Button>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
