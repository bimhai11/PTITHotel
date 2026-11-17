# PTITHotel — Bài thực hành 1, 2, 3

Project kết hợp giao diện PTITHotel (React + Vite) với backend ASP.NET Core Web API, SQL Server và Entity Framework Core. Frontend lấy dữ liệu khách sạn từ API thay vì file dữ liệu tĩnh. Trang `/admin/hotels` cho phép thực hành đầy đủ CRUD bằng Axios. Bài thực hành 3 bổ sung đăng ký, đăng nhập, đăng xuất và trang tài khoản với React Context + localStorage.

## 1. Thành phần

- `frontend/`: React + Vite + React Router + Axios. Gồm trang chủ, danh sách khách sạn, chi tiết, giới thiệu, liên hệ và trang quản lý CRUD.
- `backend/CrudApi/`: ASP.NET Core Web API trên .NET 10, `HotelsController`, DTO validation, `AppDbContext`, model `Hotel`, `User` và `AuthController`.
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

Mặc định `appsettings.json` dùng **SQL Server LocalDB trên Windows**. Nếu chạy Docker Compose, cần đặt connection string trước khi chạy migration và backend:

```bash
# Bash (chạy trong terminal backend)
export ConnectionStrings__DefaultConnection='Server=localhost,1433;Database=PTITHotelDb;User Id=sa;Password=Your_strong_password123;TrustServerCertificate=True'
```

```powershell
# PowerShell (chạy trong terminal backend)
$env:ConnectionStrings__DefaultConnection = 'Server=localhost,1433;Database=PTITHotelDb;User Id=sa;Password=Your_strong_password123;TrustServerCertificate=True'
```

Nếu dùng SQL Server có sẵn, chỉnh `ConnectionStrings:DefaultConnection` trong `backend/CrudApi/appsettings.json`. Không lưu mật khẩu production trong source control.

## 4. Tạo database bằng EF Core migration

```bash
cd backend/CrudApi
dotnet restore
dotnet tool install --global dotnet-ef --version 10.0.14
dotnet ef database update
```

Nếu đã cài `dotnet-ef`, có thể cập nhật công cụ bằng `dotnet tool update --global dotnet-ef --version 10.0.14`.

- Repository đã có `InitialCreate` và `AddUsers`; không tạo lại các migration này.
- `database update`: tạo database, bảng `Hotels`, bảng `Users` với unique index email và thêm dữ liệu khách sạn mẫu vào SQL Server.
- Khi chỉnh model về sau, chạy `dotnet ef migrations add TenMigrationMoi` rồi `dotnet ef database update`.

Khởi động backend (cũng ở `backend/CrudApi`):

```bash
dotnet run
```

URL mặc định được cấu hình trong `Properties/launchSettings.json`: `https://localhost:7001` và `http://localhost:5001`. Axios mặc định dùng `/api`; Vite proxy đến `https://localhost:7001`. Nếu lỗi chứng chỉ HTTPS local, thử `dotnet dev-certs https --trust` trên hệ điều hành hỗ trợ.

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
VITE_API_BASE_URL=/api
```

Cài package và chạy ứng dụng:

```bash
npm ci
npm run dev
```

Mở `http://localhost:5173`. Proxy giúp frontend và cookie đăng nhập dùng cùng origin trong môi trường dev. `secure: false` trong proxy chỉ để chấp nhận chứng chỉ HTTPS tự ký của backend local. Nếu `.env` cũ đang đặt URL HTTPS tuyệt đối, đổi về `/api` và khởi động lại Vite để tránh cookie bị chặn khi khác scheme HTTP/HTTPS.

Khi triển khai, phục vụ frontend và `/api` cùng origin qua HTTPS bằng reverse proxy; cấu hình fallback SPA về `index.html` cho `/login`, `/register`, `/account` và các URL React Router. Vite proxy chỉ áp dụng cho `npm run dev`.

Backend cho phép CORS từ `http://localhost:5173` và `http://127.0.0.1:5173`.

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

## 9. Bài thực hành 3: đăng ký và đăng nhập

### Chạy và kiểm tra nhanh

