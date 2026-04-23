import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWithdrawalRecords } from "../../context/WithdrawalRecordsContext";
import FilterList from "./FilterList";

export default function TikTokWithdrawalRecords() {
  const { tiktokWithdrawals, fetchWithdrawals } = useWithdrawalRecords();

  useEffect(() => {
    fetchWithdrawals("tiktok", 7);
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
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
            <BreadcrumbPage>TikTok</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FilterList platform={"tiktok"} />

      {tiktokWithdrawals.length > 0 && (
        <div className="flex flex-wrap gap-4 py-3">
          {tiktokWithdrawals.map((data) => (
            <PenghasilanTikTokCard data={data} key={data.id} />
          ))}
        </div>
      )}

      {tiktokWithdrawals.length === 0 && (
        <p className="text-xl text-gray-500">Kosong</p>
      )}
    </div>
  );
}

import { useState } from "react";
import { formatNumber, formatTanggal } from "../../utils/generalFunction";

function PenghasilanTikTokCard({ data }) {
  const [showSoldProducts, setShowSoldProducts] = useState(false);
  const [showSetor, setShowSetor] = useState(false);

  return (
    <div className="bg-gray-200 rounded-md px-3 py-2 flex flex-col gap-y-1 min-w-[350px]">
      <span>{formatTanggal(data.createdAtMs)}</span>
      <span>
        Total Penarikan : <b>{formatNumber(data.totalWithdraw)}</b>
      </span>
      <div>
        <div className="flex gap-x-2">
          <span>
            Total HPP : <b>{formatNumber(data.totalHPP.total)}</b>
          </span>
          <button
            className="text-[12px] underline text-gray-400 cursor-pointer"
            onClick={() => {
              setShowSoldProducts(!showSoldProducts);
            }}
          >
            {showSoldProducts ? "Tutup" : "Lihat Produk Terjual"}
          </button>
        </div>
        {showSoldProducts && (
          <ul className="p-2 bg-green-50 text-sm">
            {data.totalHPP.soldProducts.map((produk, i) => (
              <li className="text-sm" key={i}>
                {produk.name} : {produk.sold} x {formatNumber(produk.hpp)} ={" "}
                {formatNumber(produk.sold * produk.hpp)}
              </li>
            ))}
            <div className="flex justify-center items-center">
              <div className="w-[90%] h-[2px] bg-gray-400"></div>
              <div className="w-[10%] text-gray-400 text-center">+</div>
            </div>
            <b className="text-sm">RP {formatNumber(data.totalHPP.total)}</b>
          </ul>
        )}
      </div>
      <div>
        <div className="flex gap-x-2">
          <span>
            Komisi Adi : <b>{formatNumber(data.profit.total)}</b>
          </span>
        </div>
      </div>
      <div>
        <div className="flex gap-x-2">
          <span>
            Total Setor : <b>{formatNumber(data.totalSetor)}</b>
          </span>
          <button
            className="text-[12px] underline text-gray-400 cursor-pointer"
            onClick={() => {
              setShowSetor(!showSetor);
            }}
          >
            {showSetor ? "Tutup" : "Lihat Rincian"}
          </button>
        </div>
        {showSetor && (
          <div className="p-2 bg-green-50 text-sm flex flex-col">
            <div>
              <span>
                Uang Tagihan Lainnya :{" "}
                <b>
                  {data.bill.totalBill
                    ? formatNumber(data.bill.totalBill)
                    : "0"}
                </b>
              </span>
              <div className="px-2">
                {data.bill.billList.map((bill) => (
                  <div key={bill.identifier}>
                    <span className="text-[12px]">
                      - {bill.billName} : <b>{bill.billPrice}</b>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <span className="py-2">
              Setor : <b>{formatNumber(data.totalHPP.total)}</b> -{" "}
              <b>
                {data.bill.totalBill ? formatNumber(data.bill.totalBill) : "0"}
              </b>
              = <b>{formatNumber(data.totalSetor)}</b>{" "}
            </span>
          </div>
        )}
        <div>
          <span className="text-sm">Doc Id : {data.id}</span>
        </div>
      </div>
    </div>
  );
}
