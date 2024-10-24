document.addEventListener("DOMContentLoaded", () => {
    const locationInput = document.getElementById("location-input");
    const setLocationButton = document.getElementById("set-location");
    const locationDisplay = document.getElementById("location-display");
    const menuSection = document.getElementById("menu");
    const menuItems = document.getElementById("menu-items");
    const cartItems = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("total");
    const cart = [];
    
    let total = 0;

    // Restaurant data with menu items
    const restaurants = {
        1: { name: "Pizzeria", rating: 4.5, location: "Downtown", menu: [
            { name: "Margherita", price: 12, image: "https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco,w_1460/https://storage.googleapis.com/gen-atmedia/3/2012/07/f2203c0e403286947dcf80815b656236fec71e88.jpeg", available: true, reviews: [] },
            { name: "Pepperoni", price: 15, image: "https://th.bing.com/th/id/OIP.VwcArWBp03mwWVuoeXMndwHaHa?rs=1&pid=ImgDetMain", available: true, reviews: [] }
        ]},
        2: { name: "Sushi Place", rating: 4.8, location: "Uptown", menu: [
            { name: "California Roll", price: 10, image: "https://th.bing.com/th/id/OIP.hfELHBBsG_U7j6wsqHF69wHaE8?rs=1&pid=ImgDetMain", available: true, reviews: [] },
            { name: "Sashimi", price: 18, image: "https://lasvegas-sushi.com/wp-content/uploads/2018/04/OSAKA-Sashimi-8-845x684.jpg", available: false, reviews: [] }
        ]},
        3: { name: "Spicy Curry House", rating: 4.7, location: "Downtown", menu: [
            { name: "Butter Chicken", price: 14, image: "https://cheflolaskitchen.com/wp-content/uploads/2023/04/Butter-Chicken-9-1-785x1080.jpg", available: true, reviews: [] },
            { name: "Paneer Tikka", price: 12, image: "https://ministryofcurry.com/wp-content/uploads/2021/01/Paneer-Tikka_-2-1-850x1275.jpg", available: true, reviews: [] },
            { name: "Biryani", price: 15, image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-768x768.jpg", available: true, reviews: [] }
        ]},
        4: { name: "Delhi Diner", rating: 4.8, location: "Uptown", menu: [
            { name: "Chole Bhature", price: 10, image: "https://static.vecteezy.com/system/resources/previews/015/933/726/non_2x/chole-bhature-is-a-north-indian-food-dish-a-combination-of-chana-masala-and-bhatura-or-puri-free-photo.jpg", available: true, reviews: [] },
            { name: "Samosa", price: 5, image: "https://th.bing.com/th/id/OIP.ollRri5nxAHs2BPDr7no5gHaE3?rs=1&pid=ImgDetMain", available: true, reviews: [] },
            { name: "Dal Makhani", price: 13, image: "https://th.bing.com/th/id/OIP.giZqQvtTXt3PFYe6G3MG7AHaE8?rs=1&pid=ImgDetMain", available: false, reviews: [] }
        ]}
    };

    // Location functionality
    setLocationButton.addEventListener("click", () => {
        const locationValue = locationInput.value;
        if (locationValue) {
            locationDisplay.textContent = `Delivery Location: ${locationValue}`;
        } else {
            alert("Please enter a valid location.");
        }
    });

    // Show menu for the selected restaurant
    document.querySelectorAll('.view-menu').forEach(button => {
        button.addEventListener('click', (e) => {
            const restaurantId = e.target.closest('.restaurant').dataset.id;
            showMenu(restaurantId);
        });
    });

    function showMenu(restaurantId) {
        menuItems.innerHTML = ''; // Clear existing menu

        restaurants[restaurantId].menu.forEach(item => {
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name} - $${item.price}</p>
                <p>${item.available ? "Available" : "Not Available"}</p>
                <input type="number" class="item-quantity" min="1" value="1" style="width: 50px;">
                <button class="add-to-cart">Add to Cart</button>
                <div class="reviews">
                    <h4>Reviews:</h4>
                    <ul class="review-list"></ul>
                    <input type="text" placeholder="Your review" class="review-input" />
                    <button class="submit-review">Submit Review</button>
                </div>
            `;

            // Show existing reviews
            const reviewList = li.querySelector('.review-list');
            item.reviews.forEach(review => {
                const reviewItem = document.createElement('li');
                reviewItem.textContent = review;
                reviewList.appendChild(reviewItem);
            });

            // Add event listener for the review button
            const submitReviewButton = li.querySelector('.submit-review');
            submitReviewButton.addEventListener('click', () => {
                const reviewInput = li.querySelector('.review-input');
                if (reviewInput.value) {
                    item.reviews.push(reviewInput.value);
                    const newReviewItem = document.createElement('li');
                    newReviewItem.textContent = reviewInput.value;
                    reviewList.appendChild(newReviewItem);
                    reviewInput.value = ''; // Clear input
                } else {
                    alert('Please enter a review!');
                }
            });

            if (item.available) {
                const addButton = li.querySelector('.add-to-cart');
                addButton.addEventListener('click', () => {
                    const quantity = li.querySelector('.item-quantity').value;
                    addToCart(item, quantity);
                });
            }

            menuItems.appendChild(li);
        });

        document.getElementById('restaurants').classList.add('hidden');
        menuSection.classList.remove('hidden');
    }

    function addToCart(item, quantity) {
        const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
        const itemQuantity = parseInt(quantity);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += itemQuantity;
        } else {
            cart.push({ ...item, quantity: itemQuantity });
        }

        alert(`${item.name} (x${itemQuantity}) has been added to your cart.`);
        updateCart();
    }

    function updateCart() {
        cartItems.innerHTML = ''; // Clear existing cart
        total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove from Cart';
            removeButton.addEventListener('click', () => {
                removeFromCart(index);
            });

            li.appendChild(removeButton);
            cartItems.appendChild(li);
            total += item.price * item.quantity;
        });

        totalDisplay.textContent = total.toFixed(2);
        document.getElementById('cart').classList.remove('hidden');
    }

    function removeFromCart(index) {
        cart.splice(index, 1); // Remove the item from the cart
        updateCart(); // Update the cart display
    }

    document.getElementById('back').addEventListener('click', () => {
        menuSection.classList.add('hidden');
        document.getElementById('restaurants').classList.remove('hidden');
    });

    document.getElementById('proceed-to-payment').addEventListener('click', () => {
        document.getElementById('cart').classList.add('hidden');
        document.getElementById('payment').classList.remove('hidden');
    });

    document.getElementById('confirm-payment').addEventListener('click', () => {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCVC = document.getElementById('card-cvc').value;

        if (cardNumber && cardExpiry && cardCVC) {
            alert('Payment Successful! Your order is being processed.');
            cart.length = 0; // Clear the cart
            updateCart();
            document.getElementById('payment').classList.add('hidden');
            document.getElementById('restaurants').classList.remove('hidden');
        } else {
            alert('Please fill in all payment fields.');
        }
    });

    document.getElementById('back-to-cart').addEventListener('click', () => {
        document.getElementById('payment').classList.add('hidden');
        document.getElementById('cart').classList.remove('hidden');
    });
});
