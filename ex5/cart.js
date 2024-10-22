const cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = localStorage.getItem('currentUser');

// Check if the user is logged in
if (!currentUser) {
    alert('You need to log in first!');
    window.location.href = 'login.html'; // Redirect to login if not logged in
}

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p><strong>Price:</strong> $${item.price}</p>
            <button class="remove-cart-btn" data-index="${index}">Remove from Cart</button>
        `;
        cartItems.appendChild(cartItemDiv);
    });
    
    document.getElementById('checkoutBtn').classList.remove('hidden');

    // Add event listeners for the remove buttons
    document.querySelectorAll('.remove-cart-btn').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Function to remove items from the cart
function removeFromCart(e) {
    const index = e.target.getAttribute('data-index');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    displayCart();
}

// Checkout functionality
document.getElementById('checkoutBtn').addEventListener('click', () => {
    document.getElementById('paymentModal').style.display = "block"; // Show the payment modal
});

// Function to process payment
function processPayment(method) {
    const paymentDetails = document.createElement('div');
    paymentDetails.innerHTML = `
        <h3>You chose: ${method}. Please enter your card details below:</h3>
        <input type="text" id="cardNumber" placeholder="Card Number" required>
        <input type="text" id="cvc" placeholder="CVC" required>
        <button onclick="confirmPayment('${method}')">Confirm Payment</button>
    `;
    document.querySelector('.modal-content').appendChild(paymentDetails);
}

// Confirm payment
function confirmPayment(method) {
    const cardNumber = document.getElementById('cardNumber').value;
    const cvc = document.getElementById('cvc').value;
    
    if (cardNumber && cvc) {
        alert(`Order placed successfully! 🎉`);
        cart.length = 0; // Clear the cart
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        displayCart(); // Refresh cart display
        closeModal(); // Close the modal
    } else {
        alert('Please enter both card number and CVC.');
    }
}

// Close payment modal
function closeModal() {
    document.getElementById('paymentModal').style.display = "none";
    document.querySelector('.modal-content').innerHTML = `
        <span class="close-button" onclick="closeModal()">&times;</span>
        <h2>Select Payment Method</h2>
        <button onclick="processPayment('Credit Card')">Credit Card</button>
        <button onclick="processPayment('PayPal')">PayPal</button>
        <button onclick="processPayment('Bank Transfer')">Bank Transfer</button>
    `;
}

// Logout functionality
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    });
}

// Display cart items on load
displayCart();
