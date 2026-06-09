import MainLayout from "../../layouts/MainLayout";

export default function Waspas() {
  const steps = [
    {
      title: "1. Menentukan Kriteria",
      desc: "Sistem menentukan kriteria penilaian yang digunakan untuk rekomendasi topik skripsi seperti kemampuan pemrograman, minat riset, logika, analisis data, dan lainnya.",
    },
    {
      title: "2. Menentukan Bobot Kriteria",
      desc: "Setiap kriteria memiliki bobot sesuai tingkat kepentingannya. Semakin besar bobot, semakin besar pengaruh terhadap hasil rekomendasi.",
    },
    {
      title: "3. Mengisi Kuisioner",
      desc: "Mahasiswa menjawab pertanyaan kuisioner sesuai kemampuan, minat, dan preferensi akademik.",
    },
    {
      title: "4. Normalisasi Nilai",
      desc: "Nilai jawaban dinormalisasi berdasarkan jenis atribut Benefit atau Cost agar semua kriteria memiliki skala yang seimbang.",
    },
    {
      title: "5. Perhitungan WASPAS",
      desc: "Sistem menggabungkan metode Weighted Sum Model (WSM) dan Weighted Product Model (WPM) untuk menghasilkan skor akhir rekomendasi.",
    },
    {
      title: "6. Hasil Rekomendasi",
      desc: "Alternatif topik skripsi dengan nilai tertinggi akan direkomendasikan kepada mahasiswa.",
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-500 rounded-[32px] p-10 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Metode WASPAS</h1>

          <p className="text-lg text-teal-50 leading-relaxed max-w-3xl">
            Weighted Aggregated Sum Product Assessment (WASPAS) adalah metode
            Sistem Pendukung Keputusan (SPK) yang menggabungkan metode Weighted
            Sum Model (WSM) dan Weighted Product Model (WPM) untuk menghasilkan
            keputusan yang lebih akurat dalam pemilihan alternatif terbaik.
          </p>
        </div>

        {/* Pengertian */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            Apa Itu WASPAS?
          </h2>

          <p className="text-slate-600 leading-8">
            Metode WASPAS merupakan kombinasi dari metode
            <span className="font-semibold"> Weighted Sum Model (WSM)</span> dan
            <span className="font-semibold"> Weighted Product Model (WPM)</span>
            . Metode ini digunakan untuk meningkatkan akurasi pengambilan
            keputusan multikriteria dengan mempertimbangkan bobot pada setiap
            kriteria.
          </p>
        </div>

        {/* Rumus */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">
            Rumus Perhitungan
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border">
              <h3 className="font-semibold text-lg mb-3">
                Weighted Sum Model (WSM)
              </h3>

              <div className="bg-white border rounded-xl p-5 text-center text-xl font-semibold text-teal-700">
                Q₁ = Σ(Xᵢⱼ × Wⱼ)
              </div>

              <p className="text-sm text-slate-500 mt-4">
                Menghitung total nilai berdasarkan penjumlahan bobot dan nilai
                normalisasi.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border">
              <h3 className="font-semibold text-lg mb-3">
                Weighted Product Model (WPM)
              </h3>

              <div className="bg-white border rounded-xl p-5 text-center text-xl font-semibold text-teal-700">
                Q₂ = Π(Xᵢⱼ ^ Wⱼ)
              </div>

              <p className="text-sm text-slate-500 mt-4">
                Menghitung nilai berdasarkan hasil perkalian bobot pada tiap
                alternatif.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-teal-700 mb-3">
              Rumus Akhir WASPAS
            </h3>

            <div className="bg-white rounded-xl p-5 text-center text-2xl font-bold text-teal-700">
              Q = 0.5(Q₁) + 0.5(Q₂)
            </div>

            <p className="text-slate-600 mt-3">
              Nilai akhir diperoleh dari kombinasi metode WSM dan WPM dengan
              bobot masing-masing 50%.
            </p>
          </div>
        </div>

        {/* Step */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">
            Cara Kerja WASPAS Pada Sistem
          </h2>

          <div className="space-y-5">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-5 p-5 rounded-2xl border hover:shadow-md transition"
              >
                <div className="min-w-[50px] h-[50px] rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-slate-800">
                    {step.title}
                  </h3>

                  <p className="text-slate-500 mt-1 leading-7">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefit Cost */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-3xl p-8">
            <h3 className="font-bold text-xl text-green-700 mb-3">Benefit</h3>

            <p className="text-slate-600 leading-7">
              Kriteria benefit adalah kriteria yang semakin besar nilainya maka
              semakin baik hasilnya. Contoh: kemampuan programming atau minat
              penelitian.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
            <h3 className="font-bold text-xl text-red-700 mb-3">Cost</h3>

            <p className="text-slate-600 leading-7">
              Kriteria cost adalah kriteria yang semakin kecil nilainya maka
              semakin baik hasil akhirnya.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
