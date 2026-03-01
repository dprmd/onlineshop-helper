export const formatNumber = (num) => {
  if (!num) return "";
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
