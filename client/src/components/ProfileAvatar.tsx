import { LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUserQuery } from "@/services/user.services";
import { Link } from "react-router";

function ProfileAvatar() {
  const { data: user } = useCurrentUserQuery();
  console.log(user);

  const handleLogout = () => {};

  return (

    <div>
       {
        user ? (
            <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-slate-400 rounded-full transition-all">
        {user ? (
          <Avatar className="h-10 w-10 cursor-pointer border-2 border-slate-200 hover:border-slate-300 transition-colors">
            <AvatarImage src={user?.data.img} alt={user?.data.name} />
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {user?.data.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Link 
            to="/login" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Login
          </Link>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56 mt-2 bg-white border border-slate-200 shadow-lg rounded-lg"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-slate-900">{user?.data.name}</p>
            <p className="text-xs text-slate-500">{user?.data.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-slate-200" />


        <DropdownMenuSeparator className="bg-slate-200" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors rounded-md"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        ) : (
          <Link 
            to="/login" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Login
          </Link>
        )
       }
    </div>
    
  );
}

export default ProfileAvatar;