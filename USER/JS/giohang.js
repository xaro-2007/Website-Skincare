const CART_KEY = "cart";
const SHIPPING_FEE = 30000;

// --- 1. QUẢN LÝ DỮ LIỆU GIỎ HÀNG (LOCALSTORAGE) ---
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
    const totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
    
    // Hỗ trợ cập nhật số lượng cho cả id="cart-count" và id="soLuong" ở các trang khác nhau
    const countElements = document.querySelectorAll("#cart-count, #soLuong");
    countElements.forEach(el => {
        el.textContent = totalQuantity;
    });
}


// --- 2. HÀM KẾT NỐI TỪ TRANG SẢN PHẨM (THÊM VÀO GIỎ) ---
function addToCart(product) {
    if (!product || product.id === undefined || !Number.isFinite(product.price)) {
        alert("Thông tin sản phẩm không hợp lệ.");
        return;
    }

    const cart = getCart();
    const existingProduct = cart.find(item => String(item.id) === String(product.id));

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
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


// --- 3. HIỂN THỊ VÀ XỬ LÝ GIAO DIỆN TRANG GIỎ HÀNG ---
function renderCart() {
    const cart = getCart();
    const cartContainer = document.getElementById("cart-items");

    updateCartCount();

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Giỏ hàng của bạn đang trống!</h3>
                <p>Hãy chọn sản phẩm mỹ phẩm mà bạn yêu thích.</p>
                <a href="sanpham.html">Khám phá sản phẩm</a>
            </div>
        `;
        updateSummary();
        return;
    }

    cartContainer.innerHTML = cart.map(product => `
        <div class="cart-item">
            <img src="${product.img}" alt="${product.name}">
            <div class="item-info">
                <h3>${product.name}</h3>
                <p class="item-price">${formatMoney(product.price)}</p>
                <div class="quantity-control">
                    <button type="button" data-action="decrease" data-id="${product.id}">−</button>
                    <span class="quantity">${product.quantity}</span>
                    <button type="button" data-action="increase" data-id="${product.id}">+</button>
                </div>
                <p class="item-total">Thành tiền: ${formatMoney(product.price * product.quantity)}</p>
                <button type="button" class="remove-btn" data-action="remove" data-id="${product.id}">Xóa sản phẩm</button>
            </div>
        </div>
    `).join("");

    updateSummary();
}

function changeQuantity(id, amount) {
    const cart = getCart();
    const product = cart.find(item => String(item.id) === String(id));

    if (!product) return;

    product.quantity += amount;
    const updatedCart = cart.filter(item => item.quantity > 0);

    if (saveCart(updatedCart)) {
        renderCart();
    }
}

function removeProduct(id) {
    const cart = getCart();
    const updatedCart = cart.filter(product => String(product.id) !== String(id));

    if (saveCart(updatedCart)) {
        renderCart();
    }
}

function updateSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
    const total = subtotal + shipping;

    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");
    const checkoutButton = document.getElementById("checkout-btn");

    if (subtotalElement) subtotalElement.textContent = formatMoney(subtotal);
    if (shippingElement) shippingElement.textContent = formatMoney(shipping);
    if (totalElement) totalElement.textContent = formatMoney(total);
    if (checkoutButton) checkoutButton.disabled = cart.length === 0;
}


// --- 4. KHỞI TẠO SỰ KIỆN KHI LOAD TRANG ---
document.addEventListener("DOMContentLoaded", function() {
    renderCart();

    // Sự kiện tăng/giảm/xóa sản phẩm trong giỏ
    const cartContainer = document.getElementById("cart-items");
    if (cartContainer) {
        cartContainer.addEventListener("click", function(event) {
            const button = event.target.closest("button[data-action]");
            if (!button) return;

            const action = button.dataset.action;
            const id = button.dataset.id;

            if (action === "increase") changeQuantity(id, 1);
            if (action === "decrease") changeQuantity(id, -1);
            if (action === "remove") removeProduct(id);
        });
    }

    // Mở form thanh toán dưới dạng hộp thoại
    const checkoutButton = document.getElementById("checkout-btn");
    const checkoutModal = document.getElementById("checkout-modal");
    const checkoutForm = document.getElementById("checkout-form");
    const cancelButton = document.getElementById("cancel-btn");

    function closeCheckoutModal() {
        if (!checkoutModal) return;

        checkoutModal.classList.remove("show");
        checkoutModal.hidden = true;
        document.body.classList.remove("checkout-modal-open");
        if (checkoutButton) checkoutButton.focus();
    }

    if (checkoutButton) {
        checkoutButton.addEventListener("click", function() {
            const cart = getCart();
            if (cart.length === 0) {
                alert("Giỏ hàng đang trống!");
                return;
            }
            if (checkoutModal && checkoutForm) {
                checkoutModal.hidden = false;
                checkoutModal.classList.add("show");
                document.body.classList.add("checkout-modal-open");
                checkoutForm.querySelector("input:not([type='hidden'])").focus();
            }
        });
    }

    if (cancelButton && checkoutModal) {
        cancelButton.addEventListener("click", function() {
            closeCheckoutModal();
        });
    }

    if (checkoutModal) {
        checkoutModal.addEventListener("click", function(event) {
            if (event.target === checkoutModal) closeCheckoutModal();
        });

        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape" && !checkoutModal.hidden) {
                closeCheckoutModal();
            }
        });
    }

    // Xử lý gửi đơn hàng & gửi email qua EmailJS
    const orderForm = document.getElementById("order-form");
    if (orderForm) {
        orderForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const cart = getCart();
            if (cart.length === 0) {
                alert("Giỏ hàng đang trống!");
                closeCheckoutModal();
                renderCart();
                return;
            }

            const name = document.getElementById("customer-name").value.trim();
            const phone = document.getElementById("customer-phone").value.trim();
            const email = document.getElementById("customer-email").value.trim();
            const address = document.getElementById("customer-address").value.trim();
            const note = document.getElementById("customer-note").value.trim();

            const subtotal = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
            const total = subtotal + SHIPPING_FEE;
            const orderId = "DH" + Date.now();

            const productListString = cart.map(item => 
                `- ${item.name} x ${item.quantity}: ${formatMoney(item.price * item.quantity)}`
            ).join("\n");

            document.getElementById("order-id-input").value = orderId;
            document.getElementById("order-details-input").value = productListString;
            document.getElementById("order-total-input").value = formatMoney(total);

            const submitBtn = document.getElementById("submit-order-btn");
            let originalBtnText = "Xác nhận đặt hàng";
            if (submitBtn) {
                originalBtnText = submitBtn.textContent;
                submitBtn.textContent = "Đang gửi đơn hàng...";
                submitBtn.disabled = true;
            }

            const SERVICE_ID = "service_b9d0r95"; 
            const TEMPLATE_ID = "template_tupkgra";

            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
                .then(function() {
                    const order = {
                        id: orderId,
                        customer: { name, phone, email, address, note },
                        products: cart,
                        subtotal: subtotal,
                        shipping: SHIPPING_FEE,
                        total: total,
                        orderDate: new Date().toLocaleString("vi-VN")
                    };

                    let orders = JSON.parse(localStorage.getItem("orders")) || [];
                    orders.push(order);
                    localStorage.setItem("orders", JSON.stringify(orders));

                    saveCart([]);

                    // Hiển thị pop-up đặt hàng thành công
                    const msgElement = document.getElementById("orderSuccessMessage");
                    if (msgElement) {
                        msgElement.innerHTML = `
                            Cảm ơn bạn đã đặt hàng tại <b>JinieSkin</b>!<br>
                            Mã đơn hàng: <b class="highlight-id">${order.id}</b><br>
                            Tổng thanh toán: <b class="highlight-price">${formatMoney(order.total)}</b><br>
                           `
                    }

                    const successModal = document.getElementById("orderSuccessModal");
                    if (successModal) {
                        successModal.style.display = "flex";
                    }

                    orderForm.reset();
                    closeCheckoutModal();
                    renderCart();
                })
                .catch(function(error) {
                    console.error("Lỗi khi gửi đơn hàng:", error);
                    alert("Không thể gửi đơn hàng. Vui lòng thử lại.");
                })
                .finally(function() {
                    if (submitBtn) {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }
                });
        });
    }
});