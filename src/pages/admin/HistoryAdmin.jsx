import { useEffect, useMemo, useState } from "react";
import { History, Search, Users, TrendingUp, CalendarDays } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";

export default function HistoryAdmin() {
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let mounted = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);

        const response = await api.get("/admin/history");

        if (mounted) {
          setHistory(response.data?.data || []);
        }
      } catch (error) {
        console.error("History admin error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item?.mahasiswa?.name?.toLowerCase().includes(keyword) ||
        item?.mahasiswa?.email?.toLowerCase().includes(keyword) ||
        item?.topik?.nama_topik?.toLowerCase().includes(keyword) ||
        item?.topik?.kode?.toLowerCase().includes(keyword)
      );
    });
  }, [history, search]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <section className="bg-gradient-to-r from-slate-100 to-emerald-50 border rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <History size={30} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Riwayat Pengguna
              </h1>

              <p className="text-gray-600 mt-2">
                Lihat seluruh histori hasil rekomendasi mahasiswa.
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">Total History</p>

                <h2 className="text-3xl font-bold mt-2">{history.length}</h2>
              </div>

              <TrendingUp className="text-emerald-700" />
            </div>
          </div>

          <div className="bg-white border rounded-3xl p-6 shadow-sm md:col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Halo, {user?.name}</h3>

                <p className="text-gray-500 mt-2">
                  Admin dapat melihat seluruh hasil rekomendasi mahasiswa.
                </p>
              </div>

              <Users className="text-emerald-700" />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
          {/* TOP BAR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-5 border-b">
            <h2 className="font-semibold text-xl flex items-center gap-2">
              <History size={20} className="text-emerald-700" />
              Riwayat Mahasiswa
            </h2>

            {/* SEARCH */}
            <div className="relative w-full md:w-[320px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Cari mahasiswa / topik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="text-left px-6 py-4">Mahasiswa</th>

                  <th className="text-left px-6 py-4">Topik</th>

                  <th className="text-left px-6 py-4">Kompetensi</th>

                  <th className="text-left px-6 py-4">Score</th>

                  <th className="text-left px-6 py-4">Tanggal</th>

                  <th className="text-left px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      {/* mahasiswa */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {item?.mahasiswa?.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item?.mahasiswa?.email || "-"}
                          </p>
                        </div>
                      </td>

                      {/* topik */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium">
                            {item?.topik?.nama_topik}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item?.topik?.kode}
                          </p>
                        </div>
                      </td>

                      {/* kompetensi */}
                      <td className="px-6 py-5">
                        <span className=" text-emerald-700 px-0 py-0 rounded-full text-xs">
                          {item?.topik?.kompetensi_lulusan || "-"}
                        </span>
                      </td>

                      {/* score */}
                      <td className="px-6 py-5 font-semibold text-emerald-700">
                        {Number(item.score).toFixed(5)}
                      </td>

                      {/* tanggal */}
                      <td className="px-6 py-5 text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} />

                          {formatDate(item.tanggal)}
                        </div>
                      </td>

                      {/* status */}
                      <td className="px-6 py-5">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs capitalize">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16 text-gray-500">
                      Belum ada history
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
