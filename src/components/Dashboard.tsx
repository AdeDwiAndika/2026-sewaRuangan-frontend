import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, userService } from "../services/api";
import { reservationService } from "../services/reservationService";
import { LoginResponse, User } from "../types/user";
import { Reservation } from "../types/reservation";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const fetchData = async () => {
      try {
        const detail = await userService.getCurrentUser();
        let reservations: Reservation[] = [];

        if (detail.canViewAllReservations) {
          reservations = await reservationService.getAll();
        } else {
          reservations = await reservationService.getMyReservations();
        }
        setUserDetail(detail);
        setRecentReservations(reservations); // tampilkan semua
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Approval actions
  const handleApprove = async (id: number) => {
    try {
      await reservationService.approve(id);
      // Refresh data
      const detail = await userService.getCurrentUser();
      let reservations: Reservation[] = [];
      if (detail.canViewAllReservations) {
        reservations = await reservationService.getAll();
      } else {
        reservations = await reservationService.getMyReservations();
      }
      setUserDetail(detail);
      setRecentReservations(reservations);
    } catch (err: any) {
      setError(err.message || "Gagal menyetujui peminjaman");
    }
  };

  const handleReject = async (id: number) => {
    const reason = window.prompt("Catatan penolakan:");
    if (!reason) return;
    try {
      await reservationService.reject(id, reason);
      // Refresh data
      const detail = await userService.getCurrentUser();
      let reservations: Reservation[] = [];
      if (detail.canViewAllReservations) {
        reservations = await reservationService.getAll();
      } else {
        reservations = await reservationService.getMyReservations();
      }
      setUserDetail(detail);
      setRecentReservations(reservations);
    } catch (err: any) {
      setError(err.message || "Gagal menolak peminjaman");
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      menunggu: "bg-yellow-100 text-yellow-800",
      disetujui: "bg-green-100 text-green-800",
      ditolak: "bg-red-100 text-red-800",
      dibatalkan: "bg-gray-100 text-gray-800",
      selesai: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
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
              <h1 className="text-xl font-bold text-blue-600">
                🎓 Sewa Ruangan
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/reservations")}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Peminjaman
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                {user?.roleDisplayName}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Selamat datang, {userDetail?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Anda login sebagai{" "}
            <span className="font-medium">{userDetail?.roleDisplayName}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Aksi Cepat
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/reservations/create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Buat Peminjaman Baru
            </button>
            <button
              onClick={() => navigate("/reservations")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Lihat Semua Peminjaman
            </button>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Peminjaman Terbaru
          </h2>
          {recentReservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Belum ada data peminjaman</p>
              <button
                onClick={() => navigate("/reservations/create")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Buat Peminjaman Sekarang
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Kode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ruangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Jam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReservations.map((r) => (
                    <tr key={r.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {r.kodePeminjaman}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {r.ruanganNama}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(r.tanggalPeminjaman).toLocaleDateString(
                          "id-ID",
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {r.waktuMulai} - {r.waktuSelesai}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(r.status)}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/reservations/${r.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Detail
                        </button>
                        {/* Approval buttons always shown for approvers, but disabled if status != 'menunggu' */}
                        {userDetail?.canApprove && (
                          <>
                            <button
                              onClick={() => r.status === 'menunggu' && handleApprove(r.id)}
                              disabled={r.status !== 'menunggu'}
                              className={`ml-2 px-3 py-1 rounded-md text-xs ${r.status === 'menunggu' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => r.status === 'menunggu' && handleReject(r.id)}
                              disabled={r.status !== 'menunggu'}
                              className={`ml-2 px-3 py-1 rounded-md text-xs ${r.status === 'menunggu' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Info & Permissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Akun */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Akun
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Nama</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.email}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">No. Telepon</span>
                <span className="text-sm font-medium text-gray-900">
                  {userDetail?.phoneNumber}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Role</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.roleDisplayName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-medium text-gray-900">
                  {userDetail?.isActive ? "🟢 Aktif" : "🔴 Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>

          {/* Hak Akses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Hak Akses
            </h2>
            <div className="space-y-2">
              {userDetail?.canApprove && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span>✅</span>
                  <span>Dapat menyetujui peminjaman</span>
                </div>
              )}
              {userDetail?.canManageRooms && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span>✅</span>
                  <span>Dapat mengelola ruangan</span>
                </div>
              )}
              {userDetail?.canViewAllReservations && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span>✅</span>
                  <span>Dapat melihat semua peminjaman</span>
                </div>
              )}
              {userDetail?.canManageUsers && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span>✅</span>
                  <span>Dapat mengelola user</span>
                </div>
              )}
              {!userDetail?.canApprove &&
                !userDetail?.canManageRooms &&
                !userDetail?.canViewAllReservations &&
                !userDetail?.canManageUsers && (
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <span>👤</span>
                    <span>
                      Akses terbatas (hanya melihat peminjaman sendiri)
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
