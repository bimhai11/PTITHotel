import { Link, NavLink } from 'react-router';

import { useAuth } from '../context/auth';

export default function Header() {
  const { user, loading } = useAuth();
  return (
    <header className="header">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="/images/ptit-logo.svg" alt="PTITHotel" />
          <span>PTITHotel</span>
        </Link>
        <nav className="nav-menu" aria-label="Điều hướng chính">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/hotels">Khách sạn</NavLink>
          <NavLink to="/about-us">Giới thiệu</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink>
          <NavLink to="/admin/hotels">Quản lý</NavLink>
        </nav>
        <div className="nav-auth">
          {!loading && (user ? <Link to="/account" className="nav-button">Tài khoản</Link> : <>
            <Link to="/login" className="text-link">Đăng nhập</Link>
            <Link to="/register" className="nav-button">Đăng ký</Link>
          </>)}
        </div>
      </div>
    </header>
  );
}
