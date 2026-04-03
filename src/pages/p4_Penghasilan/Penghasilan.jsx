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

export default function Penghasilan() {
  const navigate = useNavigate();

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
            <BreadcrumbPage>Penghasilan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ul className="text-center flex flex-col gap-y-2 justify-center items-center">
        <Button
          size="lg"
          onClick={() => {
            navigate("/penghasilan/totalPenghasilan");
          }}
        >
          Total Penghasilan
        </Button>
        <Button
          size="lg"
          onClick={() => {
            navigate("/penghasilan/shopee");
          }}
        >
          Shopee
        </Button>
        <Button
          size="lg"
          onClick={() => {
            navigate("/penghasilan/tiktok");
          }}
        >
          TikTok
        </Button>
      </ul>
    </div>
  );
}
