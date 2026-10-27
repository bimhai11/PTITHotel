import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// GET /api/hotels
export async function getHotels() {
  const response = await api.get('/hotels');
  return response.data;
}

// GET /api/hotels/{id}
export async function getHotelById(id) {
  const response = await api.get(`/hotels/${id}`);
  return response.data;
}

// POST /api/hotels
export async function createHotel(hotel) {
  const response = await api.post('/hotels', hotel);
  return response.data;
}

// PUT /api/hotels/{id}
export async function updateHotel(id, hotel) {
  await api.put(`/hotels/${id}`, hotel);
}

// DELETE /api/hotels/{id}
export async function deleteHotel(id) {
  await api.delete(`/hotels/${id}`);
}

export function getApiErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.title) return data.title;
  if (data?.detail) return data.detail;
  if (data?.errors) return Object.values(data.errors).flat().join(' ');
  if (error?.code === 'ERR_NETWORK') {
    return 'Không kết nối được API. Hãy kiểm tra backend, URL trong .env và chứng chỉ HTTPS local.';
  }
  return error?.message || 'Đã xảy ra lỗi khi gọi API.';
}
