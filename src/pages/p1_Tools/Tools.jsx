import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { config } from "@/lib/variables";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Tools() {
  const link = [
    {
      buttonName: "Perhitungan Profit Shopee",
      destination: "/tools/profitCalculation",
    },
    {
      buttonName: "Image Prompt Randomizer",
      destination: "/tools/imagePromptRandomizer",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Alat</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {config.skipSecurity && (
        <p className="text-red-500 text-2xl text-center animate-caret-blink">
          Security PIN Di Nonaktifkan
        </p>
      )}
      <ul className="text-center flex flex-col gap-y-2 justify-center">
        {link.map((url) => (
          <li key={url.buttonName}>
            <Button asChild>
              <Link to={url.destination}>{url.buttonName}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
