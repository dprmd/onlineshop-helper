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
import { useCRUDBarang } from "@/context/CRUDBarangContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlokasiPemasukan } from "../../context/AlokasiPemasukanContext";
import { formatNumber } from "../../utils/generalFunction";

const StepTwo = () => {
  const {
    penghasilanHPP,
    setPenghasilanHPP,
    showConclusion,
    setShowConclusion,
    submitOrder,
    setSubmitOrder,
    whichSupplier,
  } = useAlokasiPemasukan();
  const { supplier } = useCRUDBarang();
  const navigate = useNavigate();
  const choosedSupplier = supplier.find((s) => s.id === whichSupplier);
  const listBarang = useMemo(() => {
    return choosedSupplier?.hutangBarang.map((p) => ({
      ...p,
      setor: 0,
    }));
  });
  const [setorBarang, setSetorBarang] = useState(listBarang);

  // Function
  const handleReset = () => {
    setSetorBarang(listBarang);
    setPenghasilanHPP("");
    setSubmitOrder(1);
    setShowConclusion(false);
  };

  const handlePerhitungan = (e) => {
    e.preventDefault();

    const total = setorBarang.reduce((acc, curr) => {
      return acc + Number(curr.setor) * curr.hpp;
    }, 0);
    setPenghasilanHPP(formatNumber(total));

    if (total === 0) {
      alert("Masukkan jumlah produk terjual terlebih dahulu!");
      setShowConclusion(false);
      return;
    }

    setShowConclusion(true);
    setSubmitOrder(2);
  };

  useEffect(() => {
    if (!whichSupplier) {
      navigate("/alokasiPemasukan");
    }
  }, []);

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handlePerhitungan}
        className="mt-4 border px-4 py-3 min-w-[380px] rounded-md"
      >
        <FieldSet>
          <FieldLegend>Setor Barang</FieldLegend>
          <FieldDescription>Masukan Barang Yang Akan Di Setor</FieldDescription>
          <FieldGroup>
            {listBarang?.map((p, i) => (
              <Field>
                <FieldLabel htmlFor={p.identifier}>
                  <span>{p.name}</span>
                  <span className="text-[10px] text-gray-400">
                    Sisa {p.terjual}
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
                        <p>
                          {barang.name} {barang.setor} x{" "}
                          {formatNumber(barang.hpp)} ={" "}
                          {formatNumber(barang.hpp * barang.setor)}
                        </p>
                      );
                    }
                  })}
                  Total Setor : {formatNumber(penghasilanHPP)}
                </div>
              </Field>
            )}
            <Field>
              <Button
                type="button"
                onClick={() => {
                  navigate("/alokasiPemasukan");
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
                    navigate("/alokasiPemasukan/summary");
                  }}
                >
                  Selanjutnya
                </Button>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>
        {/* {choosedSupplier?.hutangBarang.map((item, index) => ( */}
        {/* <Terjual
          // key={index}
          // namaProduk={item.name}
          // setShowConclusion={setShowConclusion}
          // setSubmitOrder={setSubmitOrder}
          // state={item.terjual}
          // setState={(value) => {
          //   setProduk((prev) => ({
          //     ...prev,
          //     [item.identifier]: {
          //       ...prev[item.identifier],
          //       terjual: value,
          //     },
          //   }));
          // }}
        /> */}
        {/* ))} */}
      </form>
    </div>
  );
};

const Terjual = ({ daftarBarang }) => {
  return (
    <></>
    // <div className="input-components">
    //   <label htmlFor={namaProduk} className="block text-lg font-semibold">
    //     {namaProduk}
    //   </label>
    //   <input
    //     type="number"
    //     id={namaProduk}
    //     value={state}
    //     className="max-w-[150px]"
    //     placeholder="0"
    //     onChange={(e) => {
    //       setShowConclusion(false);
    //       setSubmitOrder(1);
    //       setState(e.target.value);
    //     }}
    //   />
    //   <div className="inline-block">
    //     <MyButton
    //       buttonText={"-"}
    //       buttonType={"button"}
    //       onClick={() => {
    //         if (state !== 0) {
    //           setShowConclusion(false);
    //           setSubmitOrder(1);
    //           setState(Number(state) - 1);
    //         }
    //       }}
    //       tailwindClass={"bg-slate-300 ml-2 mx-1 px-2 py-1"}
    //     />
    //     <MyButton
    //       buttonText={"+"}
    //       buttonType={"button"}
    //       onClick={() => {
    //         setShowConclusion(false);
    //         setSubmitOrder(1);
    //         setState(Number(state) + 1);
    //       }}
    //       tailwindClass={"bg-slate-300 mx-1 px-2 py-1"}
    //     />
    //     <MyButton
    //       buttonText={"Reset"}
    //       buttonType={"button"}
    //       onClick={() => {
    //         setState(0);
    //       }}
    //       tailwindClass={"bg-slate-300 mx-1 px-2 py-1"}
    //     />
    //   </div>
    // </div>
  );
};

export default StepTwo;
