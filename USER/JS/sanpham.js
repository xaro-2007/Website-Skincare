
// ==========================================
// 1. LẤY CÁC PHẦN TỬ HTML
// ==========================================

const products = [
    {
        id: 1,
        name: "Son Dưỡng Môi DHC Lip Cream Nhật Bản",
        price: 165000,
        oldPrice: 210000,
        stars: "★★★★★",
        reviews: 158,
        description: "Cấp ẩm sâu, giảm thâm và giúp đôi môi mềm mịn suốt cả ngày.",
        img: "../img/son-dhc.png",
        badge: "Bán chạy",
        badgeClass: "hot"
    },
    {
        id: 2,
        name: "Son Bóng Rom&nd Glasting Color Gloss",
        price: 180000,
        oldPrice: 225000,
        stars: "★★★★★",
        reviews: 142,
        description: "Chất son bóng trong trẻo, lên màu chuẩn đẹp và căng mọng tự nhiên.",
        img: "../img/son-romand.jpg",
        badge: "Mới",
        badgeClass: "new"
    },
    {
        id: 3,
        name: "Son Tint Bóng Amuse Jel-Fit Tint Hàn Quốc",
        price: 235000,
        oldPrice: 290000,
        stars: "★★★★☆",
        reviews: 96,
        description: "Thiết kế nhỏ xinh, chất son thạch bóng mượt và bám màu lâu trôi.",
        img: "../img/son-amuse.jpg",
        badge: "-20%",
        badgeClass: "sale"
    },
    {
        id: 4,
        name: "Kem Lót JuDyDoll",
        price: 190000,
        oldPrice: 240000,
        stars: "★★★★★",
        reviews: 115,
        description: "Che phủ mịn mướt",
        img: "../img/Kemlotjudydoll.png",
        badge: "Bán chạy",
        badgeClass: "hot"
    },
    {
        id: 5,
        name: "Nước tẩy trang bí CoCoon",
        price: 145000,
        oldPrice: 180000,
        stars: "★★★★☆",
        reviews: 78,
        description: "Làm dịu da, an toàn, lành tính",
        img: "../img/taytrangcocoon.png",
        badge: "Mới",
        badgeClass: "new"
    },
    {
        id: 6,
        name: "Sữa rửa mặt CeraVe",
        price: 210000,
        oldPrice: 260000,
        stars: "★★★★★",
        reviews: 84,
        description: "Loại bỏ dầu thừa, lớp trang điểm và bụi bẩn mà không làm phá vỡ hàng rào bảo vệ tự nhiên của da, không làm da bị bong tróc.",
        img: "../img/suaruamatCerave.png",
        badge: "-20%",
        badgeClass: "sale"
    },
    {
        id: 7,
        name: "Phấn nước TIRTIR Mask Fit Red Cushion",
        price: 450000,
        oldPrice: 550000,
        stars: "★★★★★",
        reviews: 130,
        description: "Che khuyết điểm tốt, kiềm dầu suốt 10 giờ và mang lại lớp nền căng bóng.",
        img: "../img/cushionTirtir.png",
        badge: "Bán chạy",
        badgeClass: "hot"
    },
    {
        id: 8,
        name: "Phấn nước rom&nd Bare Water Cushion",
        price: 360000,
        oldPrice: 420000,
        stars: "★★★★★",
        reviews: 210,
        description: "Cấp ẩm chuyên sâu (70% tinh chất), làm mát da, và tạo hiệu ứng căng bóng trong suốt.",
        img: "../img/cushionromend.png",
        badge: "Bán chạy",
        badgeClass: "hot"
    },
    {
        id: 9,
        name: "Phấn nước Cushion Cầu Vồng Xiêm La MISTINE",
        price: 390000,
        oldPrice: 450000,
        stars: "★★★★☆",
        reviews: 105,
        description: "Khả năng kiềm dầu vượt trội kéo dài từ 12 - 16 tiếng, chống nước và mồ hôi rất tốt, giữ lớp nền không bị xỉn màu.",
        img: "../img/phannuocmistin.png",
        badge: "Mới",
        badgeClass: "new"
    },
    {
        id: 10,
        name: "Phấn nước OHUI Ultimate Cover Denier Cushion 70D21 Minisize",
        price: 275000,
        oldPrice: 435000,
        stars: "★★★★★",
        reviews: 164,
        description: "Hiệu ứng mịn lì tự nhiên tựa vải satin, ráo mịn bên ngoài nhưng vẫn giữ độ ẩm mượt dễ chịu bên trong da.",
        img: "../img/phannuocOhui.png",
        badge: "-20%",
        badgeClass: "sale"
    }
];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const categoryFilter = document.getElementById("category-filter");
const sortPrice = document.getElementById("sort-price");
const resultCount = document.getElementById("result-count");
const noProducts = document.getElementById("no-products");
const resetButton = document.getElementById("reset-filter");
const tagButtons = document.querySelectorAll(".tag-btn");

