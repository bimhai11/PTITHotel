# PTITHotel + ASP.NET Core Web API + EF Core + Axios

Project kết hợp giao diện PTITHotel (React + Vite) với backend ASP.NET Core Web API, SQL Server và Entity Framework Core. Frontend lấy dữ liệu khách sạn từ API thay vì file dữ liệu tĩnh. Trang `/admin/hotels` cho phép thực hành đầy đủ CRUD bằng Axios.

## 1. Thành phần

- `frontend/`: React + Vite + React Router + Axios. Gồm trang chủ, danh sách khách sạn, chi tiết, giới thiệu, liên hệ và trang quản lý CRUD.
- `backend/CrudApi/`: ASP.NET Core Web API trên .NET 10, `HotelsController`, DTO validation, `AppDbContext`, model `Hotel`.
- SQL Server: chạy local bằng Docker Compose; dữ liệu mẫu khách sạn được cấu hình bằng `HasData` trong EF Core.

## 2. Yêu cầu

- .NET 10 SDK
- Node.js 22.12+ (Vite 8) và npm
- Docker Desktop (hoặc SQL Server cài sẵn)

## 3. Khởi động SQL Server

Tại thư mục gốc project:

```bash
docker compose up -d sqlserver
```

SQL Server lắng nghe ở `localhost,1433`. Mật khẩu `Your_strong_password123` chỉ là mật khẩu mẫu dùng local trong Compose. Đợi container khởi động hoàn tất trước khi chạy migration.

Nếu dùng SQL Server có sẵn, chỉnh `ConnectionStrings:DefaultConnection` trong `backend/CrudApi/appsettings.json`. Không lưu mật khẩu production trong source control.

## 4. Tạo database bằng EF Core migration

```bash
cd backend/CrudApi
dotnet restore
dotnet tool install --global dotnet-ef --version 10.0.14
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Nếu đã cài `dotnet-ef`, có thể cập nhật công cụ bằng `dotnet tool update --global dotnet-ef --version 10.0.14`.

- `migrations add InitialCreate`: sinh file migration từ model và cấu hình `AppDbContext`, bao gồm dữ liệu mẫu `HasData`.
- `database update`: tạo database/bảng `Hotels` và thêm dữ liệu khách sạn mẫu vào SQL Server.
- Khi chỉnh model về sau, chạy `dotnet ef migrations add TenMigrationMoi` rồi `dotnet ef database update`.

Khởi động backend (cũng ở `backend/CrudApi`):

```bash
dotnet run
```

URL mặc định được cấu hình trong `Properties/launchSettings.json`: `https://localhost:7001` và `http://localhost:5001`. Axios mặc định dùng `https://localhost:7001/api`. Nếu lỗi chứng chỉ HTTPS local, thử `dotnet dev-certs https --trust` trên hệ điều hành hỗ trợ.

## 5. Chạy frontend

Mở terminal khác ở thư mục gốc:

```bash
cd frontend
```

Tạo file `.env` từ mẫu:

- macOS/Linux: `cp .env.example .env`
- PowerShell: `Copy-Item .env.example .env`

Giá trị mặc định:

```env
VITE_API_BASE_URL=https://localhost:7001/api
```

Cài package và chạy ứng dụng:

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`. Backend cho phép CORS từ `http://localhost:5173` và `http://127.0.0.1:5173`.

## 6. API endpoints

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/api/hotels` | Lấy danh sách khách sạn |
| `GET` | `/api/hotels/{id}` | Lấy chi tiết một khách sạn |
| `POST` | `/api/hotels` | Tạo khách sạn |
| `PUT` | `/api/hotels/{id}` | Cập nhật khách sạn |
| `DELETE` | `/api/hotels/{id}` | Xóa khách sạn |

Ví dụ body cho `POST`/`PUT`:

```json
{
  "name": "Ocean Resort",
  "city": "Đà Nẵng",
  "price": 1800000,
  "rating": 4.9,
  "image": "https://example.com/hotel.jpg",
  "description": "Khách sạn hướng biển."
}
```

Các request frontend nằm trong `frontend/src/services/hotelsApi.js`. Trang chủ, danh sách và chi tiết dùng `GET`; trang Quản lý dùng `POST`, `GET`, `PUT`, `DELETE`.

## 7. Luồng dữ liệu

1. Trang React gọi hàm trong `src/services/hotelsApi.js`.
2. Axios gọi `/api/hotels`.
3. `HotelsController` kiểm tra request/route và gọi `AppDbContext`.
4. EF Core thực hiện truy vấn SQL Server.
5. API trả JSON hoặc HTTP status phù hợp.

## 8. Lưu ý

- Trang `/admin/hotels` phục vụ học tập, chưa có đăng nhập/phân quyền; không đưa ra Internet dưới dạng quản trị thật.
- Giá, hình ảnh và đánh giá là dữ liệu minh họa, chưa phải tồn phòng hoặc giá đặt phòng thực tế.
- Form Liên hệ ở mẫu frontend chưa gửi email hoặc lưu dữ liệu vào backend.
- Khi triển khai thật, cấu hình secrets an toàn, xác thực/phân quyền, logging, rate limiting và backup database.

Frontend tham khảo: https://github.com/bimhai11/PTITHotel
