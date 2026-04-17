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
    buttonName: "Total Penghasilan",
    destination: "/income/total",
  },
  {
    buttonName: "Shopee",
    destination: "/income/shopee",
  },
  {
    buttonName: "TikTok",
    destination: "/income/tiktok",
  },
];

export default function Income() {
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
            <BreadcrumbPage>Penghasilan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ul className="text-center flex flex-col gap-y-2 justify-center items-center">
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