let activeTag = "all";


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
            ${
                product.badge
                    ? `<span class="badge ${product.badgeClass}">${product.badge}</span>`
                    : ""
            }
            <div class="product-img-wrap" onclick="openQuickView(${product.id})">
                <img
                    src="${product.img}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>
            <h4>
                ${product.name}
            </h4>
            <div class="stars">
                ${product.stars} <span>(${product.reviews})</span>
            </div>
            <div class="price">
                <span class="current-price">${formatMoney(product.price)}</span>
                ${
                    product.oldPrice
                        ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>`
                        : ""
                }
            </div>
            <div class="card-buttons">
                <button
                    type="button"
                    class="btn-quick-view"
                    onclick="openQuickView(${product.id})"
                >
                    Xem nhanh
                </button>
                <button
                    type="button"
                    class="btn-add-cart add-cart-btn"
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

    const selectedCategory = categoryFilter ? categoryFilter.value : "all";

    let filteredProducts = products.filter(product => {
        const nameLower = product.name.toLowerCase();

        const matchesName = nameLower.includes(keyword);

        const matchesCategory =
            selectedCategory === "all" ||
            nameLower.includes(selectedCategory.toLowerCase());

        let matchesTag = true;
        if (activeTag !== "all") {
            const tagKey = activeTag.toLowerCase();
            matchesTag =
                nameLower.includes(tagKey) ||
                product.badge.toLowerCase().includes(tagKey);
        }

        return matchesName && matchesCategory && matchesTag;
    });
    if (sortPrice.value === "asc") {

        filteredProducts.sort((a, b) => a.price - b.price);

    }
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
if (productList) {
    productList.addEventListener("click", function(event) {
        const button = event.target.closest(".add-cart-btn");
        if (!button) {
            return;
        }

        const productId = button.dataset.productId;

        addToCart(productId);

    });
}


// Cửa sổ Xem nhanh chi tiết
const quickViewModal = document.getElementById("quick-view-modal");
const modalBodyContent = document.getElementById("modal-body-content");
const closeModalBtn = document.getElementById("close-modal");

function openQuickView(productId) {
    const product = products.find(item => item.id === Number(productId));
    if (!product || !quickViewModal) return;

    modalBodyContent.innerHTML = `
        <div class="modal-img">
            <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="modal-info">
            <span class="badge ${product.badgeClass}">${product.badge}</span>
            <h3>${product.name}</h3>
            <div class="stars">${product.stars} <span>(${product.reviews} đánh giá)</span></div>
            <p class="modal-desc">${product.description}</p>
            <div class="price">
                <span class="current-price">${formatMoney(product.price)}</span>
                ${
                    product.oldPrice
                        ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>`
                        : ""
                }
            </div>
            <button
                type="button"
                class="btn-add-cart modal-add-btn"
                onclick="addToCart(${product.id}); quickViewModal.hidden = true;"
            >
                Thêm vào giỏ hàng
            </button>
        </div>
    `;

    quickViewModal.hidden = false;
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
        quickViewModal.hidden = true;
    });
}

if (quickViewModal) {
    quickViewModal.addEventListener("click", function (event) {
        if (event.target === quickViewModal) {
            quickViewModal.hidden = true;
        }
    });
}


// Tìm kiếm

if (categoryFilter) {
    categoryFilter.addEventListener("change", filterProducts);
}

    searchInput.addEventListener("input", filterProducts);

for (let i = 0; i < tagButtons.length; i++) {
    tagButtons[i].addEventListener("click", function () {
        if (this.classList.contains("active") && this.dataset.tag !== "all") {
            this.classList.remove("active");
            activeTag = "all";
        } else {
            for (let j = 0; j < tagButtons.length; j++) {
                tagButtons[j].classList.remove("active");
            }
            this.classList.add("active");
            activeTag = this.dataset.tag;
        }
        filterProducts();
    });
}

resetButton.addEventListener("click", function() {
    searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    sortPrice.value = "default";
    activeTag = "all";
    for (let j = 0; j < tagButtons.length; j++) {
        tagButtons[j].classList.remove("active");
    }
    filterProducts();
});

document.addEventListener("DOMContentLoaded", function() {

    filterProducts();

    updateCartCount();
});
