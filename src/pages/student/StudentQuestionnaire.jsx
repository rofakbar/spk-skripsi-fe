import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import AlternativeCard from "../../components/questionnaire/AlternativeCard";

export default function StudentQuestionnaire() {
  const navigate = useNavigate();

  const [alternatives, setAlternatives] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [formData, setFormData] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ==========================
  // FETCH QUESTIONNAIRE
  // ==========================
  useEffect(() => {
    let mounted = true;

    const fetchQuestionnaire = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://skirpsian.com/api/questionnaire",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (mounted) {
          setAlternatives(response.data.data.alternatives || []);

          setCriteria(response.data.data.criteria || []);
        }
      } catch (error) {
        console.error("Questionnaire Error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchQuestionnaire();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================
  // CONVERT NILAI
  // ==========================
  const convertGradeToScore = (value) => {
    const score = Number(value);

    if (score >= 85) return 5;
    if (score >= 80) return 4;
    if (score >= 70) return 3;
    if (score >= 65) return 2;

    return 1;
  };

  // ==========================
  // HANDLE CHANGE
  // ==========================
  const handleChange = (alternativeId, key, value) => {
    setFormData((prev) => ({
      ...prev,

      [alternativeId]: {
        ...prev[alternativeId],

        [key]: value,
      },
    }));
  };

  // ==========================
  // VALIDATION
  // ==========================
  const isComplete = () => {
    return alternatives.every((alternative) => {
      const data = formData[alternative.id];

      return criteria.every(
        (criterion) => data?.[`c${criterion.id}`] !== undefined,
      );
    });
  };

  // ==========================
  // SUBMIT
  // ==========================
  const handleSubmit = async () => {
    if (!isComplete()) {
      alert("Semua alternatif harus diisi lengkap.");

      return;
    }

    try {
      setSubmitting(true);

      const answers = [];

      Object.entries(formData).forEach(([altId, value]) => {
        criteria.forEach((criterion) => {
          answers.push({
            alternative_id: Number(altId),

            criteria_id: criterion.id,

            nilai: value[`c${criterion.id}`],
          });
        });
      });

      const token = localStorage.getItem("token");

      // submit questionnaire
      await axios.post(
        "https://skirpsian.com/api/questionnaire",
        {
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // calculate recommendation
      await axios.post(
        "https://skirpsian.com/api/recommendation",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/student/result");
    } catch (error) {
      console.error("Submit Error:", error);

      alert(error?.response?.data?.message || "Gagal submit questionnaire.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-gray-500">Memuat questionnaire...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Thesis Topic Recommendation
          </h1>

          <p className="text-gray-500 mt-3 max-w-3xl leading-relaxed">
            Lengkapi penilaian berdasarkan profil akademik dan pengalamanmu.
          </p>
        </div>

        {/* C1 */}
        <div className="bg-white border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">📋</span>

            <h2 className="font-bold text-2xl">
              C1. Nilai Mata Kuliah Relevan
            </h2>
          </div>

          <p className="text-gray-500 mb-8">
            Masukkan nilai rata-rata (0–100) untuk mata kuliah prasyarat
            berikut.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map((alternative) => (
              <div key={alternative.id}>
                <label className="block text-sm font-medium mb-2">
                  {alternative.mata_kuliah_relevan || "Belum diatur"}
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 85"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-700"
                  value={formData[alternative.id]?.c1Raw || ""}
                  onChange={(e) => {
                    const raw = e.target.value || "";

                    handleChange(alternative.id, "c1Raw", raw);

                    handleChange(
                      alternative.id,
                      "c1",
                      convertGradeToScore(raw),
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* TITLE */}
        <div>
          <h2 className="text-2xl font-bold">
            Penilaian Karakteristik Berdasarkan Bidang Topik
          </h2>

          <p className="text-gray-500 mt-2">
            Berikan penilaian sesuai pengalaman dan kemampuanmu.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid lg:grid-cols-2 gap-6">
          {alternatives.map((alternative) => (
            <AlternativeCard
              key={alternative.id}
              alternative={alternative}
              criteria={criteria}
              formData={formData}
              handleChange={handleChange}
            />
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-teal-700 hover:bg-teal-800 disabled:bg-gray-400 transition text-white px-8 py-4 rounded-2xl shadow-md font-medium"
          >
            {submitting ? "Menghitung..." : "Hitung Rekomendasi Topik"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
