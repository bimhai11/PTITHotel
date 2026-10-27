import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import HotelCard from '../components/HotelCard';
import { getApiErrorMessage, getHotels } from '../services/hotelsApi';

export default function Home() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getHotels()
      .then((data) => { if (active) setHotels(data); })
      .catch((err) => { if (active) setError(getApiErrorMessage(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams({ destination, checkIn, checkOut, guests });
    navigate(`/hotels?${params.toString()}`);
  }

  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="eyebrow">KHÁM PHÁ KỲ NGHỈ CỦA BẠN</span>
            <h1>Tìm nơi nghỉ dưỡng<br /><span>hoàn hảo cho bạn</span></h1>
            <p>Hàng trăm lựa chọn khách sạn tuyệt vời cho hành trình đáng nhớ của bạn.</p>
            <form className="search-box" onSubmit={handleSearch}>
              <label>Điểm đến<input placeholder="Bạn muốn đi đâu?" value={destination} onChange={(e) => setDestination(e.target.value)} /></label>
              <label>Ngày nhận phòng<input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label>
              <label>Ngày trả phòng<input type="date" min={checkIn || undefined} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label>
              <label>Số khách<select value={guests} onChange={(e) => setGuests(e.target.value)}><option value="1">1 khách</option><option value="2">2 khách</option><option value="3">3 khách</option><option value="4">4 khách</option><option value="5">5+ khách</option></select></label>
              <button type="submit" className="search-button">Tìm kiếm</button>
            </form>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div><span className="eyebrow blue">LỰA CHỌN HÀNG ĐẦU</span><h2>Khách sạn nổi bật</h2><p>Khám phá những điểm nghỉ dưỡng được yêu thích.</p></div>
          <Link to="/hotels" className="text-link">Xem tất cả →</Link>
        </div>
        {error && <div className="api-message error-message" role="alert"><strong>Không tải được khách sạn:</strong> {error}<p>Hãy khởi động backend ASP.NET Core và kiểm tra cấu hình VITE_API_BASE_URL.</p></div>}
        {loading ? <div className="loading-state">Đang tải danh sách khách sạn…</div> : !error && hotels.length === 0 ? <div className="loading-state">Chưa có khách sạn. Thêm dữ liệu tại trang Quản lý.</div> : (
          <div className="hotel-grid">{hotels.slice(0, 3).map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}</div>
        )}
      </section>

      <section className="benefits">
        <div className="section-heading centered"><div><span className="eyebrow blue">VÌ SAO CHỌN CHÚNG TÔI?</span><h2>Đặt phòng dễ dàng hơn</h2></div></div>
        <div className="benefit-grid">
          <article><span>🏨</span><h3>Đa dạng khách sạn</h3><p>Nhiều lựa chọn phù hợp với nhu cầu và ngân sách.</p></article>
          <article><span>💰</span><h3>Giá cả hợp lý</h3><p>Dễ dàng so sánh giá trước khi lựa chọn.</p></article>
          <article><span>💬</span><h3>Hỗ trợ tận tâm</h3><p>Thông tin rõ ràng, trải nghiệm đặt phòng thuận tiện.</p></article>
        </div>
      </section>
    </>
  );
}
