import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getApiErrorMessage, getHotelById } from '../services/hotelsApi';

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    getHotelById(id)
      .then((data) => { if (active) setHotel(data); })
      .catch((err) => { if (active) setError(err?.response?.status === 404 ? 'Không tìm thấy khách sạn này.' : getApiErrorMessage(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <section className="page-section"><div className="loading-state">Đang tải thông tin khách sạn…</div></section>;
  if (error || !hotel) return <section className="page-section"><h1>Không tìm thấy khách sạn</h1><p>{error || 'Dữ liệu khách sạn không tồn tại.'}</p><Link to="/hotels" className="primary-button">Quay lại danh sách</Link></section>;

  return (
    <section className="page-section detail-layout">
      <img src={hotel.image} alt={hotel.name} />
      <div>
        <span className="eyebrow blue">{hotel.city}</span>
        <h1>{hotel.name}</h1>
        <p>⭐ {Number(hotel.rating).toFixed(1)} / 5</p>
        <p>{hotel.description}</p>
        <h2>{Number(hotel.price).toLocaleString('vi-VN')}đ <small>/ đêm</small></h2>
        <p>Giá trên là dữ liệu minh họa cho đồ án, chưa phải giá phòng thực tế.</p>
        <Link to="/contact" className="primary-button">Liên hệ đặt phòng</Link>
      </div>
    </section>
  );
}
