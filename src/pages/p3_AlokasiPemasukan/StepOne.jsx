import { useNavigate } from "react-router-dom";
import MyButton from "../../components/MyButton";
import { useAlokasiPemasukan } from "../../context/AlokasiPemasukanContext";
import { formatNumber, validateNumber } from "../../utils/generalFunction";
import { Button } from "@/components/ui/button";

export default function () {
  const { totalPenghasilan, setTotalPenghasilan } = useAlokasiPemasukan();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center flex-col py-3">
      <form
        className="border border-slate-400 rounded-md w-max mx-auto mt-3 p-4 max-w-[400px]"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/alokasiPemasukan/calculateHPP");
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
          <Button
            size="lg"
            onClick={() => {
              navigate("/");
            }}
          >
            Kembali
          </Button>

          {/* Selanjutnya */}
          <Button size="lg" type="submit" className="bg-green-700">
            Selanjutnya
          </Button>
        </div>
      </form>
    </div>
  );
}
