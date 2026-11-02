// Khởi tạo trang thống kê.
async function initStats() {
    await prepareAdminData();

    const orders = getOrders();
    const products = getProducts();
    const users = getUsers();

    let revenue = 0;
    const soldProducts = [];

    orders.forEach(function (order) {
        if (order.status !== "Đã hủy") {
            revenue += getOrderTotal(order);
        }

        const items = Array.isArray(order.items) ? order.items : [];

        items.forEach(function (item) {
            const name = item.name || "Không tên";
            const quantity = Number(item.quantity) || 0;

            const found = soldProducts.find(function (entry) {
                return entry.name === name;
            });

            if (found) {
                found.quantity += quantity;
            } else {
                soldProducts.push({ name: name, quantity: quantity });
            }
        });
    });

    let bestName = "—";
    let bestQuantity = 0;

    soldProducts.forEach(function (entry) {
        if (entry.quantity > bestQuantity) {
            bestQuantity = entry.quantity;
            bestName = entry.name;
        }
    });

    document.getElementById("revenue-total").textContent = formatMoney(revenue);
    document.getElementById("stat-orders").textContent = orders.length;
    document.getElementById("best-seller").textContent = bestName;

    const reportNote = document.getElementById("report-note");

    if (orders.length === 0) {
        reportNote.textContent =
            "Chưa có dữ liệu đơn hàng. Số liệu sản phẩm và người dùng " +
            "vẫn được thống kê trong các biểu đồ bên dưới.";
    } else {
        reportNote.textContent =
            "Tổng doanh thu (không tính đơn đã hủy): " + formatMoney(revenue) + ". " +
            "Tổng sản phẩm: " + products.length + ", " +
            "tổng người dùng: " + users.length + ".";
    }

    const categoryItems = Object.keys(CATEGORY_NAMES).map(function (key) {
        let count = 0;

        products.forEach(function (product) {
            if (product.category === key) {
                count += 1;
            }
        });

        return {
            label: CATEGORY_NAMES[key],
            value: count
        };
    });

    let adminCount = 0;

    users.forEach(function (user) {
        if (user.role === "admin") {
            adminCount += 1;
        }
    });

    document.getElementById("stats-charts").innerHTML =
        buildBarChart("Biểu đồ: Sản phẩm theo danh mục", categoryItems) +
        buildBarChart("Biểu đồ: Người dùng theo vai trò", [
            { label: "Quản trị viên", value: adminCount },
            { label: "Khách hàng", value: users.length - adminCount }
        ]);
}

initStats();
