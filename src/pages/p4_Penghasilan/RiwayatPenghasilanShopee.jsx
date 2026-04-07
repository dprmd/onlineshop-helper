import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useCatatanPenghasilan } from "../../context/CatatanPenghasilanContext";
import FilterList from "./FilterList";
import PenghasilanShopeeCard from "./PenghasilanShopeeCard";
import { useEffect } from "react";

export default function RiwayatPenghasilanShopee() {
  const { penghasilanShopee, fetchPenghasilan, shopeeInitialFetch } =
    useCatatanPenghasilan();

  useEffect(() => {
    if (shopeeInitialFetch) {
      fetchPenghasilan("shopee", 7);
    }
  }, []);

  return (
    <div className="px-5 py-4 flex flex-col gap-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/penghasilan">Penghasilan</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shopee</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FilterList platform={"shopee"} />

      <div className="flex flex-wrap gap-4 py-3">
        {penghasilanShopee.map((data) => (
          <PenghasilanShopeeCard data={data} key={data.id} />
        ))}
      </div>
    </div>
  );
}
