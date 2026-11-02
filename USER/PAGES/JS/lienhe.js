document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");

    if (form) {
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

                // Hiển thị nội dung thông báo vào pop-up
                const msgElement = document.getElementById("contactModalMessage");
                if (msgElement) {
                    msgElement.textContent = "Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ cố gắng hỗ trợ bạn sớm nhất có thể!";
                }

                // Mở pop-up thông báo lên (sử dụng chung hàm moModal của hệ thống)
                if (typeof moModal === "function") {
                    moModal("contactModal");
                } else {
                    // Dự phòng nếu chưa có hàm moModal
                    const modal = document.getElementById("contactModal");
                    if (modal) modal.style.display = "flex";
                }

                form.reset();

            } catch (error) {
                alert("Không thể lưu tin nhắn. Vui lòng thử lại.");
            }
        });
    }
});