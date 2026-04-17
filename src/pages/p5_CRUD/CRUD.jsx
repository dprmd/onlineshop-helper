import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useCRUD } from "@/context/CRUDContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const link = [
  {
    buttonName: "Supplier",
    destination: "/crud/supplier",
  },
  {
    buttonName: "Update Hutang Barang",
    destination: "/crud/updateProductDebt",
  },
  {
    buttonName: "Produk",
    destination: "/crud/products",
  },
  {
    buttonName: "Riwayat Produksi",
    destination: "/crud/productionHistory",
  },
];

export default function CRUD() {
  const navigate = useNavigate();
  const { getSupplierList, supplierInitialFetch } = useCRUD();

  useEffect(() => {
    if (supplierInitialFetch) {
      getSupplierList();
    }
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
            <BreadcrumbPage>CRUD</BreadcrumbPage>
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
