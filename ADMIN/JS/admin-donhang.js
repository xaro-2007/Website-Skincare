// Khởi tạo trang quản lý đơn hàng.
async function initOrders() {
    await prepareAdminData();

    const tableBody = document.getElementById("order-list");

    if (!tableBody) {
        return;
    }

    const searchInput = document.getElementById("search-order");
    const statusFilter = document.getElementById("filter-status");
    const emptyOrders = document.getElementById("empty-orders");

    const dialog = document.getElementById("order-dialog");
    const orderDetail = document.getElementById("order-detail");

    const STATUS_LIST = [
        "Chờ xác nhận",
        "Đã xác nhận",
        "Đang giao",
        "Đã giao",
        "Đã hủy"
    ];

    // Lấy tên khách hàng từ đơn hàng.
    function getCustomerName(order) {
        if (order.customer && typeof order.customer === "object") {
            return order.customer.name || "Khách lẻ";
        }

        return order.customer || order.customerName || order.name || "Khách lẻ";
    }

    // Lấy ngày đặt hàng từ đơn hàng.
    function getOrderDate(order) {
        return order.orderDate || order.date || order.createdAt || "";
    }

    // Hiển thị thống kê và danh sách đơn hàng đã lọc.
    function renderOrders() {
        const allOrders = getOrders();
        const keyword = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;

        let pending = 0;
        let shipping = 0;
        let completed = 0;

        allOrders.forEach(function (order) {
            if (order.status === "Chờ xác nhận") {
                pending += 1;
            }

            if (order.status === "Đang giao") {
                shipping += 1;
            }

            if (order.status === "Đã giao") {
                completed += 1;
            }
        });

        document.getElementById("total-orders").textContent = allOrders.length;
        document.getElementById("pending-orders").textContent = pending;
        document.getElementById("shipping-orders").textContent = shipping;
        document.getElementById("completed-orders").textContent = completed;

        const orders = allOrders.filter(function (order) {
            const matchKeyword =
                String(order.id).toLowerCase().includes(keyword) ||
                String(getCustomerName(order)).toLowerCase().includes(keyword);

            const matchStatus = status === "all" || order.status === status;

            return matchKeyword && matchStatus;
        });

        if (orders.length === 0) {
            tableBody.innerHTML = "";
            emptyOrders.hidden = false;
        } else {
            emptyOrders.hidden = true;

            tableBody.innerHTML = orders.map(function (order) {
                const id = escapeHTML(order.id);
                const currentStatus = order.status || "Chờ xác nhận";
                let options = "";

                STATUS_LIST.forEach(function (item) {
                    const selected = item === currentStatus ? " selected" : "";

                    options +=
                        '<option value="' + escapeHTML(item) + '"' + selected + ">" +
                            escapeHTML(item) +
                        "</option>";
                });

                return (
                    "<tr>" +
                        "<td>" + id + "</td>" +
                        "<td>" + escapeHTML(getCustomerName(order)) + "</td>" +
                        "<td>" + escapeHTML(formatDate(getOrderDate(order))) + "</td>" +
                        "<td>" + formatMoney(getOrderTotal(order)) + "</td>" +
                        "<td>" +
                            '<select class="order-status-select" data-id="' + id + '">' +
                                options +
                            "</select>" +
                        "</td>" +
                        "<td>" +
                            '<button class="btn-detail" type="button" data-action="detail"' +
                                ' data-id="' + id + '">Xem</button>' +
                        "</td>" +
                    "</tr>"
                );
            }).join("");
        }
    }

    // Hiển thị chi tiết một đơn hàng trong hộp thoại.
    function showOrderDetail(id) {
        const order = getOrders().find(function (item) {
            return String(item.id) === String(id);
        });

        if (!order) {
            alert("Không tìm thấy đơn hàng.");
            return;
        }

        const customer = order.customer && typeof order.customer === "object"
            ? order.customer
            : {};

        let items = [];

        if (Array.isArray(order.products)) {
            items = order.products;
        } else if (Array.isArray(order.items)) {
            items = order.items;
        }

        let itemsHTML = "<p>Đơn hàng chưa có chi tiết sản phẩm.</p>";

        if (items.length > 0) {
            itemsHTML =
                '<table class="admin-table">' +
                    "<thead>" +
                        "<tr>" +
                            "<th>Sản phẩm</th>" +
                            "<th>Đơn giá</th>" +
                            "<th>Số lượng</th>" +
                            "<th>Thành tiền</th>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                        items.map(function (item) {
                            const quantity = Number(item.quantity) || 0;
                            const price = Number(item.price) || 0;

                            return (
                                "<tr>" +
                                    "<td>" + escapeHTML(item.name) + "</td>" +
                                    "<td>" + formatMoney(price) + "</td>" +
                                    "<td>" + quantity + "</td>" +
                                    "<td>" + formatMoney(price * quantity) + "</td>" +
                                "</tr>"
                            );
                        }).join("") +
                    "</tbody>" +
                "</table>";
        }

        orderDetail.innerHTML =
            '<div class="order-detail-info">' +
                "<h3>Đơn " + escapeHTML(order.id) + "</h3>" +
                "<p>Khách hàng: " + escapeHTML(getCustomerName(order)) + "</p>" +
                "<p>Số điện thoại: " + escapeHTML(customer.phone || order.phone || "Chưa có") + "</p>" +
                "<p>Email: " + escapeHTML(customer.email || "Chưa có") + "</p>" +
                "<p>Địa chỉ: " + escapeHTML(customer.address || order.address || "Chưa có") + "</p>" +
                "<p>Ghi chú: " + escapeHTML(customer.note || "Không có") + "</p>" +
                "<p>Ngày đặt: " + escapeHTML(formatDate(getOrderDate(order))) + "</p>" +
                "<p>Tổng tiền: " + formatMoney(getOrderTotal(order)) + "</p>" +
                "<p>Trạng thái: " + escapeHTML(order.status || "Chờ xác nhận") + "</p>" +
            "</div>" +
            "<h3>Sản phẩm</h3>" +
            itemsHTML;

        dialog.showModal();
    }

    searchInput.addEventListener("input", renderOrders);
    statusFilter.addEventListener("change", renderOrders);

    tableBody.addEventListener("change", function (event) {
        const select = event.target.closest(".order-status-select");

        if (!select) {
            return;
        }

        const orders = getOrders();
        const order = orders.find(function (item) {
            return String(item.id) === String(select.dataset.id);
        });

        if (!order) {
            return;
        }

        order.status = select.value;

        if (saveOrders(orders)) {
            addActivity(
                'Cập nhật đơn "' + order.id + '" sang "' + order.status + '"'
            );

            renderOrders();
        }
    });

    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action='detail']");

        if (!button) {
            return;
        }

        showOrderDetail(button.dataset.id);
    });

    document.getElementById("close-dialog").addEventListener("click", function () {
        dialog.close();
    });

    renderOrders();
}

initOrders();
