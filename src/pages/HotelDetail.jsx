
import { Link, useParams } from "react-router";
import hotels from "../data/hotels";

export default function HotelDetail() {
  const { id } = useParams();
  const hotel = hotels.find((item) => item.id === id);

  if (!hotel) {
    return (
      <section className="page-section">
        <h1>Không tìm thấy khách sạn</h1>
        <Link to="/hotels">Quay lại danh sách</Link>
      </section>
    );
  }

  return (
    <section className="page-section detail-layout">
      <img src={hotel.image} alt={hotel.name} />

      <div>
        <span className="eyebrow blue">{hotel.city}</span>
        <h1>{hotel.name}</h1>
        <p>⭐ {hotel.rating} / 5</p>
        <p>{hotel.description}</p>

        <h2>
          {hotel.price.toLocaleString("vi-VN")}đ
          <small> / đêm</small>
        </h2>

        <p>
          Giá trên là dữ liệu minh họa cho đồ án,
          chưa phải giá phòng thực tế.
        </p>

        <Link to="/contact" className="primary-button">
          Liên hệ đặt phòng
        </Link>
      </div>
    </section>
  );
}
