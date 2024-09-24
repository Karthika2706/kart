const restaurants = [
    { id: 1, name: "Pizza Place", menu: [{ id: 1, name: "Margherita", price: 10 }, { id: 2, name: "Pepperoni", price: 12 }] },
    { id: 2, name: "Burger Joint", menu: [{ id: 3, name: "Cheeseburger", price: 8 }, { id: 4, name: "Veggie Burger", price: 9 }] },
    { id: 3, name: "Sushi Spot", menu: [{ id: 5, name: "California Roll", price: 7 }, { id: 6, name: "Spicy Tuna Roll", price: 10 }] }
];

let cart = [];

function displayRestaurants() {
    const restaurantUl = document.getElementById('restaurants');
    restaurantUl.innerHTML = ''; // Clear existing items
    restaurants.forEach(restaurant => {
        const li = document.createElement('li'); // Create list item
        const button = document.createElement('button'); // Create button
        button.innerText = restaurant.name;
        button.onclick = () => displayMenu(restaurant);
        li.appendChild(button); // Append button to list item
        restaurantUl.appendChild(li); // Append list item to ul
    });
}

function displayMenu(restaurant) {
    document.getElementById('restaurant-list').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    const menuDiv = document.getElementById('menu-items');
    menuDiv.innerHTML = '';
    restaurant.menu.forEach(item => {
        const button = document.createElement('button');
        button.innerText = `${item.name} - $${item.price}`;
        button.onclick = () => addToCart(item);
        menuDiv.appendChild(button);
    });
}

function addToCart(item) {
    cart.push(item);
    alert(`${item.name} has been added to your cart!`);
    displayCart();
}

function displayCart() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('cart').style.display = 'block';
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Your cart is empty!</p>';
    } else {
        cart.forEach(item => {
            cartDiv.innerHTML += `<p>${item.name} - $${item.price}</p>`;
            totalPrice += item.price;
        });
        cartDiv.innerHTML += `<p><strong>Total: $${totalPrice}</strong></p>`;
    }
}

document.getElementById('back-btn').onclick = () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('restaurant-list').style.display = 'block';
};

document.getElementById('checkout-btn').onclick = () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    alert("Order placed successfully!");
    cart = []; // Clear the cart after placing an order
    displayCart();
};

document.getElementById('clear-cart-btn').onclick = () => {
    cart = [];
    displayCart();
};

// Back to restaurants from the cart
document.getElementById('back-to-restaurant-btn').onclick = () => {
    document.getElementById('cart').style.display = 'none';
    document.getElementById('restaurant-list').style.display = 'block';
};

// Initial display
displayRestaurants();
