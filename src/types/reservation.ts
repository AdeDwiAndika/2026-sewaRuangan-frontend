export interface Reservation {
  id: number;
  kodePeminjaman: string;
  userId: number;
  userName: string;
  ruanganId: number;
  ruanganNama: string;
  ruanganKode: string;
  keperluan: string;
  jumlahPeserta: number;
  tanggalPeminjaman: string;
  waktuMulai: string;
  waktuSelesai: string;
  status: string;
  adminName?: string;
  catatanAdmin?: string;
  createdAt: string;
}

export interface CreateReservationRequest {
  ruanganId: number;
  keperluan: string;
  jumlahPeserta: number;
  tanggalPeminjaman: string;
  waktuMulai: string;
  waktuSelesai: string;
}

export interface Ruangan {
  id: number;
  kodeRuangan: string;
  namaRuangan: string;
  gedung: string;
  lantai: number;
  kapasitas: number;
  fasilitas: string;
  status: string;
}