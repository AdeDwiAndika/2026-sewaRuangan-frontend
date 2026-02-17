import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reservationService } from '../../services/reservationService';
import { authService } from '../../services/api';
import { Reservation } from '../../types/reservation';

const ReservationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReservation();
    }, [id]);

    const fetchReservation = async () => {
        try {
        setLoading(true);
        const data = await reservationService.getById(Number(id));
        setReservation(data);
        } catch (err: any) {
        setError(err.message || 'Gagal mengambil data');
        } finally {
        setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!reservation) return;
        try {
        await reservationService.approve(reservation.id);
        fetchReservation();
        } catch (err: any) {
        alert(err.message);
        }
    };

    const handleReject = async () => {
        if (!reservation) return;
        const reason = window.prompt('Catatan penolakan:');
        if (reason) {
        try {
            await reservationService.reject(reservation.id, reason);
            fetchReservation();
        } catch (err: any) {
            alert(err.message);
        }
        }
    };

    const handleCancel = async () => {
        if (!reservation) return;
        if (window.confirm('Batalkan peminjaman ini?')) {
        try {
            await reservationService.cancel(reservation.id);
            fetchReservation();
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

    const user = authService.getCurrentUser();
    const canApprove = user?.canApprove;

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
        </div>
        );
    }

    if (error || !reservation) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-500">{error || 'Data tidak ditemukan'}</div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Sewa Ruangan</h1>
                </div>
            </div>
            </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
            onClick={() => navigate('/reservations')}
            className="mb-4 text-blue-600 hover:text-blue-800"
            >
            ← Kembali
            </button>

            <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">
                Detail Peminjaman
                </h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(reservation.status)}`}>
                {reservation.status}
                </span>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-4">Informasi Peminjaman</h2>
                    <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500">Kode Peminjaman</p>
                        <p className="font-medium">{reservation.kodePeminjaman}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Keperluan</p>
                        <p className="font-medium">{reservation.keperluan}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Jumlah Peserta</p>
                        <p className="font-medium">{reservation.jumlahPeserta} orang</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tanggal Peminjaman</p>
                        <p className="font-medium">
                        {new Date(reservation.tanggalPeminjaman).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Waktu</p>
                        <p className="font-medium">{reservation.waktuMulai} - {reservation.waktuSelesai}</p>
                    </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-4">Informasi Ruangan</h2>
                    <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500">Nama Ruangan</p>
                        <p className="font-medium">{reservation.ruanganNama}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Kode Ruangan</p>
                        <p className="font-medium">{reservation.ruanganKode}</p>
                    </div>
                    </div>

                    <h2 className="text-sm font-medium text-gray-500 mt-6 mb-4">Informasi Peminjam</h2>
                    <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500">Nama</p>
                        <p className="font-medium">{reservation.userName}</p>
                    </div>
                    </div>

                    {reservation.catatanAdmin && (
                    <>
                        <h2 className="text-sm font-medium text-gray-500 mt-6 mb-4">Catatan Admin</h2>
                        <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm">{reservation.catatanAdmin}</p>
                        </div>
                    </>
                    )}
                </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t flex space-x-3">
                {reservation.status === 'menunggu' && canApprove && (
                    <>
                    <button
                        onClick={handleApprove}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Setujui
                    </button>
                    <button
                        onClick={handleReject}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Tolak
                    </button>
                    </>
                )}
                {(reservation.status === 'menunggu' || reservation.status === 'disetujui') && (
                    <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                    Batalkan
                    </button>
                )}
                <button onClick={() => reservation.status === 'menunggu' && navigate(`/reservations/${reservation.id}/edit`)}
                        className={`px-4 py-2 text-white rounded-md ${reservation.status === 'menunggu' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    Edit
                </button>
                </div>
            </div>
            </div>
        </main>
        </div>
    );
};

export default ReservationDetail;