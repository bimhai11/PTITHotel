
import { Link } from "react-router";

export default function About() {
  return (
    <section className="page-section about-layout">
      <div>
        <span className="eyebrow blue">VỀ PTITHotel</span>
        <h1>Hành trình tuyệt vời bắt đầu từ nơi bạn nghỉ ngơi</h1>

        <p>
          PTITHotel là website hỗ trợ tìm kiếm và khám phá
          khách sạn, giúp người dùng lựa chọn nơi lưu trú
          phù hợp cho mỗi chuyến đi.
        </p>

        <p>
          Chúng tôi hướng đến trải nghiệm đơn giản, thông tin
          minh bạch và nhiều lựa chọn cho mọi hành trình.
        </p>

        <Link to="/hotels" className="primary-button">
          Khám phá khách sạn
        </Link>
      </div>

      <img
        src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80"
        alt="Không gian nghỉ dưỡng"
      />
    </section>
  );
}
