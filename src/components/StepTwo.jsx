import { formatNumber, raw } from "../utils/generalFunction";
import MyButton from "./MyButton";
import { hari, listProduk } from "../lib/variables";

const StepTwo = ({
  setProduk,
  setStep,
  penghasilanHPP,
  setPenghasilanHPP,
  showConclusion,
  setShowConclusion,
  submitOrder,
  setSubmitOrder,
  produkInArray,
}) => {
  // Function
  const handleReset = () => {
    setProduk(listProduk);
    setPenghasilanHPP("");
    setSubmitOrder(1);
    setShowConclusion(false);
  };

  const handlePerhitungan = (e) => {
    e.preventDefault();

    const total = produkInArray.reduce((acc, curr) => {
      return acc + curr.terjual * curr.hpp;
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

  return (
    <div>
      <form onSubmit={handlePerhitungan}>
        {produkInArray.map((item, index) => (
          <Terjual
            key={index}
            namaProduk={item.nama}
            setShowConclusion={setShowConclusion}
            setSubmitOrder={setSubmitOrder}
            state={item.terjual}
            setState={(value) => {
              setProduk((prev) => ({
                ...prev,
                [item.identifier]: {
                  ...prev[item.identifier],
                  terjual: value,
                },
              }));
            }}
          />
        ))}
        <div className="px-3 py-2">
          <MyButton
            buttonText="Kembali"
            buttonType="button"
            tailwindClass={"bg-red-500 mx-1 px-2 py-1"}
            onClick={() => {
              setStep(1);
            }}
          />

          <MyButton
            buttonText="Reset All"
            buttonType="button"
            tailwindClass={"bg-green-500 mx-1 px-2 py-1"}
            onClick={handleReset}
          />
          <MyButton
            buttonText={"Hitung"}
            buttonType={"submit"}
            tailwindClass={"bg-green-500 mx-1 px-2 py-1"}
          />
          {submitOrder === 2 && (
            <MyButton
              buttonText={"Selanjutnya"}
              buttonType={"button"}
              tailwindClass={"bg-green-500 mx-1 px-2 py-1"}
              onClick={() => {
                setStep(3);
              }}
            />
          )}
        </div>
      </form>

      {showConclusion && (
        <div className="p-3 flex flex-col gap-y-4">
          <div>
            <span className="font-bold text-xl">
              Total Penghasilan HPP: {formatNumber(penghasilanHPP)}
            </span>
          </div>
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border border-black border-collapse text-sm">
                <thead>
                  <tr className="font-bold text-center">
                    <th className="border border-black px-3 py-2">Hari</th>
                    {produkInArray.map((item, index) => (
                      <th className="border border-black px-3 py-2" key={index}>
                        {item.nama}
                      </th>
                    ))}
                    <th className="border border-black px-3 py-2">
                      Total Penghasilan HPP
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="text-center">
                    <td className="border border-black px-3 py-2 text-center whitespace-nowrap">
                      {hari}
                    </td>
                    {produkInArray.map((item, index) => (
                      <td className="border border-black px-3 py-2" key={index}>
                        {item.terjual}
                      </td>
                    ))}
                    <td className="border border-black px-3 py-2 text-center">
                      {formatNumber(penghasilanHPP)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Terjual = ({
  namaProduk,
  state,
  setState,
  setShowConclusion,
  setSubmitOrder,
}) => {
  return (
    <div className="input-components">
      <label htmlFor={namaProduk} className="block text-lg font-semibold">
        {namaProduk}
      </label>
      <input
        type="number"
        id={namaProduk}
        value={state}
        className="max-w-[150px]"
        placeholder="0"
        onChange={(e) => {
          setShowConclusion(false);
          setSubmitOrder(1);
          setState(e.target.value);
        }}
      />
      <div className="inline-block">
        <MyButton
          buttonText={"-"}
          buttonType={"button"}
          onClick={() => {
            if (state !== 0) {
              setShowConclusion(false);
              setSubmitOrder(1);
              setState(state - 1);
            }
          }}
          tailwindClass={"bg-slate-300 ml-2 mx-1 px-2 py-1"}
        />
        <MyButton
          buttonText={"+"}
          buttonType={"button"}
          onClick={() => {
            setShowConclusion(false);
            setSubmitOrder(1);
            setState(state + 1);
          }}
          tailwindClass={"bg-slate-300 mx-1 px-2 py-1"}
        />
        <MyButton
          buttonText={"Reset"}
          buttonType={"button"}
          onClick={() => {
            setState(0);
          }}
          tailwindClass={"bg-slate-300 mx-1 px-2 py-1"}
        />
      </div>
    </div>
  );
};

export default StepTwo;
