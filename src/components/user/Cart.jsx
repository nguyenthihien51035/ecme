import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/user/Cart.module.scss';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Load cart from localStorage
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Save cart to localStorage
    const saveCartToStorage = (updatedCart) => {
        try {
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            // Dispatch event to update cart count in header
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { cartCount: updatedCart.reduce((total, item) => total + item.quantity, 0) }
            }));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    // Update quantity
    // Update quantity
    const updateQuantity = (itemIndex, change) => {
        const updatedCart = [...cartItems];
        const currentQuantity = updatedCart[itemIndex].quantity;
        const newQuantity = currentQuantity + change;

        if (currentQuantity === 1 && change === -1) {
            // Khi số lượng là 1 và ấn dấu trừ, xóa sản phẩm
            removeItem(itemIndex, false); // false = no confirmation needed
        } else if (newQuantity > 0) {
            updatedCart[itemIndex].quantity = newQuantity;
            setCartItems(updatedCart);
            saveCartToStorage(updatedCart);
        }
    };

    // Set quantity directly
    const setQuantity = (itemIndex, quantity) => {
        const updatedCart = [...cartItems];
        const newQuantity = parseInt(quantity);

        // Nếu input rỗng hoặc không phải số hợp lệ, giữ nguyên giá trị cũ
        if (isNaN(newQuantity) || quantity === '') {
            return;
        }

        if (newQuantity <= 0) {
            removeItem(itemIndex, false);
        } else {
            updatedCart[itemIndex].quantity = newQuantity;
            setCartItems(updatedCart);
            saveCartToStorage(updatedCart);
        }
    };

    // Remove item from cart
    const removeItem = (itemIndex) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            const updatedCart = cartItems.filter((_, index) => index !== itemIndex);
            setCartItems(updatedCart);
            saveCartToStorage(updatedCart);
        }
    };

    // Calculate total
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.discountPrice || item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    // Handle checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Giỏ hàng của bạn đang trống');
            return;
        }
        // Check stock for each item
        const stockErrors = [];

        for (let item of cartItems) {
            if (item.quantity > item.maxQuantity) {
                stockErrors.push(`• ${item.name} (${item.size}/${item.color}): Chỉ còn ${item.maxQuantity} sản phẩm có thể đặt hàng`);
            }
        }

        if (stockErrors.length > 0) {
            let errorMessage = 'Một số sản phẩm trong giỏ hàng vượt quá số lượng tồn kho:\n\n';
            errorMessage += stockErrors.join('\n');
            errorMessage += '\n\nVui lòng điều chỉnh số lượng và thử lại.';

            alert(errorMessage);
            return;
        }

        navigate("/checkout");
    };

    if (loading) {
        return <div className={styles.loading}>Đang tải giỏ hàng...</div>;
    }

    return (
        <div className={styles.cartPage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <div className={styles.container}>
                    <ul className={styles.breadcrumbList}>
                        <li><a href="/">Trang chủ</a></li>
                        <li><i className="fa-solid fa-angle-right"></i></li>
                        <li className={styles.current}>Giỏ hàng</li>
                    </ul>
                </div>
            </div>

            {/* Cart Title */}
            <div className={styles.cartTitle}>
                <div className={styles.container}>
                    <h1>Giỏ hàng của bạn</h1>
                </div>
            </div>

            {/* Cart Content */}
            <div className={styles.cartContent}>
                <div className={styles.container}>
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <h2>Giỏ hàng của bạn đang trống</h2>
                            <p>Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
                            <a href="/" className={styles.continueShopping}>
                                Tiếp tục mua hàng
                            </a>
                        </div>
                    ) : (
                        <>
                            {/* Cart Header */}
                            <div className={styles.cartHeader}>
                                <div className={styles.productInfo}>Thông tin sản phẩm</div>
                                <div className={styles.unitPrice}>Đơn giá</div>
                                <div className={styles.quantity}>Số lượng</div>
                                <div className={styles.totalPrice}>Thành tiền</div>
                            </div>

                            {/* Cart Items */}
                            <div className={styles.cartBody}>
                                {cartItems.map((item, index) => (
                                    <div key={`${item.productId}-${item.variantId}`}
                                        className={`${styles.cartItem} ${index === cartItems.length - 1 ? styles.lastItem : ''}`}>

                                        <div className={styles.productSection} onClick={() => handleProductClick(item.productId)}>
                                            <div className={styles.productImage}>
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className={styles.productDetails}>
                                                <h3 className={styles.productName}>
                                                    <a href={`/products/${item.productId}`}>{item.name}</a>
                                                </h3>
                                                <p className={styles.productVariant}>
                                                    {item.size} / {item.color}
                                                </p>
                                                <button
                                                    className={styles.removeButton}
                                                    onClick={() => removeItem(index)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.priceSection}>
                                            <span className={styles.price}>
                                                {formatPrice(item.discountPrice || item.price)}
                                            </span>
                                        </div>

                                        <div className={styles.quantitySection}>
                                            <div className={styles.quantityControls}>
                                                <button
                                                    className={styles.quantityButton}
                                                    onClick={() => updateQuantity(index, -1)}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    className={styles.quantityInput}
                                                    value={item.quantity}
                                                    onChange={(e) => setQuantity(index, e.target.value)}
                                                    min="0"
                                                />
                                                <button
                                                    className={styles.quantityButton}
                                                    onClick={() => updateQuantity(index, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.totalSection}>
                                            <span className={styles.itemTotal}>
                                                {formatPrice((item.discountPrice || item.price) * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Footer */}
                            <div className={styles.cartFooter}>
                                <div className={styles.continueShoppingSection}>
                                    <a href="/" className={styles.continueShopping}>
                                        Tiếp tục mua hàng
                                    </a>
                                </div>

                                <div className={styles.checkoutSection}>
                                    <div className={styles.totalAmount}>
                                        <span className={styles.totalLabel}>Tổng tiền:</span>
                                        <span className={styles.totalValue}>
                                            {formatPrice(calculateTotal())}
                                        </span>
                                    </div>
                                    <button
                                        className={styles.checkoutButton}
                                        onClick={handleCheckout}
                                    >
                                        Thanh toán
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;