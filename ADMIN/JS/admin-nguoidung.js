// Khởi tạo trang quản lý người dùng.
async function initUsers() {
    await prepareAdminData();

    const tableBody = document.getElementById("user-table-body");

    if (!tableBody) {
        return;
    }

    const dialog = document.getElementById("user-dialog");
    const form = document.getElementById("user-form");
    const dialogTitle = document.getElementById("user-dialog-title");

    const searchInput = document.getElementById("user-search");
    const roleFilter = document.getElementById("role-filter");
    const emptyMessage = document.getElementById("empty-users");

    const totalUsers = document.getElementById("total-users");
    const totalAdmins = document.getElementById("total-admins");
    const totalActive = document.getElementById("total-active");

    // Hiển thị bảng người dùng, thống kê và kết quả lọc.
    function renderTable() {
        const keyword = searchInput.value.trim().toLowerCase();
        const role = roleFilter.value;
        const users = getUsers();

        const filtered = users.filter(function (user) {
            const matchKeyword =
                String(user.name).toLowerCase().includes(keyword) ||
                String(user.username).toLowerCase().includes(keyword) ||
                String(user.email).toLowerCase().includes(keyword);

            const matchRole = role === "all" || user.role === role;

            return matchKeyword && matchRole;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = "";
            emptyMessage.hidden = false;
        } else {
            emptyMessage.hidden = true;

            tableBody.innerHTML = filtered.map(function (user) {
                const id = escapeHTML(user.id);
                const name = escapeHTML(user.name);
                const phone = escapeHTML(user.phone || "Chưa có SĐT");
                const username = escapeHTML(user.username);
                const email = escapeHTML(user.email);

                return (
                    "<tr>" +
                        "<td>" +
                            "<strong>" + name + "</strong><br>" +
                            '<span style="font-size:12px;color:#817681;">' +
                                phone +
                            "</span>" +
                        "</td>" +
                        "<td>" + username + "</td>" +
                        "<td>" + email + "</td>" +
                        "<td>" + (user.role === "admin"
                            ? "Quản trị viên"
                            : "Khách hàng") + "</td>" +
                        "<td>" + (user.status === "locked"
                            ? "Đã khóa"
                            : "Đang hoạt động") + "</td>" +
                        "<td>" +
                            '<button class="small" type="button" data-action="edit"' +
                                ' data-id="' + id + '">Sửa</button> ' +
                            '<button class="small" type="button" data-action="delete"' +
                                ' data-id="' + id + '">Xóa</button>' +
                        "</td>" +
                    "</tr>"
                );
            }).join("");
        }

        let adminCount = 0;
        let activeCount = 0;

        users.forEach(function (user) {
            if (user.role === "admin") {
                adminCount += 1;
            }

            if (user.status === "active") {
                activeCount += 1;
            }
        });

        totalUsers.textContent = users.length;
        totalAdmins.textContent = adminCount;
        totalActive.textContent = activeCount;
    }

    // Mở hộp thoại thêm mới hoặc chỉnh sửa người dùng.
    function openDialog(id) {
        form.reset();

        document.getElementById("user-id").value = "";
        dialogTitle.textContent = "Thêm người dùng";

        if (id !== "") {
            const user = getUsers().find(function (item) {
                return String(item.id) === String(id);
            });

            if (!user) {
                alert("Không tìm thấy người dùng cần sửa.");
                return;
            }

            document.getElementById("user-id").value = user.id;
            document.getElementById("user-name").value = user.name;
            document.getElementById("user-username").value = user.username;
            document.getElementById("user-email").value = user.email;
            document.getElementById("user-phone").value = user.phone || "";
            document.getElementById("user-role").value = user.role;
            document.getElementById("user-status").value = user.status;

            dialogTitle.textContent = "Sửa người dùng";
        }

        dialog.showModal();
    }

    // Đóng hộp thoại người dùng.
    function closeDialog() {
        dialog.close();
        form.reset();
    }

    document.getElementById("add-user-btn").addEventListener("click", function () {
        openDialog("");
    });

    document.getElementById("close-user-dialog").addEventListener("click", closeDialog);
    document.getElementById("cancel-user-dialog").addEventListener("click", closeDialog);


    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const id = document.getElementById("user-id").value;
        const name = document.getElementById("user-name").value.trim();
        const username = document.getElementById("user-username").value.trim();
        const email = document.getElementById("user-email").value.trim();
        const phone = document.getElementById("user-phone").value.trim();
        const role = document.getElementById("user-role").value;
        const status = document.getElementById("user-status").value;

        if (name === "" || username === "" || email === "") {
            alert("Vui lòng nhập đầy đủ họ tên, tài khoản và email.");
            return;
        }

        const users = getUsers();

        const duplicate = users.find(function (user) {
            return user.username.toLowerCase() === username.toLowerCase() &&
                String(user.id) !== String(id);
        });

        if (duplicate) {
            alert("Tài khoản này đã tồn tại. Vui lòng chọn tài khoản khác.");
            return;
        }

        if (id === "") {
            users.push({
                id: nextId(users),
                name: name,
                username: username,
                email: email,
                phone: phone,
                role: role,
                status: status,
                createdAt: new Date().toISOString().slice(0, 10)
            });

            addActivity('Thêm người dùng "' + name + '"');
        } else {
            const user = users.find(function (item) {
                return String(item.id) === String(id);
            });

            if (!user) {
                alert("Không tìm thấy người dùng cần sửa.");
                return;
            }

            user.name = name;
            user.username = username;
            user.email = email;
            user.phone = phone;
            user.role = role;
            user.status = status;

            addActivity('Cập nhật người dùng "' + name + '"');
        }

        if (saveUsers(users)) {
            closeDialog();
            renderTable();
        }
    });

    searchInput.addEventListener("input", renderTable);
    roleFilter.addEventListener("change", renderTable);

    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const id = button.dataset.id;

        if (button.dataset.action === "edit") {
            openDialog(id);
            return;
        }

        const users = getUsers();
        const user = users.find(function (item) {
            return String(item.id) === String(id);
        });

        if (!user) {
            return;
        }

        if (user.role === "admin") {
            const adminCount = users.filter(function (item) {
                return item.role === "admin";
            }).length;

            if (adminCount <= 1) {
                alert("Không thể xóa quản trị viên cuối cùng.");
                return;
            }
        }

        if (!confirm('Bạn có chắc muốn xóa tài khoản "' + user.username + '"?')) {
            return;
        }

        const remaining = users.filter(function (item) {
            return String(item.id) !== String(id);
        });

        if (saveUsers(remaining)) {
            addActivity('Xóa người dùng "' + user.name + '"');
            renderTable();
        }
    });

    renderTable();
}

initUsers();
