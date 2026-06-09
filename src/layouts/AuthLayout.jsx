import { ShieldCheck, Clock3, Save } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* HEADER */}
      <header className="h-16 border-b bg-white px-8 flex items-center justify-between">
        <h1 className="font-bold text-teal-700 tracking-wide">SKRIPSIAN</h1>
      </header>

      {/* CONTENT */}
      <main className="flex-1 grid lg:grid-cols-2">
        {/* LEFT */}
        <section className="border-r bg-[#F7F8FA] flex items-center px-14">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-slate-900">SKRIPSIAN</h1>

            <p className="text-slate-600 mt-4 text-lg leading-relaxed">
              Tentukan Topik Skripsimu Sekarang Juga
            </p>

            <div className="mt-10 space-y-7">
              <FeatureItem
                icon={<ShieldCheck size={18} />}
                title="1. Rekomendasi Objektif (WASPAS Method)"
                description="Sistem cerdas memberikan rekomendasi topik berdasarkan kriteria pembobotan WASPAS yang teruji."
              />

              <FeatureItem
                icon={<Clock3 size={18} />}
                title="2. Dinamis & Real-time"
                description="Penyesuaian kriteria dan alternatif secara real-time untuk hasil yang akurat."
              />

              <FeatureItem
                icon={<Save size={18} />}
                title="3. Simpan & Cetak Riwayat"
                description="Dokumentasikan seluruh proses pengambilan keputusan untuk referensi bimbingan."
              />
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex items-center justify-center px-8">
          {children}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-white px-8 h-16 flex items-center justify-between text-xs text-slate-500">
        <h2 className="font-semibold text-teal-700">SKRIPSIAN</h2>

        <p>© 2026 SKRIPSIAN. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>

        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
