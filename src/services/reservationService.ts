import api from './api';
import { Reservation, CreateReservationRequest, Ruangan } from '../types/reservation';

export const reservationService = {
  // Get all reservations
  async getAll(): Promise<Reservation[]> {
    const response = await api.get('/Reservation');
    return response.data;
  },

  // Get my reservations
  async getMyReservations(): Promise<Reservation[]> {
    const response = await api.get('/Reservation/my');
    return response.data;
  },

  // Get single reservation
  async getById(id: number): Promise<Reservation> {
    const response = await api.get(`/Reservation/${id}`);
    return response.data;
  },

  // Create reservation
  async create(data: CreateReservationRequest): Promise<Reservation> {
    const response = await api.post('/Reservation', data);
    return response.data;
  },

  // Update reservation
  async update(id: number, data: Partial<CreateReservationRequest>): Promise<void> {
    await api.put(`/Reservation/${id}`, data);
  },

  // Delete reservation (admin only)
  async delete(id: number): Promise<void> {
    await api.delete(`/Reservation/${id}`);
  },

  // Approve reservation
  async approve(id: number): Promise<void> {
    await api.post(`/Reservation/${id}/approve`);
  },

  // Reject reservation
  async reject(id: number, catatan: string): Promise<void> {
    await api.post(`/Reservation/${id}/reject`, catatan, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Cancel reservation
  async cancel(id: number): Promise<void> {
    await api.post(`/Reservation/${id}/cancel`);
  }
};

export const ruanganService = {
  // Get all ruangan
  async getAll(): Promise<Ruangan[]> {
    const response = await api.get('/Ruangan');
    return response.data;
  },

  // Get available ruangan
  async getAvailable(): Promise<Ruangan[]> {
    const response = await api.get('/Ruangan/tersedia');
    return response.data;
  }
};