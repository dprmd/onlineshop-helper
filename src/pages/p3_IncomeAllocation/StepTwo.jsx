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
  const { supplier } = useCRUD();
  const productList = useMemo(() => {
    return supplier
      .find((s) => s.id === whichSupplier)
      ?.productDebt.map((p) => ({
        ...p,
        setor: 0,
      }));
  });
  const [setorBarang, setSetorBarang] = useState(productList);

  // Function
  const handleReset = () => {
    setSetorBarang(productList);
    setTotalHPP("");
    setSubmitOrder(1);
    setShowConclusion(false);
  };

  const handleCalculateHPP = (e) => {
    e.preventDefault();

    const total = setorBarang.reduce((acc, curr) => {
      return acc + Number(curr.setor) * curr.hpp;
    }, 0);
    setTotalHPP(formatNumber(total));

    if (total === 0) {
      alert("Masukkan jumlah produk terjual terlebih dahulu!");
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
                <Input
                  id={p.identifier}
                  autoComplete="off"
                  placeholder="0"
                  value={setorBarang[i].setor}
                  onChange={(e) => {
                    setSubmitOrder(1);
                    setShowConclusion(false);
                    setSetorBarang((prev) => {
                      return prev.map((prod) => {
                        if (prod.identifier === p.identifier) {
                          if (Number(e.target.value) > p.remaining) {
                            return { ...prod, setor: p.remaining };
                          }
                          return { ...prod, setor: e.target.value };
                        } else {
                          return prod;
                        }
                      });
                    });
                  }}
                />
              </Field>
            ))}
            {showConclusion && (
              <Field>
                <div className="border p-2 rounded-md text-center text-[12px]">
                  {setorBarang.map((barang) => {
                    if (Number(barang.setor > 0)) {
                      return (
                        <p key={barang.identifier}>
                          {barang.name} {barang.setor} x{" "}
                          {formatNumber(barang.hpp)} ={" "}
                          {formatNumber(barang.hpp * barang.setor)}
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
      </form>
    </div>
  );
}
