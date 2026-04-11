export const formatNumber = (num) => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const raw = (num) => {
  return Number(num.replace(/\./g, ""));
};

export const validateNumber = (e) => {
  // Hilangkan titik dulu biar bisa di-parse
  let raw = e.target.value.replace(/\./g, "");
  // Pastikan hanya angka
  if (!/^\d*$/.test(raw)) return;
  else return raw;
};

export const toCamelCase = (str) => {
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join("");
};

export const formatTanggal = (ms) => {
  const date = new Date(ms);

  const hari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];

  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const namaHari = hari[date.getDay()];
  const tanggal = date.getDate();
  const namaBulan = bulan[date.getMonth()];
  const tahun = date.getFullYear();

  return `${namaHari} ${tanggal} ${namaBulan} ${tahun}`;
};

export const combineDateTimeToMs = (date, time) => {
  const [h, m, s = "0"] = time.split(":");

  const result = new Date(date);
  result.setHours(h, m, s, 0);

  return result.getTime();
};
