import { useNavigate } from "react-router-dom";
import { formatNumber, validateNumber } from "../utils/generalFunction";
import MyButton from "./MyButton";
import { useAlokasiPemasukan } from "../context/AlokasiPemasukanContext";
import { usePenghasilan } from "../context/PenghasilanContext";

export default function () {
  const { totalPenghasilan, setTotalPenghasilan } = useAlokasiPemasukan();
  const { penghasilanHPPAT } = usePenghasilan();
  const navigate = useNavigate();

  console.log(penghasilanHPPAT);

  return (
    <div className="flex justify-center items-center flex-col py-3">
      <form
        className="border border-slate-400 rounded-md w-max mx-auto mt-3 p-4 max-w-[400px]"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/AlokasiPemasukan/calculateHPP");
        }}
      >
        {/* Input Total Penarikan Dana */}
        <div className="input-components">
          <label className="block" htmlFor="totalPenarikanDana">
            Masukan Total Penarikan Dana :
          </label>
          <input
            type="text"
            id="totalPenarikanDana"
            value={totalPenghasilan}
            className="max-w-full"
            required={true}
            onChange={(e) => {
              const number = validateNumber(e);
              setTotalPenghasilan(formatNumber(number));
            }}
            placeholder="Isi di sini . . ."
          />
        </div>

        {/* Tombol Navigasi */}
        <div className="input-components">
          <MyButton
            buttonText={"Kembali"}
            buttonType={"button"}
            onClick={() => {
              navigate("/");
            }}
            tailwindClass={"bg-red-500  mx-1 px-2 py-1"}
          />

          {/* Selanjutnya */}
          <MyButton
            buttonText={"Selanjutnya"}
            buttonType={"submit"}
            tailwindClass={"bg-green-500  mx-1 px-2 py-1"}
          />
        </div>
      </form>
    </div>
  );
}
