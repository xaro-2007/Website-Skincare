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


// --- 2. XỬ LÝ ĐĂNG KÝ (Tự động đồng bộ vào cả Frontend & Admin) ---
function dangKy() {
    const name = document.getElementById("regName").value.trim();
    const user = document.getElementById("regUser").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const pass = document.getElementById("regPass").value.trim();
    const confirmPass = document.getElementById("regConfirmPass").value.trim();

    // Kiểm tra điền đầy đủ thông tin
    if (!name || !user || !email || !phone || !pass || !confirmPass) {
        alert("Vui lòng điền đầy đủ thông tin đăng ký!");
        return;
    }

    // Kiểm tra khớp mật khẩu
    if (pass !== confirmPass) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    // Lấy dữ liệu từ localStorage
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let adminUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    // Kiểm tra trùng tài khoản
    const existingUser = accounts.find(acc => acc.username === user || acc.user === user) ||
                         adminUsers.find(acc => acc.username === user || acc.user === user);
    if (existingUser) {
        alert("Tài khoản này đã tồn tại!");
        return;
    }

    // Kiểm tra trùng email
    const existingEmail = accounts.find(acc => acc.email === email) ||
                          adminUsers.find(acc => acc.email === email);
    if (existingEmail) {
        alert("Email này đã được sử dụng cho tài khoản khác!");
        return;
    }

    const newId = Math.max(
        0, 
        ...accounts.map(acc => Number(acc.id) || 0), 
        ...adminUsers.map(acc => Number(acc.id) || 0)
    ) + 1;

    // Cấu trúc đối tượng tài khoản chuẩn tương thích tuyệt đối với trang Quản lý Người dùng của Admin
    const newAccount = {
        id: newId,
        name: name,
        username: user,
        user: user,
        email: email,
        phone: phone,
        pass: pass,
        role: "user",       // Mặc định là khách hàng
        status: "active",   // Mặc định đang hoạt động
        createdAt: new Date().toISOString().slice(0, 10)
    };

    // Lưu vào kho lưu trữ chung (`accounts` và `users`)
    accounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(accounts));

    adminUsers.push(newAccount);
    localStorage.setItem("users", JSON.stringify(adminUsers));

    // Tự động đăng nhập luôn cho tài khoản mới đăng ký
    localStorage.setItem("currentUser", name);
    localStorage.setItem("userRole", "user");

    alert("Đăng ký tài khoản thành công!");
    dongModal('registerModal');
    kiemTraDangNhap();
}


// --- 3. XỬ LÝ ĐĂNG NHẬP (Phân quyền Admin / User) ---
function dangNhap() {
    const user = document.getElementById("logUser").value.trim();
    const pass = document.getElementById("logPass").value.trim();

    if (!user || !pass) {
        alert("Vui lòng nhập tài khoản và mật khẩu!");
        return;
    }

    // 1. Kiểm tra tài khoản Admin cứng
    if (user === "admin" && pass === "123") {
        localStorage.setItem("currentUser", "Quản trị viên");
        localStorage.setItem("userRole", "admin");

        alert("Đăng nhập quyền Admin thành công!");
        dongModal('loginModal');
        
        window.location.href = "../../ADMIN/pages/admin.html"; 
        return;
    }

    // 2. Kiểm tra tài khoản khách hàng thông thường từ `accounts` hoặc `users`
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let adminUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    let allUsers = [...accounts, ...adminUsers];
    const foundUser = allUsers.find(acc => (acc.username === user || acc.user === user) && acc.pass === pass);

    if (foundUser) {
        localStorage.setItem("currentUser", foundUser.name);
        localStorage.setItem("userRole", "user");

        alert("Đăng nhập thành công!");
        dongModal('loginModal');
        
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
    localStorage.removeItem("userRole");
    
    alert("Đã đăng xuất!");
    
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