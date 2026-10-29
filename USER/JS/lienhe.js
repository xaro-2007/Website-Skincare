
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const lienHe = {
        ten: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        chuDe: document.getElementById("subject").value,
        noiDung: document.getElementById("message").value.trim()
    };

    try {
        const danhSach = JSON.parse(
            localStorage.getItem("lienHeJulie") || "[]"
        );

        danhSach.push(lienHe);

        localStorage.setItem("lienHeJulie", JSON.stringify(danhSach));

        status.textContent =
            "Đã lưu tin nhắn thử nghiệm thành công!";

        form.reset();

    } catch (error) {
        status.textContent =
            "Không thể lưu tin nhắn. Vui lòng thử lại.";
    }
});
