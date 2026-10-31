
const CART_KEY = "cart";

const SHIPPING_FEE = 30000;

function getCart() {
    try {
        const data = JSON.parse(localStorage.getItem(CART_KEY));

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Không đọc được dữ liệu giỏ hàng:", error);
        return [];
    }
}

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

function formatMoney(amount) {
    return amount.toLocaleString("vi-VN") + " ₫";
}

function updateCartCount() {
    const cart = getCart();

    const totalQuantity = cart.reduce((sum, product) => {
        return sum + product.quantity;
    }, 0);

    const countElement = document.getElementById("cart-count");

    if (countElement) {
        countElement.textContent = totalQuantity;
    }
}

function renderCart() {
    const cart = getCart();

    const cartContainer = document.getElementById("cart-items");

    if (!cartContainer) {
        return;
    }

    updateCartCount();

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

    updateSummary();
}

function changeQuantity(id, amount) {
    const cart = getCart();

    const product = cart.find(item => {
        return String(item.id) === String(id);
    });

    if (!product) {
        return;
    }

    product.quantity += amount;

    const updatedCart = cart.filter(item => {
        return item.quantity > 0;
    });

    if (saveCart(updatedCart)) {
        renderCart();
    }
}

function removeProduct(id) {
    const cart = getCart();

    const updatedCart = cart.filter(product => {
        return String(product.id) !== String(id);
    });

    if (saveCart(updatedCart)) {
        renderCart();
    }
}

function updateSummary() {
    const cart = getCart();

    const subtotal = cart.reduce((sum, product) => {
        return sum + product.price * product.quantity;
    }, 0);

    const shipping = cart.length > 0 ? SHIPPING_FEE : 0;

    const total = subtotal + shipping;

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

    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}

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

// function checkout() {
//     const cart = getCart();

//     // Không cho đặt hàng nếu giỏ hàng trống
//     if (cart.length === 0) {
//         alert("Giỏ hàng đang trống!");
//         return;
//     }

//     // Lấy thông tin khách hàng
//     const name = prompt("Nhập họ và tên của bạn:");

//     if (name === null || name.trim() === "") {
//         alert("Vui lòng nhập họ và tên.");
//         return;
//     }

//     const phone = prompt("Nhập số điện thoại:");

//     if (phone === null || phone.trim() === "") {
//         alert("Vui lòng nhập số điện thoại.");
//         return;
//     }

//     const address = prompt("Nhập địa chỉ nhận hàng:");

//     if (address === null || address.trim() === "") {
//         alert("Vui lòng nhập địa chỉ nhận hàng.");
//         return;
//     }

//     // Tính tiền đơn hàng
//     const subtotal = cart.reduce((sum, product) => {
//         return sum + product.price * product.quantity;
//     }, 0);

//     const total = subtotal + SHIPPING_FEE;

//     // Hiển thị thông báo xác nhận
//     alert(
//         "THÔNG TIN ĐƠN HÀNG\n\n" +
//         "Khách hàng: " + name.trim() + "\n" +
//         "Số điện thoại: " + phone.trim() + "\n" +
//         "Địa chỉ: " + address.trim() + "\n" +
//         "Tổng thanh toán: " + formatMoney(total) + "\n\n" 
//     );
// }

// ========================================
// 12. XỬ LÝ FORM ĐẶT HÀNG
// ========================================

// Lấy các phần tử HTML
const checkoutButton = document.getElementById("checkout-btn");
const checkoutForm = document.getElementById("checkout-form");
const orderForm = document.getElementById("order-form");
const cancelButton = document.getElementById("cancel-btn");

// Khi nhấn Tiến hành đặt hàng
if (checkoutButton) {

    checkoutButton.addEventListener("click", function() {

        const cart = getCart();

        if (cart.length === 0) {
            alert("Giỏ hàng đang trống!");
            return;
        }

        // Hiện form đặt hàng
        checkoutForm.classList.add("show");

        // Cuộn đến form
        checkoutForm.scrollIntoView({
            behavior: "smooth"
        });

    });

}


// Khi nhấn nút Hủy
if (cancelButton) {

    cancelButton.addEventListener("click", function() {

        // Ẩn form
        checkoutForm.classList.remove("show");

    });

}


// Khi người dùng xác nhận đặt hàng
if (orderForm) {

    orderForm.addEventListener("submit", function(event) {

        // Ngăn trang web tải lại
        event.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            alert("Giỏ hàng đang trống!");
            checkoutForm.classList.remove("show");
            renderCart();
            return;
        }

        // Lấy thông tin khách hàng
        const name = document.getElementById("customer-name").value.trim();

        const phone = document.getElementById("customer-phone").value.trim();

        const email = document.getElementById("customer-email").value.trim();

        const address = document.getElementById("customer-address").value.trim();

        const note = document.getElementById("customer-note").value.trim();

        // Tính tổng tiền
        const subtotal = cart.reduce((sum, product) => {
            return sum + product.price * product.quantity;
        }, 0);

        const total = subtotal + SHIPPING_FEE;

        // Tạo thông tin đơn hàng
        const order = {
            id: "DH" + Date.now(),

            customer: {
                name: name,
                phone: phone,
                email: email,
                address: address,
                note: note
            },

            products: cart,

            subtotal: subtotal,

            shipping: SHIPPING_FEE,

            total: total,

            orderDate: new Date().toLocaleString("vi-VN")
        };

        // Lưu đơn hàng vào localStorage
        let orders = JSON.parse(localStorage.getItem("orders")) || [];

        orders.push(order);

        localStorage.setItem("orders", JSON.stringify(orders));

        // Xóa giỏ hàng sau khi đặt hàng thành công
        if (!saveCart([])) {
            alert("Không thể cập nhật giỏ hàng. Vui lòng thử lại.");
            return;
        }

        // Thông báo
        alert(
            "ĐẶT HÀNG THÀNH CÔNG!\n\n" +
            "Mã đơn hàng: " + order.id + "\n" +
            "Khách hàng: " + name + "\n" +
            "Số điện thoại: " + phone + "\n" +
            "Địa chỉ: " + address + "\n" +
            "Tổng thanh toán: " + formatMoney(total)
        );

        // Làm mới giao diện
        orderForm.reset();

        checkoutForm.classList.remove("show");

        renderCart();

    });

}

document.addEventListener("DOMContentLoaded", function() {

    renderCart();

    const checkoutButton = document.getElementById("checkout-btn");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", checkout);
    }

});