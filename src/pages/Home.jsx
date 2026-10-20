
import { useState } from "react";
import { Link } from "react-router";
import hotels from "../data/hotels";
import HotelCard from "../components/HotelCard";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  function handleSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      guests
    });

    window.location.href = `/hotels?${params.toString()}`;
  }

  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="eyebrow">
              KHÁM PHÁ KỲ NGHỈ CỦA BẠN
            </span>

            <h1>
              Tìm nơi nghỉ dưỡng
              <br />
              <span>hoàn hảo cho bạn</span>
            </h1>

            <p>
              Hàng trăm lựa chọn khách sạn tuyệt vời
              cho hành trình đáng nhớ của bạn.
            </p>

            <form
              className="search-box"
              onSubmit={handleSearch}
            >
              <label>
                Điểm đến
                <input
                  placeholder="Bạn muốn đi đâu?"
                  value={destination}
                  onChange={(e) =>
                    setDestination(e.target.value)
                  }
                />
              </label>

              <label>
                Ngày nhận phòng
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) =>
                    setCheckIn(e.target.value)
                  }
                />
              </label>

              <label>
                Ngày trả phòng
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || undefined}
                  onChange={(e) =>
                    setCheckOut(e.target.value)
                  }
                />
              </label>

              <label>
                Số khách
                <select
                  value={guests}
                  onChange={(e) =>
                    setGuests(e.target.value)
                  }
                >
                  <option value="1">1 khách</option>
                  <option value="2">2 khách</option>
                  <option value="3">3 khách</option>
                  <option value="4">4 khách</option>
                  <option value="5">5+ khách</option>
                </select>
              </label>

              <button type="submit" className="search-button">
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow blue">
              LỰA CHỌN HÀNG ĐẦU
            </span>
            <h2>Khách sạn nổi bật</h2>
            <p>
              Khám phá những điểm nghỉ dưỡng được yêu thích.
            </p>
          </div>

          <Link to="/hotels" className="text-link">
            Xem tất cả →
          </Link>
        </div>

        <div className="hotel-grid">
          {hotels.slice(0, 3).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>

      <section className="benefits">
        <div className="section-heading centered">
          <div>
            <span className="eyebrow blue">VÌ SAO CHỌN CHÚNG TÔI?</span>
            <h2>Đặt phòng dễ dàng hơn</h2>
          </div>
        </div>

        <div className="benefit-grid">
          <article>
            <span>🏨</span>
            <h3>Đa dạng khách sạn</h3>
            <p>Nhiều lựa chọn phù hợp với nhu cầu và ngân sách.</p>
          </article>

          <article>
            <span>💰</span>
            <h3>Giá cả hợp lý</h3>
            <p>Dễ dàng so sánh giá trước khi lựa chọn.</p>
          </article>

          <article>
            <span>💬</span>
            <h3>Hỗ trợ tận tâm</h3>
            <p>Thông tin rõ ràng, trải nghiệm đặt phòng thuận tiện.</p>
          </article>
        </div>
      </section>
    </>
  );
}
