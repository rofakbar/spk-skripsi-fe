import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

export default function Criteria() {
  const [criteria, setCriteria] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    kode: "",
    nama: "",
    source: "user",
    tipe: "benefit",
    deskripsi: "",
  });

  // ======================
  // FETCH
  // ======================
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get("/admin/criteria");

        setCriteria(response.data.data || []);
      } catch (error) {
        console.error("Fetch criteria error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ======================
  // SEARCH
  // ======================
  const filteredData = useMemo(() => {
    return criteria.filter(
      (item) =>
        item.nama?.toLowerCase().includes(search.toLowerCase()) ||
        item.kode?.toLowerCase().includes(search.toLowerCase()) ||
        item.tipe?.toLowerCase().includes(search.toLowerCase()) ||
        item.source?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, criteria]);

  // ======================
  // REFRESH
  // ======================
  const refreshData = async () => {
    const response = await api.get("/admin/criteria");

    setCriteria(response.data.data || []);
  };

  // ======================
  // FORM
  // ======================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      kode: "",
      nama: "",
      source: "user",
      tipe: "benefit",
      deskripsi: "",
    });

    setEditingId(null);
  };

  const closeModal = () => {
    resetForm();

    setShowModal(false);
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        kode: form.kode,
        nama: form.nama,
        source: form.source,
        tipe: form.tipe,
        deskripsi: form.deskripsi,
      };

      if (editingId) {
        await api.put(`/admin/criteria/${editingId}`, payload);
      } else {
        await api.post("/admin/criteria", payload);
      }

      await refreshData();

      closeModal();

      alert(
        editingId
          ? "Kriteria berhasil diupdate"
          : "Kriteria berhasil ditambahkan",
      );
    } catch (error) {
      console.error(error.response?.data || error);

      alert(error.response?.data?.message || "Gagal menyimpan data");
    }
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      kode: item.kode,
      nama: item.nama,
      source: item.source,
      tipe: item.tipe,
      deskripsi: item.deskripsi || "",
    });

    setShowModal(true);
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Yakin hapus data?");

    if (!confirmed) return;

    try {
      await api.delete(`/admin/criteria/${id}`);

      await refreshData();

      alert("Data berhasil dihapus");
    } catch (error) {
      console.error(error);

      alert("Gagal menghapus data");
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Data Kriteria</h1>

          <p className="text-gray-500 mt-2">Kelola data kriteria SPK</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari kriteria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border rounded-2xl py-3 pl-12 pr-4 w-full sm:w-[300px]"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 transition text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Tambah
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[30px] overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-5">Kode</th>

                <th className="text-left p-5">Nama</th>

                <th className="text-left p-5">Source</th>

                <th className="text-left p-5">Tipe</th>

                <th className="text-left p-5">Deskripsi</th>

                <th className="text-center p-5">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-5">{item.kode}</td>

                    <td className="p-5">{item.nama}</td>

                    <td className="p-5">
                      <span
                        className={`px-4 py-2 rounded-full text-sm ${
                          item.source === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.source}
                      </span>
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-4 py-2 rounded-full text-sm ${
                          item.tipe === "benefit"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.tipe}
                      </span>
                    </td>

                    <td className="p-5">{item.deskripsi || "-"}</td>

                    <td className="p-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-100 p-3 rounded-xl text-blue-700"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-100 p-3 rounded-xl text-red-700"
                        >
                          <Trash2 size={18} />
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[30px] w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-5 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit" : "Tambah"} Kriteria
              </h2>

              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-90px)] px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Kode"
                  name="kode"
                  value={form.kode}
                  onChange={handleChange}
                />

                <Input
                  label="Nama Kriteria"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                />

                <div>
                  <label className="block mb-2 font-medium">Source</label>

                  <select
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    className="w-full border rounded-2xl p-4"
                  >
                    <option value="user">User</option>

                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Tipe</label>

                  <select
                    name="tipe"
                    value={form.tipe}
                    onChange={handleChange}
                    className="w-full border rounded-2xl p-4"
                  >
                    <option value="benefit">Benefit</option>

                    <option value="cost">Cost</option>
                  </select>
                </div>

                <textarea
                  name="deskripsi"
                  rows="4"
                  value={form.deskripsi}
                  onChange={handleChange}
                  placeholder="Deskripsi"
                  className="w-full border rounded-2xl p-4"
                />

                <button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 rounded-2xl transition">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>

      <input {...props} required className="w-full border rounded-2xl p-4" />
    </div>
  );
}
