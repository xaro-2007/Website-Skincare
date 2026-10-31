// Khởi tạo trang Tổng quan.
async function initDashboard() {
    await prepareAdminData();

    const products = getProducts();
    const users = getUsers();
    const orders = getOrders();
    const contacts = readStorage(CONTACT_KEY, []);
    const contactList = Array.isArray(contacts) ? contacts : [];

    document.querySelectorAll("#tongquan .card").forEach(function (card) {
        const title = card.querySelector("h3").textContent.trim();
        const number = card.querySelector("p");

        if (title === "Tổng đơn hàng") {
            number.textContent = orders.length;
        }

        if (title === "Sản phẩm") {
            number.textContent = products.length;
        }

        if (title === "Tin nhắn") {
            number.textContent = contactList.length;
        }
    });

    const cardsArea = document.querySelector("#tongquan .cards");
    let hasUserCard = false;

    cardsArea.querySelectorAll("h3").forEach(function (heading) {
        if (heading.textContent.trim() === "Người dùng") {
            hasUserCard = true;
        }
    });

    if (!hasUserCard) {
        cardsArea.insertAdjacentHTML(
            "beforeend",
            '<div class="card"><h3>Người dùng</h3><p>' + users.length + "</p></div>"
        );
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

    cardsArea.insertAdjacentHTML(
        "afterend",
        buildBarChart("Biểu đồ: Sản phẩm theo danh mục", categoryItems) +
        buildBarChart("Biểu đồ: Người dùng theo vai trò", [
            { label: "Quản trị viên", value: adminCount },
            { label: "Khách hàng", value: users.length - adminCount }
        ])
    );

    const activities = readStorage(ACTIVITY_KEY, []);
    let activityHTML = "";

    if (!Array.isArray(activities) || activities.length === 0) {
        activityHTML = "<p>Chưa có hoạt động mới.</p>";
    } else {
        activities.slice(0, 6).forEach(function (activity) {
            activityHTML +=
                '<p style="margin-top:8px;">' +
                    escapeHTML(formatDate(activity.time, true)) + " – " +
                    escapeHTML(activity.text) +
                "</p>";
        });
    }

    document.querySelectorAll("#tongquan .panel").forEach(function (panel) {
        const heading = panel.querySelector("h3");

        if (heading && heading.textContent.trim() === "Hoạt động gần đây") {
            panel.innerHTML = "<h3>Hoạt động gần đây</h3>" + activityHTML;
        }
    });
}

initDashboard();
