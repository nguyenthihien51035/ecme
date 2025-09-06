import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/user/Checkout.module.scss';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        address: '',
        different_address: false,
        note: '',
        payment: 'cod'
    });

    const generateVietQR = (bankId, accountNo, accountName, amount, description) => {
        const baseUrl = 'https://img.vietqr.io/image';
        const template = 'compact2'; // hoặc template khác

        const qrUrl = `${baseUrl}/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

        return qrUrl;
    };

    const BANK_ID = "VCB"; // Mã ngân hàng của bạn
    const ACCOUNT_NO = "1027714100"; // Số tài khoản của bạn  
    const ACCOUNT_NAME = "NGUYEN THI HIEN"; // Tên chủ tài khoản

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
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = 0; // Free shipping
    const total = subtotal + shippingFee;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Xử lý khi thay đổi phương thức thanh toán
        if (name === 'payment') {
            if (value === 'bank_transfer' && total > 0) {
                // Tạo QR preview với description tạm thời
                const previewQR = generateVietQR(
                    BANK_ID,
                    ACCOUNT_NO,
                    ACCOUNT_NAME,
                    total,
                    "PREVIEW ORDER" // Description tạm cho preview
                );
                setQrCodeUrl(previewQR);
            } else {
                setQrCodeUrl(''); // Xóa QR khi chọn COD
            }
        }
    };

    // cập nhật QR khi total thay đổi
    useEffect(() => {
        if (formData.payment === 'bank_transfer' && total > 0) {
            const previewQR = generateVietQR(
                BANK_ID,
                ACCOUNT_NO,
                ACCOUNT_NAME,
                total,
                "PREVIEW ORDER"
            );
            setQrCodeUrl(previewQR);
        }
    }, [total, formData.payment]);

    // Format price to Vietnamese currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    // Handle form submission
    const handleSubmit = async () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
            setError('Vui lòng đăng nhập để đặt hàng');
            setLoading(false);
            return;
        }
        console.log('Token exists:', !!token);
        console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');

        setLoading(true);
        setError('');
        setQrCodeUrl('');

        try {
            // Validate required fields
            if (!formData.name || !formData.phone || !formData.address) {
                throw new Error('Vui lòng điền đầy đủ thông tin');
            }

            if (cartItems.length === 0) {
                throw new Error('Giỏ hàng trống');
            }

            // Prepare order data matching your API
            const orderData = {
                shippingName: formData.name,
                shippingPhone: formData.phone,
                shippingAddress: formData.address,
                note: formData.note || '',
                paymentMethod: formData.payment === 'cod' ? 'COD' : 'BANK_TRANSFER',
                items: cartItems.map(item => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price  // Có thể cần đổi thành BigDecimal nếu lỗi
                })),
                subtotal: subtotal,
                shippingFee: shippingFee,
                total: total
            };

            // Call your API
            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                let errorMessage = `Lỗi: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.errorMessage || errorMessage;
                } catch (jsonError) {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                throw new Error('Server trả về dữ liệu không hợp lệ');
            }

            if (result.errorMessage) {
                throw new Error(result.errorMessage);
            }
            // Trong hàm handleSubmit, sau khi nhận response, thêm debug:
            console.log('Full API response:', result);
            console.log('Order response data:', result.data);
            console.log('QR Code URL from API:', result.data.qrCodeUrl);

            // Handle success
            const orderResponse = result.data;
            setOrderId(orderResponse.id);
            setOrderSuccess(true);

            // Sửa điều kiện QR code - kiểm tra cả 2 trường hợp
            if (orderResponse.qrCodeUrl) {  // Đơn giản hóa điều kiện
                console.log('Setting QR code URL:', orderResponse.qrCodeUrl);
                setQrCodeUrl(orderResponse.qrCodeUrl);
            }

            // Clear cart
            localStorage.removeItem('cart');
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { cartCount: 0 }
            }));
            setCartItems([]);

        } catch (err) {
            console.error('Order error:', err);
            setError(err.message || 'Có lỗi xảy ra khi đặt hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueShopping = () => {
        window.location.href = '/';
    };

    return (
        <div className={styles.checkout}>
            <div className={styles.container}>
                <div className={styles.checkoutGrid}>
                    {/* Form Section */}
                    <div className={styles.formSection}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>
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

                            {/* Success Message & QR Code */}
                            {orderSuccess && (
                                <div className={styles.successSection}>
                                    <div className={styles.successMessage}>
                                        <div className={styles.successIcon}>
                                            <svg viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3>Đặt hàng thành công!</h3>
                                        <p>Mã đơn hàng: <strong>#{orderId}</strong></p>
                                        <p>Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>

                                        <div className={styles.actionButtons}>
                                            <button
                                                onClick={() => navigate(`/orders/${orderId}`)}
                                                className={styles.viewOrderButton}
                                            >
                                                Xem chi tiết đơn hàng
                                            </button>
                                        </div>
                                    </div>
                                    {/* formData.payment === 'bank_transfer' &&  */}
                                    {/* QR Code for Bank Transfer */}
                                    {qrCodeUrl && (
                                        <div className={styles.qrCodeSection}>
                                            <h4>Quét mã QR để thanh toán</h4>
                                            <div className={styles.qrCodeContainer}>
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="QR Code thanh toán"
                                                    className={styles.qrCodeImage}
                                                />
                                            </div>
                                            <div className={styles.bankInfo}>
                                                <p className={styles.bankNote}>
                                                    Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh nhất.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                                <p className={styles.totalPrice}>
                                                    {formatPrice(item.quantity * item.price)}
                                                </p>
                                                <p className={styles.unitPrice}>
                                                    {formatPrice(item.price)} x {item.quantity}
                                                </p>
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