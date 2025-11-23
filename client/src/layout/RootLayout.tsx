import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <NavBar />
      <main className="grow">
        <Outlet />
      </main>
       <Footer />

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default RootLayout;
