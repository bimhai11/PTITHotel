
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import hotels from "../data/hotels";
import HotelCard from "../components/HotelCard";

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get("destination") || "";
  const [keyword, setKeyword] = useState(initialDestination);

  const filteredHotels = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase("vi");

    return hotels.filter((hotel) =>
      `${hotel.name} ${hotel.city}`
        .toLocaleLowerCase("vi")
        .includes(normalized)
    );
  }, [keyword]);

  return (
    <section className="page-section">
      <span className="eyebrow blue">KHÁM PHÁ ĐIỂM ĐẾN</span>
      <h1>Danh sách khách sạn</h1>
      <p>Tìm kiếm nơi lưu trú phù hợp với chuyến đi của bạn.</p>

      <input
        className="hotel-filter"
        placeholder="Tìm theo tên khách sạn hoặc thành phố..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div className="hotel-grid">
        {filteredHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <p>Không tìm thấy khách sạn phù hợp.</p>
      )}
    </section>
  );
}
