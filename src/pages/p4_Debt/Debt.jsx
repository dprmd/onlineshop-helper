import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useDebt } from "@/context/DebtContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const link = [
  {
    buttonName: "Supplier",
    destination: "/debt/supplier",
  },
  {
    buttonName: "Update Hutang Barang",
    destination: "/debt/updateProductDebt",
  },
  {
    buttonName: "Produk",
    destination: "/debt/productsDebt",
  },
  {
    buttonName: "Riwayat Perubahan Hutang",
    destination: "/debt/debtChanges",
  },
  {
    buttonName: "Alokasi Pemasukan",
    destination: "/debt/incomeAllocation",
  },
];

export default function Debt() {
  const navigate = useNavigate();
  const { getSupplierList } = useDebt();

  useEffect(() => {
    getSupplierList();
  }, []);

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
            <BreadcrumbPage>Hutang Barang</BreadcrumbPage>
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
