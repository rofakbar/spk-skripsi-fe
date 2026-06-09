import MainLayout from "../../layouts/MainLayout";
import { Trophy, Medal, Award } from "lucide-react";

export default function Result() {
  const recommendation =
    JSON.parse(localStorage.getItem("recommendation")) || [];

  const topRecommendation = recommendation[0];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hasil Rekomendasi</h1>

          <p className="text-gray-500 mt-2">
            Berdasarkan hasil kuesioner dan perhitungan metode WASPAS.
          </p>
        </div>

        {/* Top Recommendation */}
        {topRecommendation && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Trophy size={32} />

              <span className="font-semibold text-lg">Rekomendasi Terbaik</span>
            </div>

            <h2 className="text-4xl font-bold mb-3">
              {topRecommendation.nama_topik}
            </h2>

            <p className="text-blue-100">
              Topik skripsi yang paling sesuai berdasarkan minat, skill,
              pengalaman, dan hasil evaluasi metode WASPAS.
            </p>

            <div className="mt-6 bg-white/20 rounded-2xl p-5 w-fit">
              <p className="text-sm">Final Score</p>

              <h3 className="text-3xl font-bold">
                {Number(topRecommendation.final_score).toFixed(4)}
              </h3>
            </div>
          </div>
        )}

        {/* Ranking */}
        <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Ranking Topik Skripsi</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-5 text-left">Rank</th>

                  <th className="p-5 text-left">Topik</th>

                  <th className="p-5 text-center">Q1</th>

                  <th className="p-5 text-center">Q2</th>

                  <th className="p-5 text-center">Final Score</th>
                </tr>
              </thead>

              <tbody>
                {recommendation.map((item, index) => (
                  <tr
                    key={item.alternative_id}
                    className={`border-t hover:bg-slate-50 transition

                      ${index === 0 ? "bg-yellow-50" : ""}
                    `}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        {index === 0 && <Trophy className="text-yellow-500" />}

                        {index === 1 && <Medal className="text-gray-500" />}

                        {index === 2 && <Award className="text-amber-700" />}

                        <span className="font-bold text-lg">#{index + 1}</span>
                      </div>
                    </td>

                    <td className="p-5 font-medium">{item.nama_topik}</td>

                    <td className="p-5 text-center">
                      {Number(item.q1_score).toFixed(4)}
                    </td>

                    <td className="p-5 text-center">
                      {Number(item.q2_score).toFixed(4)}
                    </td>

                    <td className="p-5 text-center">
                      <span
                        className={`px-4 py-2 rounded-full font-semibold

                          ${
                            index === 0
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100"
                          }
                        `}
                      >
                        {Number(item.final_score).toFixed(4)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
