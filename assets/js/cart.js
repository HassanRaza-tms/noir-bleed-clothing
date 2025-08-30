// Cart functionality for Noir Bleed e-commerce
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        const cartData = localStorage.getItem('noirBleedCart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('noirBleedCart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showAddToCartMessage(product.name);
    }

    // Remove item from cart
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
            }
        }
    }

    // Get total price
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Show add to cart message
    showAddToCartMessage(productName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa fa-check-circle"></i>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new ShoppingCart();

    // Add event listeners to all product containers
    const productContainers = document.querySelectorAll('.item');
    console.log('Product containers found:', productContainers.length); // Debugging log
    productContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Prevent adding product multiple times if clicking on cart icon
            if (e.target.classList.contains('fa-shopping-cart')) {
                return; // Let the cart icon click handler handle it if needed
            }

            const productName = this.querySelector('h4').textContent;
            const productPrice = parseFloat(this.querySelector('span').textContent.replace('$', ''));
            const productImage = this.querySelector('img').src;

            // Generate unique ID based on product name and price
            const productId = `${productName.toLowerCase().replace(/\s+/g, '-')}-${productPrice}`;

            console.log('Product details:', {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });

            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };

            console.log('Adding product to cart:', product);
            window.cart.addItem(product);
        });
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        #cart-count {
            background: #ff6b6b;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
            position: absolute;
            top: -5px;
            right: -5px;
            display: none;
        }
    `;
    document.head.appendChild(style);
});
