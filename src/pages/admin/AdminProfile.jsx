import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");

        setProfile(response.data?.data ?? response.data);
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </AdminLayout>
    );
  }

  // ==========================
  // ERROR
  // ==========================
  if (!profile) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-red-500">Gagal memuat profile</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[36px] shadow-sm border overflow-hidden">
          {/* COVER */}
          <div className="relative h-64 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500">
            {/* AVATAR */}
            <div className="absolute -bottom-16 left-10">
              <div className="w-36 h-36 rounded-full border-[6px] border-white bg-white shadow-xl p-2">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-700 to-teal-500 text-white flex items-center justify-center text-5xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() ?? "A"}
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="pt-24 pb-10 px-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-800">
                  {profile?.name ?? "Administrator"}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium capitalize">
                    Administrator
                  </span>

                  {profile?.created_at && (
                    <span className="text-sm text-slate-500">
                      Bergabung{" "}
                      {new Date(profile.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* INFO CARD */}
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <InfoCard title="Nama Lengkap" value={profile?.name ?? "-"} />

              <InfoCard title="Email" value={profile?.email ?? "-"} />

              <InfoCard title="Role" value="Administrator" />

              <InfoCard title="ID Pengguna" value={`#${profile?.id ?? "-"}`} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ==========================
// INFO CARD
// ==========================
function InfoCard({ title, value }) {
  return (
    <div className="bg-slate-50 rounded-[28px] border p-6 hover:shadow-md transition">
      <p className="text-sm text-slate-500 mb-2">{title}</p>

      <h3 className="text-lg font-semibold text-slate-800 break-all">
        {value}
      </h3>
    </div>
  );
}