1. Cấu hình SQL Server theo mục 3, chạy `dotnet ef database update` trong `backend/CrudApi` (cần chạy lại lệnh này nếu đã làm bài 2 để thêm bảng `Users`).
2. Chạy backend bằng `dotnet run`, frontend bằng `npm run dev`.
3. Truy cập `http://localhost:5173/register`, nhập email, mật khẩu 8–128 ký tự và xác nhận mật khẩu.
4. Sau đăng ký thành công, ứng dụng chuyển sang `/login` và hiển thị thông báo để đăng nhập.
5. Đăng nhập đúng sẽ chuyển đến `/account`, hiển thị email và ngày đăng ký. Menu đổi thành “Tài khoản”.
6. Tải lại trang: Context gọi `/auth/me` để xác minh phiên, cập nhật thông tin user đã cache trong localStorage.
7. Nhấn “Đăng xuất”: backend xóa cookie, frontend xóa user khỏi Context/localStorage và chuyển về `/login`.
8. Truy cập trực tiếp `/account` khi chưa đăng nhập sẽ chuyển sang `/login`; sau đăng nhập sẽ quay về trang tài khoản.

### API xác thực

| Method | Endpoint | Kết quả |
|---|---|---|
| POST | `/api/auth/register` | 201 và thông tin user; 400 nếu dữ liệu sai; 409 nếu trùng email |
| POST | `/api/auth/login` | 200, thông tin user và cookie phiên; 401 nếu sai email/mật khẩu |
| GET | `/api/auth/me` | 200 và user từ DB; 401 nếu chưa đăng nhập hoặc user đã bị xóa |
| POST | `/api/auth/logout` | 204 và xóa cookie phiên |

Body đăng ký/đăng nhập:

```json
{
  "email": "student@example.com",
  "password": "MyPassword123!"
}
```

- Frontend validate email, độ dài mật khẩu và mật khẩu xác nhận, hiển thị lỗi và khóa nút khi đang gửi. Backend validate độc lập bằng Data Annotations.
- Email được trim, chuẩn hóa về chữ hoa để truy vấn; unique index `Users.NormalizedEmail` ngăn tạo tài khoản trùng kể cả khác hoa/thường hoặc request đồng thời.
- `PasswordHasher<User>` của ASP.NET Core băm mật khẩu có salt. DB lưu `PasswordHash`, không lưu mật khẩu rõ. API không trả hash.
- Đăng nhập query DB bằng EF Core rồi kiểm tra hash; thông báo lỗi chung cho email không tồn tại và mật khẩu sai.
- Cookie phiên HttpOnly, SameSite Strict, Secure khi request HTTPS, thời hạn 7 ngày và tự gia hạn khi sử dụng. Axios bật `withCredentials`.
- `AuthProvider` cung cấp `user`, `loading`, `register`, `login`, `logout`. localStorage chỉ lưu `{ id, email, createdAtUtc }` ở key `ptithotel.user`; không lưu mật khẩu hoặc cookie/token. Profile cache luôn được xác minh lại qua backend trước khi mở trang bảo vệ. Khi nhận 401, ứng dụng xóa cache.
- `/account` có `ProtectedRoute`; `/auth/me` có `[Authorize]`. Quyền truy cập API do backend kiểm tra, không dựa vào localStorage.
- CRUD khách sạn ở bài 2 vẫn là chức năng demo công khai; bài 3 chưa có phân quyền quản trị.

### Kiểm thử

Từ thư mục gốc, chạy 21 kiểm tra tích hợp authentication (test host dùng SQLite in-memory, không cần SQL Server, không thay đổi DB thật):

```bash
dotnet run --project backend/CrudApi.IntegrationTests
```

Bao gồm validate, email trùng, unique index DB, hash, sai mật khẩu/email, cookie, khôi phục phiên, đăng xuất và user bị xóa. Tests dùng `EnsureCreated`; kiểm thử này không thực thi migration SQL Server.

Kiểm thử giao diện Chromium (mock API; kiểm tra form, chuyển trang, Context, localStorage và đăng xuất):

```bash
cd frontend
npm ci
npx playwright install chromium
npm run test:e2e
npm run build
npm run lint
```

Đã kiểm tra build backend/frontend, 21 kiểm tra API và 3 kiểm tra giao diện. Migration SQL Server đã được sinh bằng EF Core và kiểm tra khả năng sinh SQL; cần áp dụng `dotnet ef database update` trên SQL Server của bạn trước khi sử dụng.
