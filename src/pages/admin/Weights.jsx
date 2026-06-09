import { useEffect, useState } from "react";

import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

import { Save } from "lucide-react";

export default function Weights() {
  const [criteria, setCriteria] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================
  // LOAD INITIAL DATA
  // ==========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/admin/weights");

        setCriteria(res.data.data || []);
      } catch (error) {
        console.error("Fetch weights error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==========================
  // REFRESH DATA
  // ==========================
  const refreshWeights = async () => {
    try {
      const res = await api.get("/admin/weights");

      setCriteria(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // HANDLE SLIDER
  // ==========================
  const handleSliderChange = (id, value) => {
    setCriteria((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              bobot: Number(value) / 100,
            }
          : item,
      ),
    );
  };

  // ==========================
  // TOTAL BOBOT
  // ==========================
  const totalWeight =
    criteria.reduce((total, item) => total + Number(item.bobot), 0) * 100;

  const isValid = Math.round(totalWeight) === 100;

  // ==========================
  // SAVE
  // ==========================
  const handleSave = async () => {
    try {
      setSaving(true);

      await api.put("/admin/weights", {
        weights: criteria.map((item) => ({
          id: item.id,
          bobot: item.bobot,
        })),
      });

      alert("Bobot berhasil disimpan");

      refreshWeights();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Gagal menyimpan bobot");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Pengaturan Bobot
          </h1>

          <p className="text-slate-500 mt-2">
            Atur bobot tiap kriteria menggunakan slider.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              Loading data...
            </div>
          ) : (
            <>
              {/* LIST */}
              <div className="space-y-8">
                {criteria.map((item) => (
                  <div key={item.id}>
                    {/* TITLE */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {item.kode} - {item.nama}
                        </h3>

                        <p className="text-sm text-slate-500">
                          Bobot untuk kriteria ini
                        </p>
                      </div>

                      <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                        {Math.round(item.bobot * 100)}%
                      </span>
                    </div>

                    {/* SLIDER */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.bobot * 100}
                      onChange={(e) =>
                        handleSliderChange(item.id, e.target.value)
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div
                className={`mt-10 rounded-3xl border p-6 ${
                  isValid
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Total Bobot
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Total harus tepat 100%
                    </p>
                  </div>

                  <div className="text-right">
                    <h2
                      className={`text-3xl font-bold ${
                        isValid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {Math.round(totalWeight)}%
                    </h2>

                    <p className="text-sm">
                      {isValid ? "Valid" : "Belum Valid"}
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="mt-8">
                <button
                  onClick={handleSave}
                  disabled={!isValid || saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} />

                  {saving ? "Menyimpan..." : "Simpan Bobot"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
