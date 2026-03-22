import { useEffect } from "react";

export default function LoadingOverlay({ show, text = "Loading..." }) {
  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />

        {/* Text */}
        <p className="text-sm font-medium text-white">{text}</p>
      </div>
    </div>
  );
}
