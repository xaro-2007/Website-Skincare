// Khởi tạo trang quản lý sản phẩm.
async function initProducts() {
    await prepareAdminData();

    const tableBody = document.getElementById("product-table-body");

    if (!tableBody) {
        return;
    }

    const dialog = document.getElementById("product-dialog");
    const form = document.getElementById("product-form");
    const dialogTitle = document.getElementById("dialog-title");

    const searchInput = document.getElementById("product-search");
    const categoryFilter = document.getElementById("category-filter");
    const emptyMessage = document.getElementById("empty-message");

    const totalProducts = document.getElementById("total-products");
    const totalCategories = document.getElementById("total-categories");
    const averagePrice = document.getElementById("average-price");

    // Hiển thị bảng sản phẩm, thống kê và kết quả lọc.
    function renderTable() {
        const keyword = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;
        const products = getProducts();

        const filtered = products.filter(function (product) {
            const matchName = String(product.name).toLowerCase().includes(keyword);
            const matchCategory =
                category === "all" || product.category === category;

            return matchName && matchCategory;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = "";
            emptyMessage.hidden = false;
        } else {
            emptyMessage.hidden = true;

            tableBody.innerHTML = filtered.map(function (product) {
                const id = escapeHTML(product.id);
                const name = escapeHTML(product.name);
                const image = escapeHTML(resolveAdminImage(product.img));
                const description = escapeHTML(product.description);
                const categoryName = escapeHTML(
                    product.categoryName ||
                    CATEGORY_NAMES[product.category] ||
                    product.category ||
                    "Mỹ phẩm"
                );
                const stock = product.stock !== undefined ? escapeHTML(product.stock) : "20";

                return (
                    "<tr>" +
                        "<td>" +
                            '<div style="display:flex;align-items:center;gap:10px;">' +
                                '<img src="' + image + '" alt="' + name + '"' +
                                    ' style="width:44px;height:44px;border-radius:8px;object-fit:cover;">' +
                                "<div>" +
                                    "<strong>" + name + "</strong><br>" +
                                    '<span style="font-size:12px;color:#817681;">' +
                                        description +
                                    "</span>" +
                                "</div>" +
                            "</div>" +
                        "</td>" +
                        "<td>" + categoryName + "</td>" +
                        "<td>" + formatMoney(product.price) + "</td>" +
                        "<td>" + stock + "</td>" +
                        "<td>" +
                            '<button class="small" type="button" data-action="edit"' +
                                ' data-id="' + id + '">Sửa</button> ' +
                            '<button class="small" type="button" data-action="delete"' +
                                ' data-id="' + id + '">Xóa</button>' +
                        "</td>" +
                    "</tr>"
                );
            }).join("");
        }

        const categories = [];
        let totalPrice = 0;

        products.forEach(function (product) {
            if (product.category && categories.indexOf(product.category) === -1) {
                categories.push(product.category);
            }

            totalPrice += Number(product.price) || 0;
        });

        totalProducts.textContent = products.length;
        totalCategories.textContent = categories.length;
        averagePrice.textContent = formatMoney(
            products.length > 0
                ? Math.round(totalPrice / products.length)
                : 0
        );
    }

    // Mở hộp thoại thêm mới hoặc chỉnh sửa sản phẩm.
    function openDialog(id) {
        form.reset();

        document.getElementById("product-id").value = "";
        document.getElementById("product-stock").value = "20";
        dialogTitle.textContent = "Thêm sản phẩm";

        if (id !== "") {
            const product = getProducts().find(function (item) {
                return String(item.id) === String(id);
            });

            if (!product) {
                alert("Không tìm thấy sản phẩm cần sửa.");
                return;
            }

            document.getElementById("product-id").value = product.id;
            document.getElementById("product-name").value = product.name;
            document.getElementById("product-category").value = product.category || "son";
            document.getElementById("product-price").value = product.price;
            document.getElementById("product-stock").value =
                product.stock !== undefined ? product.stock : 20;
            document.getElementById("product-image").value = product.img;
            document.getElementById("product-description").value =
                product.description || "";
            document.getElementById("product-badge").value = product.badge || "";

            dialogTitle.textContent = "Sửa sản phẩm";
        }

        dialog.showModal();
    }

    // Đóng hộp thoại sản phẩm.
    function closeDialog() {
        dialog.close();
        form.reset();
    }

    document.getElementById("add-product-btn").addEventListener("click", function () {
        openDialog("");
    });

    document.getElementById("close-dialog").addEventListener("click", closeDialog);
    document.getElementById("cancel-dialog").addEventListener("click", closeDialog);

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("product-id").value;
        const name = document.getElementById("product-name").value.trim();
        const category = document.getElementById("product-category").value;
        const price = Number(document.getElementById("product-price").value);
        const stock = Number(document.getElementById("product-stock").value);
        const image = document.getElementById("product-image").value.trim();
        const description =
            document.getElementById("product-description").value.trim();
        const badge = document.getElementById("product-badge").value.trim();

        if (name === "" || image === "") {
            alert("Vui lòng nhập tên và đường dẫn hình ảnh sản phẩm.");
            return;
        }

        if (isNaN(price) || price < 0) {
            alert("Giá bán phải là số không âm.");
            return;
        }

        if (isNaN(stock) || stock < 0) {
            alert("Số lượng tồn kho phải là số không âm.");
            return;
        }

        const products = getProducts();

        if (id === "") {
            products.push({
                id: nextId(products),
                name: name,
                category: category,
                categoryName: CATEGORY_NAMES[category],
                price: price,
                stock: stock,
                stars: "★★★★★",
                reviews: 50,
                img: image,
                description: description,
                badge: badge,
                badgeClass: "new"
            });

            addActivity('Thêm sản phẩm "' + name + '"');
        } else {
            const product = products.find(function (item) {
                return String(item.id) === String(id);
            });

            if (!product) {
                alert("Không tìm thấy sản phẩm cần sửa.");
                return;
            }

            product.name = name;
            product.category = category;
            product.categoryName = CATEGORY_NAMES[category];
            product.price = price;
            product.stock = stock;
            product.img = image;
            product.description = description;
            product.badge = badge;

            addActivity('Cập nhật sản phẩm "' + name + '"');
        }

        if (await saveProducts(products)) {
            closeDialog();
            renderTable();
        }
    });

    searchInput.addEventListener("input", renderTable);
    categoryFilter.addEventListener("change", renderTable);

    tableBody.addEventListener("click", async function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const id = button.dataset.id;

        if (button.dataset.action === "edit") {
            openDialog(id);
            return;
        }

        const products = getProducts();
        const product = products.find(function (item) {
            return String(item.id) === String(id);
        });

        if (!product) {
            return;
        }

        if (!confirm('Bạn có chắc muốn xóa sản phẩm "' + product.name + '"?')) {
            return;
        }

        const remaining = products.filter(function (item) {
            return String(item.id) !== String(id);
        });

        if (await saveProducts(remaining)) {
            addActivity('Xóa sản phẩm "' + product.name + '"');
            renderTable();
        }
    });

    renderTable();
}

initProducts();
