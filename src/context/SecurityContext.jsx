import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { createContext, useContext, useRef, useState } from "react";
import { toast } from "sonner";

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const otpRef = useRef(null);
  const [pin, setPin] = useState("");
  const [openPin, setOpenPin] = useState({
    open: false,
    actionOnMatch: async () => {},
  });
  const [disableInputOtp, setDisableInputOtp] = useState(false);

  const comparePin = async (thePin) => {
    if (thePin.length < 10) return;
    else {
      setDisableInputOtp(true);

      const { data } = await getDocument(
        "Security Fetch",
        collectionName.security,
        "pin",
      );

      const isMatch = await bcrypt.compare(thePin, data.hashedPin);

      if (isMatch) {
        setPin("");
        setDisableInputOtp(false);
        await openPin.actionOnMatch();
        setOpenPin(() => ({
          actionOnMatch: async () => {},
          parameter: "",
          open: false,
        }));
        return;
      } else {
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
            maxLength={10}
            value={pin}
            onChange={async (v) => {
              setPin(v);
              if (v.length >= 10) {
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
              <InputOTPSlot index={6} />
              <InputOTPSlot index={7} />
              <InputOTPSlot index={8} />
              <InputOTPSlot index={9} />
            </InputOTPGroup>
          </InputOTP>
        </DialogContent>
      </Dialog>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
