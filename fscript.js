const restaurants = [
    {
        name: "Italian Bistro",
        rating: 4.5,
        image: "https://lovebeverlyhills.com/uploads/cache/Image/BlockFeaturedBlock/id/8618/db5f53060ad41ebc63376b5bc7c4b368d6ea86c0.jpg",
        menu: [
            { item: "Pasta", price: 10, image: "https://www.allrecipes.com/thmb/mvO1mRRH1zTz1SvbwBCTz78CRJI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/67700_RichPastaforthePoorKitchen_ddmfs_4x3_2284-220302ec8328442096df370dede357d7.jpg" },
            { item: "Pizza", price: 12, image: "https://www.allrecipes.com/thmb/qZ7LKGV1_RYDCgYGSgfMn40nmks=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-24878-bbq-chicken-pizza-beauty-4x3-39cd80585ad04941914dca4bd82eae3d.jpg" },
            { item: "Lasagna", price: 15, image: "https://www.cento.com/images/recipes/pasta/traditional_lasagne.webp" }
        ]
    },
    {
        name: "Chinese Corner",
        rating: 4.0,
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/df/b1/ae/chynna.jpg?w=600&h=400&s=1",
        menu: [
            { item: "Noodles", price: 8, image: "https://j6e2i8c9.rocketcdn.me/wp-content/uploads/2015/05/noodles_food_1.jpg" },
            { item: "Spring Rolls", price: 5, image: "https://simpletoscratch.com/wp-content/uploads/2020/05/spring-rolls-11.jpg" },
            { item: "Fried Rice", price: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO0Sds2N7j-aT95gmnHcz5xniQbzBPQYcUPw&s" }
        ]
    },
    {
        name: "Indian Spice",
        rating: 4.8,
        image: "https://www.architectandinteriorsindia.com/public/styles/740_411_wide_landscape/public/images/2020/05/09/Story-3-2.gif?-t63Pw_8",
        menu: [
            { item: "Butter Chicken", price: 12, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjM2y1wY1hw918dd9B3VJA7a6v7zhBxEsxCA&s" },
            { item: "Biryani", price: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL1O8U_pdtkJ-b1OjlElc6hT4solNppcFsuA&s" },
            { item: "Kabab", price: 2, image: "https://c.ndtvimg.com/2020-01/a39okhfk_620_625x300_21_January_20.jpg" }
        ]
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || {};

function displayRestaurants() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    restaurants.forEach((restaurant, index) => {
        const restaurantDiv = document.createElement('div');
        restaurantDiv.classList.add('restaurant');
        restaurantDiv.onclick = () => displayMenu(index);

        const restaurantImage = document.createElement('img');
        restaurantImage.src = restaurant.image;
        restaurantDiv.appendChild(restaurantImage);

        const restaurantName = document.createElement('h2');
        restaurantName.textContent = restaurant.name;
        restaurantDiv.appendChild(restaurantName);

        const rating = document.createElement('div');
        rating.classList.add('rating');
        rating.textContent = `Rating: ${restaurant.rating} ⭐`;
        restaurantDiv.appendChild(rating);

        content.appendChild(restaurantDiv);
    });
}

function displayMenu(index) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const restaurant = restaurants[index];
    const restaurantName = document.createElement('h2');
    restaurantName.textContent = restaurant.name;
    content.appendChild(restaurantName);

    restaurant.menu.forEach(menuItem => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('menu-item');
        
        const menuItemImage = document.createElement('img');
        menuItemImage.src = menuItem.image;
        menuItemDiv.appendChild(menuItemImage);

        menuItemDiv.appendChild(document.createElement('br'));
        menuItemDiv.appendChild(document.createTextNode(`${menuItem.item} - $${menuItem.price}`));

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 1;
        quantityInput.min = 1;

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.onclick = () => addToCart(menuItem, quantityInput.value);
        
        menuItemDiv.appendChild(quantityInput);
        menuItemDiv.appendChild(addButton);
        content.appendChild(menuItemDiv);
    });
}

function searchFood() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const content = document.getElementById('content');
    content.innerHTML = '';

    restaurants.forEach((restaurant) => {
        // Check if restaurant name matches the search query
        if (restaurant.name.toLowerCase().includes(query)) {
            const restaurantDiv = document.createElement('div');
            restaurantDiv.classList.add('restaurant');
            restaurantDiv.onclick = () => displayMenu(restaurants.indexOf(restaurant));

            const restaurantImage = document.createElement('img');
            restaurantImage.src = restaurant.image;
            restaurantDiv.appendChild(restaurantImage);

            const restaurantName = document.createElement('h2');
            restaurantName.textContent = restaurant.name;
            restaurantDiv.appendChild(restaurantName);

            const rating = document.createElement('div');
            rating.classList.add('rating');
            rating.textContent = `Rating: ${restaurant.rating} ⭐`;
            restaurantDiv.appendChild(rating);

            content.appendChild(restaurantDiv);
        }

        restaurant.menu.forEach((menuItem) => {
            // Check if menu item matches the search query
            if (menuItem.item.toLowerCase().includes(query)) {
                const menuItemDiv = document.createElement('div');
                menuItemDiv.classList.add('menu-item');

                const menuItemImage = document.createElement('img');
                menuItemImage.src = menuItem.image;
                menuItemDiv.appendChild(menuItemImage);

                menuItemDiv.appendChild(document.createElement('br'));
                menuItemDiv.appendChild(document.createTextNode(`${menuItem.item} - $${menuItem.price}`));

                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.value = 1;
                quantityInput.min = 1;

                const addButton = document.createElement('button');
                addButton.textContent = 'Add to Cart';
                addButton.onclick = () => addToCart(menuItem, quantityInput.value);
                
                menuItemDiv.appendChild(quantityInput);
                menuItemDiv.appendChild(addButton);
                content.appendChild(menuItemDiv);
            }
        });
    });
}

function addToCart(menuItem, quantity) {
    if (cart[menuItem.item]) {
        cart[menuItem.item].quantity += parseInt(quantity);
    } else {
        cart[menuItem.item] = { price: menuItem.price, quantity: parseInt(quantity) };
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${menuItem.item} added to cart!`);
}

function displayCart() {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Your Cart</h2>';

    let totalPrice = 0;

    for (const item in cart) {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item} - $${cart[item].price} x ${cart[item].quantity}`;
        totalPrice += cart[item].price * cart[item].quantity;
        content.appendChild(itemDiv);
    }

    const totalDiv = document.createElement('h3');
    totalDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
    content.appendChild(totalDiv);

    const placeOrderButton = document.createElement('button');
    placeOrderButton.textContent = 'Place Order';
    placeOrderButton.onclick = placeOrder;
    content.appendChild(placeOrderButton);
}

function placeOrder() {
    alert(`Order placed! Total: $${calculateTotalPrice().toFixed(2)}`);
    cart = {};
    localStorage.removeItem('cart');
    displayCart();
}

function calculateTotalPrice() {
    return Object.keys(cart).reduce((total, item) => total + cart[item].price * cart[item].quantity, 0);
}

// Event listeners for navigation
document.getElementById('home-button').onclick = displayRestaurants;
document.getElementById('cart-button').onclick = displayCart;
document.getElementById('search-bar').addEventListener('input', searchFood);

// Initial call to display restaurants on page load
displayRestaurants();
