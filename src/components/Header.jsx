
import { NavLink, Link } from "react-router";

export default function Header() {
  return (
    <header className="header">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="/images/ptit-logo.png" alt="Logo PTIT" />
          <span>PTITHotel</span>
        </Link>

        <nav className="nav-menu">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/hotels">Khách sạn</NavLink>
          <NavLink to="/about-us">Giới thiệu</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink>
        </nav>

        <Link to="/hotels" className="nav-button">
          Đặt phòng
        </Link>
      </div>
    </header>
  );
}
