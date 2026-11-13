# Mộc Trầm — E-Commerce Backend (NestJS + PostgreSQL + Prisma)

Backend API cho hệ thống thương mại điện tử **Mộc Trầm**, xây dựng bằng **NestJS**, **Prisma ORM**, **PostgreSQL** và tuân thủ **Clean Architecture + SOLID Principles** (xem quy chuẩn code tại [AGENTS.md](./AGENTS.md)).

---

## 1. Yêu cầu môi trường

* **Node.js** (khuyên dùng v20+) & **npm**
* **Docker Desktop** (hoặc **OrbStack** trên macOS) để chạy PostgreSQL local

---

## 2. Hướng dẫn cài đặt & chạy dự án

### Bước 1: Cài đặt thư viện
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường (`.env`)
Copy file mẫu `.env.example` thành `.env` (nếu chưa có):
```bash
cp .env.example .env
```
Mặc định file `.env` kết nối tới PostgreSQL trong Docker:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/moctram_db?schema=public"
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### Bước 3: Khởi động PostgreSQL bằng Docker
Mở ứng dụng **Docker Desktop** (hoặc OrbStack), sau đó chạy:
```bash
npm run docker:up
```

### Bước 4: Tạo bảng & Nạp dữ liệu mẫu (Seed)
```bash
# Tạo 14 bảng vào PostgreSQL theo prisma/schema.prisma
npm run prisma:push

# Nạp dữ liệu mẫu (Admin, Danh mục, Sản phẩm, Banner, Store Settings)
npm run prisma:seed
```

### Bước 5: Chạy Backend Server
```bash
# Chế độ development (tự động reload khi sửa code)
npm run start:dev
```
Server sẽ chạy tại:
* **Base URL:** `http://localhost:4000`
* **API Prefix:** `http://localhost:4000/api/v1`

---

## 3. Tài khoản Admin mẫu (từ Seed)

* **Email:** `admin@moctram.vn`
* **Password:** `Admin@123456`

---

## 4. Xem & Quản lý Database

### Cách 1: Dùng Prisma Studio (Giao diện Web có sẵn)
```bash
npx prisma studio
```
Mở trình duyệt tại: `http://localhost:5555`

### Cách 2: Dùng DBeaver / TablePlus / Postico
Tạo kết nối **PostgreSQL** với thông số:
* **Host:** `localhost`
* **Port:** `5432`
* **Database:** `moctram_db`
* **Username:** `postgres`
* **Password:** `password`

---

## 5. Danh sách API chính (`/api/v1`)

### Auth (`/api/v1/auth`)
* `POST /api/v1/auth/login` — Đăng nhập lấy JWT token
* `POST /api/v1/auth/register` — Đăng ký tài khoản
* `GET /api/v1/auth/profile` — Lấy thông tin tài khoản hiện tại *(Cần JWT)*

### Products (`/api/v1/products`)
* `GET /api/v1/products` — Danh sách sản phẩm (hỗ trợ lọc, tìm kiếm, phân trang)
* `GET /api/v1/products/:slug` — Chi tiết sản phẩm theo slug
* `POST /api/v1/products` — Tạo sản phẩm mới *(Admin)*
* `PATCH /api/v1/products/:id` — Cập nhật sản phẩm *(Admin)*
* `DELETE /api/v1/products/:id` — Xóa sản phẩm *(Admin)*

### Categories (`/api/v1/categories`)
* `GET /api/v1/categories` — Danh sách danh mục
* `POST /api/v1/categories` — Tạo danh mục *(Admin)*
* `PATCH /api/v1/categories/:id` — Cập nhật danh mục *(Admin)*
* `DELETE /api/v1/categories/:id` — Xóa danh mục *(Admin)*

### Orders (`/api/v1/orders`)
* `POST /api/v1/orders` — Tạo đơn hàng mới
* `POST /api/v1/orders/track` — Tra cứu đơn hàng & tạo link VietQR
* `POST /api/v1/orders/:id/cancel` — Hủy đơn hàng & hoàn kho
* `GET /api/v1/orders` — Danh sách đơn hàng *(Admin)*
* `GET /api/v1/orders/stats` — Thống kê doanh thu & số đơn theo trạng thái *(Admin)*
* `GET /api/v1/orders/:id` — Chi tiết đơn hàng *(Admin)*
* `PATCH /api/v1/orders/:id/status` — Cập nhật trạng thái đơn hàng / thanh toán *(Admin)*

### Content (`/api/v1/content`)
* `GET /api/v1/content/banners` — Danh sách banner
* `GET /api/v1/content/faqs` — Câu hỏi thường gặp
* `GET /api/v1/content/posts` — Danh sách bài viết
* `GET /api/v1/content/posts/:slug` — Chi tiết bài viết
* `GET /api/v1/content/settings` — Cấu hình cửa hàng

---

## 6. Các lệnh hữu ích khác

```bash
# Build production
npm run build

# Chạy server production (sau khi build)
npm run start:prod

# Chạy Unit Test
npm test

# Tắt Docker PostgreSQL
npm run docker:down
```

