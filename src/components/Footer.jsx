
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link to="/" className="logo footer-logo">
          <img src="/images/ptit-logo.png" alt="Logo PTIT" />
          <span>PTITHotel</span>
        </Link>

        <p>Đặt phòng dễ dàng, hành trình trọn vẹn.</p>
      </div>

      <div className="footer-links">
        <Link to="/">Trang chủ</Link>
        <Link to="/hotels">Khách sạn</Link>
        <Link to="/about-us">Giới thiệu</Link>
        <Link to="/contact">Liên hệ</Link>
      </div>

      <p>© 2026 PTITHotel. Đồ án môn học ReactJS.</p>
    </footer>
  );
}
