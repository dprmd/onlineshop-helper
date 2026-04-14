import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCRUD } from "@/context/CRUDContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIncomeAllocation } from "../../context/IncomeAllocationContext";
import { separateNumber } from "../../utils/generalFunction";

export default function StepOne() {
  const { totalWithdraw, setTotalWithdraw, whichSupplier, setWhichSupplier } =
    useIncomeAllocation();
  const { supplier, getSupplierList, supplierInitialFetch } = useCRUD();

  const [errorSupplier, setErrorSupplier] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (supplierInitialFetch) {
      getSupplierList();
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col gap-y-4">
      {supplier.length > 0 ? (
        <div className="border px-4 py-3 rounded-md">
          <FieldSet>
            <FieldLegend>Supplier & Total Penarikan</FieldLegend>
            <FieldDescription>
              Mohon masukan supplier dan total penarikan dana
            </FieldDescription>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (whichSupplier) {
                  navigate("/incomeAllocation/calculateHPP");
                } else {
                  setErrorSupplier(true);
                }
              }}
              id="totalPenarikan"
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="supplier">Supplier</FieldLabel>
                  <Select
                    id="supplier"
                    required
                    value={whichSupplier}
                    onValueChange={(e) => {
                      setErrorSupplier(false);
                      setWhichSupplier(e);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {supplier.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errorSupplier && (
                    <FieldError>Mohon Pilih Supplier</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Total Penarikan Dana</FieldLabel>
                  <Input
                    type="text"
                    value={totalWithdraw}
                    placeholder="0"
                    autoComplete="off"
                    onChange={(e) => {
                      const value = separateNumber(e);
                      setTotalWithdraw(value);
                    }}
                    required
                  />
                </Field>
                <Field>
                  <Button
                    size="lg"
                    type="button"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Kembali
                  </Button>

                  {/* Selanjutnya */}
                  <Button
                    size="lg"
                    type="submit"
                    className="bg-green-700"
                    form="totalPenarikan"
                  >
                    Selanjutnya
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </FieldSet>
        </div>
      ) : (
        <div className="text-center">
          <p>Mohon Tambahkan Supplier Terlebih Dahulu</p>
          <Button
            type="button"
            onClick={() => {
              navigate("/crud/supplier");
            }}
            className="my-2"
          >
            Tambah Supplier
          </Button>
        </div>
      )}
    </div>
  );
}
