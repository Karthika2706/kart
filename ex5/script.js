const items = JSON.parse(localStorage.getItem('items')) || [];
const cart = [];
let currentUser = localStorage.getItem('currentUser');

// Check if the login page is loaded
if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username && password) {
            localStorage.setItem('currentUser', username);
            alert('Login successful!');
            window.location.href = 'index.html'; // Redirect to main page
        } else {
            alert('Please enter both username and password.');
        }
    });
}

// Check if the main page is loaded
if (document.getElementById('logoutBtn')) {
    if (!currentUser) {
        alert('You need to log in first!');
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    });
}

// Navigation buttons
document.getElementById('productsBtn').addEventListener('click', () => {
    displayItems();
    document.getElementById('cart').classList.add('hidden');
});

document.getElementById('postAdBtn').addEventListener('click', () => {
    document.getElementById('itemForm').classList.toggle('hidden');
});

document.getElementById('cartBtn').addEventListener('click', () => {
    displayCart();
    document.getElementById('itemList').innerHTML = '';
});

// Adding item functionality
if (document.getElementById('submitItemBtn')) {
    document.getElementById('submitItemBtn').addEventListener('click', (e) => {
        e.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemPrice = document.getElementById('itemPrice').value;
        const itemDescription = document.getElementById('itemDescription').value;
        const itemImageInput = document.getElementById('itemImage');

        if (itemName && itemPrice) {
            const item = {
                name: itemName,
                price: itemPrice,
                description: itemDescription,
                owner: currentUser,
                image: itemImageInput.files[0] ? URL.createObjectURL(itemImageInput.files[0]) : null,
            };
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items)); // Save items to localStorage
            displayItems();
            document.getElementById('itemForm').reset();
            document.getElementById('itemForm').classList.add('hidden');
        } else {
            alert('Please fill in all fields.');
        }
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('itemForm').classList.add('hidden');
    });
}

function displayItems() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.innerHTML = `
            <h2>${item.name}</h2>
            <p><strong>Price:</strong> $${item.price}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Owner:</strong> ${item.owner}</p>
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image">` : ''}
            <button class="add-to-cart-btn" data-index="${index}">Add to Cart</button>
            ${item.owner === currentUser ? `<button class="remove-btn" data-index="${index}">Remove</button>` : ''}
        `;
        itemList.appendChild(itemDiv);
    });
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

function addToCart(e) {
    const index = e.target.getAttribute('data-index');
    cart.push(items[index]);
    alert(`${items[index].name} added to cart.`);
}

function removeItem(e) {
    const index = e.target.getAttribute('data-index');
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items)); // Update localStorage
    displayItems();
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
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
    document.getElementById('cart').classList.remove('hidden');

    document.querySelectorAll('.remove-cart-btn').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

function removeFromCart(e) {
    const index = e.target.getAttribute('data-index');
    cart.splice(index, 1);
    displayCart();
}

// Checkout functionality
document.getElementById('checkoutBtn').addEventListener('click', () => {
    const paymentMethod = prompt('Please enter your payment method (e.g., Credit Card, PayPal):');
    if (paymentMethod) {
        alert(`Checkout successful! Payment method: ${paymentMethod}`);
        cart.length = 0; // Clear the cart
        displayCart();
    }
});

// Display items on initial load
if (document.getElementById('itemList')) {
    displayItems();
}