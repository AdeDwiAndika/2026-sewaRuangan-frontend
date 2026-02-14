// Enum untuk UserRole (sama dengan backend)
export enum UserRole {
  Admin = 1,
  Mahasiswa = 2,
  Dosen = 3,
  Staff = 4
}

// Untuk display name role
export const RoleDisplayNames: Record<UserRole, string> = {
  [UserRole.Admin]: 'Administrator',
  [UserRole.Staff]: 'Staff',
  [UserRole.Dosen]: 'Dosen',
  [UserRole.Mahasiswa]: 'Mahasiswa'
};

// Interface untuk Register Request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
}

// Interface untuk Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface untuk Login Response (RoleInfoDto dari backend)
export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
  tokenExpiration: string;
  role: UserRole;
  roleDisplayName: string;
  canApprove: boolean;
  canManageRooms: boolean;
  canViewAllReservations: boolean;
  canManageUsers: boolean;
}

// Interface untuk User (UserDto dari backend)
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  roleDisplayName: string;
  isActive: boolean;
  createdAt: string;
  canApprove: boolean;
  canManageRooms: boolean;
  canViewAllReservations: boolean;
  canManageUsers: boolean;
  canDelete: boolean;
  totalReservations: number;
}

// Interface untuk API Response
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: string[];
}