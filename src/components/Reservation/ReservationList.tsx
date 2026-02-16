import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reservationService } from "../../services/reservationService";
import { authService } from "../../services/api";
import { Reservation } from "../../types/reservation";

const ReservationList: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('semua');
  const [search, setSearch] = useState('');
  
  // State untuk modal approval
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const filterReservations = reservations.filter(r =>
    (filter === 'semua' ? true : r.status === filter) &&
    (
      (r.keperluan?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.ruanganNama?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.status?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.kodePeminjaman?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.userName?.toLowerCase() || '').includes(search.toLowerCase())
    )
  );

  const handleApproveClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowApproveModal(true);
  };

  const handleRejectClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowRejectModal(true);
    setRejectReason('');
  };

  const handleApprove = async () => {
    if (!selectedReservation) return;
    
    setActionLoading(true);
    try {
      await reservationService.approve(selectedReservation.id);
      setShowApproveModal(false);
      fetchReservations();
    } catch (err: any) {
      alert(err.message || 'Gagal menyetujui peminjaman');
    } finally {
      setActionLoading(false);
      setSelectedReservation(null);
    }
  };

  const handleReject = async () => {
    if (!selectedReservation) return;
    
    if (!rejectReason.trim()) {
      alert('Catatan penolakan harus diisi');
      return;
    }
    
    setActionLoading(true);
    try {
      await reservationService.reject(selectedReservation.id, rejectReason);
      setShowRejectModal(false);
      fetchReservations();
    } catch (err: any) {
      alert(err.message || 'Gagal menolak peminjaman');
    } finally {
      setActionLoading(false);
      setSelectedReservation(null);
      setRejectReason('');
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Batalkan peminjaman ini?')) {
      try {
        await reservationService.cancel(id);
        fetchReservations();
      } catch (err: any) {
        alert(err.message);
      }
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
  const canApprove = user?.role === 1 || user?.role === 3 || user?.role === 4;

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
        <div className="flex justify-between items-center">
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
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari Peminjaman..."
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
            />
          </div>
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
                {filterReservations.map((r) => (
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
                        {/* Approval Actions - untuk yang menunggu */}
                        {r.status === 'menunggu' && canApprove && (
                          <>
                            <button 
                              onClick={() => handleApproveClick(r)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Setuju
                            </button>
                            <button 
                              onClick={() => handleRejectClick(r)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        
                        {/* Cancel - untuk pemilik atau admin */}
                        {(r.status === 'menunggu' || r.status === 'disetujui') && (
                          <button 
                            onClick={() => handleCancel(r.id)}
                            className="text-yellow-600 hover:text-yellow-800 font-medium"
                          >
                            Batal
                          </button>
                        )}
                        
                        {/* Delete - hanya admin */}
                        {isAdmin && (
                          <button 
                            onClick={() => handleDelete(r.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Hapus
                          </button>
                        )}
                        
                        {/* Detail - semua bisa lihat */}
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

      {/* Modal Approve */}
      {showApproveModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Setujui Peminjaman</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p><span className="font-medium">Kode:</span> {selectedReservation.kodePeminjaman}</p>
              <p><span className="font-medium">Ruangan:</span> {selectedReservation.ruanganNama}</p>
              <p><span className="font-medium">Peminjam:</span> {selectedReservation.userName}</p>
              <p><span className="font-medium">Tanggal:</span> {new Date(selectedReservation.tanggalPeminjaman).toLocaleDateString('id-ID')}</p>
              <p><span className="font-medium">Jam:</span> {selectedReservation.waktuMulai} - {selectedReservation.waktuSelesai}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={actionLoading}
              >
                Batal
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? 'Memproses...' : 'Ya, Setujui'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reject */}
      {showRejectModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tolak Peminjaman</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p><span className="font-medium">Kode:</span> {selectedReservation.kodePeminjaman}</p>
              <p><span className="font-medium">Ruangan:</span> {selectedReservation.ruanganNama}</p>
              <p><span className="font-medium">Peminjam:</span> {selectedReservation.userName}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Contoh: Ruangan sedang dipelihara, Jadwal bentrok, dll"
                disabled={actionLoading}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={actionLoading}
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Memproses...' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;