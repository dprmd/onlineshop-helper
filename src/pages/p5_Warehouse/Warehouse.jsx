import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const link = [
  {
    buttonName: "Riwayat Produksi",
    destination: "/warehouse/productionHistory",
  },
  {
    buttonName: "List Produk",
    destination: "/warehouse/products",
  },
];

export default function Warehouse() {
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
            <Button asChild>
              <Link to={url.destination}>{url.buttonName}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
