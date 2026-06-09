import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    nim: "",
    semester: "",
    ipk: "",
    minat: "",
  });

  const fetchStudents = async (mounted = true) => {
    try {
      const response = await api.get("/admin/students");

      if (mounted) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);

      await fetchStudents(mounted);
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    return students.filter(
      (item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.student_profile?.nim?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, students]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      nim: "",
      semester: "",
      ipk: "",
      minat: "",
    });

    setEditingId(null);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/students/${editingId}`, form);
      } else {
        await api.post("/admin/students", form);
      }

      await fetchStudents();

      closeModal();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Gagal menyimpan data");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      name: item.name,
      email: item.email,
      password: "",
      nim: item.student_profile?.nim || "",
      semester: item.student_profile?.semester || "",
      ipk: item.student_profile?.ipk || "",
      minat: item.student_profile?.minat || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Yakin hapus mahasiswa?");

    if (!confirmed) return;

    try {
      await api.delete(`/admin/students/${id}`);

      await fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Data Mahasiswa</h1>

          <p className="text-gray-500">Kelola data mahasiswa</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-xl border bg-white outline-none"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 text-white px-5 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-5 text-left">Nama</th>

              <th className="p-5 text-left">Email</th>

              <th className="p-5 text-left">NIM</th>

              <th className="p-5 text-left">Semester</th>

              <th className="p-5 text-left">IPK</th>

              <th className="p-5 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-5">{item.name}</td>

                <td className="p-5">{item.email}</td>

                <td className="p-5">{item.student_profile?.nim}</td>

                <td className="p-5">{item.student_profile?.semester}</td>

                <td className="p-5">{item.student_profile?.ipk}</td>

                <td className="p-5">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleEdit(item)}>
                      <Pencil />
                    </button>

                    <button onClick={() => handleDelete(item.id)}>
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-7 w-full max-w-2xl">
            <div className="flex justify-between mb-5">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit" : "Tambah"} Mahasiswa
              </h2>

              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Nama"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-xl p-4"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-4"
              />

              {!editingId && (
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-4"
                />
              )}

              <input
                name="nim"
                placeholder="NIM"
                value={form.nim}
                onChange={handleChange}
                className="w-full border rounded-xl p-4"
              />

              <input
                name="semester"
                placeholder="Semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full border rounded-xl p-4"
              />

              <input
                name="ipk"
                placeholder="IPK"
                value={form.ipk}
                onChange={handleChange}
                className="w-full border rounded-xl p-4"
              />

              <input
                name="minat"
                placeholder="Minat"
                value={form.minat}
                onChange={handleChange}
                className="w-full border rounded-xl p-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border px-5 py-3 rounded-xl"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-5 py-3 rounded-xl"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
