import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/auth';
import { getApiErrorMessage } from '../services/hotelsApi';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    setError('');
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) { setError(getApiErrorMessage(err)); }
    finally { setBusy(false); }
  }

  return <section className="page-section auth-page">
    <span className="eyebrow blue">PTITHOTEL · THÀNH VIÊN</span>
    <h1>Tài khoản của bạn</h1>
    <div className="admin-panel account-panel">
      <p>Bạn đã đăng nhập thành công.</p>
      <dl><dt>Email</dt><dd>{user.email}</dd>
        <dt>Ngày đăng ký</dt><dd>{new Date(user.createdAtUtc).toLocaleDateString('vi-VN')}</dd></dl>
      {error && <div className="api-message error-message" role="alert">{error}</div>}
      <button className="primary-button" onClick={handleLogout} disabled={busy}>{busy ? 'Đang đăng xuất...' : 'Đăng xuất'}</button>
    </div>
  </section>;
}
