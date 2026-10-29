const products = [
    {
        id: 1,
        name: "Sữa rửa mặt dịu nhẹ",
        category: "cleanser",
        categoryName: "Sữa rửa mặt",
        price: 150000,
        description: "Làm sạch da nhẹ nhàng mỗi ngày.",
        img: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=600&q=80",
        badge: "Bán chạy"
    },
    {
        id: 2,
        name: "Sữa rửa mặt dưỡng ẩm",
        category: "cleanser",
        categoryName: "Sữa rửa mặt",
        price: 180000,
        description: "Hỗ trợ làm sạch và giữ ẩm cho da.",
        img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80",
        badge: ""
    },
    {
        id: 3,
        name: "Toner cấp ẩm",
        category: "toner",
        categoryName: "Toner",
        price: 220000,
        description: "Bổ sung độ ẩm cho làn da.",
        img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80",
        badge: "Mới"
    },
    {
        id: 4,
        name: "Toner làm dịu da",
        category: "toner",
        categoryName: "Toner",
        price: 195000,
        description: "Bước chăm sóc da sau khi rửa mặt.",
        img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80",
        badge: ""
    },
    {
        id: 5,
        name: "Serum dưỡng da",
        category: "serum",
        categoryName: "Serum",
        price: 320000,
        description: "Bổ sung dưỡng chất cho quy trình dưỡng da.",
        img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80",
        badge: "Bán chạy"
    },
    {
        id: 6,
        name: "Serum cấp ẩm",
        category: "serum",
        categoryName: "Serum",
        price: 350000,
        description: "Hỗ trợ duy trì độ ẩm cho da.",
        img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80",
        badge: ""
    },
    {
        id: 7,
        name: "Kem dưỡng ẩm",
        category: "moisturizer",
        categoryName: "Kem dưỡng",
        price: 280000,
        description: "Giúp da mềm mại và đủ ẩm.",
        img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80",
        badge: "Yêu thích"
    },
    {
        id: 8,
        name: "Kem dưỡng ban đêm",
        category: "moisturizer",
        categoryName: "Kem dưỡng",
        price: 390000,
        description: "Bổ sung bước dưỡng ẩm vào buổi tối.",
        img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
        badge: ""
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

// 3. ĐỊNH DẠNG TIỀN VIỆT NAM
function formatMoney(price) {
    return price.toLocaleString("vi-VN") + " ₫";
}
// 4. ĐỌC GIỎ HÀNG TỪ LOCALSTORAGE
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart"));

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Không đọc được giỏ hàng:", error);
        return [];
    }
}
// 5. LƯU GIỎ HÀNG
function saveCart(cart) {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Không lưu được giỏ hàng:", error);
        alert("Không thể lưu giỏ hàng. Vui lòng thử lại.");
        return false;
    }
}
// 6. CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG
function updateCartCount() {
    const cart = getCart();

    const totalQuantity = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
}
// 7. HIỂN THỊ SẢN PHẨM
function renderProducts(productArray) {
    if (!productList) {
        return;
    }
    // Hiển thị số lượng kết quả
    resultCount.textContent = productArray.length;
    // Nếu không tìm thấy sản phẩm
    if (productArray.length === 0) {
        productList.innerHTML = "";
        noProducts.hidden = false;
        return;
    }
    noProducts.hidden = true;
    // Tạo giao diện cho từng sản phẩm
    productList.innerHTML = productArray.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${product.img}"
                    alt="${product.name}"
                    loading="lazy"
                >
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
                    ${product.name}
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
// 8. TÌM KIẾM, LỌC VÀ SẮP XẾP
function filterProducts() {
    // Lấy nội dung tìm kiếm
    const keyword = searchInput.value
        .trim()
        .toLowerCase();
    // Lấy danh mục được chọn
    const selectedCategory = categoryFilter.value;
    // Lọc sản phẩm
    let filteredProducts = products.filter(product => {
        const matchesName = product.name
            .toLowerCase()
            .includes(keyword);
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;
        return matchesName && matchesCategory;
    });
    // Sắp xếp giá
    if (sortPrice.value === "asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }
    if (sortPrice.value === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    // Hiển thị kết quả
    renderProducts(filteredProducts);
}
// 9. THÊM SẢN PHẨM VÀO GIỎ HÀNG
function addToCart(productId) {
    // Tìm sản phẩm theo ID
    const product = products.find(item => {
        return item.id === Number(productId);
    });
    if (!product) {
        alert("Không tìm thấy sản phẩm!");
        return;
    }
    // Lấy giỏ hàng hiện tại
    const cart = getCart();
    // Kiểm tra sản phẩm đã có trong giỏ chưa
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
    // Lưu giỏ hàng
    if (saveCart(cart)) {
        // Cập nhật số lượng hiển thị
        updateCartCount();
        alert("Đã thêm " + product.name + " vào giỏ hàng!");
    }
}
// 10. XỬ LÝ NÚT THÊM VÀO GIỎ HÀNG
if (productList) {
    productList.addEventListener("click", function(event) {
        // Tìm nút được nhấn
        const button = event.target.closest(".add-cart-btn");
        if (!button) {
            return;
        }
        // Lấy ID sản phẩm từ thuộc tính data
        const productId = button.dataset.productId;
        // Thêm sản phẩm vào giỏ
        addToCart(productId);
    });
}
// 11. GẮN SỰ KIỆN TÌM KIẾM VÀ LỌC
// Tìm kiếm khi nhập từ khóa
searchInput.addEventListener("input", filterProducts);
// Tìm kiếm khi nhấn nút
searchButton.addEventListener("click", filterProducts);
// Lọc theo danh mục
categoryFilter.addEventListener("change", filterProducts);
// Sắp xếp theo giá
sortPrice.addEventListener("change", filterProducts);
// 12. ĐẶT LẠI BỘ LỌC
resetButton.addEventListener("click", function() {
    searchInput.value = "";
    categoryFilter.value = "all";
    sortPrice.value = "default";
    filterProducts();
});
// 13. KHỞI ĐỘNG TRANG
document.addEventListener("DOMContentLoaded", function() {
    // Hiển thị tất cả sản phẩm
    filterProducts();
    // Hiển thị số lượng trong giỏ hàng
    updateCartCount();
});