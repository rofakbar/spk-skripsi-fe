import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

export default function Alternatives() {
  const [alternatives, setAlternatives] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    kode: "",
    nama_topik: "",
    kompetensi_lulusan: "",
    mata_kuliah_relevan: "",
    deskripsi: "",
  });

  // sementara force admin
  const isAdmin = true;

  // ======================
  // FETCH
  // ======================
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get("/admin/alternatives");

        setAlternatives(response.data.data || []);
      } catch (error) {
        console.error("Fetch alternatives error:", error);
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
    return alternatives.filter(
      (item) =>
        item.nama_topik?.toLowerCase().includes(search.toLowerCase()) ||
        item.kode?.toLowerCase().includes(search.toLowerCase()) ||
        item.kompetensi_lulusan?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, alternatives]);

  // ======================
  // REFRESH
  // ======================
  const refreshData = async () => {
    const response = await api.get("/admin/alternatives");

    setAlternatives(response.data.data || []);
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
      nama_topik: "",
      kompetensi_lulusan: "",
      mata_kuliah_relevan: "",
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
        nama_topik: form.nama_topik,

        kompetensi_lulusan: form.kompetensi_lulusan,

        mata_kuliah_relevan: form.mata_kuliah_relevan,

        deskripsi: form.deskripsi,
      };

      if (editingId) {
        await api.put(`/admin/alternatives/${editingId}`, payload);
      } else {
        await api.post("/admin/alternatives", payload);
      }

      await refreshData();

      closeModal();

      alert(editingId ? "Data berhasil diupdate" : "Data berhasil ditambahkan");
    } catch (error) {
      console.error(error);

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

      nama_topik: item.nama_topik,

      kompetensi_lulusan: item.kompetensi_lulusan,

      mata_kuliah_relevan: item.mata_kuliah_relevan || "",

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
      await api.delete(`/admin/alternatives/${id}`);

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Data Alternatif</h1>

          <p className="text-gray-500 mt-2">Kelola alternatif topik skripsi</p>
        </div>

        <div className="flex gap-3">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari alternatif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border rounded-2xl py-3 pl-12 pr-4 w-[300px]"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-emerald-600 text-white px-5 rounded-2xl flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[30px] overflow-hidden border">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-5">Kode</th>

              <th className="text-left p-5">Nama Topik</th>

              <th className="text-left p-5">Kompetensi</th>
              <th className="text-left p-5">Mata Kuliah</th>

              <th className="text-left p-5">Deskripsi</th>

              <th className="text-center p-5">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-5">{item.kode}</td>

                <td className="p-5">{item.nama_topik}</td>

                <td className="p-5">{item.kompetensi_lulusan}</td>
                <td className="p-5">{item.mata_kuliah_relevan || "-"}</td>

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
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-[30px] w-full max-w-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit" : "Tambah"} Alternatif
              </h2>

              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Kode"
                name="kode"
                value={form.kode}
                onChange={handleChange}
              />

              <Input
                label="Nama Topik"
                name="nama_topik"
                value={form.nama_topik}
                onChange={handleChange}
              />

              <Input
                label="Kompetensi Lulusan"
                name="kompetensi_lulusan"
                value={form.kompetensi_lulusan}
                onChange={handleChange}
              />
              <Input
                label="Mata Kuliah Relevan"
                name="mata_kuliah_relevan"
                value={form.mata_kuliah_relevan}
                onChange={handleChange}
              />

              <textarea
                name="deskripsi"
                rows="4"
                value={form.deskripsi}
                onChange={handleChange}
                className="w-full border rounded-2xl p-4"
              />

              <button className="bg-emerald-600 text-white w-full py-4 rounded-2xl">
                Simpan
              </button>
            </form>
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
