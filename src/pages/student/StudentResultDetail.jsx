import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

export default function StudentResultDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        const endpoint = id
          ? `https://spk-skripsi-be-production-48e1.up.railway.app/api/recommendation/history/${id}`
          : "https://spk-skripsi-be-production-48e1.up.railway.app/api/recommendation/detail";

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const decisionMatrix = data?.decision_matrix || {};

  const normalizedMatrix = data?.normalized_matrix || {};

  const ranking = data?.ranking || [];

  const wsm = data?.wsm || [];

  const wpm = data?.wpm || [];

  const criteria = Object.keys(Object.values(decisionMatrix)[0] || {});

  const renderTable = (title, matrix, isDecimal = false) => (
    <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b bg-slate-50">
        <h2 className="font-semibold text-xl">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-6 py-4">Alternatif</th>

              {criteria.map((c) => (
                <th key={c} className="text-left px-6 py-4">
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.entries(matrix).map(([alt, values]) => (
              <tr key={alt} className="border-t hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-teal-700">{alt}</td>

                {criteria.map((criterion) => (
                  <td key={criterion} className="px-6 py-4">
                    {isDecimal
                      ? Number(values[criterion]).toFixed(4)
                      : values[criterion]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              {id ? "Detail Riwayat Rekomendasi" : "Detail Perhitungan WASPAS"}
            </h1>

            <p className="text-gray-500 mt-2">
              {id
                ? "Detail hasil rekomendasi sebelumnya."
                : "Perhitungan rekomendasi topik skripsi secara detail."}
            </p>
          </div>

          <button
            onClick={() => navigate(id ? "../dashboard" : "/student/result")}
            className="border border-teal-700 text-teal-700 px-5 py-3 rounded-xl hover:bg-teal-50 transition"
          >
            Kembali
          </button>
        </div>

        {/* DECISION MATRIX */}
        {renderTable("1. Matriks Keputusan", decisionMatrix)}

        {/* NORMALIZATION */}
        {renderTable("2. Matriks Normalisasi", normalizedMatrix, true)}

        {/* WSM */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <h2 className="font-semibold text-xl mb-6">
            3. Weighted Sum Model (WSM)
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wsm.map((item) => (
              <div key={item.alternative} className="border rounded-2xl p-5">
                <p className="text-sm text-gray-500">{item.alternative}</p>

                <h3 className="text-2xl font-bold text-teal-700 mt-2">
                  {Number(item.value).toFixed(5)}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* WPM */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <h2 className="font-semibold text-xl mb-6">
            4. Weighted Product Model (WPM)
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wpm.map((item) => (
              <div key={item.alternative} className="border rounded-2xl p-5">
                <p className="text-sm text-gray-500">{item.alternative}</p>

                <h3 className="text-2xl font-bold text-teal-700 mt-2">
                  {Number(item.value).toFixed(5)}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL RANKING */}
        <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b">
            <h2 className="font-semibold text-xl">5. Hasil Akhir WASPAS</h2>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-6 py-4">Rank</th>

                <th className="text-left px-6 py-4">Kode</th>

                <th className="text-left px-6 py-4">Nama Topik</th>

                <th className="text-left px-6 py-4">Score</th>
              </tr>
            </thead>

            <tbody>
              {ranking.map((item) => (
                <tr
                  key={item.rank}
                  className={`border-t ${item.rank === 1 ? "bg-teal-50" : ""}`}
                >
                  <td className="px-6 py-4 font-semibold">{item.rank}</td>

                  <td className="px-6 py-4 text-teal-700 font-semibold">
                    {item.kode}
                  </td>

                  <td className="px-6 py-4">{item.nama_topik}</td>

                  <td className="px-6 py-4 font-bold">
                    {Number(item.score).toFixed(5)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
