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

export default function ShopeeWithdrawalRecords() {
  const { shopeeWithdrawals, fetchWithdrawals, shopeeInitialFetch } =
    useWithdrawalRecords();

  useEffect(() => {
    if (shopeeInitialFetch) {
      fetchWithdrawals("shopee", 7);
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
              <Link to="/income">Penghasilan</Link>
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
        {shopeeWithdrawals.map((data) => (
          <PenghasilanShopeeCard data={data} key={data.id} />
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { formatNumber, formatTanggal } from "../../utils/generalFunction";

function PenghasilanShopeeCard({ data }) {
  const [showSoldProducts, setShowSoldProducts] = useState(false);
  const [showAllocation, setShowAllocation] = useState(false);
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
          <button
            className="text-[12px] underline text-gray-400 cursor-pointer"
            onClick={() => {
              setShowAllocation(!showAllocation);
            }}
          >
            {showAllocation ? "Tutup" : "Lihat Pembagian"}
          </button>
        </div>
        {showAllocation && (
          <div className="p-2 bg-green-50 text-sm flex flex-col">
            <span>
              Komisi Kotor : <b>{formatNumber(data.profit.total)}</b>
            </span>
            <span>
              Sedekah : <b>{formatNumber(data.profit.sedekah)}</b>
            </span>
            <span>
              Patungan Untuk Ema :{" "}
              <b>{formatNumber(data.splitBillEmaIki.adi)}</b>
            </span>
            <span className="py-2">
              Komisi Bersih : <b>{formatNumber(data.profit.total)}</b> -{" "}
              <b>{formatNumber(data.profit.sedekah)}</b> -{" "}
              <b>{formatNumber(data.splitBillEmaIki.adi)}</b> ={" "}
              <b>
                {formatNumber(
                  data.profit.total -
                    data.profit.sedekah -
                    data.splitBillEmaIki.adi,
                )}
              </b>
            </span>

            <span>Pembagian Komisi Bersih :</span>
            <div className="flex flex-col px-2">
              <span>
                Capital : <b>{formatNumber(data.profit.capital)}</b>
              </span>
              <span>
                Dana Darurat : <b>{formatNumber(data.profit.danaDarurat)}</b>
              </span>
              <span>
                Uang Keinginan :{" "}
                <b>{formatNumber(data.profit.uangKeinginan)}</b>
              </span>
              <span>
                Investasi : <b>{formatNumber(data.profit.uangInvestasi)}</b>
              </span>
            </div>
          </div>
        )}
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
            <span>
              Gaji Adi :{" "}
              <b>{data.gajiAdi > 0 ? formatNumber(data.gajiAdi) : 0}</b>
            </span>
            <span>
              Patungan Untuk Ema :{" "}
              <b>{formatNumber(data.splitBillEmaIki.uko)}</b>
            </span>
            <div>
              <span>
                Uang Tagihan Lainnya :{" "}
                <b>{formatNumber(data.bill.totalBill)}</b>
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
              <b>{data.gajiAdi > 0 ? formatNumber(data.gajiAdi) : 0}</b> -{" "}
              <b>{formatNumber(data.splitBillEmaIki.uko)}</b> -{" "}
              <b>{formatNumber(data.bill.totalBill)}</b> ={" "}
              <b>
                {formatNumber(
                  data.totalHPP.total -
                    data.gajiAdi -
                    data.splitBillEmaIki.uko -
                    data.bill.totalBill,
                )}
              </b>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
