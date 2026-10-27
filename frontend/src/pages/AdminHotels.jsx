import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { createHotel, deleteHotel, getApiErrorMessage, getHotels, updateHotel } from '../services/hotelsApi';

const defaultImage = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80';
const emptyForm = { name: '', city: '', price: '', rating: '4.5', image: defaultImage, description: '' };
const money = (value) => `${Number(value).toLocaleString('vi-VN')}đ`;

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadHotels = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setHotels(await getHotels()); }
    catch (err) { setError(getApiErrorMessage(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadHotels(); }, [loadHotels]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() { setEditingId(null); setForm(emptyForm); }

  function startEdit(hotel) {
    setEditingId(hotel.id);
    setForm({ name: hotel.name, city: hotel.city, price: String(hotel.price), rating: String(hotel.rating), image: hotel.image, description: hotel.description || '' });
    setError(''); setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true); setError(''); setNotice('');
    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      price: Number(form.price),
      rating: Number(form.rating),
      image: form.image.trim(),
      description: form.description.trim(),
    };
    try {
      if (editingId !== null) {
        await updateHotel(editingId, payload);
        setNotice('Đã cập nhật khách sạn bằng PUT.');
      } else {
        await createHotel(payload);
        setNotice('Đã tạo khách sạn bằng POST.');
      }
      resetForm();
      await loadHotels();
    } catch (err) { setError(getApiErrorMessage(err)); }
    finally { setSaving(false); }
  }

  async function handleDelete(hotel) {
    if (!window.confirm(`Bạn có chắc muốn xóa “${hotel.name}”?`)) return;
    setError(''); setNotice('');
    try {
      await deleteHotel(hotel.id);
      if (editingId === hotel.id) resetForm();
      setNotice('Đã xóa khách sạn bằng DELETE.');
      await loadHotels();
    } catch (err) { setError(getApiErrorMessage(err)); }
  }

  return (
    <section className="page-section admin-page">
      <span className="eyebrow blue">KHU VỰC THỰC HÀNH CRUD</span>
      <h1>Quản lý khách sạn</h1>
      <p>Trang học tập để thử các request Axios gửi đến ASP.NET Core API. Dữ liệu được lưu trong SQL Server qua EF Core.</p>
      {error && <div className="api-message error-message" role="alert"><strong>Lỗi:</strong> {error}</div>}
      {notice && <div className="api-message success-message" role="status">{notice}</div>}

      <section className="admin-panel">
        <div className="section-heading">
          <div><span className="eyebrow blue">{editingId !== null ? 'UPDATE · PUT' : 'CREATE · POST'}</span><h2>{editingId !== null ? `Sửa khách sạn #${editingId}` : 'Thêm khách sạn'}</h2></div>
          {editingId !== null && <button className="admin-button button-secondary" type="button" onClick={resetForm}>Hủy sửa</button>}
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Tên khách sạn *<input name="name" value={form.name} onChange={handleChange} required minLength="2" maxLength="120" placeholder="Ví dụ: Ocean Resort" /></label>
          <label>Thành phố *<input name="city" value={form.city} onChange={handleChange} required minLength="2" maxLength="100" placeholder="Đà Nẵng" /></label>
          <label>Giá mỗi đêm (VNĐ) *<input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} required /></label>
          <label>Đánh giá (0–5) *<input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} required /></label>
          <label className="admin-full">URL ảnh<input name="image" type="url" maxLength="500" value={form.image} onChange={handleChange} placeholder="https://..." /></label>
          <label className="admin-full">Mô tả<textarea name="description" maxLength="1000" rows="3" value={form.description} onChange={handleChange} placeholder="Mô tả khách sạn" /></label>
          <div className="admin-actions admin-full">
            <button className="admin-button button-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu…' : editingId !== null ? 'Lưu thay đổi (PUT)' : 'Thêm khách sạn (POST)'}</button>
            {editingId === null && <button className="admin-button button-secondary" type="button" onClick={() => setForm(emptyForm)}>Xóa nội dung</button>}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="section-heading">
          <div><span className="eyebrow blue">READ · GET</span><h2>Danh sách khách sạn</h2></div>
          <button className="admin-button button-secondary" type="button" onClick={loadHotels} disabled={loading}>{loading ? 'Đang tải…' : 'Tải lại'}</button>
        </div>
        {loading ? <div className="loading-state">Đang tải dữ liệu từ API…</div> : hotels.length === 0 ? <div className="loading-state">Chưa có khách sạn. Hãy thêm khách sạn bằng form phía trên.</div> : (
          <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>Khách sạn</th><th>Giá / đêm</th><th>Đánh giá</th><th>Thao tác</th></tr></thead>
            <tbody>{hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td><div className="admin-hotel-name"><Link to={`/hotels/${hotel.id}`}>{hotel.name}</Link></div><div className="admin-muted">{hotel.city} · ID: {hotel.id}</div></td>
                <td className="admin-price">{money(hotel.price)}</td>
                <td>⭐ {Number(hotel.rating).toFixed(1)}</td>
                <td><div className="admin-row-actions"><button className="admin-button button-secondary button-small" type="button" onClick={() => startEdit(hotel)}>Sửa</button><button className="admin-button button-danger button-small" type="button" onClick={() => handleDelete(hotel)}>Xóa</button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
        <div className="admin-list-footer">Tổng cộng <strong>{hotels.length}</strong> khách sạn · GET / POST / PUT / DELETE</div>
      </section>
    </section>
  );
}
