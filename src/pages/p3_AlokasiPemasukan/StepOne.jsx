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
import { useCRUDBarang } from "@/context/CRUDBarangContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlokasiPemasukan } from "../../context/AlokasiPemasukanContext";
import { formatNumber, validateNumber } from "../../utils/generalFunction";

export default function () {
  const {
    totalPenghasilan,
    setTotalPenghasilan,
    whichSupplier,
    setWhichSupplier,
  } = useAlokasiPemasukan();
  const { supplier, getSupplierList, initialFetch } = useCRUDBarang();

  const [errorSupplier, setErrorSupplier] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialFetch) {
      getSupplierList();
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col gap-y-4 px-4 py-3">
      {supplier.length > 0 ? (
        <FieldSet>
          <FieldLegend>Supplier & Total Penarikan</FieldLegend>
          <FieldDescription>
            Mohon masukan supplier dan total penarikan dana
          </FieldDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (whichSupplier) {
                navigate("/alokasiPemasukan/calculateHPP");
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
                {errorSupplier && <FieldError>Mohon Pilih Supplier</FieldError>}
              </Field>
              <Field>
                <FieldLabel>Total Penarikan Dana</FieldLabel>
                <Input
                  type="text"
                  value={totalPenghasilan}
                  placeholder="0"
                  autoComplete="off"
                  onChange={(e) => {
                    const number = validateNumber(e);
                    if (!number) {
                      setTotalPenghasilan("");
                    } else {
                      setTotalPenghasilan(formatNumber(number));
                    }
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
      ) : (
        <div className="text-center">
          <p>Mohon Tambahkan Supplier Terlebih Dahulu</p>
          <Button
            type="button"
            onClick={() => {
              navigate("/crudBarang/supplier");
            }}
            className="my-2"
          >
            Tambah Barang
          </Button>
        </div>
      )}
    </div>
  );
}
