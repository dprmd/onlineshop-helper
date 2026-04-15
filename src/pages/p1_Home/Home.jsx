import { Button } from "@/components/ui/button";
import { deleteCollection } from "@/services/firebase/docService";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleClickMe = async () => {
    deleteCollection("penghasilanJualanOnlineShopee");
    deleteCollection("penghasilanJualanOnlineTikTok");
  };

  return (
    <div>
      <h3 className="text-center text-2xl my-4 font-bold">
        Hallo Selamat Datang 😄
      </h3>
      <ul className="text-center flex flex-col gap-y-2 justify-center">
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/profitCalculation");
            }}
          >
            Perhitungan Profit
          </Button>
        </li>
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/incomeAllocation");
            }}
          >
            Alokasi Pemasukan
          </Button>
        </li>
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/income");
            }}
          >
            Penghasilan
          </Button>
        </li>
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/crud");
            }}
          >
            CRUD Barang
          </Button>
        </li>

        {/* <li>
          <Button onClick={handleClickMe}>Click Me</Button>
        </li> */}
      </ul>
    </div>
  );
}
