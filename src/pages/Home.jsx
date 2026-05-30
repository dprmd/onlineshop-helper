import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { config } from "@/lib/variables";

const link = [
  {
    buttonName: "Alat",
    destination: "/tools",
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
      {config.skipSecurity && (
        <p className="text-red-500 text-2xl text-center animate-caret-blink">
          Security PIN Di Nonaktifkan
        </p>
      )}
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
