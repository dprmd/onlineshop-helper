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

export default function CRUD() {
  const navigate = useNavigate();
  const { getSupplierList, initialFetch } = useCRUD();

  useEffect(() => {
    if (initialFetch) {
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
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/crud/supplier");
            }}
          >
            Supplier
          </Button>
        </li>
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/crud/addProductDebt");
            }}
          >
            Tambah Hutang Barang
          </Button>
        </li>
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/crud/products");
            }}
          >
            Produk
          </Button>
        </li>
      </ul>
    </div>
  );
}
