import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Link } from "react-router";
import { useLogOutMutation } from "@/services/user.services";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch,useAppSelector } from "@/store/authSlice";
import { setUser } from "@/store/authSlice";

function ProfileAvatar() {
  const user = useAppSelector((state) => state.auth.user);
  const [logOut] = useLogOutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const handleLogout = async () => {
    try {
      await logOut().unwrap(); 
      toast.success("Logged out successfully!", {
        description: "See you next time",
      });
      localStorage.removeItem("token")
      dispatch(setUser(null));
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout", {
        description: "Please try again",
      });
    }
  };

  return (
    <div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-10 w-10 cursor-pointer border border-black/20 hover:border-black transition">
              <AvatarImage src={user?.data.img} alt={user?.data.name} />
              <AvatarFallback className="bg-black text-white font-semibold">
                {user?.data.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 bg-white border border-black/10 shadow-lg rounded-none"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-black">{user?.data.name}</p>
                <p className="text-xs text-gray-600">{user?.data.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-black hover:bg-muted cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          to="/login"
          className="px-6 py-2 bg-black text-white font-medium uppercase tracking-wide hover:bg-neutral-900 transition-colors rounded-none"
        >
          Login
        </Link>
      )}
    </div>
  );
}

export default ProfileAvatar;
