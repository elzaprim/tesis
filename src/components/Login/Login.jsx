import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

const API_USER_URL = 'https://api.sahabatbmeitb.my.id/User';
const API_LOGIN_URL = 'https://api.sahabatbmeitb.my.id/login';
const API_REGISTER_URL = 'https://api.sahabatbmeitb.my.id/User/store';

export const Login = () => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    nip: '',
    bpjs: '',
    identifier: '', // ganti dari email ke identifier (bisa email, username, atau NIK)
    password: '',
    confirmPassword: '',
    hospital: '',
  });
  const [errors, setErrors] = useState({});
  const [accountCreated, setAccountCreated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleAccountSwitch = () => {
    setIsCreatingAccount(!isCreatingAccount);
    setErrors({});
    setFormData({
      name: '',
      username: '',
      nip: '',
      bpjs: '',
      identifier: '',
      password: '',
      confirmPassword: '',
      hospital: '',
    });
    setAccountCreated(false);
    setLoginError(false);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const redirectToDashboard = (level) => {
    switch (level) {
      case 'administrator':
        navigate('/admin-dashboard');
        break;
      case 'dokter':
        navigate('/doctor-dashboard');
        break;
      case 'pasien':
        navigate('/guardian-dashboard');
        break;
      default:
        console.error('Role tidak dikenali');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(false);

    try {
      const response = await fetch(API_USER_URL);
      const result = await response.json();

      if (response.ok && result.success) {
        const users = result.data;

        const user = users.find(u =>
          u.email === formData.identifier ||
          u.username === formData.identifier ||
          u.nik === formData.identifier
        );

        if (user) {
          const loginResponse = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email, // kirim email ke endpoint login meskipun input awal bisa username/NIK
              password: formData.password,
            }),
          });

          const loginResult = await loginResponse.json();

          if (loginResponse.ok) {
            const { token } = loginResult;
            sessionStorage.setItem('user_id', user.id);
            sessionStorage.setItem('role', user.level);
            sessionStorage.setItem('auth_token', token);
            sessionStorage.setItem('nik', user.nik);
            sessionStorage.setItem('email', user.email);
            sessionStorage.setItem('nama_lengkap', user.nama_lengkap);

            redirectToDashboard(user.level);
          } else {
            setLoginError(true);
          }
        } else {
          setLoginError(true);
        }
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.error('Error saat login:', error);
      setLoginError(true);
    }

    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    setIsLoading(true);

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Password dan konfirmasi password tidak cocok';
    }

    if (!role) {
      newErrors.role = 'Pilih role sebelum melanjutkan';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          nik: formData.nip,
          level: role,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setAccountCreated(true);
      } else {
        setErrors({ general: result.message || 'Gagal mendaftar' });
      }
    } catch (error) {
      console.error('Error saat mendaftar:', error);
      setErrors({ general: 'Terjadi kesalahan, coba lagi nanti' });
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Selamat Datang di App</h2>

      {accountCreated ? (
        <div className={styles.successContainer}>
          <h3>Akun berhasil dibuat!</h3>
        </div>
      ) : isCreatingAccount ? (
        <div className={styles.formContainer}>
          <h3>Buat Akun</h3>

          <label htmlFor="role">Pilih Role:</label>
          <select
            id="role"
            name="role"
            className={styles.selectField}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Pilih Role</option>
            <option value="dokter">Dokter</option>
            <option value="administrator">Admin</option>
            <option value="pasien">Wali Pasien</option>
          </select>
          {errors.role && <span className={styles.errorMessage}>{errors.role}</span>}

          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            className={styles.inputField}
            value={formData.name}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="nip"
            placeholder="NIP"
            className={styles.inputField}
            value={formData.nip}
            onChange={handleInputChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.inputField}
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.inputField}
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Konfirmasi Password"
            className={styles.inputField}
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />

          <button className={styles.submitButton} onClick={handleRegisterSubmit} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Buat Akun'}
          </button>
          <button type="button" onClick={handleAccountSwitch} className={styles.switchButton}>
            Sudah punya akun? Login
          </button>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h3>Login</h3>

          <input
            type="text"
            name="identifier"
            placeholder="Email / Username / NIK"
            className={styles.inputField}
            value={formData.identifier}
            onChange={handleInputChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.inputField}
            value={formData.password}
            onChange={handleInputChange}
          />

          <button className={styles.submitButton} onClick={handleLoginSubmit} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>

          {loginError && <p className={styles.errorMessage}>Email / Username / NIK atau Password salah!</p>}

          <button type="button" onClick={handleAccountSwitch} className={styles.switchButton}>
            Belum punya akun? Daftar
          </button>
        </div>
      )}
    </div>
  );
};
