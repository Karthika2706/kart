document.addEventListener("DOMContentLoaded", () => {
    const cartItemsElement = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("total");
    const emptyCartMessage = document.getElementById("empty-cart-message");

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    function updateCartDisplay() {
        cartItemsElement.innerHTML = ""; // Clear existing cart
        total = 0;

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            totalDisplay.textContent = '0.00';
        } else {
            emptyCartMessage.classList.add('hidden');
            cart.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
                cartItemsElement.appendChild(li);
                total += item.price * item.quantity;
            });
            totalDisplay.textContent = total.toFixed(2);
        }
    }

    updateCartDisplay();

    document.getElementById("proceed-to-payment").addEventListener("click", () => {
        // Logic to proceed to payment can be added here
        window.location.href = "payment.html"; // Redirect to payment page (if you have one)
    });
});
