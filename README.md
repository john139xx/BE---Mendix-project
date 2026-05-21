# E-Commerce Backend API

Backend API cho ứng dụng bán hàng hoá xây dựng bằng Node.js, Express và PostgreSQL.

## Cài đặt

### Yêu cầu
- Node.js (v14 hoặc cao hơn)
- PostgreSQL (v12 hoặc cao hơn)
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd ecommerce-backend
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` và thiết lập các biến sau:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your_stripe_key
```

### Bước 4: Tạo database
```bash
createdb ecommerce_db
```

### Bước 5: Chạy server
```bash
# Development
npm run dev

# Production
npm start
```

Server sẽ chạy trên `http://localhost:5000`

## Các API Endpoint

### Người dùng (Users)
- `POST /api/users/register` - Đăng ký người dùng mới
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/:id` - Lấy thông tin người dùng
- `PUT /api/users/:id` - Cập nhật thông tin người dùng

### Sản phẩm (Products)
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Giỏ hàng (Cart)
- `GET /api/cart/:userId` - Lấy giỏ hàng
- `POST /api/cart/:userId/add` - Thêm sản phẩm vào giỏ hàng
- `DELETE /api/cart/:userId/remove/:cartItemId` - Xóa sản phẩm khỏi giỏ hàng
- `DELETE /api/cart/:userId/clear` - Xóa tất cả sản phẩm trong giỏ hàng

### Đơn hàng (Orders)
- `GET /api/orders` - Lấy tất cả đơn hàng
- `GET /api/orders/user/:userId` - Lấy đơn hàng của người dùng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders/:userId/create` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

## Cấu trúc Database

### Users (Người dùng)
- id (UUID, Primary Key)
- email (String, Unique)
- password (String)
- firstName (String)
- lastName (String)
- phone (String)
- address (String)
- city (String)
- province (String)
- postalCode (String)
- role (Enum: customer, admin)
- createdAt, updatedAt

### Products (Sản phẩm)
- id (UUID, Primary Key)
- name (String)
- description (Text)
- price (Decimal)
- quantity (Integer)
- category (String)
- image (String)
- sku (String, Unique)
- active (Boolean)
- createdAt, updatedAt

### Orders (Đơn hàng)
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- totalAmount (Decimal)
- status (Enum: pending, processing, shipped, delivered, cancelled)
- paymentMethod (String)
- paymentStatus (Enum: pending, completed, failed)
- shippingAddress (Text)
- notes (Text)
- createdAt, updatedAt

### Carts (Giỏ hàng)
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- createdAt, updatedAt

### CartItems (Mục giỏ hàng)
- id (UUID, Primary Key)
- cartId (UUID, Foreign Key)
- productId (UUID, Foreign Key)
- quantity (Integer)
- price (Decimal)
- createdAt, updatedAt

### OrderItems (Mục đơn hàng)
- id (UUID, Primary Key)
- orderId (UUID, Foreign Key)
- productId (UUID, Foreign Key)
- quantity (Integer)
- price (Decimal)
- createdAt, updatedAt

## Ví dụ sử dụng

### Đăng ký người dùng
```json
POST /api/users/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Tạo sản phẩm
```json
POST /api/products
{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 999.99,
  "quantity": 10,
  "category": "Electronics",
  "sku": "LAPTOP001"
}
```

### Thêm sản phẩm vào giỏ hàng
```json
POST /api/cart/:userId/add
{
  "productId": "product-uuid",
  "quantity": 2
}
```

### Tạo đơn hàng
```json
POST /api/orders/:userId/create
{
  "shippingAddress": "123 Main St, City, Country",
  "paymentMethod": "credit_card"
}
```

## Lỗi thường gặp

### Database connection error
- Kiểm tra xem PostgreSQL đang chạy
- Kiểm tra các biến database trong file `.env`
- Kiểm tra xem database đã được tạo

### Port already in use
- Thay đổi PORT trong file `.env`
- Hoặc kill process đang sử dụng port

## Hỗ trợ

Nếu gặp bất kỳ vấn đề nào, vui lòng liên hệ hoặc tạo issue.
