// ========================================
// 1. KHAI BÁO CÁC BIẾN
// ========================================

// Tên khóa dùng chung để lưu giỏ hàng
const CART_KEY = "cart";

// Phí vận chuyển minh họa
const SHIPPING_FEE = 30000;


// ========================================
// 2. LẤY DỮ LIỆU GIỎ HÀNG
// ========================================

function getCart() {
    try {
        const data = JSON.parse(localStorage.getItem(CART_KEY));

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Không đọc được dữ liệu giỏ hàng:", error);
        return [];
    }
}


// ========================================
// 3. LƯU DỮ LIỆU GIỎ HÀNG
// ========================================

function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Không lưu được giỏ hàng:", error);
        alert("Không thể lưu giỏ hàng. Vui lòng thử lại.");
        return false;
    }
}


// ========================================
// 4. ĐỊNH DẠNG TIỀN VIỆT NAM
// ========================================

function formatMoney(amount) {
    return amount.toLocaleString("vi-VN") + " ₫";
}


// ========================================
// 5. HIỂN THỊ SỐ LƯỢNG SẢN PHẨM
// ========================================

function updateCartCount() {
    const cart = getCart();

    // Tổng số lượng của tất cả sản phẩm
    const totalQuantity = cart.reduce((sum, product) => {
        return sum + product.quantity;
    }, 0);

    const countElement = document.getElementById("cart-count");

    if (countElement) {
        countElement.textContent = totalQuantity;
    }
}


// ========================================
// 6. HIỂN THỊ DANH SÁCH SẢN PHẨM
// ========================================

