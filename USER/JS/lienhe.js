
// Lay form va thong bao
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

// Xu ly khi bam nut Gui tin nhan
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Lay thong tin tu form
    const lienHe = {
        ten: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        chuDe: document.getElementById("subject").value,
        noiDung: document.getElementById("message").value.trim()
    };

    try {
        // Lay danh sach lien he da luu
        const danhSach = JSON.parse(
            localStorage.getItem("lienHeJulie") || "[]"
        );

        // Them lien he moi
        danhSach.push(lienHe);

        // Luu lai tren trinh duyet
        localStorage.setItem("lienHeJulie", JSON.stringify(danhSach));

        status.textContent =
            "Đã lưu tin nhắn thử nghiệm thành công!";

        form.reset();

    } catch (error) {
        status.textContent =
            "Không thể lưu tin nhắn. Vui lòng thử lại.";
    }
});
