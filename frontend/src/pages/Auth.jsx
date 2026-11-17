import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/auth';
import { getApiErrorMessage } from '../services/hotelsApi';

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const requestedPath = location.state?.from;
  const destination = typeof requestedPath === 'string' && requestedPath.startsWith('/') &&
    !requestedPath.startsWith('//') && !['/login', '/register'].includes(requestedPath)
    ? requestedPath : '/account';

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const nextErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 254)
      nextErrors.email = 'Vui lòng nhập email hợp lệ (tối đa 254 ký tự).';
    if (password.length < 8 || password.length > 128)
      nextErrors.password = 'Mật khẩu phải có từ 8 đến 128 ký tự.';
    if (isRegister && password !== confirmation)
      nextErrors.confirmation = 'Mật khẩu xác nhận không khớp.';
    setErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      if (isRegister) {
        await register(email, password);
        navigate('/login', { replace: true, state: { registered: true, from: destination } });
      } else {
        await login(email, password);
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally { setBusy(false); }
  }

  if (loading) return <p className="loading-state" role="status">Đang kiểm tra phiên đăng nhập...</p>;
  if (user) return <Navigate to={destination} replace />;

  return (
    <section className="page-section auth-page">
      <span className="eyebrow blue">PTITHOTEL · THÀNH VIÊN</span>
      <h1>{isRegister ? 'Tạo tài khoản' : 'Chào mừng bạn trở lại'}</h1>
      <p>{isRegister ? 'Đăng ký để bắt đầu hành trình cùng PTITHotel.' : 'Đăng nhập để quản lý thông tin tài khoản của bạn.'}</p>
      {!isRegister && location.state?.registered && <div className="api-message success-message" role="status">Đăng ký thành công! Vui lòng đăng nhập.</div>}
      <form className="contact-form auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="api-message error-message" role="alert">{error}</div>}
        <label htmlFor="email">Email
          <input id="email" type="email" autoComplete="email" required maxLength={254} value={email}
            onChange={event => setEmail(event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
        </label>
        {errors.email && <span id="email-error" className="field-error" role="alert">{errors.email}</span>}
        <label htmlFor="password">Mật khẩu
          <input id="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required
            minLength={8} maxLength={128} value={password} onChange={event => setPassword(event.target.value)}
            aria-invalid={!!errors.password} aria-describedby="password-help password-error" />
        </label>
        <small id="password-help">Sử dụng từ 8 đến 128 ký tự.</small>
        {errors.password && <span id="password-error" className="field-error" role="alert">{errors.password}</span>}
        {isRegister && <>
          <label htmlFor="confirmation">Xác nhận mật khẩu
            <input id="confirmation" type="password" autoComplete="new-password" required maxLength={128}
              value={confirmation} onChange={event => setConfirmation(event.target.value)}
              aria-invalid={!!errors.confirmation} aria-describedby={errors.confirmation ? 'confirmation-error' : undefined} />
          </label>
          {errors.confirmation && <span id="confirmation-error" className="field-error" role="alert">{errors.confirmation}</span>}
        </>}
        <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}</button>
        <p>{isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <Link className="text-link" to={isRegister ? '/login' : '/register'} state={{ from: destination }}>{isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}</Link>
        </p>
      </form>
    </section>
  );
}
