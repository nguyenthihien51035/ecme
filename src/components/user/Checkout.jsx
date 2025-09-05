import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/user/Checkout.module.scss';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        address: '',
        different_address: false,
        note: '',
        payment: 'cod'
    });

    // Load cart items from localStorage
    useEffect(() => {
        try {
            const cart = localStorage.getItem('cart');
            if (cart) {
                setCartItems(JSON.parse(cart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }

        // Load user info if available
        try {
            const userInfo = localStorage.getItem('user');
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                setUser(userData);
                setFormData(prev => ({
                    ...prev,
                    email: userData.email || '',
                    name: userData.fullname || userData.name || '',
                    address: userData.address || ''
                }));
            }
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }, []);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const finalPrice = item.discountPrice && item.discountPrice < item.price
            ? item.discountPrice
            : item.price;
        return sum + (finalPrice * item.quantity);
    }, 0);

    const shippingFee = 0; // Free shipping
    const total = subtotal + shippingFee;

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Format price to Vietnamese currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.email || !formData.name || !formData.phone || !formData.address) {
                throw new Error('Vui lòng điền đầy đủ thông tin');
            }

            if (cartItems.length === 0) {
                throw new Error('Giỏ hàng trống');
            }

            // Prepare order data
            const orderData = {
                customerInfo: {
                    email: formData.email,
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    note: formData.note
                },
                items: cartItems.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    name: item.name,
                    sku: item.sku,
                    color: item.color,
                    size: item.size,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                payment: formData.payment,
                subtotal: subtotal,
                shippingFee: shippingFee,
                total: total,
                orderDate: new Date().toISOString()
            };

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Order placed:', orderData);

            // Clear cart after successful order
            localStorage.removeItem('cart');

            // Dispatch cart updated event
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { cartCount: 0 }
            }));

            // Show success message
            alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');

            // Reset form
            setFormData({
                email: '',
                name: '',
                phone: '',
                address: '',
                different_address: false,
                note: '',
                payment: 'cod'
            });
            setCartItems([]);

        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi đặt hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueShopping = () => {
        window.location.href = '/';
    };

    const navigate = useNavigate();

    return (
        <div className={styles.checkout}>
            <div className={styles.container}>
                <div className={styles.checkoutGrid}>
                    {/* Form Section */}
                    <div className={styles.formSection}>
                        <div className={styles.header}>
                            <h1 className={styles.title} onClick={() => navigate('/')}>
                                RUBIES <span className={styles.subtitle}>est. 2015</span>
                            </h1>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formContainer}>
                            {/* Email */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            {/* Name & Phone */}
                            <div className={styles.gridTwo}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Họ và tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Họ và tên"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Số điện thoại</label>
                                    <div className={styles.phoneInput}>
                                        <img
                                            src="https://flagcdn.com/w20/vn.png"
                                            alt="VN"
                                            className={styles.flagIcon}
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Số điện thoại"
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Địa chỉ"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            {/* <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    name="different_address"
                                    checked={formData.different_address}
                                    onChange={handleInputChange}
                                    className={styles.checkbox}
                                />
                                <label className={styles.checkboxLabel}>Giao hàng đến địa chỉ khác</label>
                            </div> */}

                            {/* Notes */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Ghi chú (tùy chọn)</label>
                                <textarea
                                    rows="3"
                                    name="note"
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    placeholder="Ghi chú"
                                    className={styles.textarea}
                                />
                            </div>

                            {/* Payment */}
                            <div className={styles.paymentSection}>
                                <h3 className={styles.paymentTitle}>Thanh toán</h3>
                                <div className={styles.radioGroup}>
                                    <label className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="bank_transfer"
                                            checked={formData.payment === 'bank_transfer'}
                                            onChange={handleInputChange}
                                            className={styles.radio}
                                        />
                                        <span className={styles.radioLabel}>Chuyển khoản qua ngân hàng</span>
                                    </label>
                                    <label className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={formData.payment === 'cod'}
                                            onChange={handleInputChange}
                                            className={styles.radio}
                                        />
                                        <span className={styles.radioLabel}>Thanh toán khi giao hàng (COD)</span>
                                    </label>
                                    <p className={styles.paymentNote}>Bạn chỉ phải thanh toán khi nhận được hàng</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading || cartItems.length === 0}
                                className={`${styles.submitButton} ${(loading || cartItems.length === 0) ? styles.disabled : ''}`}
                            >
                                {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className={styles.summarySection}>
                        <div className={styles.summaryCard}>
                            {/* Products (scrollable) */}
                            <div className={styles.productsContainer}>
                                {cartItems.length === 0 ? (
                                    <div className={styles.emptyCart}>
                                        <div className={styles.emptyIcon}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <p className={styles.emptyText}>Giỏ hàng trống</p>
                                        <p className={styles.emptySubtext}>Thêm sản phẩm để tiếp tục</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={`${item.productId}-${item.variantId}`} className={styles.productItem}>
                                            <div className={styles.productImageContainer}>
                                                <img
                                                    src={item.image}
                                                    className={styles.productImage}
                                                    alt={item.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                                    }}
                                                />
                                                <span className={styles.quantityBadge}>
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className={styles.productInfo}>
                                                <h4 className={styles.productName}>{item.name}</h4>
                                                <p className={styles.productVariants}>
                                                    <span className={styles.variantTag}>{item.color}</span>
                                                    <span className={styles.variantTag}>{item.size}</span>
                                                </p>
                                                <p className={styles.productSku}>Mã: {item.sku}</p>
                                            </div>
                                            <div className={styles.productPrice}>
                                                {item.discountPrice && item.discountPrice < item.price ? (
                                                    <>
                                                        <p className={styles.totalPrice}>
                                                            {formatPrice(item.quantity * item.discountPrice)}
                                                        </p>
                                                        <p className={styles.unitPrice}>
                                                            <span className={styles.originalPrice}>{formatPrice(item.price)}</span>
                                                            <span className={styles.salePrice}>{formatPrice(item.discountPrice)} x {item.quantity}</span>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className={styles.totalPrice}>
                                                            {formatPrice(item.quantity * item.price)}
                                                        </p>
                                                        <p className={styles.unitPrice}>
                                                            {formatPrice(item.price)} x {item.quantity}
                                                        </p>
                                                    </>
                                                )}

                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Summary (fixed bottom) */}
                            <div className={styles.summaryBottom}>
                                <div className={styles.summaryCalculations}>
                                    <div className={styles.summaryRow}>
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span>Phí vận chuyển</span>
                                        <span className={styles.freeShipping}>
                                            {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                                        </span>
                                    </div>
                                    <hr className={styles.divider} />
                                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                        <span>Tổng cộng</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <div className={styles.continueSection}>
                                    <button
                                        onClick={handleContinueShopping}
                                        className={styles.continueButton}
                                    >
                                        ← Tiếp tục mua hàng
                                    </button>
                                </div>

                                {/* Trust badges */}
                                <div className={styles.trustBadges}>
                                    <div className={styles.badge}>
                                        <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Bảo mật
                                    </div>
                                    <div className={styles.badge}>
                                        <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                        </svg>
                                        Giao nhanh
                                    </div>
                                    <div className={styles.badge}>
                                        <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                        Hỗ trợ 24/7
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;