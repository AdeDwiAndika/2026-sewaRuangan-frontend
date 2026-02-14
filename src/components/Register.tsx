import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { RegisterRequest, UserRole, RoleDisplayNames } from '../types/user';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: UserRole.Mahasiswa // Default Mahasiswa
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'role') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  
  // Validasi password match
  if (formData.password !== confirmPassword) {
    setError('Password dan konfirmasi password tidak sama');
    return;
  }

  // Validasi panjang password
  if (formData.password.length < 6) {
    setError('Password minimal 6 karakter');
    return;
  }

  setLoading(true);

  try {
    console.log('Submitting registration:', formData); // Debug
    
    const result = await authService.register(formData);
    console.log('Registration success:', result); // Debug
    
    // Redirect ke login dengan pesan sukses
    navigate('/login', { 
      state: { 
        message: 'Registrasi berhasil! Silakan login dengan email dan password Anda.' 
      } 
    });
  } catch (err: any) {
    console.error('Registration error:', err); // Debug
    setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '1rem'
    },
    card: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '500px'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
      color: '#111827'
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.25rem'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      outline: 'none'
    },
    select: {
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: 'white',
      outline: 'none'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      marginTop: '0.5rem'
    },
    buttonDisabled: {
      backgroundColor: '#93c5fd',
      cursor: 'not-allowed'
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      textAlign: 'center' as const
    },
    footer: {
      marginTop: '1rem',
      textAlign: 'center' as const,
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Daftar Akun Sewa Ruangan</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="masukkan nama lengkap"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="masukkan email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>No. Telepon</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="masukkan no telepon"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value={UserRole.Mahasiswa}>Mahasiswa</option>
              <option value={UserRole.Dosen}>Dosen</option>
              <option value={UserRole.Staff}>Staff</option>
              <option value={UserRole.Admin}>Admin</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="minimal 6 karakter"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="ulangi password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        <div style={styles.footer}>
          Sudah punya akun?{' '}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;