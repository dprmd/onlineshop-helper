import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const link = [
  {
    buttonName: "Perhitungan Profit",
    destination: "/profitCalculation",
  },
  {
    buttonName: "Alokasi Pemasukan",
    destination: "/incomeAllocation",
  },
  {
    buttonName: "Penghasilan",
    destination: "/income",
  },
  {
    buttonName: "Data Barang",
    destination: "/crud",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-center text-2xl my-4 font-bold">
        Hallo Selamat Datang 😄
      </h3>
      <ul className="text-center flex flex-col gap-y-2 justify-center">
        {link.map((url) => (
          <li key={url.buttonName}>
            <Button
              size="lg"
              onClick={() => {
                navigate(url.destination);
              }}
            >
              {url.buttonName}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
