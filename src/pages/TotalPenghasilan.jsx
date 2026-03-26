import { formatNumber } from "../utils/generalFunction";
import { usePenghasilan } from "../context/PenghasilanContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CardFooter } from "../components/ui/card";

export default function TotalPenghasilan() {
  const navigate = useNavigate();
  const { penghasilanAT, tagihanAT, setorAT, untungAT } = usePenghasilan();

  const totalPenghasilanAT = Object.values(penghasilanAT).reduce(
    (acc, cur) => acc + cur,
  );
  const totalTagihanAT = Object.values(tagihanAT).reduce(
    (acc, cur) => acc + cur,
  );
  const totalSetorAT = Object.values(setorAT).reduce((acc, cur) => acc + cur);
  const totalUntungAT = Object.values(untungAT).reduce((acc, cur) => acc + cur);

  const totalShopee = tagihanAT.shopee + setorAT.shopee + untungAT.shopee;
  const totalTiktok = tagihanAT.tiktok + setorAT.tiktok + untungAT.tiktok;

  const dataKeuangan = [
    {
      name: "Shopee",
      value: totalShopee,
    },
    {
      name: "TikTok",
      value: totalTiktok,
    },
    {
      name: "Lainnya",
      value: totalPenghasilanAT - totalShopee - totalTiktok,
    },
  ];

  return (
    <div className="px-4 py-3">
      <div className="my-3 text-center">
        <h3 className="text-xl font-bold">DATA ALL TIME</h3>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div>
          <p>
            Total Penarikan Dana : <b>RP {formatNumber(totalPenghasilanAT)}</b>
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
        <SalesPieChart data={dataKeuangan} />
      </div>
      <button
        type="button"
        onClick={() => {
          navigate("/CatatanPenghasilan");
        }}
        className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300 mt-2"
      >
        Kembali
      </button>
    </div>
  );
}

function SalesPieChart({ data }) {
  const COLORS = ["#f97316", "#000000", "#FF0000"];
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="w-full max-w-md my-4">
      <CardHeader>
        <CardTitle>Kontribusi Marketplace</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER LABEL */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-lg font-bold">
              Rp {total.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-muted-foreground">100%</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center">
          <span className="text-gray text-sm text-gray-400 text-center">
            Semua Data Adalah Hasil Kalkulasi Dari 6 Maret 2026
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
