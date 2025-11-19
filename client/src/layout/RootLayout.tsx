import NavBar from "@/components/NavBar"
import { Outlet } from "react-router-dom"

function RootLayout() {
  return (
   <div
   className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 "
   >
    <NavBar />
    <main className="grow container mx-auto px-4 py-6">
      <Outlet />
    </main>
   </div>
  )
}

export default RootLayout