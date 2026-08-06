let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let users = JSON.parse(localStorage.getItem('users')) || {};
let loggedInUser = null;

function showHome() {
    hideAll();
    document.getElementById('home').classList.remove('hidden');
    displayProducts();
}

function showCart() {
    hideAll();
    document.getElementById('cart').classList.remove('hidden');
    displayCart();
    togglePaymentDetails(); // Show or hide payment details based on selected method
}

function showSellProduct() {
    hideAll();
    document.getElementById('sell-product').classList.remove('hidden');
}

function showLogin() {
    hideAll();
    document.getElementById('login').classList.remove('hidden');
}

function showRegister() {
    hideAll();
    document.getElementById('register').classList.remove('hidden');
}

function showOrders() {
    hideAll();
    document.getElementById('orders').classList.remove('hidden');
    displayOrders();
}

function hideAll() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('cart').classList.add('hidden');
    document.getElementById('sell-product').classList.add('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('register').classList.add('hidden');
    document.getElementById('orders').classList.add('hidden');
}

function addProduct() {
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').value;

    const product = { name, price, image };
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    alert('Product added!');

    // Reset fields
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';

    // Show updated products
    displayProducts();
}

function displayProducts() {
    const productContainer = document.getElementById('products');
    productContainer.innerHTML = '';

    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <p>Price: ₹${product.price}</p>
                <button onclick="addToCart(${index})">Add to Cart</button>
                <button onclick="buyProduct(${index})">Buy Now</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
        productContainer.appendChild(productDiv);
    });
}

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
}

function buyProduct(index) {
    alert(`You have chosen to buy ${products[index].name}.`);
}

function addToCart(index) {
    cart.push(products[index]);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
    showCart(); // Go to cart after adding
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <p>${item.name} - ₹${item.price}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContainer.appendChild(cartItemDiv);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function confirmOrder() {
    const address = document.getElementById('delivery-address').value;
    const contactNumber = document.getElementById('contact-number').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const order = {
        items: cart,
        address: address,
        contactNumber: contactNumber,
        paymentMethod: paymentMethod,
        status: 'Processing'
    };

    if (paymentMethod !== 'cod') {
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all payment details!');
            return;
        }

        // Here you can add logic for processing online payment
        alert(`Payment of ₹${cart.reduce((sum, item) => sum + parseFloat(item.price), 0)} made successfully!`);
    }

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    cart = []; // Clear cart after order
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Order confirmed!');

    // Show orders after confirming
    showOrders();
}

function cancelOrder(index) {
    if (confirm("Are you sure you want to cancel this order?")) {
        orders.splice(index, 1); // Remove the order from the array
        localStorage.setItem('orders', JSON.stringify(orders));
        alert('Order has been canceled.');
        showOrders(); // Refresh the order list
    }
}

function togglePaymentDetails() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const paymentDetails = document.getElementById('payment-details');

    if (paymentMethod !== 'cod') {
        paymentDetails.classList.remove('hidden');
    } else {
        paymentDetails.classList.add('hidden');
    }
}

document.querySelectorAll('input[name="payment-method"]').forEach(input => {
    input.addEventListener('change', togglePaymentDetails);
});

function displayOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    orders.forEach((order, index) => {
        const orderDiv = document.createElement('div');
        orderDiv.innerHTML = `
            <h3>Order #${index + 1}</h3>
            <p>Address: ${order.address}</p>
            <p>Contact Number: ${order.contactNumber}</p>
            <p>Payment Method: ${order.paymentMethod}</p>
            <p>Status: ${order.status}</p>
            <h4>Items:</h4>
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <p>${item.name} - ₹${item.price}</p>
                </div>
            `).join('')}
            <button onclick="cancelOrder(${index})">Cancel Order</button>
        `;
        orderList.appendChild(orderDiv);
    });
}

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (users[username]) {
        alert('User already exists!');
    } else {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful!');
        showLogin(); // Go to login after registration
    }
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (users[username] && users[username] === password) {
        alert('Login successful!');
        loggedInUser = username; // Set logged in user
        showSellProduct(); // Go to sell product page after login
    } else {
        alert('Invalid credentials!');
    }
}

// Initialize the app
showHome();