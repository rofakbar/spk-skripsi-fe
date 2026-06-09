import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.roles?.[0]?.name ?? "mahasiswa";

  const location = useLocation();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Semua user bisa lihat
  const commonMenus = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "WASPAS",
      path: "/waspas",
    },
    {
      name: "History",
      path: "/history",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // close dropdown klik luar
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
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-12">
        <Link
          to="/dashboard"
          className="font-bold text-2xl text-teal-700 tracking-wide"
        >
          SKRIPSIAN
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {commonMenus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              className={`text-sm font-medium pb-1 transition-all duration-200 ${
                location.pathname === menu.path
                  ? "text-teal-700 border-b-2 border-teal-700"
                  : "text-slate-500 hover:text-teal-700"
              }`}
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </div>

      {/* PROFILE */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 transition"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-teal-700 to-emerald-500 text-white flex items-center justify-center font-semibold shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="hidden md:block text-left">
            <h3 className="font-medium text-sm text-slate-800">{user?.name}</h3>

            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
        </button>

        {/* DROPDOWN */}
        {openDropdown && (
          <div className="absolute right-0 mt-3 w-60 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <p className="font-semibold text-sm text-slate-800">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
            </div>

            <Link
              to="/profile"
              onClick={() => setOpenDropdown(false)}
              className="block px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
