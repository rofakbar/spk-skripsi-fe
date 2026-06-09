import { useEffect, useState } from "react";

import { GraduationCap, FolderKanban, BookOpen } from "lucide-react";

import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    criteria: 0,
    topics: 0,
    students: 0,
    tests: 0,
  });

  const [criteriaWeights, setCriteriaWeights] = useState([]);

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [criteriaRes, alternativesRes, usersRes, resultsRes] =
          await Promise.all([
            api.get("/admin/criteria"),
            api.get("/admin/alternatives"),
            api.get("/admin/users"),
            api.get("/admin/results"),
          ]);

        const criteria = criteriaRes.data.data || [];

        const alternatives = alternativesRes.data.data || [];

        const users = usersRes.data.data || [];

        const results = resultsRes.data.data || [];

        const mahasiswa = users.filter(
          (user) => Array.isArray(user.role) && user.role.includes("user"),
        );

        setStats({
          criteria: criteria.length,
          topics: alternatives.length,
          students: mahasiswa.length,
          tests: results.length,
        });

        setCriteriaWeights(criteria);

        setResults(results.slice(0, 5));
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5">
        <StatCard
          title="Total Mahasiswa"
          value={loading ? "..." : stats.students}
          icon={<GraduationCap />}
        />

        <StatCard
          title="Jumlah Kriteria"
          value={loading ? "..." : `${stats.criteria} Kriteria`}
          icon={<BookOpen />}
        />

        <StatCard
          title="Jumlah Alternatif"
          value={loading ? "..." : `${stats.topics} Topik`}
          icon={<FolderKanban />}
        />
      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        {/* TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b">
            <div>
              <h3 className="font-semibold">Recent Student Activity</h3>

              <p className="text-sm text-gray-500">
                Latest recommendation results
              </p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left p-4">STUDENT</th>

                <th className="text-left p-4">TOPIC</th>

                <th className="text-left p-4">SCORE</th>
              </tr>
            </thead>

            <tbody>
              {results.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{item.user?.name || "-"}</td>

                  <td className="p-4">{item.alternative?.nama_topik || "-"}</td>

                  <td className="p-4">{item.score || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOBOT */}
        <div className="bg-white rounded-2xl border p-5">
          <h3 className="font-semibold mb-5">Bobot Kriteria</h3>

          {criteriaWeights.map((item) => (
            <WeightBar
              key={item.id}
              label={item.kode}
              subtitle={item.nama}
              value={Math.round(parseFloat(item.bobot) * 100)}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>

        <h2 className="text-4xl font-bold mt-2">{value}</h2>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
        {icon}
      </div>
    </div>
  );
}

function WeightBar({ label, subtitle, value }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-2">
        <div>
          <p className="font-medium">{label}</p>

          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>

        <span className="font-semibold">{value}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-700 rounded-full"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}
