
// ========================================
// 1. LẤY ID SẢN PHẨM TỪ URL
// ========================================

const urlParams = new URLSearchParams(window.location.search);

const productId = Number(urlParams.get("id"));


// ========================================
// 2. TÌM SẢN PHẨM
// ========================================

const product = products.find(item => item.id === productId);

const detailContainer = document.getElementById("product-detail");


// ========================================
// 3. ĐỊNH DẠNG GIÁ
// ========================================

function formatMoney(price) {

    return price.toLocaleString("vi-VN") + " ₫";

}


// ========================================
// 4. LẤY GIỎ HÀNG
// ========================================

function getCart() {

    try {

        const cart = JSON.parse(localStorage.getItem("cart"));

        return Array.isArray(cart) ? cart : [];

    } catch (error) {

        console.error("Lỗi đọc giỏ hàng:", error);

        return [];

    }

}


// ========================================
// 5. LƯU GIỎ HÀNG
// ========================================

function saveCart(cart) {

    try {

        localStorage.setItem("cart", JSON.stringify(cart));

        return true;

    } catch (error) {

        console.error("Lỗi lưu giỏ hàng:", error);

        alert("Không thể lưu giỏ hàng!");

        return false;

    }

}


// ========================================
// 6. CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG
// ========================================

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce((sum, item) => {

        return sum + Number(item.quantity);

    }, 0);

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {

        cartCount.textContent = totalQuantity;

    }

}


// ========================================
// 7. HIỂN THỊ CHI TIẾT SẢN PHẨM
// ========================================

function renderProductDetail() {

    if (!detailContainer) return;

    if (!product) {

        detailContainer.innerHTML = `
            <h2>Không tìm thấy sản phẩm!</h2>
            <a href="sanpham.html">
                Quay lại trang sản phẩm
            </a>
        `;

        return;

    }


    detailContainer.innerHTML = `

        <div class="detail-content">

            <div class="detail-image">

                <img
                    src="${product.img}"
                    alt="${product.name}"
                >

            </div>

            <div class="detail-info">

                <p class="detail-category">
                    ${product.categoryName}
                </p>

                <h1>${product.name}</h1>

                <p class="detail-description">
                    ${product.description}
                </p>

                <p class="detail-price">
                    ${formatMoney(product.price)}
                </p>

                <p>Số lượng sản phẩm:</p>

                <div class="quantity-box">

                    <button type="button" id="decrease">
                        -
                    </button>

                    <input
                        type="number"
                        id="quantity"
                        value="1"
                        min="1"
                        step="1"
                    >

                    <button type="button" id="increase">
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="add-cart-btn"
                    id="add-cart"
                >
                    Thêm vào giỏ hàng
                </button>

            </div>

        </div>

    `;


    // Gọi chức năng tăng giảm số lượng

    handleQuantity();


    // Gọi chức năng thêm giỏ hàng

    document.getElementById("add-cart")
        .addEventListener("click", addProductToCart);

}


// ========================================
// 8. TĂNG GIẢM SỐ LƯỢNG
// ========================================

function handleQuantity() {

    const quantityInput = document.getElementById("quantity");

    const decreaseButton = document.getElementById("decrease");

    const increaseButton = document.getElementById("increase");


    decreaseButton.addEventListener("click", function() {

        let quantity = Number(quantityInput.value);

        if (quantity > 1) {

            quantity--;

        }

        quantityInput.value = quantity;

    });


    increaseButton.addEventListener("click", function() {

        let quantity = Number(quantityInput.value);

        quantity++;

        quantityInput.value = quantity;

    });


    quantityInput.addEventListener("change", function() {

        let quantity = Number(quantityInput.value);

        if (!Number.isInteger(quantity) || quantity < 1) {

            quantity = 1;

        }

        quantityInput.value = quantity;

    });

}


// ========================================
// 9. THÊM SẢN PHẨM VÀO GIỎ HÀNG
// ========================================

function addProductToCart() {

    const quantityInput = document.getElementById("quantity");

    const quantity = Number(quantityInput.value);


    if (!Number.isInteger(quantity) || quantity < 1) {

        alert("Vui lòng nhập số lượng hợp lệ!");

        return;

    }


    // Lấy dữ liệu giỏ hàng hiện tại

    const cart = getCart();


    // Kiểm tra sản phẩm đã tồn tại chưa

    const existingProduct = cart.find(item => {

        return Number(item.id) === product.id;

    });


    if (existingProduct) {

        // Đã tồn tại thì cộng số lượng

        existingProduct.quantity =
            Number(existingProduct.quantity) + quantity;

    } else {

        // Chưa tồn tại thì thêm sản phẩm mới

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            img: product.img,

            quantity: quantity

        });

    }


    // Lưu vào localStorage

    if (saveCart(cart)) {
        
        updateCartCount();

        alert(
            "Đã thêm " + quantity +
            " sản phẩm " + product.name +
            " vào giỏ hàng!"
        );

    }

}


// ========================================
// 10. KHỞI CHẠY
// ========================================

document.addEventListener("DOMContentLoaded", function() {

    renderProductDetail();

    updateCartCount();

});
