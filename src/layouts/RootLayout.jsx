import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <div className="px-4 py-3">
      <Outlet />
      <Toaster />
    </div>
  );
}
