import {
  LayoutDashboard,
  ClipboardList,
  SlidersHorizontal,
  Database,
  History,
  LogOut,
  Settings2,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const menus = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Manajemen Kriteria",
      icon: ClipboardList,
      path: "/admin/criteria",
    },
    {
      label: "Data Alternatif",
      icon: Database,
      path: "/admin/alternatives",
    },
    {
      label: "Manajemen Mahasiswa",
      icon: SlidersHorizontal,
      path: "/admin/students",
    },

    {
      label: "Riwayat Pengguna",
      icon: History,
      path: "/admin/historyadmin",
    },
    {
      label: "Nilai Alternatif",
      icon: Settings2,
      path: "/admin/alternative-criteria",
    },
    {
      label: "Pengaturan Bobot",
      icon: SlidersHorizontal,
      path: "/admin/weights",
    },
  ];

  return (
    <aside className="w-[250px] bg-white border-r flex flex-col justify-between px-5 py-6">
      <div>
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-emerald-700">SKRIPSIAN</h1>

          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            Admin Panel
          </span>
        </div>

        <nav className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-emerald-100 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />

                {menu.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button className="flex items-center gap-3 text-red-500 text-sm">
        <LogOut size={18} />
        Logout Account
      </button>
    </aside>
  );
}
