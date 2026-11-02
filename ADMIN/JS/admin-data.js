const PRODUCTS_KEY = "julie_products";
const PRODUCTS_SOURCE_KEY = "julie_products_source";
const USERS_KEY = "julie_users";
const ORDERS_KEY = "julie_orders";
const ACTIVITY_KEY = "julie_activity";

// Key tin nhắn dùng chung với trang liên hệ của USER.
const CONTACT_KEY = "lienHeJulie";

const CATEGORY_NAMES = {
    son: "Son môi",
    cushion: "Phấn nước",
    cleanser: "Sữa rửa mặt",
    taytrang: "Nước tẩy trang",
    kemlot: "Kem lót"
};

// Dữ liệu dự phòng khi mở trực tiếp bằng file://
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Son Dưỡng Môi DHC Lip Cream Nhật Bản",
        category: "son",
        categoryName: "Son môi",
        price: 165000,
        oldPrice: 210000,
        stock: 35,
        stars: "★★★★★",
        reviews: 158,
        description: "Cấp ẩm sâu, giảm thâm và giúp đôi môi mềm mịn suốt cả ngày.",
        img: "../img/son-dhc.png",
        badge: "Bán chạy",
        badgeClass: "hot"
    },
    {
        id: 2,
        name: "Son Bóng Rom&nd Glasting Color Gloss",
        category: "son",
        categoryName: "Son môi",
        price: 180000,
        oldPrice: 225000,
        stock: 28,
        stars: "★★★★★",
        reviews: 142,
        description: "Chất son bóng trong trẻo, lên màu chuẩn đẹp và căng mọng tự nhiên.",
        img: "../img/son-romand.jpg",
        badge: "Mới",
        badgeClass: "new"
    },
    {
        id: 3,
        name: "Son Tint Bóng Amuse Jel-Fit Tint Hàn Quốc",
        category: "son",
        categoryName: "Son môi",
        price: 235000,
        oldPrice: 290000,
        stock: 20,
        stars: "★★★★☆",
        reviews: 96,
        description: "Thiết kế nhỏ xinh, chất son thạch bóng mượt và bám màu lâu trôi.",
        img: "../img/son-amuse.jpg",
        badge: "-20%",
        badgeClass: "sale"
    },
    {
        id: 4,
        name: "Kem Lót JuDyDoll",
        category: "kemlot",
        categoryName: "Kem lót",
        price: 190000,
        oldPrice: 240000,
        stock: 25,
        stars: "★★★★★",
        reviews: 115,
        description: "Che phủ mịn mướt, hỗ trợ lớp nền lâu trôi.",
        img: "../img/Kemlotjudydoll.png",
        badge: "Bán chạy",
        badgeClass: "hot"
    },
    {
        id: 5,
        name: "Nước tẩy trang bí CoCoon",
        category: "taytrang",
        categoryName: "Nước tẩy trang",
        price: 145000,
        oldPrice: 180000,
        stock: 40,
        stars: "★★★★☆",
        reviews: 78,
        description: "Làm dịu da, làm sạch sâu, an toàn và lành tính.",
        img: "../img/taytrangcocoon.png",
        badge: "Mới",
        badgeClass: "new"
    },
    {
        id: 6,
        name: "Sữa rửa mặt CeraVe",
        category: "cleanser",
        categoryName: "Sữa rửa mặt",
        price: 210000,
        oldPrice: 260000,
        stock: 30,
        stars: "★★★★★",
        reviews: 84,
        description: "Loại bỏ dầu thừa, lớp trang điểm và bụi bẩn mà không làm phá vỡ hàng rào bảo vệ tự nhiên của da.",
        img: "../img/suaruamatCerave.png",
        badge: "-20%",
        badgeClass: "sale"
    },
    {
        id: 7,
        name: "Phấn nước TIRTIR Mask Fit Red Cushion",
        category: "cushion",
        categoryName: "Phấn nước",
        price: 450000,
        oldPrice: 550000,
        stock: 18,
        stars: "★★★★★",
        reviews: 130,
        description: "Che khuyết điểm tốt, kiềm dầu suốt 10 giờ và mang lại lớp nền căng bóng.",
        img: "../img/cushionTirtir.png",
        badge: "Bán chạy",
        badgeClass: "hot"
    },
    {
        id: 8,
        name: "Phấn nước rom&nd Bare Water Cushion",
        category: "cushion",
        categoryName: "Phấn nước",
        price: 360000,
        oldPrice: 420000,
        stock: 22,
        stars: "★★★★★",
        reviews: 210,
        description: "Cấp ẩm chuyên sâu (70% tinh chất), làm mát da, và tạo hiệu ứng căng bóng trong suốt.",
        img: "../img/cushionromend.png",
        badge: "Bán chạy",
        badgeClass: "hot"
    },
    {
        id: 9,
        name: "Phấn nước Cushion Cầu Vồng Xiêm La MISTINE",
        category: "cushion",
        categoryName: "Phấn nước",
        price: 390000,
        oldPrice: 450000,
        stock: 15,
        stars: "★★★★☆",
        reviews: 105,
        description: "Khả năng kiềm dầu vượt trội kéo dài từ 12 - 16 tiếng, chống nước và mồ hôi rất tốt.",
        img: "../img/phannuocmistin.png",
        badge: "Mới",
        badgeClass: "new"
    },
    {
        id: 10,
        name: "Phấn nước OHUI Ultimate Cover Denier Cushion 70D21 Minisize",
        category: "cushion",
        categoryName: "Phấn nước",
        price: 275000,
        oldPrice: 435000,
        stock: 12,
        stars: "★★★★★",
        reviews: 164,
        description: "Hiệu ứng mịn lì tự nhiên tựa vải satin, ráo mịn bên ngoài nhưng vẫn giữ độ ẩm mượt bên trong da.",
        img: "../img/phannuocOHUI.png",
        badge: "-20%",
        badgeClass: "sale"
    }
];

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
