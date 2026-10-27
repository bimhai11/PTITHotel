import { Link } from 'react-router';

export default function HotelCard({ hotel }) {
  return (
    <article className="hotel-card">
      <Link to={`/hotels/${hotel.id}`}>
        <img src={hotel.image} alt={hotel.name} className="hotel-image" loading="lazy" />
      </Link>
      <div className="hotel-info">
        <div className="hotel-location">
          <span>📍 {hotel.city}</span>
          <span>⭐ {Number(hotel.rating).toFixed(1)}</span>
        </div>
        <h3><Link to={`/hotels/${hotel.id}`}>{hotel.name}</Link></h3>
        <p className="hotel-description">{hotel.description}</p>
        <div className="hotel-card-bottom">
          <p className="hotel-price">{Number(hotel.price).toLocaleString('vi-VN')}đ<small> / đêm</small></p>
          <Link to={`/hotels/${hotel.id}`} className="detail-button">Xem phòng</Link>
        </div>
      </div>
    </article>
  );
}
