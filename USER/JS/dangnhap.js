// --- 1. MỞ VÀ ĐÓNG MODAL ---
function moModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
    }
}

function dongModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}

// Chuyển qua lại giữa form Đăng nhập và Đăng ký
function chuyenForm(fromModalId, toModalId) {
    dongModal(fromModalId);
    moModal(toModalId);
}


// --- 2. XỬ LÝ ĐĂNG KÝ (Đăng ký xong tự động đăng nhập luôn) ---
function dangKy() {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const pass = document.getElementById("regPass").value.trim();

    if (!name || !email || !phone || !pass) {
        alert("Vui lòng điền đầy đủ thông tin đăng ký!");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Vui lòng nhập email hợp lệ!");
        return;
    }

    if (!/^\+?[0-9\s()-]{8,20}$/.test(phone)) {
        alert("Vui lòng nhập số điện thoại hợp lệ!");
        return;
    }

    let accounts;
    try {
        accounts = JSON.parse(localStorage.getItem("accounts")) || [];
        if (!Array.isArray(accounts)) {
            accounts = [];
        }
    } catch (error) {
        console.error("Không đọc được danh sách tài khoản:", error);
        alert("Không thể đọc danh sách tài khoản. Vui lòng tải lại trang.");
        return;
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedPhone = phone.replace(/\D/g, "");
    const existing = accounts.find(acc =>
        String(acc.email || "").toLowerCase() === normalizedEmail ||
        String(acc.phone || "").replace(/\D/g, "") === normalizedPhone
    );
    if (existing) {
        alert("Email hoặc số điện thoại này đã được đăng ký!");
        return;
    }

    const nextAccountId = accounts.reduce((maxId, account) => {
        return Math.max(maxId, Number(account.id) || 0);
    }, 0) + 1;

    accounts.push({
        id: nextAccountId,
        name: name,
        username: email,
        user: email,
        email: email,
        phone: phone,
        pass: pass,
        role: "user",
        status: "active",
        createdAt: new Date().toISOString().slice(0, 10)
    });

    try {
        localStorage.setItem("accounts", JSON.stringify(accounts));
    } catch (error) {
        console.error("Không lưu được tài khoản:", error);
        alert("Không thể lưu tài khoản. Vui lòng thử lại.");
        return;
    }

    // Tự động gán trạng thái đăng nhập cho tài khoản mới đăng ký
    localStorage.setItem("currentUser", name);
    localStorage.setItem("userRole", "user"); // Phân quyền là user thường

    alert("Đăng ký tài khoản thành công!");
    dongModal('registerModal');
    kiemTraDangNhap();
}


// --- 3. XỬ LÝ ĐĂNG NHẬP (Phân quyền Admin / User) ---
function dangNhap() {
    const user = document.getElementById("logUser").value.trim();
    const pass = document.getElementById("logPass").value.trim();

    if (!user || !pass) {
        alert("Vui lòng nhập email/số điện thoại và mật khẩu!");
        return;
    }

    // 1. Kiểm tra tài khoản Admin cứng
    if (user === "admin" && pass === "123") {
        localStorage.setItem("currentUser", "Quản trị viên");
        localStorage.setItem("userRole", "admin"); // Đánh dấu quyền admin

        alert("Đăng nhập quyền Admin thành công!");
        dongModal('loginModal');
        
        // Chuyển hướng chính xác vào thư mục ADMIN/pages/admin.html
        window.location.href = "../../ADMIN/pages/admin.html"; 
        return;
    }

    // 2. Kiểm tra tài khoản khách hàng thông thường (`accounts`)
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const normalizedLogin = user.toLowerCase();
    const normalizedPhone = user.replace(/\D/g, "");
    const foundUser = accounts.find(acc => {
        const accountEmail = String(acc.email || "").toLowerCase();
        const accountPhone = String(acc.phone || "").replace(/\D/g, "");
        const legacyUsername = String(acc.user || acc.username || "");

        return acc.pass === pass && (
            accountEmail === normalizedLogin ||
            (normalizedPhone && accountPhone === normalizedPhone) ||
            legacyUsername === user
        );
    });

    if (foundUser) {
        localStorage.setItem("currentUser", foundUser.name);
        localStorage.setItem("userRole", "user"); // Đánh dấu quyền user

        alert("Đăng nhập thành công!");
        dongModal('loginModal');
        
        // Nếu lỡ đang ở trang admin mà đăng nhập bằng user thì đẩy về trang chủ, ngược lại cập nhật header
        if (window.location.href.includes("admin.html")) {
            window.location.href = "../PAGES/trangchu.html";
        } else {
            kiemTraDangNhap();
        }
    } else {
        alert("Sai tài khoản hoặc mật khẩu!");
    }
}


// --- 4. XỬ LÝ ĐĂNG XUẤT ---
function dangXuat() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole"); // Xóa luôn quyền khi đăng xuất
    
    alert("Đã đăng xuất!");
    
    // Nếu đang ở trang admin thì văng về trang chủ, còn ở trang thường thì cập nhật header
    if (window.location.href.includes("admin.html")) {
        window.location.href = "../PAGES/trangchu.html";
    } else {
        kiemTraDangNhap();
    }
}


// --- 5. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP KHI MỞ TRANG ---
function kiemTraDangNhap() {
    const currentUser = localStorage.getItem("currentUser");
    const authButtons = document.getElementById("authButtons");
    const userDashboard = document.getElementById("userDashboard");
    const tenHienThi = document.getElementById("tenHienThi");

    if (currentUser) {
        if (authButtons) authButtons.style.display = "none";
        if (userDashboard) userDashboard.style.display = "flex";
        if (tenHienThi) tenHienThi.textContent = currentUser;
    } else {
        if (authButtons) authButtons.style.display = "block";
        if (userDashboard) userDashboard.style.display = "none";
    }
}

// Tự động chạy kiểm tra khi load trang
document.addEventListener("DOMContentLoaded", function() {
    kiemTraDangNhap();
});