import { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeft, Printer, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import domtoimage from "dom-to-image-more";
import MainLayout from "../../layouts/MainLayout";

export default function StudentResult() {
  const navigate = useNavigate();

  const pdfRef = useRef(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH RESULT
  // ==========================
  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://spk-skripsi-be-production-48e1.up.railway.app/api/recommendation/latest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setResult(response.data);
      } catch (error) {
        console.error("Recommendation Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  // ==========================
  // DATA
  // ==========================
  const recommendation = result?.data?.recommendation;

  const ranking = result?.data?.ranking?.slice(1) || [];

  // ==========================
  // EXPORT PDF
  // ==========================
  const handleExportPDF = () => {
    const pdf = new jsPDF();

    // title
    pdf.setFontSize(18);

    pdf.setFont("helvetica", "bold");

    pdf.text("Hasil Rekomendasi Topik Skripsi", 105, 20, {
      align: "center",
    });

    pdf.setFontSize(10);

    pdf.setFont("helvetica", "normal");

    pdf.text("Sistem Pendukung Keputusan Metode WASPAS", 105, 28, {
      align: "center",
    });

    // top match
    pdf.setFontSize(14);

    pdf.setFont("helvetica", "bold");

    pdf.text("Top Recommendation", 14, 45);

    pdf.setFontSize(12);

    pdf.setFont("helvetica", "normal");

    pdf.text(`Topik : ${recommendation?.nama_topik || "-"}`, 14, 55);

    pdf.text(
      `Kompetensi : ${recommendation?.kompetensi_lulusan || "-"}`,
      14,
      63,
    );

    pdf.text(`Score : ${Number(recommendation?.score).toFixed(3)}`, 14, 71);

    // ranking table
    autoTable(pdf, {
      startY: 85,

      head: [["Rank", "Kode", "Nama Bidang", "Score"]],

      body: ranking.map((item) => [
        item.rank,
        item.kode,
        item.nama_topik,
        Number(item.score).toFixed(3),
      ]),

      theme: "grid",

      headStyles: {
        fillColor: [15, 118, 110],
      },

      styles: {
        fontSize: 10,
      },
    });

    // footer
    pdf.setFontSize(9);

    pdf.text(
      `Generated on ${new Date().toLocaleDateString("id-ID")}`,
      14,
      pdf.internal.pageSize.height - 10,
    );

    pdf.save("hasil-rekomendasi-skripsian.pdf");
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Recommendation Results
            </h1>

            <p className="text-gray-500 mt-2">
              Berdasarkan performa akademik dan profil kemampuanmu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-[280px]">
            {" "}
            <button
              onClick={handleExportPDF}
              className="bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Printer size={18} />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="border border-teal-700 text-teal-700 hover:bg-teal-50 py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft size={18} />
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        {/* PRINT AREA */}
        <div ref={pdfRef} className="space-y-6 bg-white rounded-3xl p-6">
          {/* TITLE PDF */}
          <div className="hidden print:block text-center border-b pb-5">
            <h1 className="text-2xl font-bold text-slate-900">
              Hasil Rekomendasi Topik Skripsi
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Sistem Pendukung Keputusan Metode WASPAS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {" "}
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* TOP MATCH */}
              <div className="bg-white border rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-50 rounded-full -translate-y-10 translate-x-10" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-6">
                  {" "}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">
                        Top Match
                      </span>

                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star size={12} />
                        Best Fit
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900">
                      {recommendation?.nama_topik}
                    </h2>

                    <p className="text-teal-700 font-medium mt-2">
                      {recommendation?.kompetensi_lulusan}
                    </p>

                    <p className="text-gray-500 leading-relaxed mt-5">
                      {recommendation?.insight}
                    </p>
                  </div>
                  {/* SCORE */}
                  <div className="bg-teal-700 text-white rounded-2xl p-6 text-center w-full lg:w-[170px] shrink-0 shadow-md">
                    {" "}
                    <p className="text-sm opacity-80">FINAL SCORE</p>
                    <h2 className="text-4xl font-bold mt-2">
                      {Number(recommendation?.score).toFixed(3)}
                    </h2>
                    <p className="text-xs opacity-80 mt-2">High Relevance</p>
                  </div>
                </div>
              </div>

              {/* RANKING */}
              <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b">
                  <h2 className="font-semibold text-lg">Peringkat Lainnya</h2>
                </div>

                <div className="overflow-x-auto rounded-b-3xl">
                  {" "}
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-6 py-4">Rank</th>

                        <th className="text-left px-6 py-4">Kode</th>

                        <th className="text-left px-6 py-4">Nama Bidang</th>

                        <th className="text-left px-6 py-4">Score</th>
                      </tr>
                    </thead>

                    <tbody>
                      {ranking.map((item) => (
                        <tr
                          key={item.rank}
                          className="border-t hover:bg-slate-50"
                        >
                          <td className="px-6 py-5 font-medium">
                            {String(item.rank).padStart(2, "0")}
                          </td>

                          <td className="px-6 py-5 text-teal-700 font-semibold">
                            {item.kode}
                          </td>

                          <td className="px-6 py-5">{item.nama_topik}</td>

                          <td className="px-6 py-5 font-medium">
                            {Number(item.score).toFixed(3)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* RIGHT */}
            {/* RIGHT */}
            <div className="space-y-6">
              {/* DETAIL */}
              <div className="bg-white border rounded-3xl p-6 shadow-sm print:hidden">
                <h3 className="font-semibold mb-4">Detail Perhitungan</h3>

                <p className="text-sm text-gray-500 mb-5">
                  Lihat proses normalisasi, pembobotan, hingga hasil perhitungan
                  WASPAS.
                </p>

                <button
                  onClick={() => navigate("/student/result/detail")}
                  className="w-full border border-slate-300 hover:bg-slate-50 py-3 rounded-xl transition font-medium"
                >
                  Lihat Detail Perhitungan
                </button>
              </div>

              {/* INFO */}
              <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6">
                <h3 className="font-semibold text-teal-800 mb-3">
                  INFORMASI METODE
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Rekomendasi dihitung menggunakan metode WASPAS dengan
                  pendekatan Weighted Sum Model (WSM) dan Weighted Product Model
                  (WPM).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
