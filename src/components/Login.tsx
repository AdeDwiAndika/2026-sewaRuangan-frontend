import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { LoginRequest } from '../types/user';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      console.log('Login success:', response);
      
      // Redirect ke dashboard atau halaman utama
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  // Style CSS inline sederhana
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    },
    card: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px'
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
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
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
        <h2 style={styles.title}>Login Sewa Ruangan</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
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
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="masukkan password"
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
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          Belum punya akun?{' '}
          <Link to="/register" style={styles.link}>
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;