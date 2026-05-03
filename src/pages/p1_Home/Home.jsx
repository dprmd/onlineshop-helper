import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const link = [
  {
    buttonName: "Perhitungan Profit",
    destination: "/profitCalculation",
  },
  {
    buttonName: "Penghasilan",
    destination: "/income",
  },
  {
    buttonName: "Hutang Barang",
    destination: "/debt",
  },
  {
    buttonName: "Gudang Saya",
    destination: "/warehouse",
  },
];

export default function Home() {
  return (
    <div>
      <h3 className="text-center text-2xl my-4 font-bold">
        Hallo Selamat Datang 😄
      </h3>
      <ul className="text-center flex flex-col gap-y-2 justify-center">
        {link.map((url) => (
          <li key={url.buttonName}>
            <Button asChild>
              <Link to={url.destination}>{url.buttonName}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
