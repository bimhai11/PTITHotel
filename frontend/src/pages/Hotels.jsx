import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import HotelCard from '../components/HotelCard';
import { getApiErrorMessage, getHotels } from '../services/hotelsApi';

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('destination') || '');
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

  const filteredHotels = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');
    return hotels.filter((hotel) => `${hotel.name} ${hotel.city}`.toLocaleLowerCase('vi').includes(normalized));
  }, [keyword, hotels]);

  return (
    <section className="page-section">
      <span className="eyebrow blue">KHÁM PHÁ ĐIỂM ĐẾN</span>
      <h1>Danh sách khách sạn</h1>
      <p>Tìm kiếm nơi lưu trú phù hợp với chuyến đi của bạn.</p>
      <input className="hotel-filter" placeholder="Tìm theo tên khách sạn hoặc thành phố..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      {error && <div className="api-message error-message" role="alert"><strong>Lỗi kết nối API:</strong> {error}</div>}
      {loading ? <div className="loading-state">Đang tải dữ liệu từ máy chủ…</div> : !error && (
        <>
          <div className="hotel-grid">{filteredHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}</div>
          {filteredHotels.length === 0 && <p>Không tìm thấy khách sạn phù hợp.</p>}
        </>
      )}
    </section>
  );
}
