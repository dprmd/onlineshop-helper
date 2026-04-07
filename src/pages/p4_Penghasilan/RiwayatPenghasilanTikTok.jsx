import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCatatanPenghasilan } from "../../context/CatatanPenghasilanContext";
import FilterList from "./FilterList";
import PenghasilanTikTokCard from "./PenghasilanTikTokCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function RiwayatPenghasilanTikTok() {
  const { penghasilanTikTok, fetchPenghasilan, tiktokInitialFetch } =
    useCatatanPenghasilan();

  useEffect(() => {
    if (tiktokInitialFetch) {
      fetchPenghasilan("tiktok", 7);
    }
  }, []);

  return (
    <div className="px-4 py-3 flex flex-col gap-y-4">
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
            <BreadcrumbPage>TikTok</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FilterList platform={"tiktok"} />

      <div className="flex flex-wrap gap-4 py-3">
        {penghasilanTikTok.map((data) => (
          <PenghasilanTikTokCard data={data} key={data.id} />
        ))}
      </div>
    </div>
  );
}
