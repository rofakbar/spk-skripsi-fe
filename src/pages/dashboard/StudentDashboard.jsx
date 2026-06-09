import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layouts/MainLayout";
import { Rocket, ClipboardList, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://skirpsian.com/api/recommendation/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setHistory(response.data.data);
      } catch (error) {
        console.error("History error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* HERO */}
        <section className="bg-gradient-to-r from-slate-100 to-teal-50 border rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              Halo, {user?.name}! Siap
              <br />
              Menentukan Topik Skripsimu?
            </h1>

            <p className="text-gray-600 mt-4 max-w-2xl leading-relaxed">
              Platform rekomendasi kami siap membantu menganalisis minat dan
              riwayat akademikmu untuk menemukan topik penelitian yang paling
              relevan dan potensial.
            </p>
          </div>

          <button
            onClick={() => navigate("/student/questionnaire")}
            className="mt-6 md:mt-0 bg-teal-700 hover:bg-teal-800 transition text-white px-6 py-4 rounded-xl flex items-center gap-2 shadow-md"
          >
            <Rocket size={18} />
            Mulai Cari Topik
          </button>
        </section>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* HISTORY */}
          <div className="lg:col-span-2 bg-white border rounded-3xl overflow-hidden shadow-sm">
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h2 className="font-semibold text-xl flex items-center gap-2">
                <RotateCcw size={18} className="text-teal-700" />
                Riwayat Tes Sebelumnya
              </h2>

              <button className="text-teal-700 text-sm font-medium hover:underline">
                Lihat Semua
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-4 font-medium">Tanggal</th>

                    <th className="text-left px-6 py-4 font-medium">
                      Rekomendasi
                    </th>

                    <th className="text-left px-6 py-4 font-medium">Skor</th>
                  </tr>
                </thead>

                <tbody>
                  {/* LOADING */}
                  {loading ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-10 text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : history.length > 0 ? (
                    history.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() =>
                          navigate(`/student/result/history/${item.id}`)
                        }
                        className="border-t hover:bg-slate-50 transition cursor-pointer"
                      >
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(item.created_at)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-600 rounded-full" />

                            <span className="font-medium">
                              {item?.top_alternative?.nama_topik}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium">
                            {Number(item.top_score).toFixed(3)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-14 text-gray-500"
                      >
                        Belum ada riwayat rekomendasi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* GUIDE */}
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-xl flex items-center gap-2 mb-6">
              <ClipboardList size={18} className="text-teal-700" />
              Panduan Pengisian
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: "Isi Kuesioner",
                  desc: "Jawab pertanyaan sesuai minat, pengalaman proyek, skill, dan nilai mata kuliah terkait.",
                },

                {
                  title: "Analisis Sistem",
                  desc: "Sistem akan menganalisis profilmu menggunakan metode WASPAS.",
                },

                {
                  title: "Dapatkan Rekomendasi",
                  desc: "Lihat rekomendasi topik skripsi terbaik berdasarkan kecocokan profilmu.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="font-semibold">{item.title}</h3>

                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          © 2026 SKRIPSIAN. Platform Rekomendasi Topik Skripsi Terpercaya.
        </div>
      </div>
    </MainLayout>
  );
}
