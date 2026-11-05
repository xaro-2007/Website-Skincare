const PRODUCTS_KEY = "julie_products";
const PRODUCTS_SOURCE_KEY = "julie_products_source";
const USERS_KEY = "julie_users";
const ORDERS_KEY = "orders";
const ACTIVITY_KEY = "julie_activity";

// Key tin nhắn dùng chung với trang liên hệ của USER.
const CONTACT_KEY = "lienHeJulie";

const CATEGORY_NAMES = {
    son: "Son môi",
    cushion: "Phấn nước",
    cleanser: "Sữa rửa mặt",
    toner: "Toner",
    serum: "Serum",
    moisturizer: "Kem dưỡng",
    primer: "Kem lót",
};


// Đọc dữ liệu JSON đã lưu trong localStorage.
function readStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
        return fallback;
    }
}

// Lưu dữ liệu vào localStorage, trả về true nếu thành công.
function saveStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        alert("Không lưu được dữ liệu. Vui lòng thử lại.");
        return false;
    }
}

// Đọc file JSON; trả về null nếu không đọc được (ví dụ mở bằng file://).
async function fetchJSON(fileName) {
    if (location.protocol === "file:") {
        return null;
    }

    try {
        const response = await fetch("../../data/" + fileName, { cache: "no-store" });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        return null;
    }
}

// Tự động suy luận danh mục nếu sản phẩm trong JSON chưa có trường category
function normalizeProductList(list) {
    if (!Array.isArray(list)) return [];

    return list.map(function (item) {
        const nameLower = String(item.name || "").toLowerCase();
        let category = item.category || "";

        if (!category) {
            if (nameLower.includes("son")) category = "son";
            else if (nameLower.includes("phấn nước") || nameLower.includes("cushion")) category = "cushion";
            else if (nameLower.includes("sữa rửa mặt")) category = "cleanser";
            else if (nameLower.includes("tẩy trang")) category = "taytrang";
            else if (nameLower.includes("kem lót")) category = "kemlot";
            else category = "son";
        }

        return {
            id: item.id,
            name: item.name || "",
            category: category,
            categoryName: item.categoryName || CATEGORY_NAMES[category] || category,
            price: Number(item.price) || 0,
            oldPrice: item.oldPrice ? Number(item.oldPrice) : 0,
            stock: item.stock !== undefined ? Number(item.stock) : 20,
            stars: item.stars || "★★★★★",
            reviews: item.reviews !== undefined ? Number(item.reviews) : 50,
            description: item.description || "",
            img: item.img || "",
            badge: item.badge || "",
            badgeClass: item.badgeClass || "hot"
        };
    });
}

// Chuyển đường dẫn ảnh "../img/..." sang "../../USER/img/..." để hiển thị đúng trong trang Admin
function resolveAdminImage(imgPath) {
    if (!imgPath) return "";
    if (imgPath.indexOf("../img/") === 0) {
        return "../../USER/" + imgPath.slice(3);
    }
    return imgPath;
}

// Nạp dữ liệu từ JSON vào localStorage.
// Nếu file data/products.json thay đổi so với lần trước thì tự động cập nhật mới!
async function prepareAdminData() {
    const fileProducts = await fetchJSON("products.json");
    const sourceProducts = Array.isArray(fileProducts) ? fileProducts : DEFAULT_PRODUCTS;
    const normalized = normalizeProductList(sourceProducts);
    const sourceSignature = JSON.stringify(normalized);
    const savedSignature = localStorage.getItem(PRODUCTS_SOURCE_KEY);

    if (readStorage(PRODUCTS_KEY, null) === null || savedSignature !== sourceSignature) {
        saveStorage(PRODUCTS_KEY, normalized);
        localStorage.setItem(PRODUCTS_SOURCE_KEY, sourceSignature);
    }

    if (readStorage(USERS_KEY, null) === null) {
        const users = await fetchJSON("users.json");

        if (Array.isArray(users)) {
            saveStorage(USERS_KEY, users);
        }
    }
}

// Lấy danh sách sản phẩm.
function getProducts() {
    const products = readStorage(PRODUCTS_KEY, []);
    return Array.isArray(products) ? products : [];
}

// Lưu danh sách sản phẩm.
function saveProducts(products) {
    return saveStorage(PRODUCTS_KEY, products);
}

// Lấy danh sách người dùng.
function getUsers() {
    const users = readStorage(USERS_KEY, []);
    return Array.isArray(users) ? users : [];
}

// Lưu danh sách người dùng.
function saveUsers(users) {
    return saveStorage(USERS_KEY, users);
}

// Lấy danh sách đơn hàng.
function getOrders() {
    const orders = readStorage(ORDERS_KEY, []);
    return Array.isArray(orders) ? orders : [];
}

// Lưu danh sách đơn hàng.
function saveOrders(orders) {
    return saveStorage(ORDERS_KEY, orders);
}

// Thêm một hoạt động mới vào lịch sử gần đây.
function addActivity(text) {
    const activities = readStorage(ACTIVITY_KEY, []);
    const list = Array.isArray(activities) ? activities : [];

    list.unshift({
        time: new Date().toISOString(),
        text: text
    });

    saveStorage(ACTIVITY_KEY, list.slice(0, 15));
}

// Tạo id mới lớn hơn id lớn nhất hiện có.
function nextId(items) {
    let maxId = 0;

    items.forEach(function (item) {
        const id = Number(item.id);

        if (id > maxId) {
            maxId = id;
        }
    });

    return maxId + 1;
}

// Định dạng số tiền theo kiểu Việt Nam.
function formatMoney(amount) {
    return Number(amount).toLocaleString("vi-VN") + " ₫";
}

// Định dạng ngày; nếu withTime là true thì hiển thị thêm giờ.
function formatDate(value, withTime) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return String(value);
    }

    return withTime
        ? date.toLocaleString("vi-VN")
        : date.toLocaleDateString("vi-VN");
}

// Chuyển ký tự đặc biệt thành HTML an toàn.
function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Tính tổng tiền của một đơn hàng.
function getOrderTotal(order) {
    if (typeof order.total === "number") {
        return order.total;
    }

    let total = 0;

    if (Array.isArray(order.items)) {
        order.items.forEach(function (item) {
            total += (Number(item.price) || 0) * (Number(item.quantity) || 0);
        });
    }

    return total;
}

// Tạo HTML cho biểu đồ cột từ danh sách nhãn và giá trị.
function buildBarChart(title, items) {
    let maxValue = 1;

    items.forEach(function (item) {
        if (item.value > maxValue) {
            maxValue = item.value;
        }
    });

    let rows = "";

    items.forEach(function (item) {
        rows +=
            '<div style="display:flex;align-items:center;gap:12px;margin-top:12px;">' +
                '<span style="width:130px;font-size:13px;color:#817681;">' +
                    escapeHTML(item.label) +
                "</span>" +
                '<div style="flex:1;height:14px;background:#f8e6ed;border-radius:7px;overflow:hidden;">' +
                    '<div style="height:100%;background:#d9688d;width:' +
                        Math.round((item.value / maxValue) * 100) +
                    '%;"></div>' +
                "</div>" +
                '<span style="min-width:28px;text-align:right;font-size:13px;font-weight:bold;color:#c45a7e;">' +
                    item.value +
                "</span>" +
            "</div>";
    });

    return (
        '<section class="panel" style="margin-bottom:24px;">' +
            "<h3>" + escapeHTML(title) + "</h3>" +
            rows +
        "</section>"
    );
}
