import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <NavBar />
      <main className="grow">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default RootLayout;
