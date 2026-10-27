import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link to="/" className="logo footer-logo">
          <img src="/images/ptit-logo.svg" alt="PTITHotel" />
          <span>PTITHotel</span>
        </Link>
        <p>Đặt phòng dễ dàng, hành trình trọn vẹn.</p>
      </div>
      <div className="footer-links">
        <Link to="/">Trang chủ</Link>
        <Link to="/hotels">Khách sạn</Link>
        <Link to="/about-us">Giới thiệu</Link>
        <Link to="/contact">Liên hệ</Link>
        <Link to="/admin/hotels">Quản lý</Link>
      </div>
      <p>© 2026 PTITHotel. Đồ án học tập ASP.NET Core + React.</p>
    </footer>
  );
}
