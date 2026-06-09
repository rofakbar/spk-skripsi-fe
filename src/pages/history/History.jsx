import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  History as HistoryIcon,
  TrendingUp,
  FileSearch,
  Users,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";

export default function History() {
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // FIX ROLE CHECK
  const isAdmin =
    user?.roles?.[0]?.name === "admin" ||
    user?.roles?.some((role) => role?.name?.toLowerCase() === "admin");

  useEffect(() => {
    let mounted = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);

        // endpoint beda berdasarkan role
        const endpoint = isAdmin ? "/admin/history" : "/recommendation/history";

        console.log("IS ADMIN:", isAdmin);

        console.log("ENDPOINT:", endpoint);

        const response = await api.get(endpoint);

        if (mounted) {
          setHistory(response.data?.data || []);
        }
      } catch (error) {
        console.error("History error:", error);
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
  }, [isAdmin]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const content = (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="bg-gradient-to-r from-slate-100 to-teal-50 border rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md">
            <HistoryIcon size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              {isAdmin ? "Riwayat Pengguna" : "Riwayat Rekomendasi"}
            </h1>

            <p className="text-gray-600 mt-2">
              {isAdmin
                ? "Lihat seluruh hasil rekomendasi mahasiswa."
                : "Lihat hasil rekomendasi topik skripsi yang pernah dilakukan."}
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Total Riwayat</p>

              <h2 className="text-3xl font-bold mt-2">{history.length}</h2>
            </div>

            {isAdmin ? (
              <Users className="text-teal-700" />
            ) : (
              <TrendingUp className="text-teal-700" />
            )}
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm md:col-span-2">
          <h3 className="font-semibold text-lg">Halo, {user?.name}</h3>

          <p className="text-gray-500 mt-2">
            {isAdmin
              ? "Admin dapat melihat seluruh histori rekomendasi mahasiswa."
              : "Klik salah satu riwayat untuk melihat detail hasil WASPAS."}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <h2 className="font-semibold text-xl flex items-center gap-2">
            <FileSearch size={18} className="text-teal-700" />
            Riwayat
          </h2>

          <span className="text-sm text-gray-500">{history.length} hasil</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-gray-600">
              <tr>
                <th className="text-left px-6 py-4">Tanggal</th>

                {isAdmin && <th className="text-left px-6 py-4">Mahasiswa</th>}

                <th className="text-left px-6 py-4">Topik</th>

                <th className="text-left px-6 py-4">Kompetensi</th>

                <th className="text-left px-6 py-4">Skor</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="text-center py-12">
                    Loading...
                  </td>
                </tr>
              ) : history.length > 0 ? (
                history.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() =>
                      !isAdmin && navigate(`/student/result/history/${item.id}`)
                    }
                    className={`border-t transition ${
                      !isAdmin ? "hover:bg-slate-50 cursor-pointer" : ""
                    }`}
                  >
                    <td className="px-6 py-5">
                      {formatDate(item.created_at || item.tanggal)}
                    </td>

                    {isAdmin && (
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium">{item?.mahasiswa?.name}</p>

                          <p className="text-xs text-gray-500">
                            {item?.mahasiswa?.email || "-"}
                          </p>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-5 font-medium">
                      {isAdmin
                        ? item?.topik?.nama_topik
                        : item?.top_alternative?.nama_topik || "-"}
                    </td>

                    <td className="px-6 py-5">
                      {isAdmin
                        ? item?.topik?.kompetensi_lulusan
                        : item?.top_alternative?.bidang || "-"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium">
                        {isAdmin
                          ? Number(item.score).toFixed(5)
                          : Number(item.top_score).toFixed(3)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="text-center py-16 text-gray-500"
                  >
                    Belum ada riwayat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return isAdmin ? (
    <AdminLayout>{content}</AdminLayout>
  ) : (
    <MainLayout>{content}</MainLayout>
  );
}
