export const config = {
  syncLastSave: true,
};

// Patungan Untuk Uang Harian Ema Iki
export const splitBillEmaIki = {
  uko: 36000,
  adi: 36000,
};

// Harus Ada Total 100
export const metode = {
  uangSaya: 39,
  danaDarurat: 0,
  modal: 40,
  sedekah: 1,
  keinginan: 20,
};

// Gaji Harian Adi
export const fullDayWage = 50000;
export const halfDayWage = 25000;

// Additional function
const now = new Date();
export const day = now.getDay();
export const dayName = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const formatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});
export const hari = formatter.format(now);
