

// Initialize items and cart
const items = JSON.parse(localStorage.getItem('items')) || [];
const cart = [];
let currentUser = localStorage.getItem('currentUser');

// Handle login functionality
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username && password) {
            localStorage.setItem('currentUser', username);
            alert('Login successful!');
            window.location.href = 'web.html'; // Redirect to main page
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
    window.location.href = 'cart.html'; // Redirect to cart page
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
            const file = itemImageInput.files[0];
            const reader = new FileReader();

            reader.onloadend = function () {
                const item = {
                    name: itemName,
                    price: itemPrice,
                    description: itemDescription,
                    owner: currentUser,
                    image: reader.result, // Store the base64 string
                };
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items)); // Save items to localStorage
                displayItems();
                document.getElementById('itemForm').reset();
                document.getElementById('itemForm').classList.add('hidden');
            };

            if (file) {
                reader.readAsDataURL(file); // Convert image to base64
            } else {
                alert('Please upload an image.');
            }
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

// Checkout functionality
if (document.getElementById('checkoutBtn')) {
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        const paymentMethodContainer = document.getElementById('paymentOptions');
        paymentMethodContainer.classList.remove('hidden');
    });

    document.querySelectorAll('.payment-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const paymentMethod = e.target.getAttribute('data-method');
            const cardDetails = prompt(`Enter your card details for ${paymentMethod}:\nCard Number:\nCVC:`);
            if (cardDetails) {
                alert('Order placed successfully! 🎉');
                cart.length = 0; // Clear the cart
                window.location.href = 'index.html'; // Redirect to main page
            }
        });
    });
}

// Display items on initial load
if (document.getElementById('itemList')) {
    displayItems();
}
