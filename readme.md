CÁC CÔNG VIỆC CẦN LÀM:
- Hồ THị Nhên: Thanh công cụ
    + Thêm trang Blog
    + Xóa nút giỏ hàng
    + Chỉnh vị trí logo
    + Xây dựng giao diện trang chủ

- Đào Minh Nhật:
    + Tạo tính năng nhận thông báo sau khi đặt đơn hàng thành công

- Lê Thị Ngọc Linh: 
    + Tạo trang admin để quản lý và theo dõi đơn hàng

- Phạm Văn Xa Rơ:
    + Xây dựng trang chi tiết cho từng sản phẩm
    + Hiển thị trang điền thông tin khi khách hàng muốn đặt sản phẩm
    + Tạo js cho từng "chi tiết sản phẩm"

CHẠY WEBSITE VÀ LƯU SẢN PHẨM:
- Cài Node.js, mở terminal tại thư mục dự án và chạy `node server.js`.
- Mở website tại `http://127.0.0.1:3000/`; trang quản trị sản phẩm ở `http://127.0.0.1:3000/ADMIN/PAGES/sanpham.html`.
- Khi thêm, sửa hoặc xóa sản phẩm trong admin, máy chủ cập nhật `data/products.json`; trang sản phẩm user đọc dữ liệu mới từ API.
- Cần chạy website qua `server.js` để ghi file. Nếu chỉ mở bằng file:// hoặc Live Server tĩnh, trình duyệt không có quyền ghi vào `products.json`.
