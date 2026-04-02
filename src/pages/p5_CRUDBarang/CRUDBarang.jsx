import { Link } from "react-router-dom";

export default function CRUDBarang() {
  return (
    <div>
      <div className="text-center text-3xl my-4 font-bold">
        <p>Create Read Update Delete</p>
        <p>Barang</p>
      </div>
      <ul className="text-center flex flex-col gap-y-6 justify-center">
        <li>
          <Link
            to="supplier"
            className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300"
          >
            Supplier
          </Link>
        </li>
        <li>
          <Link
            to="tambahHutangBarang"
            className="bg-green-400 text-black px-4 py-2 rounded-xl hover:bg-green-300"
          >
            Tambah Hutang Barang
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
