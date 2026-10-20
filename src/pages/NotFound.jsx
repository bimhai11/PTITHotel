
import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="page-section not-found">
      <h1>404</h1>
      <h2>Không tìm thấy trang</h2>
      <p>Địa chỉ bạn truy cập không tồn tại.</p>
      <Link to="/" className="primary-button">
        Về trang chủ
      </Link>
    </section>
  );
}
