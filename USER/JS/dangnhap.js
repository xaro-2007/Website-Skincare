// Hàm mở popup chung
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
    
    document.querySelectorAll('input').forEach(input => input.value = '');
}