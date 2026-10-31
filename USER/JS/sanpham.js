
// ==========================================
// 1. LẤY CÁC PHẦN TỬ HTML
// ==========================================

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const categoryFilter = document.getElementById("category-filter");
const sortPrice = document.getElementById("sort-price");
const resultCount = document.getElementById("result-count");
const noProducts = document.getElementById("no-products");
const resetButton = document.getElementById("reset-filter");


// ==========================================
// 2. ĐỊNH DẠNG TIỀN
// ==========================================

function formatMoney(price) {
    return price.toLocaleString("vi-VN") + " ₫";
}


// ==========================================
// 3. LẤY GIỎ HÀNG
// ==========================================

function getCart() {

    try {

        const cart = JSON.parse(localStorage.getItem("cart"));

        return Array.isArray(cart) ? cart : [];

    } catch (error) {

        console.error("Lỗi đọc giỏ hàng:", error);

        return [];

    }

}


// ==========================================
// 4. LƯU GIỎ HÀNG
// ==========================================

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


// ==========================================
// 5. CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG
// ==========================================

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


// ==========================================
// 6. HIỂN THỊ SẢN PHẨM
// ==========================================

function renderProducts(productArray) {

    if (!productList) return;

    resultCount.textContent = productArray.length;

    if (productArray.length === 0) {

        productList.innerHTML = "";

        noProducts.hidden = false;

        return;

    }

    noProducts.hidden = true;

    productList.innerHTML = productArray.map(product => `

        <article class="product-card">

            <div class="product-image">

                <a href="trangchitiet.html?id=${product.id}">

                    <img
                        src="${product.img}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </a>

                ${
                    product.badge
                        ? `<span class="product-badge">${product.badge}</span>`
                        : ""
                }

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.categoryName}
                </p>

                <h3 class="product-name">

                    <a href="trangchitiet.html?id=${product.id}">
                        ${product.name}
                    </a>

                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <p class="product-price">
                    ${formatMoney(product.price)}
                </p>

                <button
                    type="button"
                    class="add-cart-btn"
                    data-product-id="${product.id}"
                >
                    Thêm vào giỏ hàng
                </button>

            </div>

        </article>

    `).join("");

}


// ==========================================
// 7. TÌM KIẾM, LỌC VÀ SẮP XẾP
// ==========================================

function filterProducts() {

    const keyword = searchInput.value.trim().toLowerCase();

    const selectedCategory = categoryFilter.value;

    let filteredProducts = products.filter(product => {

        const matchesName = product.name
            .toLowerCase()
            .includes(keyword);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesName && matchesCategory;

    });


    // Giá thấp đến cao

    if (sortPrice.value === "asc") {

        filteredProducts.sort((a, b) => a.price - b.price);

    }


    // Giá cao đến thấp

    if (sortPrice.value === "desc") {

        filteredProducts.sort((a, b) => b.price - a.price);

    }


    renderProducts(filteredProducts);

}


// ==========================================
// 8. THÊM SẢN PHẨM VÀO GIỎ HÀNG
// ==========================================

function addToCart(productId) {

    const product = products.find(item => {
        return item.id === Number(productId);
    });

    if (!product) {

        alert("Không tìm thấy sản phẩm!");

        return;

    }

    const cart = getCart();

    const existingProduct = cart.find(item => {
        return Number(item.id) === product.id;
    });


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

        alert("Đã thêm " + product.name + " vào giỏ hàng!");

    }

}


// ==========================================
// 9. XỬ LÝ CÁC SỰ KIỆN
// ==========================================

// Nút thêm vào giỏ hàng

if (productList) {

    productList.addEventListener("click", function(event) {

        const button = event.target.closest(".add-cart-btn");

        if (!button) return;

        const productId = button.dataset.productId;

        addToCart(productId);

    });

}


// Tìm kiếm

if (searchInput) {

    searchInput.addEventListener("input", filterProducts);

}


// Nút tìm kiếm

if (searchButton) {

    searchButton.addEventListener("click", filterProducts);

}


// Lọc danh mục

if (categoryFilter) {

    categoryFilter.addEventListener("change", filterProducts);

}


// Sắp xếp giá

if (sortPrice) {

    sortPrice.addEventListener("change", filterProducts);

}


// Reset bộ lọc

if (resetButton) {

    resetButton.addEventListener("click", function() {

        searchInput.value = "";

        categoryFilter.value = "all";

        sortPrice.value = "default";

        filterProducts();

    });

}


// ==========================================
// 10. KHỞI CHẠY TRANG SẢN PHẨM
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    filterProducts();

    updateCartCount();

});
