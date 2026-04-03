import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useCatatanPenghasilan } from "../../context/CatatanPenghasilanContext";
import { formatNumber } from "../../utils/generalFunction";

export default function TotalPenghasilan() {
  const { penghasilanAT, tagihanAT, setorAT, untungAT } =
    useCatatanPenghasilan();

  const totalPenghasilanAT = useMemo(() => {
    return Object.values(penghasilanAT).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  });
  const totalTagihanAT = useMemo(() => {
    return Object.values(tagihanAT).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  });
  const totalSetorAT = useMemo(() => {
    return Object.values(setorAT).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  });
  const totalUntungAT = useMemo(() => {
    return Object.values(untungAT).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  });

  const totalShopee = tagihanAT.shopee + setorAT.shopee + untungAT.shopee;
  const totalTiktok = tagihanAT.tiktok + setorAT.tiktok + untungAT.tiktok;
  const totalLainnya = totalPenghasilanAT - totalShopee - totalTiktok;

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
            <BreadcrumbLink asChild>
              <Link to="/penghasilan">Penghasilan</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Total Penghasilan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="min-w-[350px]">
        <CardHeader>
          <CardTitle>DATA ALL TIME</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2 pb-4">
          <div>
            <p>
              Total Penarikan Dana :{" "}
              <b>RP {formatNumber(totalPenghasilanAT)}</b>
            </p>
            <p>
              Total Tagihan : <b>RP {formatNumber(totalTagihanAT)}</b>
            </p>
            <p>
              Total Setor : <b>RP {formatNumber(totalSetorAT)}</b>
            </p>
            <p>
              Total Untung : <b>RP {formatNumber(totalUntungAT)}</b>
            </p>
          </div>
          <SalesPieChart
            total={totalPenghasilanAT}
            totalShopee={totalShopee}
            totalTiktok={totalTiktok}
            totalLainnya={totalLainnya}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SalesPieChart({ total, totalShopee, totalTiktok, totalLainnya }) {
  const chartData = [
    { marketplace: "Shopee", total: totalShopee, fill: "var(--color-shopee)" },
    { marketplace: "TikTok", total: totalTiktok, fill: "var(--color-tiktok)" },
    {
      marketplace: "Lainnya",
      total: totalLainnya,
      fill: "var(--color-lainnya)",
    },
  ];
  const chartConfig = {
    total: {
      label: "Total",
    },
    shopee: {
      label: "Shopee",
      color: "#EE4D2D",
    },
    tiktok: {
      label: "TikTok",
      color: "black",
    },
    lainnya: {
      label: "Lainnya",
      color: "gray",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Kontribusi Marketplace</CardTitle>
        <CardDescription>6 Maret - Sekarang</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="min-w-40" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="marketplace"
              innerRadius={65}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-sm font-bold"
                        >
                          {formatNumber(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Lainnya Adalah Uang Harian Ema Iki
        </div>
      </CardFooter>
    </Card>
  );
}
