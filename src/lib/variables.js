export const listProduk = {
  keyra: {
    identifier: "keyra",
    nama: "Keyra",
    hpp: 50000,
    terjual: 0,
  },
  zize: {
    identifier: "zize",
    nama: "Zize",
    hpp: 50000,
    terjual: 0,
  },
  chea: {
    identifier: "chea",
    nama: "Chea",
    hpp: 60000,
    terjual: 0,
  },
  chea200: {
    identifier: "chea200",
    nama: "Chea Harga 200Rb",
    hpp: 100000,
    terjual: 0,
  },
  cheaKorneli: {
    identifier: "cheaKorneli",
    nama: "Chea Korneli",
    hpp: 75000,
    terjual: 0,
  },
  cheaJaguar: {
    identifier: "cheaJaguar",
    nama: "Chea Jaguar",
    hpp: 70000,
    terjual: 0,
  },
  azzura: {
    identifier: "azzura",
    nama: "Azzura",
    hpp: 70000,
    terjual: 0,
  },
  seraya: {
    identifier: "seraya",
    nama: "Seraya",
    hpp: 75000,
    terjual: 0,
  },
  aliza: {
    identifier: "aliza",
    nama: "Aliza",
    hpp: 60000,
    terjual: 0,
  },
};

// Patungan Untuk Uang Harian Ema Iki
export const patunganUntukEma = {
  uko: 36000,
  adi: 36000,
};

// Harus Ada Total 100
export const metode = {
  capital: 40,
  danaDarurat: 30,
  investasi: 29,
  sedekah: 1,
};

// Gaji Harian Adi
export const gajiPerHariFull = 50000;
export const gajiPerHariHalf = 25000;

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
