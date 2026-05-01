import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { getDocument } from "@/services/firebase/docService";
import { collectionName } from "@/services/firebase/firebase";
import bcrypt from "bcryptjs";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext, useContext } from "react";
import { toast } from "sonner";

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const otpRef = useRef(null);
  const [pin, setPin] = useState("");
  const [openPin, setOpenPin] = useState({
    open: false,
    actionOnMatch: () => {},
    parameter: "",
  });
  const [disableInputOtp, setDisableInputOtp] = useState(false);

  const comparePin = async (thePin) => {
    if (thePin.length < 6) return;
    else {
      setDisableInputOtp(true);

      const { data } = await getDocument(
        "Security Fetch",
        collectionName.security,
        "pin",
      );

      const isMatch = await bcrypt.compare(thePin, data.hashedPin);

      if (isMatch) {
        setOpenPin(() => ({
          actionOnMatch: () => {},
          parameter: "",
          open: false,
        }));
        setPin("");
        setDisableInputOtp(false);
        openPin.actionOnMatch(openPin.parameter);
        return;
      } else {
        console.log(openPin);
        toast.warning("Pin Salah");
        setDisableInputOtp(false);
        setPin("");
        setTimeout(() => {
          otpRef.current?.focus?.();
        }, 0);
        return;
      }
    }
  };

  return (
    <SecurityContext.Provider value={{ setOpenPin }}>
      <Dialog
        open={openPin.open}
        onOpenChange={(v) => {
          setOpenPin((prev) => ({ ...prev, open: v }));
          setPin("");
        }}
      >
        <DialogContent className="text-center flex flex-col justify-center items-center">
          <DialogHeader>
            <DialogTitle className="flex">
              Masukan Pin Keamanan{" "}
              {disableInputOtp && <Spinner className="mx-1" />}
            </DialogTitle>
          </DialogHeader>
          <InputOTP
            ref={otpRef}
            maxLength={6}
            value={pin}
            onChange={async (v) => {
              setPin(v);
              if (v.length >= 6) {
                await comparePin(v);
              }
            }}
            disabled={disableInputOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </DialogContent>
      </Dialog>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
