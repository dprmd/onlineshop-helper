import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getDocuments, updateDocument } from "@/services/firebase/docService";
import { collectionName } from "@/services/firebase/firebase";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useWithdrawalRecords } from "../../context/WithdrawalRecordsContext";
import { formatNumber } from "../../utils/generalFunction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function IncomeTotal() {
  const {
    ATWithdrawals,
    setATWithdrawals,
    ATBills,
    setATBills,
    ATSetor,
    setATSetor,
    ATProfit,
    setATProfit,
    fetchAT,
  } = useWithdrawalRecords();

  const [showUntung, setShowUntung] = useState(false);

  const totalPenghasilanAT = useMemo(() => {
    return Object.values(ATWithdrawals).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  }, [ATWithdrawals]);
  const totalTagihanAT = useMemo(() => {
    return Object.values(ATBills).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  }, [ATBills]);
  const totalSetorAT = useMemo(() => {
    return Object.values(ATSetor).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  }, [ATSetor]);
  const totalUntungAT = useMemo(() => {
    return Object.values(ATProfit).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  }, [ATProfit]);

  const tempCalculateShopee = ATBills.shopee + ATSetor.shopee + ATProfit.shopee;
  const tempCalculateTiktok = ATBills.tiktok + ATSetor.tiktok + ATProfit.tiktok;
  const remainingShopee = ATWithdrawals.shopee - tempCalculateShopee;
  const remainingTiktok = ATWithdrawals.tiktok - tempCalculateTiktok;
  const totalShopee = tempCalculateShopee + remainingShopee;
  const totalTiktok = tempCalculateTiktok + remainingTiktok;

  const fixAlltimeData = async () => {
    const { data: s } = await getDocuments(
      "Ambil Semua Doc Withdraw Shopee",
      collectionName.withdrawals.shopee,
      "newToOld",
    );
    const { data: t } = await getDocuments(
      "Ambil Semua Doc Withdraw Tiktok",
      collectionName.withdrawals.tiktok,
      "newToOld",
    );

    const letMeCount = (arr, type) => {
      const keyMap = {
        withdraw: (item) => item.totalWithdraw,
        setor: (item) => item.totalSetor,
        profit: (item) => item.profit?.total,
        bill: (item) => item.bill?.totalBill || 0,
      };

      const getter = keyMap[type];
      if (!getter) return 0;

      return arr.reduce((acc, curr) => acc + getter(curr), 0);
    };

    const sW = letMeCount(s, "withdraw");
    const tW = letMeCount(t, "withdraw");
    const sS = letMeCount(s, "setor");
    const tS = letMeCount(t, "setor");
    const sP = letMeCount(s, "profit");
    const tP = letMeCount(t, "profit");
    const sB = letMeCount(s, "bill");
    const tB = letMeCount(t, "bill");

    const fixed = {
      shopee: {
        ATWithdrawals: sW,
        ATSetor: sS,
        ATProfit: sP,
        ATBills: sB,
      },
      tiktok: {
        ATWithdrawals: tW,
        ATSetor: tS,
        ATProfit: tP,
        ATBills: tB,
      },
    };

    setATWithdrawals({ shopee: sW, tiktok: tW });
    setATSetor({ shopee: sS, tiktok: tS });
    setATProfit({ shopee: sP, tiktok: tP });
    setATBills({ shopee: sB, tiktok: tB });

    await updateDocument(
      "Fix All Time Data",
      collectionName.allTime,
      collectionName.allTimeDocId,
      fixed,
      "Success Fix All Time Data",
    );

    toast.success("Berhasil Fix Data All Time");
  };

  useEffect(() => {
    fetchAT();
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
            <BreadcrumbLink asChild>
              <Link to="/income">Penghasilan</Link>
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
          <CardAction>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size={"xs"}
                  className="cursor-pointer hover:bg-gray-600"
                >
                  Fix Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Kamu Yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Operasi Ini Akan Memakan Kuota Read Yang Besar, Karena
                    Membaca Semua Dokumen Penarikan Shopee & TikTok
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={fixAlltimeData}>
                    Lanjutkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
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
            total={showUntung ? totalUntungAT : totalPenghasilanAT}
            totalShopee={showUntung ? ATProfit.shopee : totalShopee}
            totalTiktok={showUntung ? ATProfit.tiktok : totalTiktok}
            showUntung={showUntung}
            setShowUntung={setShowUntung}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SalesPieChart({
  total,
  totalShopee,
  totalTiktok,
  showUntung,
  setShowUntung,
}) {
  const chartData = [
    { marketplace: "Shopee", total: totalShopee, fill: "var(--color-shopee)" },
    { marketplace: "TikTok", total: totalTiktok, fill: "var(--color-tiktok)" },
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
  };

  return (
    <Card className="flex flex-col relative">
      <CardHeader className="items-center pb-0">
        <CardTitle>Kontribusi Marketplace</CardTitle>
        <CardDescription>Dulu - Sekarang</CardDescription>
        <Button
          variant="outline"
          onClick={() => {
            setShowUntung((prev) => !prev);
          }}
          className="absolute right-1 top-1 text-[10px] cursor-pointer"
        >
          {showUntung ? "Omzet" : "Untung"}
        </Button>
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
          Ini Hanya Gambaran Awal 😊
        </div>
      </CardFooter>
    </Card>
  );
}
