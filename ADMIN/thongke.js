
// ===== KHOI TAO TRANG THONG KE =====

const refreshButton = document.getElementById("refresh-stats");
const yearSelect = document.getElementById("stats-year");

// Tao danh sach nam de chon
function setupYearFilter() {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement("option");

        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }
}

// Hien thi trang thai chua co du lieu
function showEmptyStatistics() {
    document.getElementById("stats-revenue").textContent = "0 ₫";
    document.getElementById("stats-orders").textContent = "0";
    document.getElementById("stats-completed").textContent = "0";
    document.getElementById("stats-average").textContent = "0 ₫";

    document.getElementById("stats-pending").textContent = "0";
    document.getElementById("stats-confirmed").textContent = "0";
    document.getElementById("stats-shipping").textContent = "0";
    document.getElementById("stats-delivered").textContent = "0";
    document.getElementById("stats-cancelled").textContent = "0";

    document.getElementById("monthly-stats").innerHTML = `
        <tr>
            <td colspan="3">Chưa có dữ liệu thống kê.</td>
        </tr>
    `;

    document.getElementById("best-selling-products").innerHTML = `
        <tr>
            <td colspan="4">Chưa có dữ liệu sản phẩm đã bán.</td>
        </tr>
    `;

    document.getElementById("stats-message").textContent =
        "Giao diện đã sẵn sàng. Cần kết nối dữ liệu đơn hàng để tính toán thống kê thực tế.";
}

// Khoi tao giao dien
setupYearFilter();
showEmptyStatistics();

// Nut lam moi giao dien
refreshButton.addEventListener("click", function () {
    showEmptyStatistics();
});
