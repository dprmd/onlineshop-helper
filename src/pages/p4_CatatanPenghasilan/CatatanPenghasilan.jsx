import { Link } from "react-router-dom";

export default function CatatanPenghasilan() {
  return (
    <div>
      <h3 className="text-center text-3xl my-4 font-bold">
        Riwayat Penghasilan Jualan Online
      </h3>
      <ul className="text-center flex flex-col gap-y-6 justify-center">
        <li>
          <Link
            to="totalPenghasilan"
            className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300"
          >
            Total Penghasilan
          </Link>
        </li>
        <li>
          <Link
            to="shopee"
            className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300"
          >
            Shopee
          </Link>
        </li>
        <li>
          <Link
            to="tiktok"
            className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300"
          >
            TikTok
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300"
          >
            Kembali
          </Link>
        </li>
      </ul>
    </div>
  );
}
