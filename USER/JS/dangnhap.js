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

function chuyenForm(fromModalId, toModalId) {
    dongModal(fromModalId);
    moModal(toModalId);
}

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

    accounts.push({ name, user, pass });
    localStorage.setItem("accounts", JSON.stringify(accounts));

    localStorage.setItem("currentUser", name);

    alert("Đăng ký tài khoản thành công!");
    

    dongModal('registerModal');
    

    kiemTraDangNhap();
}

function dangNhap() {
    const user = document.getElementById("logUser").value.trim();
    const pass = document.getElementById("logPass").value.trim();

    if (!user || !pass) {
        alert("Vui lòng nhập tài khoản và mật khẩu!");
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const foundUser = accounts.find(acc => acc.user === user && acc.pass === pass);

    if (foundUser || (user === "admin" && pass === "123")) {
        const displayName = foundUser ? foundUser.name : user;
        
        localStorage.setItem("currentUser", displayName);

        alert("Đăng nhập thành công!");
        dongModal('loginModal');
        kiemTraDangNhap();
    } else {
        alert("Sai tài khoản hoặc mật khẩu!");
    }
}

function dangXuat() {
    localStorage.removeItem("currentUser");
    alert("Đã đăng xuất!");
    kiemTraDangNhap();
}

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

document.addEventListener("DOMContentLoaded", function() {
    kiemTraDangNhap();
});