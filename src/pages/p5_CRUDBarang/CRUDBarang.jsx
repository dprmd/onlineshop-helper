import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useCRUDBarang } from "@/context/CRUDBarangContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CRUDBarang() {
  const navigate = useNavigate();
  const { getSupplierList, initialFetch } = useCRUDBarang();

  useEffect(() => {
    if (initialFetch) {
      getSupplierList();
    }
  }, []);

  return (
    <div className="px-4 py-3 flex flex-col justify-center items-center gap-y-4">
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
              navigate("/crudBarang/supplier");
            }}
          >
            Supplier
          </Button>
        </li>
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/crudBarang/tambahHutangBarang");
            }}
          >
            Tambah Hutang Barang
          </Button>
        </li>
        <li>
          <Button
            size="lg"
            onClick={() => {
              navigate("/crudBarang/products");
            }}
          >
            Produk
          </Button>
        </li>
      </ul>
    </div>
  );
}
