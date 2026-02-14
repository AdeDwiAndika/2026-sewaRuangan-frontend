import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../services/reservationService';
import { authService } from '../services/api';
import { Reservation } from '../types/reservation';

const ReservationList: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('semua');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAll();
      setReservations(data);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, action: string, catatan?: string) => {
    try {
      if (action === 'approve') {
        await reservationService.approve(id);
      } else if (action === 'reject') {
        const note = window.prompt('Catatan penolakan:');
        if (note) await reservationService.reject(id, note);
        else return;
      } else if (action === 'cancel') {
        if (window.confirm('Batalkan peminjaman ini?')) {
          await reservationService.cancel(id);
        } else {
          return;
        }
      }
      fetchReservations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus peminjaman ini? (Hanya admin)')) {
      try {
        await reservationService.delete(id);
        fetchReservations();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'menunggu': 'bg-yellow-100 text-yellow-800',
      'disetujui': 'bg-green-100 text-green-800',
      'ditolak': 'bg-red-100 text-red-800',
      'dibatalkan': 'bg-gray-100 text-gray-800',
      'selesai': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredReservations = reservations.filter(r => 
    filter === 'semua' ? true : r.status === filter
  );

  const user = authService.getCurrentUser();
  const isAdmin = user?.role === 1 || user?.role === 4;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-blue-600">🎓 Sewa Ruangan</h1>
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/reservations')}
                  className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
                >
                  Peminjaman
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Peminjaman Ruangan</h1>
          <button 
            onClick={() => navigate('/reservations/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Buat Peminjaman
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['semua', 'menunggu', 'disetujui', 'ditolak', 'dibatalkan', 'selesai'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peminjam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keperluan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{r.kodePeminjaman}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.ruanganNama}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(r.tanggalPeminjaman).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.waktuMulai} - {r.waktuSelesai}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{r.keperluan}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        {r.status === 'menunggu' && (
                          <>
                            {isAdmin && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(r.id, 'approve')}
                                  className="text-green-600 hover:text-green-800 font-medium"
                                >
                                  Setuju
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(r.id, 'reject')}
                                  className="text-red-600 hover:text-red-800 font-medium"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleStatusChange(r.id, 'cancel')}
                              className="text-yellow-600 hover:text-yellow-800 font-medium"
                            >
                              Batal
                            </button>
                          </>
                        )}
                        {r.status === 'disetujui' && (
                          <button 
                            onClick={() => handleStatusChange(r.id, 'cancel')}
                            className="text-yellow-600 hover:text-yellow-800 font-medium"
                          >
                            Batal
                          </button>
                        )}
                        {isAdmin && (
                          <button 
                            onClick={() => handleDelete(r.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Hapus
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/reservations/${r.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada data peminjaman</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReservationList;