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
    const user = document.getElementById("regUser").value.trim();
    const pass = document.getElementById("regPass").value.trim();

    if (!name || !user || !pass) {
        alert("Vui lòng điền đầy đủ thông tin đăng ký!");
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const existing = accounts.find(acc => acc.user === user);
    if (existing) {
        alert("Tài khoản này đã tồn tại!");
        return;
    }

    // Lưu tài khoản mới vào danh sách
    accounts.push({ name, user, pass });
    localStorage.setItem("accounts", JSON.stringify(accounts));

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
        alert("Vui lòng nhập tài khoản và mật khẩu!");
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
    const foundUser = accounts.find(acc => acc.user === user && acc.pass === pass);

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