import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reservationService } from "../../services/reservationService";
import { Reservation } from "../../types/reservation";

const EditReservation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [form, setForm] = useState<Partial<Reservation>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!id) return;
        const data = await reservationService.getById(Number(id));
        setReservation(data);
        setForm({
          keperluan: data.keperluan,
          jumlahPeserta: data.jumlahPeserta,
          tanggalPeminjaman: data.tanggalPeminjaman,
          waktuMulai: data.waktuMulai,
          waktuSelesai: data.waktuSelesai,
        });
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data peminjaman");
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await reservationService.update(Number(id), {
      keperluan: form.keperluan,
      jumlahPeserta: form.jumlahPeserta,
      tanggalPeminjaman: form.tanggalPeminjaman,
      waktuMulai: form.waktuMulai,
      waktuSelesai: form.waktuSelesai,
    });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate peminjaman");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!reservation) return <div>Data tidak ditemukan</div>;

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Peminjaman</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Keperluan</label>
          <input
            type="text"
            name="keperluan"
            value={form.keperluan || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Jumlah Peserta</label>
          <input
            type="number"
            name="jumlahPeserta"
            value={form.jumlahPeserta || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tanggal Peminjaman</label>
          <input
            type="date"
            name="tanggalPeminjaman"
            value={form.tanggalPeminjaman ? String(form.tanggalPeminjaman).slice(0,10) : ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Waktu Mulai</label>
          <input
            type="time"
            name="waktuMulai"
            value={form.waktuMulai || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Waktu Selesai</label>
          <input
            type="time"
            name="waktuSelesai"
            value={form.waktuSelesai || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReservation;