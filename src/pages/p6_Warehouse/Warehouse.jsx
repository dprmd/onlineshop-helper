import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const link = [
  {
    buttonName: "Riwayat Produksi",
    destination: "/warehouse/productionHistory",
  },
];

export default function Warehouse() {
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col justify-center items-center gap-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Gudang Saya</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ul className="text-center flex flex-col justify-center gap-y-2">
        {link.map((url) => (
          <li key={url.destination}>
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
