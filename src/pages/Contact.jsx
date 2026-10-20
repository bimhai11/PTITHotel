
export default function Contact() {
  function handleSubmit(event) {
    event.preventDefault();
    alert("Đã gửi thông tin mẫu! Đây chưa phải hệ thống gửi email.");
    event.currentTarget.reset();
  }

  return (
    <section className="page-section contact-layout">
      <div>
        <span className="eyebrow blue">CHÚNG TÔI LUÔN SẴN SÀNG</span>
        <h1>Liên hệ với PTITHotel</h1>
        <p>Gửi câu hỏi để tìm hiểu thêm về dịch vụ đặt phòng.</p>

        <p>📧 Email: support@ptithotel.example</p>
        <p>📞 Điện thoại: 1900 0000</p>
        <p>📍 Địa chỉ: TP. Hồ Chí Minh, Việt Nam</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Họ và tên
          <input required placeholder="Nhập họ tên" />
        </label>

        <label>
          Email
          <input type="email" required placeholder="Nhập email" />
        </label>

        <label>
          Nội dung
          <textarea required rows="5" placeholder="Bạn cần hỗ trợ gì?" />
        </label>

        <button className="primary-button" type="submit">
          Gửi liên hệ
        </button>
      </form>
    </section>
  );
}
