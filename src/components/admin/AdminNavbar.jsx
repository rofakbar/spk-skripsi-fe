import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { ChevronDown } from "lucide-react";

export default function AdminNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  // close dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b px-8 py-5 flex justify-between items-center">
      {/* LEFT */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Dashboard Overview
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Kelola data SPK rekomendasi skripsi
        </p>
      </div>

      {/* PROFILE */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 transition"
        >
          {/* AVATAR */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-700 to-teal-500 text-white flex items-center justify-center font-semibold shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* INFO */}
          <div className="hidden md:block text-left">
            <h4 className="font-semibold text-sm text-slate-800">
              {user?.name}
            </h4>

            <p className="text-xs text-slate-500">Administrator</p>
          </div>

          <ChevronDown
            size={18}
            className={`text-slate-500 transition ${
              openDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* DROPDOWN */}
        {openDropdown && (
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* USER INFO */}
            <div className="px-5 py-4 border-b bg-slate-50">
              <p className="font-semibold text-sm text-slate-800">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
            </div>

            {/* MENU */}
            <button
              onClick={() => {
                setOpenDropdown(false);

                navigate("/admin/profile");
              }}
              className="w-full text-left px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
