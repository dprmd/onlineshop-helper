import { Button } from "@/components/ui/button";
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
import { useUI } from "@/context/UIContext";
import { config } from "@/lib/variables";
import { getDocument } from "@/services/firebase/docService";
import { collectionName } from "@/services/firebase/firebase";
import bcrypt from "bcryptjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const otpRef = useRef(null);
  const { setLoading } = useUI();
  const [hashedPin, setHashedPin] = useState("");
  const [isFetchingHashedPin, setIsFetchingHashedPin] = useState(false);
  const [isHashedPinFetched, setIsHashedPinFetched] = useState(false);
  const [pin, setPin] = useState("");
  const [openPin, setOpenPin] = useState({
    open: false,
    actionOnMatch: async () => {},
  });
  const [disableInputOtp, setDisableInputOtp] = useState(false);

  const getHashedPin = async () => {
    if (isFetchingHashedPin || isHashedPinFetched) return;
    setIsFetchingHashedPin(true);
    setLoading(true);

    const { success, error, data } = await getDocument(
      "Initial Setup",
      collectionName.security,
      "pin",
    );

    if (success) {
      setHashedPin(data.hashedPin);
      setIsHashedPinFetched(true);
    } else {
      console.log(error);
    }

    setLoading(false);
    setIsFetchingHashedPin(false);
  };

  const comparePin = async (thePin) => {
    if (thePin.length < 10) return;
    else {
      setDisableInputOtp(true);

      const isMatch = async () => {
        if (config.skipSecurity) {
          return true;
        } else {
          const letMeCompare = await bcrypt.compare(thePin, hashedPin);
          return letMeCompare;
        }
      };

      if (await isMatch()) {
        setPin("");
        setDisableInputOtp(false);
        setOpenPin(() => ({
          actionOnMatch: async () => {},
          parameter: "",
          open: false,
        }));
        await openPin.actionOnMatch();
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

  useEffect(() => {
    getHashedPin();
  });

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

          {config.skipSecurity && (
            <Button
              onClick={async () => {
                setPin("letmegosir");
                await comparePin("letmegosir");
              }}
            >
              Skip
            </Button>
          )}
        </DialogContent>
      </Dialog>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
