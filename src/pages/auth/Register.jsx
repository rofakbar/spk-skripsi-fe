import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import api from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    nim: "",
    semester: "",
    ipk: "",
    minat: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // redirect jika sudah login
  useEffect(() => {
    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.role?.[0];

    if (token) {
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/student/questionnaire");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", form);

      const token = response.data.data.token;

      const user = response.data.data.user;

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      const role = user?.role?.[0];

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/student/questionnaire");
      }
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl bg-white border rounded-3xl shadow-sm p-10">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Register</h1>

          <p className="text-slate-500 mt-2 text-sm">
            Buat akun mahasiswa untuk melanjutkan
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* IDENTITAS */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">
              Informasi Akun
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Masukkan email"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* AKADEMIK */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">
              Data Mahasiswa
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  NIM
                </label>

                <input
                  type="text"
                  name="nim"
                  value={form.nim}
                  onChange={handleChange}
                  placeholder="2207411001"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Semester
                </label>

                <input
                  type="number"
                  min="1"
                  max="14"
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  placeholder="8"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  IPK
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  name="ipk"
                  value={form.ipk}
                  onChange={handleChange}
                  placeholder="3.75"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Minat
                </label>

                <input
                  type="text"
                  name="minat"
                  value={form.minat}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Keamanan Akun</h3>

            <div className="grid md:grid-cols-2 gap-5">
              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-teal-600"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Konfirmasi Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-teal-600"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 transition text-white py-3 rounded-xl font-medium"
          >
            {loading ? "Loading..." : "REGISTER"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-teal-700 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
