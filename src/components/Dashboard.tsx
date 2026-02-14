import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services/api';
import { LoginResponse, User } from '../types/user';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Cek apakah user sudah login
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      console.log(' User not Found');
      navigate('/login');
      return;
    }

    setUser(currentUser);

    // Ambil detail user dari API
    const fetchUserDetail = async () => {
      try {
        const detail = await userService.getCurrentUser();
        setUserDetail(detail);
      } catch (error) {
        console.error('Gagal mengambil detail user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    },
    navbar: {
      backgroundColor: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    userName: {
      fontWeight: '500'
    },
    badge: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    logoutButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer'
    },
    content: {
      padding: '2rem'
    },
    card: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    },
    infoRow: {
      display: 'flex',
      padding: '0.75rem 0',
      borderBottom: '1px solid #e5e7eb'
    },
    infoLabel: {
      width: '150px',
      fontWeight: '500',
      color: '#6b7280'
    },
    infoValue: {
      flex: 1,
      color: '#111827'
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginTop: '1.5rem',
      marginBottom: '1rem'
    },
    capabilities: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    capability: {
      padding: '0.5rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.375rem',
      fontSize: '0.875rem'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '1.125rem'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.title}>Sewa Ruangan</div>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.name}</span>
          <span style={styles.badge}>{user?.roleDisplayName}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Profil User</h2>
          
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Nama</div>
            <div style={styles.infoValue}>{userDetail?.name || user?.name}</div>
          </div>
          
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Email</div>
            <div style={styles.infoValue}>{userDetail?.email || user?.email}</div>
          </div>
          
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>No. Telepon</div>
            <div style={styles.infoValue}>{userDetail?.phoneNumber}</div>
          </div>
          
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Role</div>
            <div style={styles.infoValue}>{userDetail?.roleDisplayName}</div>
          </div>
          
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Total Reservasi</div>
            <div style={styles.infoValue}>{userDetail?.totalReservations}</div>
          </div>

          <h2 style={styles.sectionTitle}>Hak Akses</h2>
          
          <div style={styles.capabilities}>
            {userDetail?.canApprove && (
              <div style={styles.capability}>✅ Dapat menyetujui peminjaman</div>
            )}
            {userDetail?.canManageRooms && (
              <div style={styles.capability}>✅ Dapat mengelola ruangan</div>
            )}
            {userDetail?.canViewAllReservations && (
              <div style={styles.capability}>✅ Dapat melihat semua peminjaman</div>
            )}
            {userDetail?.canManageUsers && (
              <div style={styles.capability}>✅ Dapat mengelola user</div>
            )}
            {userDetail?.canDelete && (
              <div style={styles.capability}>✅ Dapat menghapus data</div>
            )}
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Status Akun</div>
            <div style={styles.infoValue}>
              {userDetail?.isActive ? '🟢 Aktif' : '🔴 Tidak Aktif'}
            </div>
          </div>
          
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Terdaftar Sejak</div>
            <div style={styles.infoValue}>
              {userDetail?.createdAt ? new Date(userDetail.createdAt).toLocaleDateString('id-ID') : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;