
// ===== TRANG TONG QUAN ADMIN =====

const ORDER_KEY = "julieOrders";
const PRODUCT_KEY = "julieProducts";

function readData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Không đọc được dữ liệu ${key}:`, error);
        return [];
    }
}

function updateDashboard() {
    const orders = readData(ORDER_KEY);
    const products = readData(PRODUCT_KEY);

    const orderCount = document.querySelector(
        "#tongquan .cards .card:nth-child(1) p"
    );

    const productCount = document.querySelector(
        "#tongquan .cards .card:nth-child(2) p"
    );

    const messageCount = document.querySelector(
        "#tongquan .cards .card:nth-child(3) p"
    );

    if (orderCount) {
        orderCount.textContent = orders.length;
    }

    if (productCount) {
        productCount.textContent = products.length;
    }

    if (messageCount) {
        messageCount.textContent = "0";
    }
}

document.addEventListener("DOMContentLoaded", updateDashboard);

window.addEventListener("storage", function (event) {
    if (event.key === ORDER_KEY || event.key === PRODUCT_KEY) {
        updateDashboard();
    }
});
