import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAlokasiPemasukan } from "../../context/AlokasiPemasukanContext";
import { formatNumber, validateNumber } from "../../utils/generalFunction";

export default function () {
  const { totalPenghasilan, setTotalPenghasilan } = useAlokasiPemasukan();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center flex-col py-3">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            Masukan Total Penarikan Dana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/alokasiPemasukan/calculateHPP");
            }}
            id="totalPenarikan"
          >
            <Input
              type="text"
              value={totalPenghasilan}
              placeholder="0"
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
          </form>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
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
        </CardFooter>
      </Card>
    </div>
  );
}
