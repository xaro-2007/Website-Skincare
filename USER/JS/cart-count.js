(function() {
    function updateCartCount() {
        let cart = [];

        try {
            const storedCart = JSON.parse(localStorage.getItem("cart"));
            cart = Array.isArray(storedCart) ? storedCart : [];
        } catch (error) {
            console.error("Không đọc được dữ liệu giỏ hàng:", error);
        }

        const totalQuantity = cart.reduce((total, item) => {
            const quantity = Number(item.quantity);
            return total + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
        }, 0);

        document.querySelectorAll("#cart-count").forEach(element => {
            element.textContent = totalQuantity;
        });
    }

    document.addEventListener("DOMContentLoaded", updateCartCount);
    window.addEventListener("storage", event => {
        if (event.key === "cart" || event.key === null) {
            updateCartCount();
        }
    });
})();
