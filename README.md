# ⚡ Flash Sale System - Space-Based Architecture

> Hệ thống Flash Sale được xây dựng theo kiến trúc Space-Based Architecture nhằm xử lý tải cao, giảm bottleneck database và tăng tốc độ phản hồi realtime.

---

# 🚀 Project Overview

Dự án mô phỏng hệ thống bán hàng Flash Sale tương tự Shopee/Lazada với khả năng:

- Xử lý hàng ngàn request mỗi giây
- Giảm tải Database
- Tăng tốc truy xuất dữ liệu bằng Memory Grid
- Hỗ trợ xử lý realtime

---

# 🧠 Architecture

## Space-Based Architecture (SBA)

Hệ thống sử dụng:

- Processing Unit (PU)
- Data Grid (Redis)
- In-Memory Processing

Mục tiêu:
- Hạn chế đọc/ghi Database trực tiếp
- Giảm bottleneck
- Tăng scalability
- Low latency

---

# 🏗️ Core Components

| Thành phần | Vai trò |
|------|------|
| Processing Unit (PU) | Service xử lý nghiệp vụ + local cache |
| Data Grid | Redis lưu dữ liệu RAM dùng chung |
| Frontend | Giao diện người dùng |
| Optional Messaging | Đồng bộ event nếu cần |

---

# 🔄 Main Processing Flow

## 📦 Luồng đặt hàng

```txt
1. User chọn sản phẩm
        ↓
2. Frontend gọi Cart Processing Unit
        ↓
3. Cart lưu dữ liệu vào Redis
        ↓
4. User thực hiện Checkout
        ↓
5. Order Processing Unit lấy cart từ Redis
        ↓
6. Inventory Processing Unit giảm stock realtime
        ↓
7. Trả kết quả ngay cho user
```

---

# ⚡ Data Flow

```txt
Frontend
   ↓
Cart Processing Unit (PU2)
   └─ Save Cart → Redis
                    ↓
Order Processing Unit (PU3)
   └─ Read Cart → Redis
                    ↓
Inventory Processing Unit (PU4)
   └─ Update Stock → Redis
                    ↓
Frontend nhận kết quả ngay
```

---

# 👨‍💻 Team Members & Responsibilities

| Thành viên | Công việc phụ trách |
|------------|--------------------|
| Lê Gia Khánh | Frontend Development |
| Nguyễn Thanh Tú | Product Processing Unit (PU1) |
| Nguyễn Hồ Việt Khoa | Cart Processing Unit (PU2) |
| Vương Ngọc Huệ | Order Processing Unit (PU3) |
| Trần Phương Trí | Inventory Processing Unit (PU4) |

---

# 🛠️ Tech Stack

## Frontend
- ReactJS
- Axios
- TailwindCSS

## Backend
- NodeJS
- ExpressJS

## Data Grid
- Redis

## Architecture
- Space-Based Architecture
- In-Memory Computing
- REST API

---

# 📂 Project Structure

```bash
FlashSaleSystem/
│
├── frontend/
│
├── product-pu/
├── cart-pu/
├── order-pu/
├── inventory-pu/
│
├── redis/
├── docker-compose.yml
│
└── README.md
```

---

# ⚡ Features

## 🛍️ Product Processing Unit (PU1)
- Get product list
- Get product detail
- Read data from Redis

## 🛒 Cart Processing Unit (PU2)
- Add to cart
- Get cart
- Store cart session in Redis

## 📦 Order Processing Unit (PU3)
- Checkout order
- Read cart from Redis
- Coordinate inventory processing

## 📉 Inventory Processing Unit (PU4)
- Get stock
- Reduce stock realtime
- Update stock directly on Redis

---

# 🌐 Service Ports

| Service | Port |
|------|------|
| Frontend | 3000 |
| Product PU | 8081 |
| Cart PU | 8082 |
| Order PU | 8083 |
| Inventory PU | 8084 |
| Redis | 6379 |

---

# 🧠 Why Space-Based Architecture?

## ❌ Traditional Architecture Problem

```txt
App → Database
```

Khi Flash Sale:
- Quá nhiều request
- Database bottleneck
- Query chậm
- Server dễ crash

---

## ✅ Space-Based Architecture Solution

```txt
App → Processing Unit → Redis (RAM)
```

Ưu điểm:
- Dữ liệu xử lý trên RAM
- Response cực nhanh
- Scale ngang dễ dàng
- Giảm tải DB

---

# 🐳 Run With Docker Compose

## Start system

```bash
docker compose up --build
```

## Stop system

```bash
docker compose down
```

---

# 🖥️ Access URLs

## Frontend

```txt
http://localhost:3000
```

## Redis

```txt
localhost:6379
```

---

# 📌 Notes

- Redis đóng vai trò Data Grid trung tâm.
- Các Processing Unit xử lý trực tiếp trên Memory Grid.
- Không truy cập Database trong luồng realtime.
- Hệ thống tối ưu cho Flash Sale và tải lớn.

---

# ❤️ Thanks For Visiting
