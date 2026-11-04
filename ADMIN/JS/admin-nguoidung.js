// Thay thế hàm getUsers() cũ trong admin-data.js bằng đoạn code này:
function getUsers() {
    // Lấy dữ liệu từ cả 2 nguồn: "users" (admin dùng) và "accounts" (khách hàng đăng ký)
    const adminUsers = JSON.parse(localStorage.getItem("users")) || [];
    const clientAccounts = JSON.parse(localStorage.getItem("accounts")) || [];

    // Gộp chung lại và loại bỏ trùng lặp dựa theo username hoặc user
    const combinedMap = new Map();
    [...adminUsers, ...clientAccounts].forEach(user => {
        const key = user.username || user.user;
        if (key && !combinedMap.has(key)) {
            // Chuẩn hóa lại cấu trúc để admin hiển thị mượt mà
            combinedMap.set(key, {
                id: user.id || Date.now(),
                name: user.name || "Chưa có tên",
                username: user.username || user.user,
                email: user.email || "",
                phone: user.phone || "",
                pass: user.pass || user.password || "",
                role: user.role || "user",
                status: user.status || "active",
                createdAt: user.createdAt || new Date().toISOString().slice(0, 10)
            });
        }
    });

    const finalUsers = Array.from(combinedMap.values());
    
    // Tự động cập nhật đồng bộ ngược lại vào localStorage để hai bên dùng chung một nguồn
    localStorage.setItem("users", JSON.stringify(finalUsers));
    localStorage.setItem("accounts", JSON.stringify(finalUsers));

    return finalUsers;
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("accounts", JSON.stringify(users));
    return true;
}