import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

import { Search, Pencil, X } from "lucide-react";

export default function AlternativeCriteria() {
  const [alternatives, setAlternatives] = useState([]);

  const [adminCriteria, setAdminCriteria] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [selectedAlternative, setSelectedAlternative] = useState(null);

  const [scores, setScores] = useState([]);

  // ==========================
  // FETCH DATA
  // ==========================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [alternativeRes, criteriaRes] = await Promise.all([
          api.get("/admin/alternative-criteria"),

          api.get("/admin/criteria"),
        ]);

        setAlternatives(alternativeRes.data.data || []);

        // hanya criteria admin
        setAdminCriteria(
          (criteriaRes.data.data || []).filter((c) => c.source === "admin"),
        );
      } catch (error) {
        console.error("Fetch alternative criteria error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==========================
  // SEARCH
  // ==========================
  const filteredData = useMemo(() => {
    return alternatives.filter(
      (item) =>
        item.nama_topik?.toLowerCase().includes(search.toLowerCase()) ||
        item.kode?.toLowerCase().includes(search.toLowerCase()) ||
        item.kompetensi_lulusan?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, alternatives]);

  // ==========================
  // REFRESH
  // ==========================
  const refreshData = async () => {
    const response = await api.get("/admin/alternative-criteria");

    setAlternatives(response.data.data || []);
  };

  // ==========================
  // OPEN MODAL
  // ==========================
  const handleEdit = (alternative) => {
    setSelectedAlternative(alternative);

    const existingScores = alternative.criteria || [];

    const mergedScores = adminCriteria.map((criteria) => {
      const existing = existingScores.find(
        (score) => score.criteria_id === criteria.id,
      );

      return {
        criteria_id: criteria.id,

        nama: criteria.nama,

        kode: criteria.kode,

        nilai: existing?.nilai ?? 1,
      };
    });

    setScores(mergedScores);

    setShowModal(true);
  };

  // ==========================
  // CHANGE SCORE
  // ==========================
  const handleScoreChange = (criteriaId, value) => {
    setScores((prev) =>
      prev.map((item) =>
        item.criteria_id === criteriaId
          ? {
              ...item,
              nilai: Number(value),
            }
          : item,
      ),
    );
  };

  // ==========================
  // SAVE
  // ==========================
  const handleSave = async () => {
    try {
      await api.put(`/admin/alternative-criteria/${selectedAlternative.id}`, {
        scores: scores.map((item) => ({
          criteria_id: item.criteria_id,

          nilai: item.nilai,
        })),
      });

      await refreshData();

      setShowModal(false);

      alert("Penilaian berhasil diperbarui");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Gagal menyimpan data");
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Penilaian Alternatif
          </h1>

          <p className="text-gray-500 mt-2">
            Kelola nilai objektif tiap topik skripsi
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-[320px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari alternatif..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[32px] overflow-hidden border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-5">Kode</th>

                <th className="text-left p-5">Nama Topik</th>

                <th className="text-left p-5">Kompetensi</th>

                <th className="text-left p-5">Nilai Kriteria</th>

                <th className="text-center p-5">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-5 font-medium">{item.kode}</td>

                    <td className="p-5">{item.nama_topik}</td>

                    <td className="p-5 text-gray-600">
                      {item.kompetensi_lulusan}
                    </td>

                    <td className="p-5">
                      <div className="flex flex-wrap gap-2">
                        {adminCriteria.map((criteria) => {
                          const found = item.criteria?.find(
                            (c) => c.criteria_id === criteria.id,
                          );

                          return (
                            <span
                              key={criteria.id}
                              className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs"
                            >
                              {criteria.kode}: {found?.nilai ?? "-"}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-100 hover:bg-blue-200 p-3 rounded-xl text-blue-700 transition"
                        >
                          <Pencil size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
              <div className="px-8 py-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Edit Penilaian</h2>

                  <p className="text-gray-500 mt-1">
                    {selectedAlternative?.nama_topik}
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="hover:bg-gray-100 p-2 rounded-xl"
                >
                  <X />
                </button>
              </div>

              <div className="p-8 space-y-5 overflow-y-auto">
                {" "}
                {scores.map((item) => (
                  <div
                    key={item.criteria_id}
                    className="flex items-center justify-between border rounded-2xl px-5 py-4"
                  >
                    <div>
                      <p className="font-semibold">{item.kode}</p>

                      <p className="text-sm text-gray-500">{item.nama}</p>
                    </div>

                    <select
                      value={item.nilai}
                      onChange={(e) =>
                        handleScoreChange(item.criteria_id, e.target.value)
                      }
                      className="border rounded-xl px-4 py-3 w-[120px]"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 rounded-2xl font-medium mt-4"
                >
                  Simpan Penilaian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
