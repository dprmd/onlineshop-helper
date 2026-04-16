import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Text */}
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold">Halaman Tidak Ditemukan</h2>

        {/* Description */}
        <p className="mt-2 text-slate-400 text-sm">
          Halaman yang kamu cari mungkin sudah dihapus, dipindahkan, atau tidak
          pernah ada.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 rounded-xl bg-sky-400 text-slate-900 font-semibold shadow-lg shadow-sky-400/20 hover:bg-sky-300 transition-all duration-300"
        >
          ← Kembali ke Beranda
        </Link>

        {/* Decorative Glow */}
        <div className="absolute inset-0 -z-10 flex justify-center items-center">
          <div className="w-[300px] h-[300px] bg-sky-500/20 blur-3xl rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
