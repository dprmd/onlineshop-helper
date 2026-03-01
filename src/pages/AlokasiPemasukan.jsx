import { useState } from "react";
import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import StepThree from "../components/StepThree";
import { formatNumber } from "../utils/generalFunction";
import { listProduk } from "../lib/variables";

const AlokasiPemasukan = () => {
  // Global State
  const [step, setStep] = useState(1);
  const [totalPenghasilan, setTotalPenghasilan] = useState("");
  const [penghasilanHPP, setPenghasilanHPP] = useState("");
  const [produk, setProduk] = useState(listProduk);
  const produkInArray = Object.values(produk);
  const [isTikTok, setIsTikTok] = useState(false);

  // StepTwo State
  const [showConclusion, setShowConclusion] = useState(false);
  const [submitOrder, setSubmitOrder] = useState(1);

  // StepThree State
  const [gajiHarian, setGajiHarian] = useState(0);
  const [totalTagihan, setTotalTagihan] = useState(0);
  const [tagihan, setTagihan] = useState([]);

  let noteProdukTerjual = "";
  produkInArray.forEach((item) => {
    if (item.terjual > 0) {
      // Menggunakan list bullet ( - ) agar rapi secara vertikal
      noteProdukTerjual += `\n- *${item.nama}* (${
        item.terjual
      }X)\n  ${formatNumber(item.hpp)} ⮕ *${formatNumber(
        item.terjual * item.hpp,
      )}*`;
    }
  });

  return (
    <>
      {/* Step Pertama */}

      {step === 1 && (
        <StepOne
          totalPenghasilan={totalPenghasilan}
          setTotalPenghasilan={setTotalPenghasilan}
          setStep={setStep}
        />
      )}

      {/* Step Kedua */}
      {step === 2 && (
        <StepTwo
          setStep={setStep}
          penghasilanHPP={penghasilanHPP}
          setPenghasilanHPP={setPenghasilanHPP}
          setProduk={setProduk}
          showConclusion={showConclusion}
          setShowConclusion={setShowConclusion}
          submitOrder={submitOrder}
          setSubmitOrder={setSubmitOrder}
          produkInArray={produkInArray}
        />
      )}

      {/* Step Ketiga */}
      {step === 3 && (
        <StepThree
          penghasilanHPP={penghasilanHPP}
          setPenghasilanHPP={setPenghasilanHPP}
          totalPenghasilan={totalPenghasilan}
          setTotalPenghasilan={setTotalPenghasilan}
          setStep={setStep}
          gajiHarian={gajiHarian}
          setGajiHarian={setGajiHarian}
          totalTagihan={totalTagihan}
          setTotalTagihan={setTotalTagihan}
          tagihan={tagihan}
          setTagihan={setTagihan}
          isTikTok={isTikTok}
          setIsTikTok={setIsTikTok}
          produkInArray={produkInArray}
        />
      )}
    </>
  );
};

export default AlokasiPemasukan;
