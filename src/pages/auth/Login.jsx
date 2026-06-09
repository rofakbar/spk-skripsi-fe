import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import api from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // LOCK LOGIN PAGE
  useEffect(() => {
    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      const role = user.role?.[0];

      if (role === "admin") {
        navigate("/dashboard");
      }

      if (role === "user") {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", form);

      const token = response.data.data.token;

      const user = response.data.data.user;

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role?.[0];

      // redirect role-based
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white border rounded-3xl shadow-sm p-10">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Masuk</h1>

          <p className="text-slate-500 mt-2 text-sm">
            Silakan masukkan kredensial Anda
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>

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

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 transition text-white py-3 rounded-xl font-medium"
          >
            {loading ? "Loading..." : "LOGIN"}
          </button>

          {/* REGISTER */}
          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-teal-700 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
