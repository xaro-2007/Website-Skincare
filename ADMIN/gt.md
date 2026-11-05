# BÀI GIẢNG: BẺ KHÓA LUỒNG CHẠY ADMIN

Tài liệu này giải thích theo kiểu "đi theo dấu vết":

1. Một chức năng bắt đầu từ đâu.
2. Nó gọi hàm nào.
3. Hàm đó lấy dữ liệu từ hàm nào.
4. Dữ liệu gốc nằm ở đâu.
5. Từng dòng code trong các hàm của luồng đó làm gì.

Tài liệu không có câu hỏi, bài tập hay quiz.

---

## Bảng tác dụng của mọi hàm (tra nhanh)

| File | Hàm | Tác dụng |
| --- | --- | --- |
| `admin-data.js` | `readStorage` | Đọc dữ liệu đã lưu trong localStorage theo khóa; trả `fallback` nếu chưa có hoặc chuỗi bị hỏng. |
| `admin-data.js` | `saveStorage` | Ghi mảng/object vào localStorage dưới dạng chuỗi JSON; trả `true`/`false`. |
| `admin-data.js` | `fetchJSON` | Tải một file JSON trong thư mục `data/`; trả `null` nếu mở bằng `file://` hoặc đọc lỗi. |
| `admin-data.js` | `normalizeProductList` | Chuẩn hóa danh sách sản phẩm: điền trường thiếu, ép kiểu số, đoán danh mục từ tên. |
| `admin-data.js` | `resolveAdminImage` | Đổi đường dẫn `../img/...` thành `../../USER/img/...` để Admin hiển thị đúng ảnh. |
| `admin-data.js` | `prepareAdminData` | Nạp dữ liệu ban đầu: sản phẩm luôn đồng bộ theo `products.json`, người dùng chỉ nạp lần đầu. |
| `admin-data.js` | `getProducts` | Lấy mảng sản phẩm đang lưu trong localStorage. |
| `admin-data.js` | `saveProducts` | Ghi đè mảng sản phẩm vào localStorage. |
| `admin-data.js` | `getUsers` | Lấy mảng người dùng đang lưu. |
| `admin-data.js` | `saveUsers` | Ghi đè mảng người dùng. |
| `admin-data.js` | `getOrders` | Lấy mảng đơn hàng đang lưu. |
| `admin-data.js` | `saveOrders` | Ghi đè mảng đơn hàng. |
| `admin-data.js` | `addActivity` | Ghi một dòng lịch sử hoạt động, giữ tối đa 15 dòng mới nhất. |
| `admin-data.js` | `nextId` | Tìm id lớn nhất trong mảng và trả về id lớn nhất cộng 1. |
| `admin-data.js` | `formatMoney` | Định dạng số thành chuỗi tiền Việt Nam kèm ký hiệu `₫`. |
| `admin-data.js` | `formatDate` | Định dạng ngày/giờ kiểu Việt Nam; trả chuỗi gốc nếu ngày không hợp lệ. |
| `admin-data.js` | `escapeHTML` | Đổi ký tự đặc biệt thành mã an toàn trước khi chèn vào HTML. |
| `admin-data.js` | `getOrderTotal` | Lấy tổng tiền của đơn: dùng `order.total` nếu có, không thì cộng `price × quantity`. |
| `admin-data.js` | `buildBarChart` | Tạo HTML một biểu đồ thanh ngang từ danh sách nhãn và giá trị. |
| `admin-sanpham.js` | `initProducts` | Khởi động trang Sản phẩm: nạp dữ liệu, lấy phần tử HTML, gắn sự kiện, vẽ bảng lần đầu. |
| `admin-sanpham.js` | `renderTable` | Đọc sản phẩm, lọc theo từ khóa/danh mục, vẽ các dòng bảng và cập nhật 3 ô thống kê. |
| `admin-sanpham.js` | `openDialog` | Mở hộp thoại thêm mới (id rỗng) hoặc điền sẵn dữ liệu để sửa. |
| `admin-sanpham.js` | `closeDialog` | Đóng hộp thoại và xóa sạch form. |
| `admin-sanpham.js` | submit handler | Xử lý khi bấm Lưu: đọc form, kiểm tra, thêm hoặc cập nhật, lưu, vẽ lại bảng. |
| `admin-sanpham.js` | click handler | Xử lý nút Sửa/Xóa cho mọi dòng bảng bằng ủy quyền sự kiện. |
| `admin-nguoidung.js` | `initUsers` | Khởi động trang Người dùng: nạp dữ liệu, gắn sự kiện, vẽ bảng lần đầu. |
| `admin-nguoidung.js` | `renderTable` | Lọc người dùng theo từ khóa/vai trò, vẽ bảng và cập nhật thống kê. |
| `admin-nguoidung.js` | `openDialog` | Mở hộp thoại thêm mới hoặc điền sẵn dữ liệu người dùng để sửa. |
| `admin-nguoidung.js` | `closeDialog` | Đóng hộp thoại và xóa sạch form. |
| `admin-nguoidung.js` | submit handler | Kiểm tra trùng username, thêm/cập nhật người dùng, lưu và vẽ lại bảng. |
| `admin-nguoidung.js` | click handler | Sửa hoặc xóa người dùng; chặn xóa quản trị viên cuối cùng. |
| `admin-donhang.js` | `initOrders` | Khởi động trang Đơn hàng: nạp dữ liệu, gắn sự kiện, vẽ bảng lần đầu. |
| `admin-donhang.js` | `getCustomerName` | Lấy tên khách từ `order.customer` (object hoặc chuỗi) hoặc các trường cũ. |
| `admin-donhang.js` | `getOrderDate` | Lấy ngày đặt từ `orderDate`, `date` hoặc `createdAt`. |
| `admin-donhang.js` | `renderOrders` | Lọc đơn, đếm trạng thái, vẽ bảng đơn hàng. |
| `admin-donhang.js` | `showOrderDetail` | Đổ thông tin khách và bảng sản phẩm vào hộp thoại chi tiết. |
| `admin-donhang.js` | change handler | Đổi trạng thái đơn, lưu lại và vẽ lại bảng. |
| `admin.js` | `initDashboard` | Điền các thẻ số, chèn biểu đồ và hiện 6 hoạt động gần đây. |
| `admin.js` | `logoutAdmin` | Xóa trạng thái đăng nhập và quay về trang đăng nhập. |
| `admin-thongke.js` | `initStats` | Tính doanh thu, số đơn, sản phẩm bán chạy và vẽ biểu đồ thống kê. |

---

## 1. Nền tảng: dữ liệu đi từ đâu tới đâu

Trước khi đi vào từng chức năng, cần nắm một sơ đồ chung. Mọi trang Admin đều đi theo sơ đồ này.

### 1.1. Sơ đồ tổng quát

```text
data/products.json
        │
        ▼
   fetchJSON("products.json")
        │
        ▼
   normalizeProductList(...)
        │
        ▼
   saveStorage("julie_products", ...)
        │
        ▼
   localStorage["julie_products"]
        │
        ▼
   readStorage("julie_products", [])
        │
        ▼
   getProducts()
        │
        ▼
   renderTable()
```

Với người dùng:

```text
data/users.json
        │
        ▼
   fetchJSON("users.json")
        │
        ▼
   saveStorage("julie_users", ...)
        │
        ▼
   localStorage["julie_users"]
        │
        ▼
   readStorage("julie_users", [])
        │
        ▼
   getUsers()
        │
        ▼
   renderTable()
```

Với đơn hàng:

```text
USER/JS/giohang.js
        │
        ▼
   localStorage["orders"]
        │
        ▼
   readStorage("orders", [])
        │
        ▼
   getOrders()
        │
        ▼
   renderOrders()
```

Điểm quan trọng: hàm render không đọc JSON trực tiếp. Hàm render gọi hàm `get...`, hàm `get...` gọi `readStorage`, và `readStorage` mới là nơi đọc localStorage.

### 1.2. `readStorage` — dòng 22–29

**Tác dụng:** Đọc dữ liệu đã lưu trong localStorage theo khóa và trả về mảng/object đã `JSON.parse`. Nếu khóa chưa có hoặc chuỗi bị hỏng thì trả về `fallback`.

