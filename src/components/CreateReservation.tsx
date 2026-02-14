import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService, ruanganService } from '../services/reservationService';
import { CreateReservationRequest, Ruangan } from '../types/reservation';

const CreateReservation: React.FC = () => {
  const navigate = useNavigate();
  const [ruanganList, setRuanganList] = useState<Ruangan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<CreateReservationRequest>({
    ruanganId: 0,
    keperluan: '',
    jumlahPeserta: 1,
    tanggalPeminjaman: new Date().toISOString().split('T')[0],
    waktuMulai: '08:00',
    waktuSelesai: '09:00'
  });

  useEffect(() => {
    fetchRuangan();
  }, []);

  const fetchRuangan = async () => {
    try {
      const data = await ruanganService.getAvailable();
      setRuanganList(data);
    } catch (err) {
      console.error('Gagal mengambil data ruangan');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'ruanganId' || name === 'jumlahPeserta' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await reservationService.create(formData);
      alert('Peminjaman berhasil dibuat!');
      navigate('/reservations');
    } catch (err: any) {
      setError(err.message || 'Gagal membuat peminjaman');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">🎓 Sewa Ruangan</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Buat Peminjaman Baru</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Ruangan
              </label>
              <select
                name="ruanganId"
                value={formData.ruanganId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>-- Pilih Ruangan --</option>
                {ruanganList.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.namaRuangan} - {r.gedung} Lantai {r.lantai} (Kap. {r.kapasitas})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keperluan
              </label>
              <textarea
                name="keperluan"
                value={formData.keperluan}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Rapat organisasi, Kegiatan belajar, dll"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Peserta
              </label>
              <input
                type="number"
                name="jumlahPeserta"
                value={formData.jumlahPeserta}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Peminjaman
              </label>
              <input
                type="date"
                name="tanggalPeminjaman"
                value={formData.tanggalPeminjaman}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  name="waktuMulai"
                  value={formData.waktuMulai}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  name="waktuSelesai"
                  value={formData.waktuSelesai}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading || formData.ruanganId === 0}
                className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                  (loading || formData.ruanganId === 0) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {loading ? 'Memproses...' : 'Buat Peminjaman'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/reservations')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateReservation;