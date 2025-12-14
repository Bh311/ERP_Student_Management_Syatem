import { useState } from "react";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import Logo from "../../images/Logo.png";

export default function Header({ role, email }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow border-b relative">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img src={Logo} alt="Logo" className="h-10 w-10" />
        <div>
          <h1 className="text-lg font-semibold">Student Management System</h1>
          <p className="text-xs text-gray-500">{role} Portal</p>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs border border-green-500 text-green-600 rounded-full">
          {role === "admin" ? "Admin View" : "Student View"}
        </span>
      </div>


      {/* Right Section */}
  

        {/* User Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <User className="w-6 h-6 text-gray-600" />
            <div className="text-right">
              <p className="font-medium">{role === "admin" ? "Admin User" : "Student User"}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg z-50">
              <ul className="py-2 text-sm text-gray-700">
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              
                  <User className="w-4 h-4" /> Profile
               
                </li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Settings className="w-4 h-4" /> Settings
                </li>
                <li
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </li>
              </ul>
            </div>
          )}
        </div>
   
    </header>
  );
}