function renderCart() {
    const cart = getCart();

    const cartContainer = document.getElementById("cart-items");

    // Nếu không tìm thấy khu vực giỏ hàng thì dừng
    if (!cartContainer) {
        return;
    }

    // Cập nhật số lượng sản phẩm
    updateCartCount();

    // Nếu giỏ hàng trống
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Giỏ hàng của bạn đang trống!</h3>

                <p>Hãy chọn sản phẩm mỹ phẩm mà bạn yêu thích.</p>

                <a href="../San_pham/sanpham.html">
                    Khám phá sản phẩm
                </a>
            </div>
        `;

        updateSummary();
        return;
    }

    // Tạo giao diện cho từng sản phẩm
    cartContainer.innerHTML = cart.map(product => `
        <div class="cart-item">

            <img
                src="${product.img}"
                alt="${product.name}"
            >

            <div class="item-info">

                <h3>${product.name}</h3>

                <p class="item-price">
                    ${formatMoney(product.price)}
                </p>

                <div class="quantity-control">

                    <button
                        type="button"
                        data-action="decrease"
                        data-id="${product.id}"
                        aria-label="Giảm số lượng ${product.name}"
                    >−</button>

                    <span class="quantity">
                        ${product.quantity}
                    </span>

                    <button
                        type="button"
                        data-action="increase"
                        data-id="${product.id}"
                        aria-label="Tăng số lượng ${product.name}"
                    >+</button>

                </div>

                <p class="item-total">
                    Thành tiền:
                    ${formatMoney(product.price * product.quantity)}
                </p>

                <button
                    type="button"
                    class="remove-btn"
                    data-action="remove"
                    data-id="${product.id}"
                >
                    Xóa sản phẩm
                </button>

            </div>

        </div>
    `).join("");

    // Cập nhật tổng tiền
    updateSummary();
}


// ========================================
// 7. TĂNG HOẶC GIẢM SỐ LƯỢNG
// ========================================

function changeQuantity(id, amount) {
    const cart = getCart();

    const product = cart.find(item => {
        return String(item.id) === String(id);
    });

    // Không tìm thấy sản phẩm
    if (!product) {
        return;
    }

    // Thay đổi số lượng
    product.quantity += amount;

    // Nếu số lượng bằng 0 thì xóa sản phẩm
    const updatedCart = cart.filter(item => {
        return item.quantity > 0;
    });

    // Lưu và hiển thị lại giỏ hàng
    if (saveCart(updatedCart)) {
        renderCart();
    }
}


// ========================================
// 8. XÓA SẢN PHẨM
// ========================================

function removeProduct(id) {
    const cart = getCart();

    const updatedCart = cart.filter(product => {
        return String(product.id) !== String(id);
    });

    if (saveCart(updatedCart)) {
        renderCart();
    }
}


// ========================================
// 9. TÍNH TỔNG TIỀN
// ========================================

function updateSummary() {
    const cart = getCart();

    // Tính tổng tiền sản phẩm
    const subtotal = cart.reduce((sum, product) => {
        return sum + product.price * product.quantity;
    }, 0);

    // Chỉ tính phí vận chuyển khi có sản phẩm
    const shipping = cart.length > 0 ? SHIPPING_FEE : 0;

    // Tổng tiền cuối cùng
    const total = subtotal + shipping;

    // Hiển thị các khoản tiền
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");
    const checkoutButton = document.getElementById("checkout-btn");

    if (subtotalElement) {
        subtotalElement.textContent = formatMoney(subtotal);
    }

    if (shippingElement) {
        shippingElement.textContent = formatMoney(shipping);
    }

    if (totalElement) {
        totalElement.textContent = formatMoney(total);
    }

    // Không cho đặt hàng khi giỏ hàng trống
    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}


// ========================================
// 10. THÊM SẢN PHẨM VÀO GIỎ HÀNG
// ========================================

// Hàm này có thể được gọi từ trang Sản phẩm
function addToCart(product) {
    if (
        !product ||
        product.id === undefined ||
        typeof product.name !== "string" ||
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isSafeInteger(product.price) ||
        typeof product.img !== "string"
    ) {
        alert("Thông tin sản phẩm không hợp lệ.");
        return;
    }

    const cart = getCart();

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingProduct = cart.find(item => {
        return String(item.id) === String(product.id);
    });

    if (existingProduct) {
        // Nếu đã có thì tăng số lượng
        existingProduct.quantity += 1;
    } else {
        // Nếu chưa có thì thêm sản phẩm mới
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: 1
        });
    }

    if (saveCart(cart)) {
        updateCartCount();
        alert("Đã thêm sản phẩm vào giỏ hàng!");
    }
}


// ========================================
// 11. XỬ LÝ CÁC NÚT TRONG GIỎ HÀNG
// ========================================

const cartContainer = document.getElementById("cart-items");

if (cartContainer) {
    cartContainer.addEventListener("click", function(event) {

        // Tìm nút được nhấn
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === "increase") {
            changeQuantity(id, 1);
        }

        if (action === "decrease") {
            changeQuantity(id, -1);
        }

        if (action === "remove") {
            removeProduct(id);
        }
    });
}


// ========================================
// 12. XỬ LÝ ĐẶT HÀNG
// ========================================

function checkout() {
    const cart = getCart();

    // Không cho đặt hàng nếu giỏ hàng trống
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    // Lấy thông tin khách hàng
    const name = prompt("Nhập họ và tên của bạn:");

    if (name === null || name.trim() === "") {
        alert("Vui lòng nhập họ và tên.");
        return;
    }

    const phone = prompt("Nhập số điện thoại:");

    if (phone === null || phone.trim() === "") {
        alert("Vui lòng nhập số điện thoại.");
        return;
    }

    const address = prompt("Nhập địa chỉ nhận hàng:");

    if (address === null || address.trim() === "") {
        alert("Vui lòng nhập địa chỉ nhận hàng.");
        return;
    }

    // Tính tiền đơn hàng
    const subtotal = cart.reduce((sum, product) => {
        return sum + product.price * product.quantity;
    }, 0);

    const total = subtotal + SHIPPING_FEE;

    // Hiển thị thông báo xác nhận
    alert(
        "THÔNG TIN ĐƠN HÀNG\n\n" +
        "Khách hàng: " + name.trim() + "\n" +
        "Số điện thoại: " + phone.trim() + "\n" +
        "Địa chỉ: " + address.trim() + "\n" +
        "Tổng thanh toán: " + formatMoney(total) + "\n\n" +
        "Đây là bản demo. Đơn hàng chưa được lưu vào hệ thống."
    );
}


// ========================================
// 13. KHỞI TẠO TRANG GIỎ HÀNG
// ========================================

document.addEventListener("DOMContentLoaded", function() {

    // Hiển thị sản phẩm khi mở trang
    renderCart();

    // Gắn sự kiện cho nút đặt hàng
    const checkoutButton = document.getElementById("checkout-btn");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", checkout);
    }

});