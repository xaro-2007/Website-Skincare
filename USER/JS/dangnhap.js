function moModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function dongModal(id) {
    document.getElementById(id).style.display = 'none';
}

function chuyenForm(modalHienTai, modalCanMo) {
    document.getElementById(modalHienTai).style.display = 'none';
    document.getElementById(modalCanMo).style.display = 'flex';
}

function dangKy() {
    let ten = document.getElementById('regName').value.trim();
    let tk = document.getElementById('regUser').value.trim();
    let mk = document.getElementById('regPass').value.trim();

    if(!ten || !tk || !mk) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    localStorage.setItem("tenNguoiDung", ten);
    localStorage.setItem("taikhoan", tk);
    localStorage.setItem("matkhau", mk);
    
    dongModal('registerModal');
    hienThiTrangChinh(ten);
}

function dangNhap() {
    let tk = document.getElementById('logUser').value.trim();
    let mk = document.getElementById('logPass').value.trim();

    if(!tk || !mk) {
        alert("Vui lòng nhập tài khoản và mật khẩu!");
        return;
    }

    let ten = localStorage.getItem("tenNguoiDung") ? localStorage.getItem("tenNguoiDung") : tk;

    dongModal('loginModal');
    hienThiTrangChinh(ten);
}

function hienThiTrangChinh(ten) {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('tenHienThi').innerText = ten;
    document.getElementById('userDashboard').style.display = 'flex';
}

function dangXuat() {
    document.getElementById('userDashboard').style.display = 'none';
    document.getElementById('authButtons').style.display = 'block';
    
    document.querySelectorAll('.modal-content input').forEach(input => input.value = '');
}

document.addEventListener("DOMContentLoaded", function () {
    try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        if (Array.isArray(cart)) {
            const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const soLuongEl = document.getElementById("soLuong");
            const cartCountEl = document.getElementById("cart-count");
            if (soLuongEl) soLuongEl.textContent = total;
            if (cartCountEl) cartCountEl.textContent = total;
        }
    } catch (e) {}
});
