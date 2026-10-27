import { Link, NavLink } from 'react-router';

export default function Header() {
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
        <Link to="/hotels" className="nav-button">Đặt phòng</Link>
      </div>
    </header>
  );
}
