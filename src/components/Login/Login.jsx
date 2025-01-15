import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';


export const Login = () => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    bpjs: '',
    email: '',
    password: '',
    confirmPassword: '',
    hospital: '',
  });
  const [errors, setErrors] = useState({});
  const [accountCreated, setAccountCreated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Menggunakan react-router-dom untuk navigasi

  const handleAccountSwitch = () => {
    setIsCreatingAccount(!isCreatingAccount);
    setErrors({});
    setFormData({
      name: '',
      nip: '',
      bpjs: '',
      email: '',
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

  const redirectToDashboard = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'doctor':
        navigate('/doctor-dashboard');
        break;
      case 'guardian':
        navigate('/guardian-dashboard');
        break;
      default:
        console.error('Role tidak dikenali');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(formData.email)) {
      setLoginError(true);
      setIsLoading(false);
    } else {
      setLoginError(false);
      // Simulate API call for login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      console.log('Login submitted', formData);

      // Redirect user to their respective dashboard based on role
      redirectToDashboard(role);
    }
  };

  const handleSubmit = async (e) => {
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
    } else {
      // Simulate API call for account creation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAccountCreated(true);
      setErrors({});
      setFormData({
        name: '',
        nip: '',
        bpjs: '',
        email: '',
        password: '',
        confirmPassword: '',
        hospital: '',
      });
      setIsLoading(false);
      console.log('Account created', formData);

      // Redirect user to their respective dashboard based on role
      redirectToDashboard(role);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Selamat Datang di App</h2>

      <img
        src={
          isCreatingAccount
            ? '/assets/common/new-acc.svg' // Animasi untuk buat akun
            : '/assets/common/login-animation.svg'  // Animasi untuk login
        }
        alt={isCreatingAccount ? 'Signup Animation' : 'Login Animation'}
        className={styles.heroImg}
      />

      {accountCreated ? (
        <div className={styles.successContainer}>
          <h3>Akun sudah berhasil dibuat!</h3>
        </div>
      ) : isCreatingAccount ? (
        <div className={styles.formContainer}>
          <h3>Belum punya akun? Buat Akun</h3>
          <label htmlFor="role">Pilih Role:</label>
          <select
            id="role"
            name="role"
            className={styles.selectField}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Pilih Role</option>
            <option value="doctor">Dokter</option>
            <option value="admin">Admin</option>
            <option value="guardian">Wali Pasien</option>
          </select>
          {errors.role && <span className={styles.errorMessage}>{errors.role}</span>}

          {role && (
            <div>
              {(role === 'doctor' || role === 'admin') && (
                <div>
                  <label htmlFor="hospital">Pilih Rumah Sakit:</label>
                  <select
                    id="hospital"
                    name="hospital"
                    className={styles.selectField}
                    value={formData.hospital}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih Rumah Sakit</option>
                    <option value="A">Rumah Sakit A</option>
                    <option value="B">Rumah Sakit B</option>
                    <option value="C">Rumah Sakit C</option>
                  </select>
                </div>
              )}

              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                className={styles.inputField}
                value={formData.name}
                onChange={handleInputChange}
              />

              {(role === 'doctor' || role === 'admin') ? (
                <input
                  type="text"
                  name="nip"
                  placeholder="NIP"
                  className={styles.inputField}
                  value={formData.nip}
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  type="text"
                  name="bpjs"
                  placeholder="No. BPJS"
                  className={styles.inputField}
                  value={formData.bpjs}
                  onChange={handleInputChange}
                />
              )}

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
              {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}

              <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Buat Akun'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h3>Sudah punya akun? Login</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.inputField}
            value={formData.email}
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
          <button
            className={styles.submitButton}
            onClick={handleLoginSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
          {loginError && <p className={styles.errorMessage}>Email atau Password salah!</p>}
        </div>
      )}

      <p onClick={handleAccountSwitch} className={styles.switchLink}>
        {isCreatingAccount ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Buat Akun'}
      </p>
    </div>
  );
};