```js
22 function readStorage(key, fallback) {
23     try {
24         const raw = localStorage.getItem(key);
25         return raw === null ? fallback : JSON.parse(raw);
26     } catch (error) {
27         return fallback;
28     }
29 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 22 | Khai báo hàm nhận `key` và `fallback`. |
| 23 | Mở `try` để bắt lỗi khi đọc dữ liệu. |
| 24 | Gọi `localStorage.getItem(key)` để lấy chuỗi đã lưu. Nếu chưa có key, kết quả là `null`. |
| 25 | Nếu `raw` là `null` thì trả `fallback`. Nếu không, gọi `JSON.parse(raw)` để đổi chuỗi thành mảng hoặc object. |
| 26 | Bắt lỗi nếu chuỗi lưu trong localStorage bị hỏng. |
| 27 | Trả `fallback` khi `JSON.parse` lỗi. |
| 28 | Kết thúc `catch`. |
| 29 | Kết thúc hàm. |

### 1.3. `saveStorage` — dòng 32–40

**Tác dụng:** Ghi mảng/object vào localStorage dưới dạng chuỗi JSON. Trả `true` nếu lưu được, `false` nếu trình duyệt không cho ghi.

```js
32 function saveStorage(key, data) {
33     try {
34         localStorage.setItem(key, JSON.stringify(data));
35         return true;
36     } catch (error) {
37         alert("Không lưu được dữ liệu. Vui lòng thử lại.");
38         return false;
39     }
40 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 32 | Khai báo hàm nhận `key` và `data`. |
| 33 | Mở `try`. |
| 34 | Gọi `JSON.stringify(data)` để đổi mảng/object thành chuỗi, rồi `localStorage.setItem` ghi chuỗi đó vào trình duyệt. |
| 35 | Trả `true` nếu ghi thành công. |
| 36 | Bắt lỗi nếu trình duyệt không cho ghi. |
| 37 | Báo cho người dùng biết không lưu được. |
| 38 | Trả `false` để hàm gọi biết việc lưu thất bại. |
| 39 | Kết thúc `catch`. |
| 40 | Kết thúc hàm. |

### 1.4. `fetchJSON` — dòng 43–59

**Tác dụng:** Tải một file JSON trong thư mục `data/` bằng `fetch` và trả về dữ liệu đã parse. Trả `null` nếu trang mở bằng `file://` hoặc file đọc lỗi.

```js
43 async function fetchJSON(fileName) {
44     if (location.protocol === "file:") {
45         return null;
46     }
47
48     try {
49         const response = await fetch("../../data/" + fileName, { cache: "no-store" });
50
51         if (!response.ok) {
52             return null;
53         }
54
55         return await response.json();
56     } catch (error) {
57         return null;
58     }
59 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 43 | Khai báo hàm `async`, nhận tên file JSON. |
| 44 | Kiểm tra trang đang mở bằng `file://` hay bằng server. |
| 45 | Nếu mở bằng `file://`, trả `null` vì `fetch` không đọc được file local theo cách này. |
| 48 | Mở `try`. |
| 49 | Gọi `fetch` để đọc file trong thư mục `data/`. `cache: "no-store"` yêu cầu trình duyệt không dùng bản cũ. |
| 51 | Kiểm tra mã phản hồi. |
| 52 | Nếu file không tồn tại hoặc lỗi, trả `null`. |
| 55 | Nếu file đọc được, gọi `response.json()` để đổi nội dung thành mảng/object. |
| 56 | Bắt lỗi mạng hoặc lỗi đọc file. |
| 57 | Trả `null` khi có lỗi. |
| 59 | Kết thúc hàm. |

### 1.5. `normalizeProductList` — dòng 62–94

**Tác dụng:** Chuẩn hóa danh sách sản phẩm thô từ JSON: điền trường thiếu, ép kiểu số cho giá/tồn kho, và đoán danh mục từ tên nếu sản phẩm chưa có danh mục.

```js
62 function normalizeProductList(list) {
63     if (!Array.isArray(list)) return [];
64
65     return list.map(function (item) {
66         const nameLower = String(item.name || "").toLowerCase();
67         let category = item.category || "";
68
69         if (!category) {
70             if (nameLower.includes("son")) category = "son";
71             else if (nameLower.includes("phấn nước") || nameLower.includes("cushion")) category = "cushion";
72             else if (nameLower.includes("sữa rửa mặt")) category = "cleanser";
73             else if (nameLower.includes("tẩy trang")) category = "taytrang";
74             else if (nameLower.includes("kem lót")) category = "kemlot";
75             else category = "son";
76         }
77
78         return {
79             id: item.id,
80             name: item.name || "",
81             category: category,
82             categoryName: item.categoryName || CATEGORY_NAMES[category] || category,
83             price: Number(item.price) || 0,
84             oldPrice: item.oldPrice ? Number(item.oldPrice) : 0,
85             stock: item.stock !== undefined ? Number(item.stock) : 20,
86             stars: item.stars || "★★★★★",
87             reviews: item.reviews !== undefined ? Number(item.reviews) : 50,
88             description: item.description || "",
89             img: item.img || "",
90             badge: item.badge || "",
91             badgeClass: item.badgeClass || "hot"
92         };
93     });
94 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 62 | Khai báo hàm nhận một danh sách. |
| 63 | Nếu đầu vào không phải mảng, trả mảng rỗng. |
| 65 | Gọi `map` để biến mỗi sản phẩm thành một object đã chuẩn hóa. |
| 66 | Lấy tên sản phẩm, đổi về chữ thường để dò danh mục. |
| 67 | Lấy `category` có sẵn; nếu chưa có thì để chuỗi rỗng. |
| 69–76 | Nếu chưa có danh mục, dò tên để đoán danh mục. |
| 70 | Tên có chữ "son" thì gán `son`. |
| 71 | Tên có "phấn nước" hoặc "cushion" thì gán `cushion`. |
| 72 | Tên có "sữa rửa mặt" thì gán `cleanser`. |
| 73 | Tên có "tẩy trang" thì gán `taytrang`. |
| 74 | Tên có "kem lót" thì gán `kemlot`. |
| 75 | Không khớp trường hợp nào thì mặc định `son`. |
| 78 | Bắt đầu trả về object sản phẩm mới. |
| 79 | Giữ nguyên `id`. |
| 80 | Tên sản phẩm, mặc định chuỗi rỗng. |
| 81 | Gán danh mục đã tìm được. |
| 82 | Gán tên danh mục: ưu tiên `item.categoryName`, sau đó `CATEGORY_NAMES`, cuối cùng là mã danh mục. |
| 83 | Đổi giá sang số; nếu không đổi được thì 0. |
| 84 | Giữ giá cũ nếu có. |
| 85 | Nếu `stock` không phải `undefined` thì đổi sang số; nếu thiếu thì mặc định 20. Điểm này giữ được `stock = 0`. |
| 86 | Sao mặc định. |
| 87 | Số lượt đánh giá, mặc định 50. |
| 88 | Mô tả, mặc định chuỗi rỗng. |
| 89 | Đường dẫn ảnh, mặc định chuỗi rỗng. |
| 90 | Nhãn sản phẩm, mặc định chuỗi rỗng. |
| 91 | Class của nhãn, mặc định `hot`. |
| 92 | Kết thúc object. |
| 93 | Kết thúc `map`. |
| 94 | Kết thúc hàm. |

### 1.6. `prepareAdminData` — dòng 107–126

**Tác dụng:** Chuẩn bị dữ liệu khi mở trang: nạp sản phẩm từ `products.json` vào localStorage (và nạp lại khi file đổi), nạp người dùng từ `users.json` nếu kho người dùng còn trống.

```js
107 async function prepareAdminData() {
108     const fileProducts = await fetchJSON("products.json");
109     const sourceProducts = Array.isArray(fileProducts) ? fileProducts : DEFAULT_PRODUCTS;
110     const normalized = normalizeProductList(sourceProducts);
111     const sourceSignature = JSON.stringify(normalized);
112     const savedSignature = localStorage.getItem(PRODUCTS_SOURCE_KEY);
113
114     if (readStorage(PRODUCTS_KEY, null) === null || savedSignature !== sourceSignature) {
115         saveStorage(PRODUCTS_KEY, normalized);
116         localStorage.setItem(PRODUCTS_SOURCE_KEY, sourceSignature);
117     }
118
119     if (readStorage(USERS_KEY, null) === null) {
120         const users = await fetchJSON("users.json");
121
122         if (Array.isArray(users)) {
123             saveStorage(USERS_KEY, users);
124         }
125     }
126 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 107 | Khai báo hàm `async`, không nhận tham số. |
| 108 | Gọi `fetchJSON("products.json")` và chờ kết quả. |
| 109 | Nếu đọc được mảng thì dùng; nếu không thì dùng giá trị dự phòng. Hiện tại `DEFAULT_PRODUCTS` chưa được khai báo, nên nhánh dự phòng sẽ báo lỗi. |
| 110 | Gọi `normalizeProductList` để chuẩn hóa danh sách sản phẩm. |
| 111 | Dùng `JSON.stringify` tạo chuỗi đại diện cho danh sách đã chuẩn hóa. |
| 112 | Đọc chuỗi đại diện của lần lưu trước trong localStorage. |
| 114 | Kiểm tra kho sản phẩm chưa có, hoặc file JSON đã thay đổi. |
| 115 | Ghi danh sách sản phẩm đã chuẩn hóa vào localStorage. |
| 116 | Ghi chuỗi đại diện mới để lần sau so sánh. |
| 119 | Kiểm tra kho người dùng đã có chưa. |
| 120 | Nếu chưa có, gọi `fetchJSON("users.json")` và chờ. |
| 122 | Kiểm tra kết quả có phải mảng. |
| 123 | Ghi danh sách người dùng vào localStorage. |
| 126 | Kết thúc hàm. |

Điểm cần nhớ: sản phẩm có thể được nạp lại khi file JSON thay đổi. Người dùng chỉ được nạp lần đầu, không bị ghi đè.

### 1.7. Các hàm `get...` và `save...`

**Tác dụng:** Sáu hàm ngắn đóng vai trò cửa ra vào của dữ liệu: `get...` đọc mảng từ localStorage, `save...` ghi mảng xuống localStorage. Nhờ vậy các trang không cần gọi `readStorage`/`saveStorage` trực tiếp.

```js
129 function getProducts() {
130     const products = readStorage(PRODUCTS_KEY, []);
131     return Array.isArray(products) ? products : [];
132 }
133
135 function saveProducts(products) {
136     return saveStorage(PRODUCTS_KEY, products);
137 }
138
140 function getUsers() {
141     const users = readStorage(USERS_KEY, []);
142     return Array.isArray(users) ? users : [];
143 }
144
146 function saveUsers(users) {
147     return saveStorage(USERS_KEY, users);
148 }
149
151 function getOrders() {
152     const orders = readStorage(ORDERS_KEY, []);
153     return Array.isArray(orders) ? orders : [];
154 }
155
157 function saveOrders(orders) {
158     return saveStorage(ORDERS_KEY, orders);
159 }
```

| Hàm | Dòng | Tác dụng | Cách đi |
| --- | --- | --- | --- |
| `getProducts` | 129–132 | Lấy danh sách sản phẩm đang lưu. | Gọi `readStorage("julie_products", [])`, sau đó kiểm tra kết quả có phải mảng. |
| `saveProducts` | 135–137 | Ghi đè danh sách sản phẩm. | Gọi `saveStorage("julie_products", products)`. |
| `getUsers` | 140–143 | Lấy danh sách người dùng đang lưu. | Gọi `readStorage("julie_users", [])`, kiểm tra mảng. |
| `saveUsers` | 146–148 | Ghi đè danh sách người dùng. | Gọi `saveStorage("julie_users", users)`. |
| `getOrders` | 151–154 | Lấy danh sách đơn hàng đang lưu. | Gọi `readStorage("orders", [])`, kiểm tra mảng. |
| `saveOrders` | 157–159 | Ghi đè danh sách đơn hàng. | Gọi `saveStorage("orders", orders)`. |

### 1.8. Các hàm hỗ trợ hiển thị

`formatMoney` — dòng 190–192:

**Tác dụng:** Đổi một số thành chuỗi tiền kiểu Việt Nam (dấu chấm ngăn cách nghìn) và thêm ký hiệu `₫`.

```js
190 function formatMoney(amount) {
191     return Number(amount).toLocaleString("vi-VN") + " ₫";
192 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 190 | Khai báo hàm nhận số tiền. |
| 191 | Đổi sang số, định dạng kiểu Việt Nam, rồi thêm ký hiệu `₫`. |
| 192 | Kết thúc hàm. |

`formatDate` — dòng 195–209:

**Tác dụng:** Định dạng một giá trị ngày/giờ thành chuỗi kiểu Việt Nam; có thể kèm giờ hoặc chỉ ngày. Nếu ngày không hợp lệ thì trả lại chuỗi gốc.

```js
195 function formatDate(value, withTime) {
196     if (!value) {
197         return "";
198     }
199
200     const date = new Date(value);
201
202     if (isNaN(date.getTime())) {
203         return String(value);
204     }
205
206     return withTime
207         ? date.toLocaleString("vi-VN")
208         : date.toLocaleDateString("vi-VN");
209 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 195 | Khai báo hàm nhận ngày và cờ `withTime`. |
| 196 | Kiểm tra giá trị rỗng. |
| 197 | Trả chuỗi rỗng nếu không có ngày. |
| 200 | Tạo object `Date` từ giá trị đầu vào. |
| 202 | Kiểm tra ngày có hợp lệ không. |
| 203 | Nếu không hợp lệ, trả lại chuỗi gốc. |
| 206–208 | Nếu hợp lệ, trả ngày kèm giờ hoặc chỉ ngày tùy `withTime`. |
| 209 | Kết thúc hàm. |

`escapeHTML` — dòng 212–223:

**Tác dụng:** Đổi các ký tự đặc biệt (`&`, `<`, `>`, `"`, `'`) thành mã an toàn để dữ liệu người dùng nhập không chèn được HTML lạ vào trang.

```js
212 function escapeHTML(value) {
213     if (value === null || value === undefined) {
214         return "";
215     }
216
217     return String(value)
218         .replace(/&/g, "&amp;")
219         .replace(/</g, "&lt;")
220         .replace(/>/g, "&gt;")
221         .replace(/"/g, "&quot;")
222         .replace(/'/g, "&#39;");
223 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 212 | Khai báo hàm nhận một giá trị. |
| 213 | Kiểm tra `null` hoặc `undefined`. |
| 214 | Trả chuỗi rỗng nếu không có giá trị. |
| 217 | Đổi giá trị sang chuỗi. |
| 218 | Đổi `&` thành `&amp;`. |
| 219 | Đổi `<` thành `&lt;`. |
| 220 | Đổi `>` thành `&gt;`. |
| 221 | Đổi `"` thành `&quot;`. |
| 222 | Đổi `'` thành `&#39;`. |
| 223 | Kết thúc hàm. |

`getOrderTotal` — dòng 226–240:

**Tác dụng:** Lấy tổng tiền của một đơn hàng: dùng `order.total` nếu đã có, nếu không thì tự cộng `price × quantity` của từng sản phẩm.

```js
226 function getOrderTotal(order) {
227     if (typeof order.total === "number") {
228         return order.total;
229     }
230
231     let total = 0;
232
233     if (Array.isArray(order.items)) {
234         order.items.forEach(function (item) {
235             total += (Number(item.price) || 0) * (Number(item.quantity) || 0);
236         });
237     }
238
239     return total;
240 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 226 | Khai báo hàm nhận một đơn hàng. |
| 227 | Kiểm tra `order.total` có phải số. |
| 228 | Nếu có, trả luôn tổng tiền đã lưu. |
| 231 | Nếu không, bắt đầu tổng bằng 0. |
| 233 | Kiểm tra `order.items` có phải mảng. |
| 234 | Duyệt từng sản phẩm. |
| 235 | Cộng `price * quantity`, mỗi giá trị đều đổi sang số. |
| 239 | Trả tổng vừa tính. |
| 240 | Kết thúc hàm. |

`addActivity` — dòng 162–172:

**Tác dụng:** Ghi một dòng lịch sử hoạt động vào localStorage, đưa dòng mới lên đầu và chỉ giữ 15 dòng gần nhất.

```js
162 function addActivity(text) {
163     const activities = readStorage(ACTIVITY_KEY, []);
164     const list = Array.isArray(activities) ? activities : [];
165
166     list.unshift({
167         time: new Date().toISOString(),
168         text: text
169     });
170
171     saveStorage(ACTIVITY_KEY, list.slice(0, 15));
172 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 162 | Khai báo hàm nhận nội dung hoạt động. |
| 163 | Đọc lịch sử cũ bằng `readStorage`. |
| 164 | Nếu dữ liệu không phải mảng thì dùng mảng rỗng. |
| 166–169 | Tạo object hoạt động mới gồm thời gian và nội dung. |
| 167 | Lấy thời gian hiện tại theo chuẩn ISO. |
| 171 | Đưa hoạt động mới lên đầu, chỉ giữ 15 phần tử, rồi ghi lại. |
| 172 | Kết thúc hàm. |

`nextId` — dòng 175–187:

**Tác dụng:** Tìm id lớn nhất trong một mảng rồi trả về id đó cộng 1, dùng để tạo id cho phần tử mới.

```js
175 function nextId(items) {
176     let maxId = 0;
177
178     items.forEach(function (item) {
179         const id = Number(item.id);
180
181         if (id > maxId) {
182             maxId = id;
183         }
184     });
185
186     return maxId + 1;
187 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 175 | Khai báo hàm nhận danh sách. |
| 176 | Bắt đầu với id lớn nhất bằng 0. |
| 178 | Duyệt từng phần tử. |
| 179 | Đổi id sang số. |
| 181 | Nếu id lớn hơn id lớn nhất hiện tại. |
| 182 | Cập nhật id lớn nhất. |
| 186 | Trả id lớn nhất cộng 1. |
| 187 | Kết thúc hàm. |

---

## 2. Luồng render sản phẩm

Đây là luồng trọng tâm. Các luồng khác có cách đi tương tự.

### 2.1. Sơ đồ đầy đủ

```text
Mở ADMIN/PAGES/sanpham.html
│
├─ Trình duyệt tải admin-data.js
│   └─ Khai báo readStorage, saveStorage, fetchJSON, normalizeProductList,
│      prepareAdminData, getProducts, escapeHTML, formatMoney, ...
│
├─ Trình duyệt tải admin-sanpham.js
│   └─ Gọi initProducts()                              [dòng 270]
│       │
│       ├─ await prepareAdminData()                    [dòng 3]
│       │   ├─ fetchJSON("products.json")              [dòng 108]
│       │   ├─ normalizeProductList(...)               [dòng 110]
│       │   ├─ readStorage(PRODUCTS_KEY, null)         [dòng 114]
│       │   ├─ saveStorage(PRODUCTS_KEY, normalized)   [dòng 115]
│       │   ├─ readStorage(USERS_KEY, null)            [dòng 119]
│       │   ├─ fetchJSON("users.json")                 [dòng 120]
│       │   └─ saveStorage(USERS_KEY, users)           [dòng 123]
│       │
│       ├─ document.getElementById("product-table-body") [dòng 5]
│       ├─ Lấy các phần tử HTML                        [dòng 11–21]
│       ├─ Khai báo renderTable, openDialog, closeDialog
│       ├─ Gắn sự kiện click, submit, input, change    [dòng 145–230]
│       └─ renderTable()                               [dòng 267]
│           │
│           ├─ getProducts()                           [dòng 27]
│           │   └─ readStorage("julie_products", [])   [dòng 130]
│           │       ├─ localStorage.getItem(...)       [dòng 24]
│           │       └─ JSON.parse(...)                 [dòng 25]
│           │
│           ├─ products.filter(...)                    [dòng 29]
│           ├─ filtered.map(...)                       [dòng 43]
│           │   ├─ escapeHTML(...)                     [dòng 44–54]
│           │   ├─ resolveAdminImage(...)              [dòng 46]
│           │   └─ formatMoney(...)                    [dòng 71]
│           ├─ join("")                                [dòng 81]
│           ├─ tableBody.innerHTML = ...               [dòng 43]
│           ├─ products.forEach(...)                   [dòng 87]
│           └─ totalProducts.textContent = ...         [dòng 95]
│
└─ Trình duyệt tải admin.js
    └─ initDashboard()                                 [dòng 100]
        └─ Báo lỗi vì trang Sản phẩm không có #tongquan [dòng 31]
```

### 2.2. Render lấy dữ liệu từ hàm nào

Chuỗi đi của dữ liệu:

```text
renderTable()
    │
    ├─ gọi getProducts()                    [admin-sanpham.js dòng 27]
    │       │
    │       └─ gọi readStorage(PRODUCTS_KEY, [])   [admin-data.js dòng 130]
    │               │
    │               ├─ gọi localStorage.getItem("julie_products")   [dòng 24]
    │               └─ gọi JSON.parse(...)                          [dòng 25]
    │
    └─ nhận về mảng products
```

Dữ liệu trong `localStorage["julie_products"]` do `prepareAdminData` ghi vào:

```text
data/products.json
    │
    ├─ fetchJSON("products.json")           [admin-data.js dòng 108]
    ├─ normalizeProductList(...)            [dòng 110]
    └─ saveStorage(PRODUCTS_KEY, ...)       [dòng 115]
```

Vì vậy có thể đọc chuỗi đầy đủ như sau:

```text
data/products.json
→ fetchJSON
→ normalizeProductList
→ saveStorage
→ localStorage["julie_products"]
→ readStorage
→ getProducts
→ renderTable
```

### 2.3. `initProducts` — dòng 2–270, giải thích theo từng đoạn

**Tác dụng:** Hàm khởi động của trang Sản phẩm. Hàm này không tự vẽ bảng. Nó chuẩn bị dữ liệu, lấy phần tử HTML, gắn sự kiện, rồi gọi `renderTable()`.

| Dòng | Việc xảy ra |
| --- | --- |
| 2 | Khai báo hàm `async function initProducts()`. |
| 3 | Gọi `await prepareAdminData()`. Hàm tạm dừng cho đến khi dữ liệu nạp xong. |
| 5 | Gọi `document.getElementById("product-table-body")` để lấy phần thân bảng. |
| 7 | Kiểm tra `tableBody` có tồn tại không. |
| 8 | Nếu không có bảng, trả về và dừng hàm. |
| 11 | Lấy hộp thoại sản phẩm. |
| 12 | Lấy form sản phẩm. |
| 13 | Lấy tiêu đề hộp thoại. |
| 15 | Lấy ô tìm kiếm. |
| 16 | Lấy bộ lọc danh mục. |
| 17 | Lấy thông báo "không có sản phẩm". |
| 19 | Lấy ô thống kê tổng sản phẩm. |
| 20 | Lấy ô thống kê tổng danh mục. |
| 21 | Lấy ô thống kê giá trung bình. |
| 24–102 | Khai báo hàm `renderTable`. Hàm này được giải thích riêng ở mục 2.4. |
| 105–137 | Khai báo hàm `openDialog`. Hàm này được giải thích trong luồng thêm/sửa. |
| 140–143 | Khai báo hàm `closeDialog`. |
| 145–147 | Gắn sự kiện click cho nút `#add-product-btn`, gọi `openDialog("")`. |
| 149 | Gắn sự kiện click cho nút đóng hộp thoại, gọi `closeDialog`. |
| 150 | Gắn sự kiện click cho nút hủy, gọi `closeDialog`. |
| 152 | Gắn sự kiện submit cho form sản phẩm. |
| 227 | Gắn sự kiện input cho ô tìm kiếm, gọi `renderTable`. |
| 228 | Gắn sự kiện change cho bộ lọc danh mục, gọi `renderTable`. |
| 230 | Gắn sự kiện click cho phần thân bảng để xử lý nút Sửa/Xóa. |
| 267 | Gọi `renderTable()` lần đầu để hiển thị bảng. |
| 268 | Kết thúc hàm. |
| 270 | Gọi `initProducts()` để bắt đầu chạy. |

### 2.4. `renderTable` — dòng 24–102, giải thích từng dòng

**Tác dụng:** Đọc sản phẩm từ `getProducts()`, lọc theo từ khóa và danh mục, vẽ các dòng `<tr>` vào bảng, rồi cập nhật ba ô thống kê (tổng sản phẩm, số danh mục, giá trung bình).

```js
24     function renderTable() {
25         const keyword = searchInput.value.trim().toLowerCase();
26         const category = categoryFilter.value;
27         const products = getProducts();
28
29         const filtered = products.filter(function (product) {
30             const matchName = String(product.name).toLowerCase().includes(keyword);
31             const matchCategory =
32                 category === "all" || product.category === category;
33
34             return matchName && matchCategory;
35         });
36
37         if (filtered.length === 0) {
38             tableBody.innerHTML = "";
39             emptyMessage.hidden = false;
40         } else {
41             emptyMessage.hidden = true;
42
43             tableBody.innerHTML = filtered.map(function (product) {
44                 const id = escapeHTML(product.id);
45                 const name = escapeHTML(product.name);
46                 const image = escapeHTML(resolveAdminImage(product.img));
47                 const description = escapeHTML(product.description);
48                 const categoryName = escapeHTML(
49                     product.categoryName ||
50                     CATEGORY_NAMES[product.category] ||
51                     product.category ||
52                     "Mỹ phẩm"
53                 );
54                 const stock = product.stock !== undefined ? escapeHTML(product.stock) : "20";
55
56                 return (
57                     "<tr>" +
58                         "<td>" +
59                             '<div style="display:flex;align-items:center;gap:10px;">' +
60                                 '<img src="' + image + '" alt="' + name + '"' +
61                                     ' style="width:44px;height:44px;border-radius:8px;object-fit:cover;">' +
62                                 "<div>" +
63                                     "<strong>" + name + "</strong><br>" +
64                                     '<span style="font-size:12px;color:#817681;">' +
65                                         description +
66                                     "</span>" +
67                                 "</div>" +
68                             "</div>" +
69                         "</td>" +
70                         "<td>" + categoryName + "</td>" +
71                         "<td>" + formatMoney(product.price) + "</td>" +
72                         "<td>" + stock + "</td>" +
73                         "<td>" +
74                             '<button class="small" type="button" data-action="edit"' +
75                                 ' data-id="' + id + '">Sửa</button> ' +
76                             '<button class="small" type="button" data-action="delete"' +
77                                 ' data-id="' + id + '">Xóa</button>' +
78                         "</td>" +
79                     "</tr>"
80                 );
81             }).join("");
82         }
83
84         const categories = [];
85         let totalPrice = 0;
86
87         products.forEach(function (product) {
88             if (product.category && categories.indexOf(product.category) === -1) {
89                 categories.push(product.category);
90             }
91
92             totalPrice += Number(product.price) || 0;
93         });
94
95         totalProducts.textContent = products.length;
96         totalCategories.textContent = categories.length;
97         averagePrice.textContent = formatMoney(
98             products.length > 0
99                 ? Math.round(totalPrice / products.length)
100                 : 0
101         );
102     }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 24 | Khai báo hàm `renderTable`, không nhận tham số. |
| 25 | Lấy giá trị ô tìm kiếm, bỏ khoảng trắng hai đầu, đổi về chữ thường. |
| 26 | Lấy giá trị bộ lọc danh mục. |
| 27 | Gọi `getProducts()` để lấy toàn bộ sản phẩm từ localStorage. |
| 29 | Gọi `filter` để tạo mảng chỉ gồm sản phẩm phù hợp. |
| 30 | So tên sản phẩm với từ khóa, không phân biệt chữ hoa chữ thường. |
| 31–32 | Kiểm tra danh mục: nếu bộ lọc là `"all"` thì đúng, hoặc danh mục sản phẩm trùng bộ lọc. |
| 34 | Chỉ giữ sản phẩm đúng cả tên và danh mục. |
| 37 | Kiểm tra mảng sau lọc có rỗng không. |
| 38 | Nếu rỗng, xóa nội dung bảng. |
| 39 | Hiện thông báo không tìm thấy. |
| 40 | Nếu có dữ liệu. |
| 41 | Ẩn thông báo không tìm thấy. |
| 43 | Gán `innerHTML` của bảng bằng kết quả `map` và `join`. |
| 44 | Lấy id sản phẩm và escape. |
| 45 | Lấy tên sản phẩm và escape. |
| 46 | Đổi đường dẫn ảnh cho Admin rồi escape. |
| 47 | Lấy mô tả và escape. |
| 48–53 | Lấy tên danh mục theo thứ tự ưu tiên: `categoryName`, `CATEGORY_NAMES`, mã danh mục, cuối cùng là "Mỹ phẩm". |
| 54 | Lấy tồn kho; nếu `undefined` thì hiện `"20"`. |
| 56–80 | Tạo chuỗi HTML cho một dòng `<tr>`. |
| 60–61 | Tạo thẻ `<img>` với đường dẫn ảnh, tên sản phẩm và kích thước. |
| 63 | Hiện tên sản phẩm in đậm. |
| 64–66 | Hiện mô tả bên dưới tên. |
| 70 | Tạo ô danh mục. |
| 71 | Tạo ô giá, dùng `formatMoney`. |
| 72 | Tạo ô tồn kho. |
| 73–78 | Tạo hai nút Sửa và Xóa, kèm `data-action` và `data-id`. |
| 81 | Nối tất cả chuỗi `<tr>` thành một chuỗi duy nhất. |
| 84 | Tạo mảng rỗng để chứa các danh mục. |
| 85 | Bắt đầu tổng giá bằng 0. |
| 87 | Duyệt toàn bộ sản phẩm, không phải chỉ sản phẩm đã lọc. |
| 88 | Nếu sản phẩm có danh mục và danh mục chưa có trong mảng. |
| 89 | Thêm danh mục vào mảng. |
| 92 | Cộng giá sản phẩm vào tổng giá. |
| 95 | Ghi tổng số sản phẩm vào ô thống kê. |
| 96 | Ghi tổng số danh mục. |
| 97–101 | Tính giá trung bình: nếu có sản phẩm thì chia tổng cho số lượng và làm tròn; nếu không thì 0. Dùng `formatMoney` để hiển thị. |
| 102 | Kết thúc hàm. |

### 2.5. Các hàm được gọi bên trong `renderTable`

| Hàm | Dòng | Tác dụng trong luồng |
| --- | --- | --- |
| `getProducts` | 27 | Lấy mảng sản phẩm từ localStorage. |
| `readStorage` | 130 | Đọc chuỗi JSON và đổi thành mảng. |
| `escapeHTML` | 44–54 | Làm sạch chuỗi trước khi đưa vào HTML. |
| `resolveAdminImage` | 46 | Đổi `../img/...` thành `../../USER/img/...`. |
| `CATEGORY_NAMES` | 48–52 | Lấy tên danh mục hiển thị. |
| `formatMoney` | 71, 97 | Định dạng giá và giá trung bình. |

`resolveAdminImage` — dòng 97–103:

**Tác dụng:** Đổi đường dẫn ảnh `../img/...` (đúng với thư mục USER) thành `../../USER/img/...` để ảnh hiển thị đúng khi đứng từ thư mục ADMIN.

```js
97 function resolveAdminImage(imgPath) {
98     if (!imgPath) return "";
99     if (imgPath.indexOf("../img/") === 0) {
100         return "../../USER/" + imgPath.slice(3);
101     }
102     return imgPath;
103 }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 97 | Khai báo hàm nhận đường dẫn ảnh. |
| 98 | Nếu đường dẫn rỗng, trả chuỗi rỗng. |
| 99 | Nếu đường dẫn bắt đầu bằng `../img/`. |
| 100 | Đổi thành `../../USER/img/...` để Admin tìm đúng thư mục ảnh. |
| 102 | Nếu không khớp, giữ nguyên đường dẫn. |
| 103 | Kết thúc hàm. |

### 2.6. Ví dụ chạy thật

Giả sử localStorage đang có 2 sản phẩm:

```json
[
    {
        "id": 1,
        "name": "Son dưỡng môi",
        "category": "son",
        "categoryName": "Son môi",
        "price": 150000,
        "stock": 20,
        "img": "../img/son.jpg",
        "description": "Dưỡng môi mềm"
    },
    {
        "id": 2,
        "name": "Serum vitamin C",
        "category": "serum",
        "categoryName": "Serum",
        "price": 350000,
        "stock": 10,
        "img": "../img/serum.jpg",
        "description": "Sáng da"
    }
]
```

Người dùng mở trang, không gõ gì, bộ lọc là "Tất cả".

Thứ tự chạy:

1. `renderTable` lấy `keyword = ""`, `category = "all"`.
2. `getProducts()` trả mảng 2 sản phẩm.
3. `filter` giữ cả 2 vì tên nào cũng chứa chuỗi rỗng và `category === "all"`.
4. `map` tạo 2 chuỗi `<tr>`.
5. `join("")` nối thành một chuỗi HTML.
6. `tableBody.innerHTML` nhận chuỗi đó và trình duyệt vẽ bảng.
7. `products.forEach` đếm được 2 danh mục: `son`, `serum`.
8. `totalPrice = 500000`.
9. `averagePrice = 250000`.
10. Ba ô thống kê hiện: 2 sản phẩm, 2 danh mục, 250.000 ₫.

Nếu người dùng gõ "son":

1. Sự kiện `input` gọi `renderTable`.
2. `keyword = "son"`.
3. `filter` chỉ giữ sản phẩm "Son dưỡng môi".
4. `map` tạo 1 chuỗi `<tr>`.
5. Bảng chỉ còn 1 dòng.
6. Phần thống kê vẫn tính trên toàn bộ 2 sản phẩm, vì `products` là mảng gốc, còn `filtered` chỉ dùng để vẽ bảng.

### 2.7. Sau khi render, dữ liệu nằm ở đâu

- Mảng sản phẩm gốc vẫn nằm trong localStorage.
- `getProducts()` trả về một mảng mới được `JSON.parse` từ localStorage. Mảng này không tự ghi ngược lại.
- `renderTable` chỉ đọc mảng và tạo HTML.
- Muốn dữ liệu đổi, phải gọi `saveProducts` ở một chức năng khác, rồi gọi lại `renderTable`.

---

## 3. Luồng thêm sản phẩm

### 3.1. Sơ đồ đi

```text
Người dùng bấm #add-product-btn
│
├─ Sự kiện click                          [admin-sanpham.js dòng 145]
│   └─ openDialog("")                     [dòng 146]
│       ├─ form.reset()                   [dòng 106]
│       ├─ #product-id = ""               [dòng 108]
│       ├─ #product-stock = "20"          [dòng 109]
│       ├─ tiêu đề = "Thêm sản phẩm"      [dòng 110]
│       └─ dialog.showModal()             [dòng 136]
│
├─ Người dùng nhập form và bấm lưu
│
├─ Sự kiện submit                         [dòng 152]
│   ├─ event.preventDefault()             [dòng 153]
│   ├─ đọc các ô nhập                     [dòng 155–163]
│   ├─ kiểm tra tên/ảnh/giá/tồn kho       [dòng 165–178]
│   ├─ getProducts()                      [dòng 180]
│   ├─ products.push({...})               [dòng 183–196]
│   │   └─ nextId(products)               [dòng 184]
│   ├─ addActivity(...)                   [dòng 198]
│   ├─ saveProducts(products)             [dòng 221]
│   │   └─ saveStorage(PRODUCTS_KEY, ...) [admin-data.js dòng 136]
│   │       ├─ JSON.stringify(...)        [dòng 34]
│   │       └─ localStorage.setItem(...)  [dòng 34]
│   ├─ closeDialog()                      [dòng 222]
│   │   ├─ dialog.close()                 [dòng 141]
│   │   └─ form.reset()                   [dòng 142]
│   └─ renderTable()                      [dòng 223]
│       ├─ getProducts()                  [dòng 27]
│       │   └─ readStorage(...)           [admin-data.js dòng 130]
│       └─ filter → map → innerHTML
```

### 3.2. `openDialog` — dòng 105–137, giải thích từng dòng

**Tác dụng:** Mở hộp thoại sản phẩm. Nếu `id` rỗng thì chuẩn bị form trống để thêm mới; nếu có `id` thì tìm sản phẩm và điền sẵn dữ liệu để sửa.

```js
105     function openDialog(id) {
106         form.reset();
107
108         document.getElementById("product-id").value = "";
109         document.getElementById("product-stock").value = "20";
110         dialogTitle.textContent = "Thêm sản phẩm";
111
112         if (id !== "") {
113             const product = getProducts().find(function (item) {
114                 return String(item.id) === String(id);
115             });
116
117             if (!product) {
118                 alert("Không tìm thấy sản phẩm cần sửa.");
119                 return;
120             }
121
122             document.getElementById("product-id").value = product.id;
123             document.getElementById("product-name").value = product.name;
124             document.getElementById("product-category").value = product.category || "son";
125             document.getElementById("product-price").value = product.price;
126             document.getElementById("product-stock").value =
127                 product.stock !== undefined ? product.stock : 20;
128             document.getElementById("product-image").value = product.img;
129             document.getElementById("product-description").value =
130                 product.description || "";
131             document.getElementById("product-badge").value = product.badge || "";
132
133             dialogTitle.textContent = "Sửa sản phẩm";
134         }
135
136         dialog.showModal();
137     }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 105 | Khai báo hàm nhận `id`. Id rỗng là thêm mới, id có giá trị là sửa. |
| 106 | Xóa sạch form để không còn dữ liệu lần trước. |
| 108 | Xóa ô id ẩn. |
| 109 | Đặt tồn kho mặc định là 20. |
| 110 | Đặt tiêu đề "Thêm sản phẩm". |
| 112 | Kiểm tra có id hay không. |
| 113 | Nếu có id, gọi `getProducts()` rồi `find` để tìm sản phẩm. |
| 114 | So sánh id dạng chuỗi để tránh lỗi số và chuỗi. |
| 117 | Nếu không tìm thấy. |
| 118 | Báo lỗi. |
| 119 | Dừng hàm. |
| 122 | Ghi id vào ô ẩn. |
| 123 | Điền tên. |
| 124 | Điền danh mục, mặc định `son`. |
| 125 | Điền giá. |
| 126–127 | Điền tồn kho; nếu chưa có thì 20. |
| 128 | Điền đường dẫn ảnh. |
| 129–130 | Điền mô tả. |
| 131 | Điền nhãn. |
| 133 | Đổi tiêu đề thành "Sửa sản phẩm". |
| 136 | Mở hộp thoại. |
| 137 | Kết thúc hàm. |

### 3.3. Sự kiện submit — dòng 152–225, giải thích từng dòng

**Tác dụng:** Xử lý khi người dùng bấm Lưu: đọc các ô trong form, kiểm tra dữ liệu, thêm sản phẩm mới hoặc cập nhật sản phẩm đang sửa, ghi vào localStorage rồi vẽ lại bảng.

```js
152     form.addEventListener("submit", function (event) {
153         event.preventDefault();
154
155         const id = document.getElementById("product-id").value;
156         const name = document.getElementById("product-name").value.trim();
157         const category = document.getElementById("product-category").value;
158         const price = Number(document.getElementById("product-price").value);
159         const stock = Number(document.getElementById("product-stock").value);
160         const image = document.getElementById("product-image").value.trim();
161         const description =
162             document.getElementById("product-description").value.trim();
163         const badge = document.getElementById("product-badge").value.trim();
164
165         if (name === "" || image === "") {
166             alert("Vui lòng nhập tên và đường dẫn hình ảnh sản phẩm.");
167             return;
168         }
169
170         if (isNaN(price) || price < 0) {
171             alert("Giá bán phải là số không âm.");
172             return;
173         }
174
175         if (isNaN(stock) || stock < 0) {
176             alert("Số lượng tồn kho phải là số không âm.");
177             return;
178         }
179
180         const products = getProducts();
181
182         if (id === "") {
183             products.push({
184                 id: nextId(products),
185                 name: name,
186                 category: category,
187                 categoryName: CATEGORY_NAMES[category],
188                 price: price,
189                 stock: stock,
190                 stars: "★★★★★",
191                 reviews: 50,
192                 img: image,
193                 description: description,
194                 badge: badge,
195                 badgeClass: "new"
196             });
197
198             addActivity('Thêm sản phẩm "' + name + '"');
199         } else {
200             const product = products.find(function (item) {
201                 return String(item.id) === String(id);
202             });
203
204             if (!product) {
205                 alert("Không tìm thấy sản phẩm cần sửa.");
206                 return;
207             }
208
209             product.name = name;
210             product.category = category;
211             product.categoryName = CATEGORY_NAMES[category];
212             product.price = price;
213             product.stock = stock;
214             product.img = image;
215             product.description = description;
216             product.badge = badge;
217
218             addActivity('Cập nhật sản phẩm "' + name + '"');
219         }
220
221         if (saveProducts(products)) {
222             closeDialog();
223             renderTable();
224         }
225     });
```

| Dòng | Việc xảy ra |
| --- | --- |
| 152 | Gắn sự kiện submit cho form. |
| 153 | Chặn hành vi mặc định của form là tải lại trang. |
| 155 | Đọc id từ ô ẩn. |
| 156 | Đọc tên, bỏ khoảng trắng hai đầu. |
| 157 | Đọc danh mục. |
| 158 | Đọc giá và đổi sang số. |
| 159 | Đọc tồn kho và đổi sang số. |
| 160 | Đọc đường dẫn ảnh. |
| 161–162 | Đọc mô tả. |
| 163 | Đọc nhãn. |
| 165 | Kiểm tra tên hoặc ảnh rỗng. |
| 166 | Báo lỗi. |
| 167 | Dừng xử lý, không lưu. |
| 170 | Kiểm tra giá không phải số hoặc âm. |
| 171 | Báo lỗi. |
| 172 | Dừng xử lý. |
| 175 | Kiểm tra tồn kho không phải số hoặc âm. |
| 176 | Báo lỗi. |
| 177 | Dừng xử lý. |
| 180 | Lấy mảng sản phẩm hiện tại. |
| 182 | Kiểm tra id rỗng để biết là thêm mới. |
| 183 | Thêm object sản phẩm mới vào cuối mảng. |
| 184 | Gọi `nextId(products)` để tạo id lớn hơn id lớn nhất. |
| 185–195 | Gán các trường của sản phẩm mới. |
| 187 | Lấy tên danh mục từ `CATEGORY_NAMES`. |
| 190–191 | Gán sao và số đánh giá mặc định. |
| 195 | Gán class nhãn là `new`. |
| 198 | Ghi hoạt động "Thêm sản phẩm". |
| 199 | Nếu id khác rỗng, chuyển sang nhánh sửa. |
| 200 | Tìm sản phẩm cần sửa. |
| 204 | Nếu không tìm thấy. |
| 205 | Báo lỗi. |
| 206 | Dừng xử lý. |
| 209–216 | Gán lại từng trường của sản phẩm. |
| 218 | Ghi hoạt động "Cập nhật sản phẩm". |
| 221 | Gọi `saveProducts(products)`. |
| 222 | Nếu lưu thành công, đóng hộp thoại. |
| 223 | Gọi `renderTable()` để vẽ lại bảng. |
| 225 | Kết thúc hàm xử lý submit. |

### 3.4. Các hàm phụ trong luồng thêm

`nextId` đã giải thích ở mục 1.8.
`addActivity` đã giải thích ở mục 1.8.
`saveProducts` và `saveStorage` đã giải thích ở mục 1.3 và 1.7.
`closeDialog` — dòng 140–143:

**Tác dụng:** Đóng hộp thoại sản phẩm và xóa sạch form để lần mở sau không còn dữ liệu cũ.

```js
140     function closeDialog() {
141         dialog.close();
142         form.reset();
143     }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 140 | Khai báo hàm đóng hộp thoại. |
| 141 | Đóng hộp thoại. |
| 142 | Xóa sạch form. |
| 143 | Kết thúc hàm. |

### 3.5. Ví dụ chạy thật

Người dùng thêm sản phẩm:

```text
Tên: Son test
Danh mục: son
Giá: 100000
Tồn kho: 5
Ảnh: ../img/son-test.jpg
Mô tả: Son thử nghiệm
Nhãn: Mới
```

Thứ tự dữ liệu:

1. `openDialog("")` mở form trống, tồn kho mặc định 20.
2. Người dùng nhập và bấm lưu.
3. Submit đọc được `id = ""`.
4. `getProducts()` trả mảng cũ, giả sử có 2 sản phẩm.
5. `nextId` thấy id lớn nhất là 2, trả 3.
6. `products.push` thêm sản phẩm id 3.
7. `addActivity` ghi lịch sử.
8. `saveProducts` ghi cả mảng 3 sản phẩm vào localStorage.
9. `closeDialog` đóng form.
10. `renderTable` đọc lại mảng 3 sản phẩm và vẽ bảng 3 dòng.

---

## 4. Luồng sửa sản phẩm

### 4.1. Sơ đồ đi

```text
Người dùng bấm nút "Sửa"
│
├─ Sự kiện click trên tableBody           [admin-sanpham.js dòng 230]
│   ├─ closest("button[data-action]")     [dòng 231]
│   ├─ id = button.dataset.id             [dòng 237]
│   ├─ data-action === "edit"             [dòng 239]
│   └─ openDialog(id)                     [dòng 240]
│       ├─ form.reset()                   [dòng 106]
│       ├─ getProducts().find(...)        [dòng 113]
│       ├─ điền dữ liệu vào form          [dòng 122–131]
│       ├─ tiêu đề = "Sửa sản phẩm"       [dòng 133]
│       └─ dialog.showModal()             [dòng 136]
│
├─ Người dùng sửa form và bấm lưu
│
└─ Sự kiện submit                         [dòng 152]
    ├─ preventDefault                     [dòng 153]
    ├─ đọc ô nhập                        [dòng 155–163]
    ├─ kiểm tra                           [dòng 165–178]
    ├─ getProducts()                      [dòng 180]
    ├─ id !== "" → nhánh sửa             [dòng 199]
    │   ├─ products.find(...)             [dòng 200]
    │   ├─ gán lại các trường             [dòng 209–216]
    │   └─ addActivity(...)               [dòng 218]
    ├─ saveProducts(products)             [dòng 221]
    ├─ closeDialog()                      [dòng 222]
    └─ renderTable()                      [dòng 223]
```

### 4.2. Sự kiện click bảng — dòng 230–265, giải thích từng dòng

**Tác dụng:** Một listener chung cho cả bảng: đọc `data-action` để biết bấm Sửa hay Xóa, đọc `data-id` để biết thao tác trên sản phẩm nào, rồi gọi `openDialog` hoặc xóa sản phẩm.

```js
230     tableBody.addEventListener("click", function (event) {
231         const button = event.target.closest("button[data-action]");
232
233         if (!button) {
234             return;
235         }
236
237         const id = button.dataset.id;
238
239         if (button.dataset.action === "edit") {
240             openDialog(id);
241             return;
242         }
243
244         const products = getProducts();
245         const product = products.find(function (item) {
246             return String(item.id) === String(id);
247         });
248
249         if (!product) {
250             return;
251         }
252
253         if (!confirm('Bạn có chắc muốn xóa sản phẩm "' + product.name + '"?')) {
254             return;
255         }
256
257         const remaining = products.filter(function (item) {
258             return String(item.id) !== String(id);
259         });
260
261         if (saveProducts(remaining)) {
262             addActivity('Xóa sản phẩm "' + product.name + '"');
263             renderTable();
264         }
265     });
```

| Dòng | Việc xảy ra |
| --- | --- |
| 230 | Gắn sự kiện click cho phần thân bảng. |
| 231 | Tìm nút gần nhất có thuộc tính `data-action`. |
| 233 | Nếu click không trúng nút. |
| 234 | Dừng xử lý. |
| 237 | Lấy id từ `data-id`. |
| 239 | Kiểm tra nút là Sửa. |
| 240 | Gọi `openDialog(id)`. |
| 241 | Dừng xử lý sau khi mở form sửa. |
| 244 | Nếu không phải Sửa, lấy mảng sản phẩm để xử lý Xóa. |
| 245 | Tìm sản phẩm theo id. |
| 249 | Nếu không tìm thấy. |
| 250 | Dừng xử lý. |
| 253 | Hỏi xác nhận xóa. |
| 254 | Nếu người dùng bấm Hủy, dừng xử lý. |
| 257 | Tạo mảng mới chỉ gồm sản phẩm có id khác id cần xóa. |
| 261 | Gọi `saveProducts(remaining)`. |
| 262 | Nếu lưu thành công, ghi hoạt động xóa. |
| 263 | Gọi `renderTable()` để vẽ lại bảng. |
| 265 | Kết thúc hàm xử lý click. |

### 4.3. Nhánh sửa trong submit — dòng 199–219

**Tác dụng:** Phần xử lý khi ô id ẩn có giá trị: tìm đúng object sản phẩm trong mảng và gán lại các trường bằng dữ liệu mới từ form, thay vì thêm phần tử mới.

| Dòng | Việc xảy ra |
| --- | --- |
| 199 | Vì id khác rỗng, chạy nhánh sửa. |
| 200 | Gọi `products.find` để tìm đúng object sản phẩm. |
| 201 | So sánh id dạng chuỗi. |
| 204 | Nếu không tìm thấy. |
| 205 | Báo lỗi. |
| 206 | Dừng xử lý. |
| 209 | Gán tên mới. |
| 210 | Gán danh mục mới. |
| 211 | Gán lại tên danh mục. |
| 212 | Gán giá mới. |
| 213 | Gán tồn kho mới. |
| 214 | Gán ảnh mới. |
| 215 | Gán mô tả mới. |
| 216 | Gán nhãn mới. |
| 218 | Ghi hoạt động cập nhật. |

Điểm quan trọng: `find` trả về đúng object nằm trong mảng `products`. Gán `product.name = ...` là sửa trực tiếp object đó. Không cần thay object trong mảng.

### 4.4. Ví dụ chạy thật

1. Bấm Sửa ở sản phẩm id 2.
2. Click handler lấy `id = "2"`.
3. `openDialog("2")` gọi `getProducts()` và `find` ra sản phẩm id 2.
4. Form được điền tên, danh mục, giá, tồn kho, ảnh, mô tả, nhãn.
5. Người dùng đổi giá từ 350000 thành 400000.
6. Submit đọc `id = "2"`, `price = 400000`.
7. `getProducts()` trả mảng cũ.
8. `find` trả object id 2.
9. Gán `product.price = 400000`.
10. `saveProducts` ghi cả mảng đã sửa vào localStorage.
11. `renderTable` đọc lại và vẽ giá mới.

---

## 5. Luồng xóa sản phẩm

### 5.1. Sơ đồ đi

```text
Người dùng bấm nút "Xóa"
│
├─ Sự kiện click trên tableBody           [admin-sanpham.js dòng 230]
│   ├─ closest("button[data-action]")     [dòng 231]
│   ├─ id = button.dataset.id             [dòng 237]
│   ├─ data-action không phải "edit"
│   ├─ getProducts()                      [dòng 244]
│   ├─ products.find(...)                 [dòng 245]
│   ├─ confirm(...)                       [dòng 253]
│   ├─ products.filter(...)               [dòng 257]
│   ├─ saveProducts(remaining)            [dòng 261]
│   ├─ addActivity(...)                   [dòng 262]
│   └─ renderTable()                      [dòng 263]
```

### 5.2. Giải thích từng dòng

**Tác dụng:** Phần xử lý khi `data-action` không phải `"edit"`: hỏi xác nhận, tạo mảng mới không chứa sản phẩm cần xóa bằng `filter`, lưu mảng mới và vẽ lại bảng.

Các dòng 230–250 giống luồng sửa. Phần khác biệt bắt đầu từ dòng 253.

| Dòng | Việc xảy ra |
| --- | --- |
| 253 | Gọi `confirm` để hỏi người dùng có chắc xóa không. |
| 254 | Nếu bấm Hủy, dừng xử lý. |
| 257 | Gọi `filter` để giữ lại các sản phẩm có id khác id cần xóa. |
| 258 | So sánh id dạng chuỗi. |
| 261 | Gọi `saveProducts(remaining)` ghi mảng mới. |
| 262 | Nếu lưu thành công, ghi hoạt động xóa. |
| 263 | Gọi `renderTable()` vẽ lại bảng. |

### 5.3. Ví dụ chạy thật

1. Bảng có 3 sản phẩm id 1, 2, 3.
2. Bấm Xóa ở sản phẩm id 2.
3. `confirm` hiện hộp thoại. Bấm OK.
4. `filter` tạo mảng mới gồm id 1 và 3.
5. `saveProducts` ghi mảng 2 sản phẩm vào localStorage.
6. `renderTable` đọc lại và vẽ bảng 2 dòng.

---

## 6. Luồng render người dùng

### 6.1. Sơ đồ đầy đủ

```text
Mở ADMIN/PAGES/nguoidung.html
│
├─ admin-data.js khai báo hàm
│
├─ admin-nguoidung.js
│   └─ initUsers()                              [dòng 264]
│       ├─ await prepareAdminData()             [dòng 3]
│       │   ├─ readStorage(USERS_KEY, null)     [admin-data.js dòng 119]
│       │   ├─ fetchJSON("users.json")          [dòng 120]
│       │   └─ saveStorage(USERS_KEY, users)    [dòng 123]
│       ├─ getElementById("user-table-body")    [dòng 5]
│       ├─ lấy các phần tử HTML                 [dòng 11–21]
│       ├─ gắn sự kiện                          [dòng 135–213]
│       └─ renderTable()                        [dòng 261]
│           ├─ getUsers()                       [dòng 27]
│           │   └─ readStorage("julie_users")   [admin-data.js dòng 141]
│           ├─ users.filter(...)                [dòng 29]
│           ├─ filtered.map(...)                [dòng 46]
│           │   └─ escapeHTML(...)              [dòng 47–51]
│           ├─ join("")                         [dòng 77]
│           ├─ tableBody.innerHTML = ...        [dòng 46]
│           ├─ users.forEach(...)               [dòng 83]
│           └─ textContent = ...                [dòng 93–95]
```

### 6.2. `initUsers` — dòng 2–264, giải thích theo đoạn

**Tác dụng:** Hàm khởi động của trang Người dùng: chờ dữ liệu, lấy các phần tử HTML, khai báo các hàm con, gắn sự kiện và gọi `renderTable()` lần đầu.

| Dòng | Việc xảy ra |
| --- | --- |
| 2 | Khai báo hàm `async function initUsers()`. |
| 3 | Chờ `prepareAdminData()` nạp dữ liệu. |
| 5 | Lấy phần thân bảng người dùng. |
| 7–9 | Nếu không có bảng, dừng hàm. |
| 11 | Lấy hộp thoại người dùng. |
| 12 | Lấy form người dùng. |
| 13 | Lấy tiêu đề hộp thoại. |
| 15 | Lấy ô tìm kiếm. |
| 16 | Lấy bộ lọc vai trò. |
| 17 | Lấy thông báo rỗng. |
| 19–21 | Lấy ba ô thống kê. |
| 24–96 | Khai báo `renderTable`. |
| 99–127 | Khai báo `openDialog`. |
| 130–133 | Khai báo `closeDialog`. |
| 135–137 | Gắn sự kiện nút thêm. |
| 139–140 | Gắn sự kiện đóng/hủy. |
| 143 | Gắn sự kiện submit. |
| 210–211 | Gắn sự kiện tìm/lọc. |
| 213 | Gắn sự kiện click bảng. |
| 261 | Gọi `renderTable()` lần đầu. |
| 264 | Gọi `initUsers()`. |

### 6.3. `renderTable` — dòng 24–96, giải thích từng dòng

**Tác dụng:** Đọc người dùng từ `getUsers()`, lọc theo từ khóa (tên, tài khoản, email) và vai trò, vẽ bảng, rồi cập nhật ba ô thống kê (tổng tài khoản, số admin, số đang hoạt động).

```js
24     function renderTable() {
25         const keyword = searchInput.value.trim().toLowerCase();
26         const role = roleFilter.value;
27         const users = getUsers();
28
29         const filtered = users.filter(function (user) {
30             const matchKeyword =
31                 String(user.name).toLowerCase().includes(keyword) ||
32                 String(user.username).toLowerCase().includes(keyword) ||
33                 String(user.email).toLowerCase().includes(keyword);
34
35             const matchRole = role === "all" || user.role === role;
36
37             return matchKeyword && matchRole;
38         });
39
40         if (filtered.length === 0) {
41             tableBody.innerHTML = "";
42             emptyMessage.hidden = false;
43         } else {
44             emptyMessage.hidden = true;
45
46             tableBody.innerHTML = filtered.map(function (user) {
47                 const id = escapeHTML(user.id);
48                 const name = escapeHTML(user.name);
49                 const phone = escapeHTML(user.phone || "Chưa có SĐT");
50                 const username = escapeHTML(user.username);
51                 const email = escapeHTML(user.email);
52
53                 return (
54                     "<tr>" +
55                         "<td>" +
56                             "<strong>" + name + "</strong><br>" +
57                             '<span style="font-size:12px;color:#817681;">' +
58                                 phone +
59                             "</span>" +
60                         "</td>" +
61                         "<td>" + username + "</td>" +
62                         "<td>" + email + "</td>" +
63                         "<td>" + (user.role === "admin"
64                             ? "Quản trị viên"
65                             : "Khách hàng") + "</td>" +
66                         "<td>" + (user.status === "locked"
67                             ? "Đã khóa"
68                             : "Đang hoạt động") + "</td>" +
69                         "<td>" +
70                             '<button class="small" type="button" data-action="edit"' +
71                                 ' data-id="' + id + '">Sửa</button> ' +
72                             '<button class="small" type="button" data-action="delete"' +
73                                 ' data-id="' + id + '">Xóa</button>' +
74                         "</td>" +
75                     "</tr>"
76                 );
77             }).join("");
78         }
79
80         let adminCount = 0;
81         let activeCount = 0;
82
83         users.forEach(function (user) {
84             if (user.role === "admin") {
85                 adminCount += 1;
86             }
87
88             if (user.status === "active") {
89                 activeCount += 1;
90             }
91         });
92
93         totalUsers.textContent = users.length;
94         totalAdmins.textContent = adminCount;
95         totalActive.textContent = activeCount;
96     }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 24 | Khai báo `renderTable`. |
| 25 | Lấy từ khóa tìm kiếm, trim, chữ thường. |
| 26 | Lấy vai trò từ bộ lọc. |
| 27 | Gọi `getUsers()`. |
| 29 | Gọi `filter`. |
| 30–33 | So từ khóa với tên, tài khoản và email. |
| 35 | So vai trò, hoặc giữ tất cả nếu bộ lọc là `all`. |
| 37 | Giữ người dùng đúng cả từ khóa và vai trò. |
| 40 | Kiểm tra danh sách rỗng. |
| 41 | Xóa nội dung bảng. |
| 42 | Hiện thông báo rỗng. |
| 44 | Ẩn thông báo rỗng khi có dữ liệu. |
| 46 | Gán `innerHTML` bằng kết quả `map`. |
| 47–51 | Escape id, tên, điện thoại, tài khoản, email. |
| 49 | Nếu không có điện thoại, hiện "Chưa có SĐT". |
| 53–76 | Tạo chuỗi HTML cho một dòng. |
| 63–65 | Đổi `role` thành chữ hiển thị. |
| 66–68 | Đổi `status` thành chữ hiển thị. |
| 70–73 | Tạo nút Sửa/Xóa với `data-action` và `data-id`. |
| 77 | Nối các dòng bằng `join("")`. |
| 80–81 | Tạo biến đếm admin và tài khoản hoạt động. |
| 83 | Duyệt toàn bộ người dùng. |
| 84–86 | Nếu là admin thì tăng `adminCount`. |
| 88–90 | Nếu trạng thái là `active` thì tăng `activeCount`. |
| 93 | Ghi tổng người dùng. |
| 94 | Ghi tổng admin. |
| 95 | Ghi tổng tài khoản hoạt động. |
| 96 | Kết thúc hàm. |

### 6.4. Thêm, sửa, xóa người dùng — thứ tự chính

**Tác dụng:** Ba chuỗi dưới đây cho thấy thứ tự hàm chạy cho từng thao tác, để so sánh với sản phẩm và thấy hai quy tắc riêng của người dùng.

Thêm người dùng:

```text
click #add-user-btn
→ openDialog("")                    [dòng 136]
→ form.reset / id rỗng / showModal  [dòng 100–126]
→ submit                            [dòng 143]
→ preventDefault                    [dòng 144]
→ đọc ô nhập                        [dòng 146–152]
→ kiểm tra rỗng                     [dòng 154]
→ getUsers()                        [dòng 159]
→ kiểm tra trùng tài khoản          [dòng 161–169]
→ users.push({...})                 [dòng 172]
→ nextId(users)                     [dòng 173]
→ addActivity                       [dòng 183]
→ saveUsers(users)                  [dòng 204]
→ closeDialog                       [dòng 205]
→ renderTable                       [dòng 206]
```

Sửa người dùng:

```text
click nút Sửa
→ closest + data-id                 [dòng 213–220]
→ openDialog(id)                    [dòng 223]
→ getUsers().find                   [dòng 106]
→ điền form                         [dòng 115–121]
→ submit                            [dòng 143]
→ kiểm tra rỗng/trùng               [dòng 154–169]
→ users.find                        [dòng 185]
→ gán lại trường                    [dòng 194–199]
→ addActivity                       [dòng 201]
→ saveUsers                         [dòng 204]
→ closeDialog                       [dòng 205]
→ renderTable                       [dòng 206]
```

Xóa người dùng:

```text
click nút Xóa
→ closest + data-id                 [dòng 213–220]
→ getUsers()                        [dòng 227]
→ users.find                        [dòng 228]
→ nếu là admin, đếm admin           [dòng 236–239]
→ nếu admin cuối, chặn xóa          [dòng 241–244]
→ confirm                           [dòng 247]
→ filter bỏ người dùng              [dòng 251]
→ saveUsers(remaining)              [dòng 255]
→ addActivity                       [dòng 256]
→ renderTable                       [dòng 257]
```

Điểm khác biệt so với sản phẩm:

- Có kiểm tra trùng `username` trước khi thêm hoặc sửa.
- Khi kiểm tra trùng, bỏ qua chính id đang sửa để không báo trùng với chính mình.
- Có kiểm tra không cho xóa admin cuối cùng.

---

## 7. Luồng render đơn hàng

### 7.1. Nguồn dữ liệu đặc biệt

Đơn hàng không có file JSON trong thư mục `data/`. Đơn hàng do USER tạo ra.

Trong `USER/JS/giohang.js`:

```text
Người dùng bấm "Xác nhận đặt hàng"
→ sự kiện submit của #order-form       [dòng 199]
→ đọc giỏ hàng, tính tiền, tạo mã đơn  [dòng 204–220]
→ emailjs.sendForm(...)                [dòng 241]
→ .then(...)                           [dòng 242]
    → tạo object order                 [dòng 243–251]
    → đọc mảng "orders" trong localStorage [dòng 253]
    → push order vào mảng              [dòng 254]
    → ghi lại mảng vào "orders"        [dòng 255]
    → saveCart([]) xóa giỏ hàng        [dòng 257]
```

Object đơn hàng có dạng:

```text
{
    id,
    customer: {
        name,
        phone,
        email,
        address,
        note
    },
    products: [
        { id, name, price, img, quantity }
    ],
    subtotal,
    shipping,
    total,
    orderDate
}
```

Trong `ADMIN/JS/admin-data.js` dòng 4, `ORDERS_KEY` là `"orders"`. Vì vậy Admin đọc đúng mảng mà USER đã ghi.

### 7.2. Sơ đồ đầy đủ

```text
Mở ADMIN/PAGES/donhang.html
│
├─ admin-data.js khai báo hàm
│
├─ admin-donhang.js
│   └─ initOrders()                            [dòng 239]
│       ├─ await prepareAdminData()            [dòng 3]
│       ├─ getElementById("order-list")        [dòng 5]
│       ├─ lấy các phần tử HTML                [dòng 11–16]
│       ├─ khai báo STATUS_LIST                [dòng 18–24]
│       ├─ khai báo getCustomerName, getOrderDate,
│       │   renderOrders, showOrderDetail
│       ├─ gắn sự kiện                         [dòng 192–234]
│       └─ renderOrders()                      [dòng 236]
│           ├─ getOrders()                     [dòng 42]
│           │   └─ readStorage("orders", [])   [admin-data.js dòng 152]
│           │       ├─ localStorage.getItem    [dòng 24]
│           │       └─ JSON.parse              [dòng 25]
│           ├─ allOrders.forEach(...)          [dòng 50]
│           ├─ ghi 4 ô thống kê               [dòng 64–67]
│           ├─ allOrders.filter(...)           [dòng 69]
│           ├─ orders.map(...)                 [dòng 85]
│           │   ├─ escapeHTML(order.id)        [dòng 86]
│           │   ├─ order.status || "Chờ xác nhận" [dòng 87]
│           │   ├─ STATUS_LIST.forEach         [dòng 90]
│           │   ├─ getCustomerName(order)      [dòng 102]
│           │   ├─ getOrderDate(order)         [dòng 103]
│           │   ├─ getOrderTotal(order)        [dòng 104]
│           │   ├─ formatDate(...)             [dòng 103]
│           │   └─ formatMoney(...)            [dòng 104]
│           └─ tableBody.innerHTML = ...       [dòng 85]
│
└─ admin.js
    └─ initDashboard()                         [dòng 100]
        └─ báo lỗi vì không có #tongquan       [dòng 31]
```

### 7.3. `initOrders` — dòng 2–239, giải thích theo đoạn

**Tác dụng:** Hàm khởi động của trang Đơn hàng: chờ dữ liệu, lấy phần tử HTML, khai báo danh sách trạng thái và các hàm con, gắn sự kiện rồi gọi `renderOrders()` lần đầu.

| Dòng | Việc xảy ra |
| --- | --- |
| 2 | Khai báo hàm `async function initOrders()`. |
| 3 | Chờ `prepareAdminData()`. |
| 5 | Lấy phần thân bảng đơn hàng. |
| 7–9 | Nếu không có bảng, dừng hàm. |
| 11 | Lấy ô tìm kiếm. |
| 12 | Lấy bộ lọc trạng thái. |
| 13 | Lấy thông báo rỗng. |
| 15 | Lấy hộp thoại chi tiết. |
| 16 | Lấy vùng nội dung chi tiết. |
| 18–24 | Khai báo danh sách 5 trạng thái. |
| 27–33 | Khai báo `getCustomerName`. |
| 36–38 | Khai báo `getOrderDate`. |
| 41–118 | Khai báo `renderOrders`. |
| 121–190 | Khai báo `showOrderDetail`. |
| 192 | Gắn sự kiện input cho ô tìm kiếm. |
| 193 | Gắn sự kiện change cho bộ lọc. |
| 195 | Gắn sự kiện change cho bảng để đổi trạng thái. |
| 222 | Gắn sự kiện click cho bảng để xem chi tiết. |
| 232–234 | Gắn sự kiện đóng hộp thoại. |
| 236 | Gọi `renderOrders()` lần đầu. |
| 239 | Gọi `initOrders()`. |

### 7.4. `renderOrders` — dòng 41–118, giải thích từng dòng

**Tác dụng:** Đọc đơn hàng từ `getOrders()`, đếm số đơn theo trạng thái, lọc theo từ khóa và trạng thái, rồi vẽ bảng đơn hàng kèm select đổi trạng thái và nút Xem.

```js
41     function renderOrders() {
42         const allOrders = getOrders();
43         const keyword = searchInput.value.trim().toLowerCase();
44         const status = statusFilter.value;
45
46         let pending = 0;
47         let shipping = 0;
48         let completed = 0;
49
50         allOrders.forEach(function (order) {
51             if (order.status === "Chờ xác nhận") {
52                 pending += 1;
53             }
54
55             if (order.status === "Đang giao") {
56                 shipping += 1;
57             }
58
59             if (order.status === "Đã giao") {
60                 completed += 1;
61             }
62         });
63
64         document.getElementById("total-orders").textContent = allOrders.length;
65         document.getElementById("pending-orders").textContent = pending;
66         document.getElementById("shipping-orders").textContent = shipping;
67         document.getElementById("completed-orders").textContent = completed;
68
69         const orders = allOrders.filter(function (order) {
70             const matchKeyword =
71                 String(order.id).toLowerCase().includes(keyword) ||
72                 String(getCustomerName(order)).toLowerCase().includes(keyword);
73
74             const matchStatus = status === "all" || order.status === status;
75
76             return matchKeyword && matchStatus;
77         });
78
79         if (orders.length === 0) {
80             tableBody.innerHTML = "";
81             emptyOrders.hidden = false;
82         } else {
83             emptyOrders.hidden = true;
84
85             tableBody.innerHTML = orders.map(function (order) {
86                 const id = escapeHTML(order.id);
87                 const currentStatus = order.status || "Chờ xác nhận";
88                 let options = "";
89
90                 STATUS_LIST.forEach(function (item) {
91                     const selected = item === currentStatus ? " selected" : "";
92
93                     options +=
94                         '<option value="' + escapeHTML(item) + '"' + selected + ">" +
95                             escapeHTML(item) +
96                         "</option>";
97                 });
98
99                 return (
100                     "<tr>" +
101                         "<td>" + id + "</td>" +
102                         "<td>" + escapeHTML(getCustomerName(order)) + "</td>" +
103                         "<td>" + escapeHTML(formatDate(getOrderDate(order))) + "</td>" +
104                         "<td>" + formatMoney(getOrderTotal(order)) + "</td>" +
105                         "<td>" +
106                             '<select class="order-status-select" data-id="' + id + '">' +
107                                 options +
108                             "</select>" +
109                         "</td>" +
110                         "<td>" +
111                             '<button class="btn-detail" type="button" data-action="detail"' +
112                                 ' data-id="' + id + '">Xem</button>' +
113                         "</td>" +
114                     "</tr>"
115                 );
116             }).join("");
117         }
118     }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 41 | Khai báo `renderOrders`. |
| 42 | Gọi `getOrders()` lấy toàn bộ đơn. |
| 43 | Lấy từ khóa tìm kiếm, trim, chữ thường. |
| 44 | Lấy trạng thái từ bộ lọc. |
| 46–48 | Tạo ba biến đếm. |
| 50 | Duyệt toàn bộ đơn. |
| 51–53 | Đơn "Chờ xác nhận" thì tăng `pending`. |
| 55–57 | Đơn "Đang giao" thì tăng `shipping`. |
| 59–61 | Đơn "Đã giao" thì tăng `completed`. |
| 64 | Ghi tổng số đơn. |
| 65 | Ghi số đơn chờ xác nhận. |
| 66 | Ghi số đơn đang giao. |
| 67 | Ghi số đơn đã giao. |
| 69 | Gọi `filter` để lọc đơn. |
| 70–72 | So mã đơn hoặc tên khách với từ khóa. |
| 74 | So trạng thái, hoặc giữ tất cả nếu bộ lọc là `all`. |
| 76 | Giữ đơn đúng cả từ khóa và trạng thái. |
| 79 | Kiểm tra danh sách rỗng. |
| 80 | Xóa nội dung bảng. |
| 81 | Hiện thông báo rỗng. |
| 83 | Ẩn thông báo rỗng khi có dữ liệu. |
| 85 | Gán `innerHTML` bằng kết quả `map`. |
| 86 | Lấy id đơn và escape. |
| 87 | Lấy trạng thái hiện tại; nếu chưa có thì "Chờ xác nhận". |
| 88 | Tạo chuỗi chứa các option. |
| 90 | Duyệt danh sách trạng thái. |
| 91 | Đánh dấu `selected` cho trạng thái hiện tại. |
| 93–96 | Tạo một `<option>` cho từng trạng thái. |
| 99–114 | Tạo chuỗi HTML cho một dòng đơn. |
| 101 | Ô mã đơn. |
| 102 | Ô tên khách, lấy qua `getCustomerName`. |
| 103 | Ô ngày đặt, lấy qua `getOrderDate` rồi `formatDate`. |
| 104 | Ô tổng tiền, lấy qua `getOrderTotal` rồi `formatMoney`. |
| 106–108 | Tạo select trạng thái với `data-id`. |
| 111–112 | Tạo nút Xem với `data-action="detail"` và `data-id`. |
| 116 | Nối các dòng bằng `join("")`. |
| 118 | Kết thúc hàm. |

### 7.5. Các hàm đọc dữ liệu đơn hàng

`getCustomerName` — dòng 27–33:

**Tác dụng:** Lấy tên khách hàng từ đơn, chấp nhận cả hai kiểu dữ liệu: `order.customer` là object (đơn của USER) hoặc là chuỗi (đơn cũ).

```js
27     function getCustomerName(order) {
28         if (order.customer && typeof order.customer === "object") {
29             return order.customer.name || "Khách lẻ";
30         }
31
32         return order.customer || order.customerName || order.name || "Khách lẻ";
33     }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 27 | Khai báo hàm nhận một đơn. |
| 28 | Nếu `order.customer` tồn tại và là object. |
| 29 | Trả `order.customer.name`, nếu không có thì "Khách lẻ". |
| 32 | Nếu `customer` là chuỗi hoặc không có, thử các trường cũ. |
| 33 | Kết thúc hàm. |

`getOrderDate` — dòng 36–38:

**Tác dụng:** Lấy ngày đặt hàng theo thứ tự ưu tiên `orderDate`, `date`, `createdAt`, để dùng được với nhiều kiểu đơn khác nhau.

```js
36     function getOrderDate(order) {
37         return order.orderDate || order.date || order.createdAt || "";
38     }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 36 | Khai báo hàm. |
| 37 | Trả ngày theo thứ tự: `orderDate`, `date`, `createdAt`, chuỗi rỗng. |
| 38 | Kết thúc hàm. |

`getOrderTotal` đã giải thích ở mục 1.8.

### 7.6. Đổi trạng thái — dòng 195–220, giải thích từng dòng

**Tác dụng:** Xử lý khi người dùng chọn trạng thái khác trong select của một đơn: tìm đơn theo `data-id`, gán `status` mới, lưu lại, ghi hoạt động và vẽ lại bảng.

```js
195     tableBody.addEventListener("change", function (event) {
196         const select = event.target.closest(".order-status-select");
197
198         if (!select) {
199             return;
200         }
201
202         const orders = getOrders();
203         const order = orders.find(function (item) {
204             return String(item.id) === String(select.dataset.id);
205         });
206
207         if (!order) {
208             return;
209         }
210
211         order.status = select.value;
212
213         if (saveOrders(orders)) {
214             addActivity(
215                 'Cập nhật đơn "' + order.id + '" sang "' + order.status + '"'
216             );
217
218             renderOrders();
219         }
220     });
```

| Dòng | Việc xảy ra |
| --- | --- |
| 195 | Gắn sự kiện change cho bảng. |
| 196 | Tìm select trạng thái gần nhất. |
| 198 | Nếu không phải select trạng thái. |
| 199 | Dừng xử lý. |
| 202 | Gọi `getOrders()`. |
| 203 | Gọi `find` để tìm đơn theo id. |
| 204 | So sánh id dạng chuỗi. |
| 207 | Nếu không tìm thấy. |
| 208 | Dừng xử lý. |
| 211 | Gán trạng thái mới cho đơn. |
| 213 | Gọi `saveOrders(orders)`. |
| 214–216 | Nếu lưu thành công, ghi hoạt động. |
| 218 | Gọi `renderOrders()` để vẽ lại. |
| 220 | Kết thúc hàm. |

### 7.7. Xem chi tiết — dòng 121–190, giải thích từng dòng

**Tác dụng:** Tìm đơn theo id, lấy thông tin khách từ `order.customer`, lấy danh sách sản phẩm từ `order.products` (hoặc `order.items`), rồi đổ toàn bộ vào hộp thoại chi tiết.

```js
121     function showOrderDetail(id) {
122         const order = getOrders().find(function (item) {
123             return String(item.id) === String(id);
124         });
125
126         if (!order) {
127             alert("Không tìm thấy đơn hàng.");
128             return;
129         }
130
131         const customer = order.customer && typeof order.customer === "object"
132             ? order.customer
133             : {};
134
135         let items = [];
136
137         if (Array.isArray(order.products)) {
138             items = order.products;
139         } else if (Array.isArray(order.items)) {
140             items = order.items;
141         }
142
143         let itemsHTML = "<p>Đơn hàng chưa có chi tiết sản phẩm.</p>";
144
145         if (items.length > 0) {
146             itemsHTML =
147                 '<table class="admin-table">' +
148                     "<thead>" +
149                         "<tr>" +
150                             "<th>Sản phẩm</th>" +
151                             "<th>Đơn giá</th>" +
152                             "<th>Số lượng</th>" +
153                             "<th>Thành tiền</th>" +
154                         "</tr>" +
155                     "</thead>" +
156                     "<tbody>" +
157                         items.map(function (item) {
158                             const quantity = Number(item.quantity) || 0;
159                             const price = Number(item.price) || 0;
160
161                             return (
162                                 "<tr>" +
163                                     "<td>" + escapeHTML(item.name) + "</td>" +
164                                     "<td>" + formatMoney(price) + "</td>" +
165                                     "<td>" + quantity + "</td>" +
166                                     "<td>" + formatMoney(price * quantity) + "</td>" +
167                                 "</tr>"
168                             );
169                         }).join("") +
170                     "</tbody>" +
171                 "</table>";
172         }
173
174         orderDetail.innerHTML =
175             '<div class="order-detail-info">' +
176                 "<h3>Đơn " + escapeHTML(order.id) + "</h3>" +
177                 "<p>Khách hàng: " + escapeHTML(getCustomerName(order)) + "</p>" +
178                 "<p>Số điện thoại: " + escapeHTML(customer.phone || order.phone || "Chưa có") + "</p>" +
179                 "<p>Email: " + escapeHTML(customer.email || "Chưa có") + "</p>" +
180                 "<p>Địa chỉ: " + escapeHTML(customer.address || order.address || "Chưa có") + "</p>" +
181                 "<p>Ghi chú: " + escapeHTML(customer.note || "Không có") + "</p>" +
182                 "<p>Ngày đặt: " + escapeHTML(formatDate(getOrderDate(order))) + "</p>" +
183                 "<p>Tổng tiền: " + formatMoney(getOrderTotal(order)) + "</p>" +
184                 "<p>Trạng thái: " + escapeHTML(order.status || "Chờ xác nhận") + "</p>" +
185             "</div>" +
186             "<h3>Sản phẩm</h3>" +
187             itemsHTML;
188
189         dialog.showModal();
190     }
```

| Dòng | Việc xảy ra |
| --- | --- |
| 121 | Khai báo `showOrderDetail`. |
| 122 | Gọi `getOrders()` và `find` để tìm đơn. |
| 123 | So sánh id dạng chuỗi. |
| 126 | Nếu không tìm thấy. |
| 127 | Báo lỗi. |
| 128 | Dừng hàm. |
| 131–133 | Lấy object `customer` nếu là object; nếu không thì dùng object rỗng. |
| 135 | Bắt đầu mảng sản phẩm rỗng. |
| 137–138 | Ưu tiên `order.products`. |
| 139–140 | Nếu không có, dùng `order.items`. |
| 143 | Tạo thông báo mặc định khi không có sản phẩm. |
| 145 | Nếu có sản phẩm. |
| 146–171 | Tạo bảng sản phẩm. |
| 157 | Duyệt từng sản phẩm. |
| 158 | Đổi số lượng sang số. |
| 159 | Đổi đơn giá sang số. |
| 162–167 | Tạo một dòng sản phẩm gồm tên, giá, số lượng, thành tiền. |
| 163 | Escape tên sản phẩm. |
| 164 | Định dạng đơn giá. |
| 166 | Định dạng thành tiền `price * quantity`. |
| 169 | Nối các dòng bằng `join("")`. |
| 174 | Bắt đầu gán nội dung chi tiết. |
| 176 | Mã đơn. |
| 177 | Tên khách. |
| 178 | Số điện thoại từ `customer.phone`, dự phòng `order.phone`. |
| 179 | Email. |
| 180 | Địa chỉ từ `customer.address`, dự phòng `order.address`. |
| 181 | Ghi chú. |
| 182 | Ngày đặt. |
| 183 | Tổng tiền. |
| 184 | Trạng thái, mặc định "Chờ xác nhận". |
| 186–187 | Thêm tiêu đề và bảng sản phẩm. |
| 189 | Mở hộp thoại. |
| 190 | Kết thúc hàm. |

### 7.8. Ví dụ chạy thật

LocalStorage:

```json
[
    {
        "id": "DH1762345678901",
        "customer": {
            "name": "Nguyễn An",
            "phone": "0901234567",
            "email": "an@example.com",
            "address": "12 Lê Lợi, Quận 1",
            "note": "Giao giờ hành chính"
        },
        "products": [
            {
                "id": 1,
                "name": "Son dưỡng môi",
                "price": 150000,
                "quantity": 2
            }
        ],
        "subtotal": 300000,
        "shipping": 30000,
        "total": 330000,
        "orderDate": "10:30:00 4/11/2026"
    }
]
```

Khi mở trang Đơn hàng:

1. `getOrders()` đọc mảng 1 đơn.
2. `forEach` đếm: tổng 1, chờ xác nhận 1, đang giao 0, đã giao 0.
3. `filter` giữ đơn nếu từ khóa rỗng và bộ lọc là `all`.
4. `map` tạo một dòng:
   - Mã: `DH1762345678901`.
   - Khách: `Nguyễn An`.
   - Ngày: `10:30:00 4/11/2026`.
   - Tổng: `330.000 ₫`.
   - Select: "Chờ xác nhận".
   - Nút Xem.
5. `innerHTML` nhận chuỗi và vẽ bảng.

Khi bấm Xem:

1. Click handler lấy id đơn.
2. `showOrderDetail` tìm đơn.
3. `customer` là object.
4. `items` lấy từ `order.products`.
5. Bảng sản phẩm có 1 dòng:
   - Son dưỡng môi.
   - 150.000 ₫.
   - 2.
   - 300.000 ₫.
6. Thông tin khách hiện tên, số điện thoại, email, địa chỉ, ghi chú.
7. Tổng tiền hiện 330.000 ₫.
8. `dialog.showModal()` mở hộp thoại.

---

## 8. Luồng Tổng quan

### 8.1. Sơ đồ

```text
Mở ADMIN/PAGES/admin.html
│
├─ admin-data.js khai báo hàm
│
└─ admin.js
    └─ initDashboard()                        [dòng 100]
        ├─ await prepareAdminData()           [dòng 3]
        ├─ getProducts()                      [dòng 5]
        ├─ getUsers()                         [dòng 6]
        ├─ getOrders()                        [dòng 7]
        ├─ readStorage(CONTACT_KEY, [])       [dòng 8]
        ├─ querySelectorAll("#tongquan .card")[dòng 11]
        ├─ forEach điền số                    [dòng 11–26]
        ├─ querySelector("#tongquan .cards")  [dòng 28]
        ├─ querySelectorAll("h3")             [dòng 31]
        ├─ insertAdjacentHTML thẻ Người dùng  [dòng 38]
        ├─ Object.keys(CATEGORY_NAMES).map    [dòng 44]
        │   └─ products.forEach               [dòng 47]
        ├─ users.forEach đếm admin            [dòng 61]
        ├─ buildBarChart(...) hai lần         [dòng 69–73]
        ├─ insertAdjacentHTML biểu đồ         [dòng 67]
        ├─ readStorage(ACTIVITY_KEY, [])      [dòng 76]
        ├─ activities.slice(0, 6).forEach     [dòng 82]
        │   └─ formatDate + escapeHTML        [dòng 85–86]
        └─ panel.innerHTML                    [dòng 95]
```

### 8.2. `initDashboard` — dòng 2–98, giải thích từng đoạn

**Tác dụng:** Điền số liệu vào các thẻ tổng quan, chèn hai biểu đồ (sản phẩm theo danh mục, người dùng theo vai trò) và thay nội dung panel "Hoạt động gần đây" bằng 6 hoạt động mới nhất.

| Dòng | Việc xảy ra |
| --- | --- |
| 2 | Khai báo hàm `async function initDashboard()`. |
| 3 | Chờ `prepareAdminData()`. |
| 5 | Gọi `getProducts()`. |
| 6 | Gọi `getUsers()`. |
| 7 | Gọi `getOrders()`. |
| 8 | Gọi `readStorage(CONTACT_KEY, [])` đọc tin nhắn liên hệ. |
| 9 | Nếu dữ liệu không phải mảng thì dùng mảng rỗng. |
| 11 | Lấy tất cả thẻ trong `#tongquan`. |
| 12 | Đọc tiêu đề `<h3>` của từng thẻ. |
| 13 | Lấy phần tử `<p>` để ghi số. |
| 15–17 | Nếu tiêu đề là "Tổng đơn hàng", ghi `orders.length`. |
| 19–21 | Nếu là "Sản phẩm", ghi `products.length`. |
| 23–25 | Nếu là "Tin nhắn", ghi `contactList.length`. |
| 28 | Lấy vùng chứa các thẻ. |
| 29 | Tạo cờ `hasUserCard`. |
| 31 | Duyệt các tiêu đề trong vùng thẻ. |
| 32–34 | Nếu đã có "Người dùng", đặt cờ thành `true`. |
| 37 | Nếu chưa có thẻ Người dùng. |
| 38–41 | Chèn thêm thẻ với số lượng người dùng. |
| 44 | Lấy danh sách danh mục từ `CATEGORY_NAMES`. |
| 45 | Duyệt từng danh mục. |
| 46 | Tạo biến đếm. |
| 47 | Duyệt sản phẩm. |
| 48–50 | Nếu sản phẩm thuộc danh mục đang xét, tăng biến đếm. |
| 53–56 | Trả object nhãn và giá trị cho biểu đồ. |
| 59 | Tạo biến đếm admin. |
| 61 | Duyệt người dùng. |
| 62–64 | Nếu vai trò là admin, tăng biến đếm. |
| 67 | Chèn hai biểu đồ sau vùng thẻ. |
| 69 | Gọi `buildBarChart` cho sản phẩm theo danh mục. |
| 70–73 | Gọi `buildBarChart` cho người dùng theo vai trò. |
| 76 | Đọc lịch sử hoạt động. |
| 77 | Tạo chuỗi HTML rỗng. |
| 79 | Nếu không có hoạt động. |
| 80 | Gán thông báo "Chưa có hoạt động mới". |
| 82 | Nếu có, lấy 6 hoạt động đầu tiên. |
| 83–87 | Tạo từng dòng hoạt động, dùng `formatDate` và `escapeHTML`. |
| 91 | Lấy tất cả panel trong `#tongquan`. |
| 92 | Đọc tiêu đề panel. |
| 94–95 | Nếu là "Hoạt động gần đây", thay nội dung panel. |
| 98 | Kết thúc hàm. |

### 8.3. `buildBarChart` — dòng 243–277, giải thích từng đoạn

**Tác dụng:** Nhận tiêu đề và danh sách `{ label, value }`, trả về một chuỗi HTML vẽ biểu đồ thanh ngang; chiều rộng mỗi thanh tỉ lệ với giá trị lớn nhất.

| Dòng | Việc xảy ra |
| --- | --- |
| 243 | Khai báo hàm nhận tiêu đề và danh sách giá trị. |
| 244 | Bắt đầu `maxValue = 1` để tránh chia cho 0. |
| 246 | Duyệt từng mục. |
| 247–249 | Nếu giá trị lớn hơn `maxValue`, cập nhật. |
| 252 | Tạo chuỗi `rows` rỗng. |
| 254 | Duyệt từng mục. |
| 255–269 | Tạo HTML cho một thanh biểu đồ: nhãn, thanh, số. |
| 261–262 | Tính chiều rộng thanh theo tỉ lệ giá trị chia `maxValue`. |
| 271–276 | Bọc tất cả trong một `section.panel`, có tiêu đề. |
| 277 | Kết thúc hàm. |

---

## 9. Luồng Thống kê

**Tác dụng của `initStats`:** Tính tổng doanh thu (bỏ đơn đã hủy), số đơn, sản phẩm bán chạy, rồi vẽ hai biểu đồ thống kê.

`admin-thongke.js` hiện không được tải vì không có `thongke.html`. Nếu được dùng, luồng chạy như sau:

```text
initStats()                              [dòng 93]
├─ await prepareAdminData()              [dòng 3]
├─ getOrders()                           [dòng 5]
├─ getProducts()                         [dòng 6]
├─ getUsers()                            [dòng 7]
├─ orders.forEach(...)                   [dòng 12]
│   ├─ getOrderTotal(order)              [dòng 14]
│   └─ soldProducts.find(...)            [dòng 23]
├─ soldProducts.forEach(...)             [dòng 38]
├─ ghi doanh thu, số đơn, bán chạy       [dòng 45–47]
├─ ghi báo cáo                           [dòng 49–60]
├─ Object.keys(CATEGORY_NAMES).map(...)  [dòng 62]
│   └─ products.forEach(...)             [dòng 65]
├─ users.forEach(...)                    [dòng 79]
└─ buildBarChart(...) × 2                [dòng 85–90]
```

| Dòng | Việc xảy ra |
| --- | --- |
| 2 | Khai báo `async function initStats()`. |
| 3 | Chờ `prepareAdminData()`. |
| 5 | Lấy đơn hàng. |
| 6 | Lấy sản phẩm. |
| 7 | Lấy người dùng. |
| 9–10 | Tạo biến doanh thu và mảng sản phẩm đã bán. |
| 12 | Duyệt từng đơn. |
| 13 | Nếu đơn không bị hủy. |
| 14 | Cộng `getOrderTotal(order)` vào doanh thu. |
| 17 | Lấy `order.items` nếu là mảng. |
| 19 | Duyệt từng sản phẩm trong đơn. |
| 20–21 | Lấy tên và số lượng. |
| 23 | Tìm sản phẩm đã có trong mảng thống kê. |
| 27–28 | Nếu có, cộng thêm số lượng. |
| 30 | Nếu chưa, thêm mới. |
| 38 | Duyệt mảng sản phẩm đã bán. |
| 39–42 | Tìm sản phẩm có số lượng lớn nhất. |
| 45 | Ghi doanh thu. |
| 46 | Ghi tổng số đơn. |
| 47 | Ghi tên sản phẩm bán chạy. |
| 49 | Lấy phần tử báo cáo. |
| 51–54 | Nếu chưa có đơn, ghi thông báo. |
| 56–59 | Nếu có đơn, ghi doanh thu, số sản phẩm, số người dùng. |
| 62 | Lấy danh mục. |
| 65 | Duyệt sản phẩm để đếm theo danh mục. |
| 79 | Duyệt người dùng để đếm admin. |
| 85–90 | Tạo hai biểu đồ và gán vào `#stats-charts`. |

Điểm cần biết: `initStats` đọc `order.items` ở dòng 17, trong khi đơn USER dùng `order.products`. Vì vậy phần thống kê sản phẩm bán chạy không đọc được sản phẩm từ đơn USER.

---

## 10. Bảng "hàm nào gọi hàm nào"

| Hàm gọi | Tác dụng | Gọi tiếp | Dữ liệu lấy từ |
| --- | --- | --- | --- |
| `initProducts` | Khởi động trang Sản phẩm. | `prepareAdminData`, `getElementById`, `addEventListener`, `renderTable` | DOM và localStorage |
| `renderTable` (sản phẩm) | Vẽ bảng sản phẩm và cập nhật thống kê. | `getProducts`, `filter`, `map`, `escapeHTML`, `resolveAdminImage`, `formatMoney` | `getProducts` |
| `openDialog` (sản phẩm) | Mở form thêm mới hoặc điền dữ liệu để sửa. | `form.reset`, `getProducts`, `find`, `showModal` | `getProducts` |
| `closeDialog` (sản phẩm) | Đóng form và xóa dữ liệu đã nhập. | `dialog.close`, `form.reset` | Không có |
| `getProducts` | Lấy mảng sản phẩm. | `readStorage` | `localStorage["julie_products"]` |
| `saveProducts` | Ghi mảng sản phẩm. | `saveStorage` | Mảng truyền vào |
| `prepareAdminData` | Nạp dữ liệu JSON vào localStorage. | `fetchJSON`, `normalizeProductList`, `readStorage`, `saveStorage` | `data/products.json`, `data/users.json` |
| `initUsers` | Khởi động trang Người dùng. | `prepareAdminData`, `getElementById`, `addEventListener`, `renderTable` | DOM và localStorage |
| `renderTable` (người dùng) | Vẽ bảng người dùng và cập nhật thống kê. | `getUsers`, `filter`, `map`, `escapeHTML` | `getUsers` |
| `openDialog` (người dùng) | Mở form thêm mới hoặc điền dữ liệu để sửa. | `form.reset`, `getUsers`, `find`, `showModal` | `getUsers` |
| `getUsers` | Lấy mảng người dùng. | `readStorage` | `localStorage["julie_users"]` |
| `saveUsers` | Ghi mảng người dùng. | `saveStorage` | Mảng truyền vào |
| `initOrders` | Khởi động trang Đơn hàng. | `prepareAdminData`, `getElementById`, `addEventListener`, `renderOrders` | DOM và localStorage |
| `renderOrders` | Vẽ bảng đơn hàng và đếm trạng thái. | `getOrders`, `getCustomerName`, `getOrderDate`, `getOrderTotal`, `formatDate`, `formatMoney`, `escapeHTML` | `getOrders` |
| `getCustomerName` | Lấy tên khách từ đơn. | Không gọi hàm khác | `order.customer` |
| `getOrderDate` | Lấy ngày đặt từ đơn. | Không gọi hàm khác | `orderDate`, `date`, `createdAt` |
| `getOrders` | Lấy mảng đơn hàng. | `readStorage` | `localStorage["orders"]` |
| `saveOrders` | Ghi mảng đơn hàng. | `saveStorage` | Mảng truyền vào |
| `showOrderDetail` | Đổ chi tiết đơn vào hộp thoại. | `getOrders`, `getCustomerName`, `getOrderDate`, `getOrderTotal`, `formatDate`, `formatMoney`, `escapeHTML` | `getOrders` |
| `initDashboard` | Điền thẻ số, biểu đồ và hoạt động gần đây. | `prepareAdminData`, `getProducts`, `getUsers`, `getOrders`, `readStorage`, `buildBarChart` | localStorage |
| `initStats` | Tính doanh thu và vẽ biểu đồ thống kê. | `prepareAdminData`, `getOrders`, `getProducts`, `getUsers`, `getOrderTotal`, `buildBarChart` | localStorage |
| `addActivity` | Ghi lịch sử hoạt động. | `readStorage`, `saveStorage` | `localStorage["julie_activity"]` |
| `getOrderTotal` | Tính tổng tiền của đơn. | Không gọi hàm khác | Object đơn truyền vào |
| `nextId` | Sinh id mới cho phần tử. | Không gọi hàm khác | Mảng truyền vào |
| `formatMoney` | Định dạng tiền Việt Nam. | Không gọi hàm khác | Số truyền vào |
| `formatDate` | Định dạng ngày kiểu Việt Nam. | Không gọi hàm khác | Giá trị ngày truyền vào |
| `escapeHTML` | Làm sạch chuỗi trước khi vào HTML. | Không gọi hàm khác | Chuỗi truyền vào |
| `resolveAdminImage` | Sửa đường dẫn ảnh cho Admin. | Không gọi hàm khác | Đường dẫn ảnh truyền vào |
| `buildBarChart` | Tạo HTML biểu đồ thanh ngang. | Không gọi hàm khác | Danh sách `{ label, value }` |

---

## 11. Bảng tra số dòng theo file

### 11.1. `ADMIN/JS/admin-data.js`

| Hàm | Dòng | Tác dụng |
| --- | --- | --- |
| Khai báo key và `CATEGORY_NAMES` | 1–18 | Tên các khóa localStorage và bảng tên danh mục. |
| `readStorage` | 22–29 | Đọc dữ liệu từ localStorage, trả `fallback` nếu lỗi. |
| `saveStorage` | 32–40 | Ghi dữ liệu vào localStorage dạng JSON. |
| `fetchJSON` | 43–59 | Tải file JSON trong `data/`, trả `null` nếu lỗi. |
| `normalizeProductList` | 62–94 | Chuẩn hóa sản phẩm: điền thiếu, ép số, đoán danh mục. |
| `resolveAdminImage` | 97–103 | Đổi đường dẫn ảnh sang đúng thư mục USER. |
| `prepareAdminData` | 107–126 | Nạp JSON vào localStorage khi mở trang. |
| `getProducts` | 129–132 | Lấy mảng sản phẩm. |
| `saveProducts` | 135–137 | Ghi mảng sản phẩm. |
| `getUsers` | 140–143 | Lấy mảng người dùng. |
| `saveUsers` | 146–148 | Ghi mảng người dùng. |
| `getOrders` | 151–154 | Lấy mảng đơn hàng. |
| `saveOrders` | 157–159 | Ghi mảng đơn hàng. |
| `addActivity` | 162–172 | Ghi lịch sử hoạt động, giữ 15 dòng. |
| `nextId` | 175–187 | Sinh id mới bằng id lớn nhất + 1. |
| `formatMoney` | 190–192 | Định dạng tiền Việt Nam kèm `₫`. |
| `formatDate` | 195–209 | Định dạng ngày/giờ kiểu Việt Nam. |
| `escapeHTML` | 212–223 | Làm sạch chuỗi trước khi chèn vào HTML. |
| `getOrderTotal` | 226–240 | Tính tổng tiền của đơn. |
| `buildBarChart` | 243–277 | Tạo HTML biểu đồ thanh ngang. |

### 11.2. `ADMIN/JS/admin-sanpham.js`

| Hàm | Dòng | Tác dụng |
| --- | --- | --- |
| `initProducts` | 2–268 | Khởi động trang Sản phẩm. |
| `renderTable` | 24–102 | Vẽ bảng sản phẩm và cập nhật thống kê. |
| `openDialog` | 105–137 | Mở form thêm mới hoặc điền dữ liệu để sửa. |
| `closeDialog` | 140–143 | Đóng form và xóa dữ liệu đã nhập. |
| Sự kiện nút Thêm | 145–147 | Gọi `openDialog("")` để thêm mới. |
| Sự kiện submit | 152–225 | Kiểm tra, thêm/cập nhật, lưu, vẽ lại bảng. |
| Sự kiện tìm/lọc | 227–228 | Gọi `renderTable` khi từ khóa hoặc danh mục đổi. |
| Sự kiện click bảng | 230–265 | Xử lý nút Sửa/Xóa cho mọi dòng. |
| Gọi `renderTable()` lần đầu | 267 | Hiển thị bảng khi mở trang. |
| Gọi `initProducts()` | 270 | Bắt đầu chạy trang. |

### 11.3. `ADMIN/JS/admin-nguoidung.js`

| Hàm | Dòng | Tác dụng |
| --- | --- | --- |
| `initUsers` | 2–262 | Khởi động trang Người dùng. |
| `renderTable` | 24–96 | Vẽ bảng người dùng và cập nhật thống kê. |
| `openDialog` | 99–127 | Mở form thêm mới hoặc điền dữ liệu để sửa. |
| `closeDialog` | 130–133 | Đóng form và xóa dữ liệu đã nhập. |
| Sự kiện nút Thêm | 135–137 | Gọi `openDialog("")` để thêm mới. |
| Sự kiện submit | 143–208 | Kiểm tra trùng username, thêm/cập nhật, lưu. |
| Sự kiện tìm/lọc | 210–211 | Gọi `renderTable` khi từ khóa hoặc vai trò đổi. |
| Sự kiện click bảng | 213–259 | Sửa hoặc xóa; chặn xóa admin cuối. |
| Gọi `renderTable()` lần đầu | 261 | Hiển thị bảng khi mở trang. |
| Gọi `initUsers()` | 264 | Bắt đầu chạy trang. |

### 11.4. `ADMIN/JS/admin-donhang.js`

| Hàm | Dòng | Tác dụng |
| --- | --- | --- |
| `initOrders` | 2–237 | Khởi động trang Đơn hàng. |
| `getCustomerName` | 27–33 | Lấy tên khách từ `order.customer`. |
| `getOrderDate` | 36–38 | Lấy ngày đặt từ đơn. |
| `renderOrders` | 41–118 | Vẽ bảng đơn hàng và đếm trạng thái. |
| `showOrderDetail` | 121–190 | Đổ chi tiết đơn vào hộp thoại. |
| Sự kiện tìm/lọc | 192–193 | Gọi `renderOrders` khi từ khóa hoặc trạng thái đổi. |
| Sự kiện đổi trạng thái | 195–220 | Cập nhật `status`, lưu và vẽ lại bảng. |
| Sự kiện click Xem | 222–230 | Gọi `showOrderDetail(id)`. |
| Sự kiện đóng hộp thoại | 232–234 | Đóng hộp thoại chi tiết. |
| Gọi `renderOrders()` lần đầu | 236 | Hiển thị bảng khi mở trang. |
| Gọi `initOrders()` | 239 | Bắt đầu chạy trang. |

### 11.5. `ADMIN/JS/admin.js`

| Hàm | Dòng | Tác dụng |
| --- | --- | --- |
| `initDashboard` | 2–98 | Điền thẻ số, biểu đồ và hoạt động gần đây. |
| Gọi `initDashboard()` | 100 | Bắt đầu chạy trang Tổng quan. |
| `logoutAdmin` | 102–104 | Xóa trạng thái đăng nhập và quay về đăng nhập. |

### 11.6. `ADMIN/JS/admin-thongke.js`

| Hàm | Dòng | Tác dụng |
| --- | --- | --- |
| `initStats` | 2–91 | Tính doanh thu, đơn, bán chạy và vẽ biểu đồ. |
| Gọi `initStats()` | 93 | Bắt đầu chạy trang Thống kê. |
