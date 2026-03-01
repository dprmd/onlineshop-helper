import { useState } from "react";
import MyButton from "./MyButton";
import {
  formatNumber,
  toCamelCase,
  validateNumber,
} from "../utils/generalFunction";

const DialogAddBill = ({
  openModalState,
  setOpenModalState,
  tagihan,
  setTagihan,
  setSudahHitung,
}) => {
  const [billName, setBillName] = useState("");
  const [totalBill, setTotalBill] = useState("");

  const handleAddBill = (e) => {
    e.preventDefault();

    const cekIfBillNameExist = tagihan.some(
      (bill) => bill.identifier === toCamelCase(billName)
    );

    if (cekIfBillNameExist) {
      alert("Maaf Tagihan Sudah Ada, Beri Nama Lain");
      setBillName("");
    } else {
      const newBill = {
        identifier: toCamelCase(billName),
        billName,
        totalBill,
      };

      setTagihan((prevBills) => [...prevBills, newBill]);

      setBillName("");
      setTotalBill("");
      setOpenModalState(false);
      setSudahHitung(false);
    }
  };
  return (
    openModalState && (
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-start pt-20 bg-gray-200">
        <form
          className="border border-gray-400 rounded-md bg-white p-4 w-[400px]"
          onSubmit={handleAddBill}
        >
          <div className="input-components flex flex-col gap-y-2">
            <label htmlFor="namaTagihan">Nama Tagihan</label>
            <input
              type="text"
              id="namaTagihan"
              value={billName}
              onChange={(e) => {
                setBillName(e.target.value);
              }}
              className="border border-gray-400 rounded-md px-1"
              placeholder="Isi Di Sini. . ."
            />
          </div>
          <div className="input-components flex flex-col gap-y-2">
            <label htmlFor="nominalTagihan">Nominal Tagihan</label>
            <input
              type="text"
              id="nominalTagihan"
              value={totalBill}
              onChange={(e) => {
                const number = validateNumber(e);
                setTotalBill(formatNumber(number));
              }}
              className="border border-gray-400 rounded-md px-1"
              placeholder="Isi Di Sini. . ."
            />
          </div>
          <div className="flex items-center px-3">
            <MyButton
              buttonText={"Batal"}
              buttonType={"button"}
              onClick={() => {
                setOpenModalState(false);
              }}
              tailwindClass={"bg-red-500 mx-1 px-2 py-1"}
            />
            <MyButton
              buttonText={"Tambahkan"}
              buttonType={"submit"}
              onClick={handleAddBill}
              tailwindClass={"bg-green-500 mx-1 px-2 py-1"}
            />
          </div>
        </form>
      </div>
    )
  );
};

export default DialogAddBill;
