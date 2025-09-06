import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/user/OrderDetail.module.scss';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
            setError('Vui lòng đăng nhập để xem đơn hàng');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                let errorMessage = `Lỗi: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.errorMessage || errorMessage;
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            if (result.errorMessage) {
                throw new Error(result.errorMessage);
            }

            setOrder(result.data);
        } catch (err) {
            console.error('Fetch order error:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#f59e0b';
            case 'CONFIRMED': return '#3b82f6';
            case 'PROCESSING': return '#8b5cf6';
            case 'SHIPPED': return '#06b6d4';
            case 'DELIVERED': return '#10b981';
            case 'CANCELLED': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'PROCESSING': return 'Đang xử lý';
            case 'SHIPPED': return 'Đang giao hàng';
            case 'DELIVERED': return 'Đã giao hàng';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    const handleBackToOrders = () => {
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Đang tải thông tin đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <div className={styles.errorIcon}>⚠️</div>
                <h3>Có lỗi xảy ra</h3>
                <p>{error}</p>
                <button onClick={handleBackToOrders} className={styles.backButton}>
                    Quay lại danh sách đơn hàng
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.error}>
                <div className={styles.errorIcon}>📦</div>
                <h3>Không tìm thấy đơn hàng</h3>
                <p>Đơn hàng không tồn tại hoặc đã bị xóa</p>
                <button onClick={handleBackToOrders} className={styles.backButton}>
                    Quay lại danh sách đơn hàng
                </button>
            </div>
        );
    }

    return (
        <div className={styles.orderDetails}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <button onClick={handleBackToOrders} className={styles.backBtn}>
                        ← Quay lại
                    </button>
                    <div className={styles.orderTitle}>
                        <h1>Chi tiết đơn hàng #{order.id}</h1>
                        <div
                            className={styles.status}
                            style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                            {getStatusText(order.status)}
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Order Info */}
                    <div className={styles.orderInfo}>
                        <div className={styles.infoCard}>
                            <h3>Thông tin đơn hàng</h3>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <label>Ngày đặt hàng:</label>
                                    <span>{formatDate(order.orderDate)}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Phương thức thanh toán:</label>
                                    <span>{order.paymentMethod === 'COD' ? 'Thanh toán khi giao hàng' : 'Chuyển khoản ngân hàng'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Tình trạng:</label>
                                    <span
                                        className={styles.statusText}
                                        style={{ color: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                                {order.note && (
                                    <div className={styles.infoItem}>
                                        <label>Ghi chú:</label>
                                        <span>{order.note}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className={styles.infoCard}>
                            <h3>Thông tin giao hàng</h3>
                            <div className={styles.shippingInfo}>
                                <p><strong>{order.shippingName}</strong></p>
                                <p>📞 {order.shippingPhone}</p>
                                <p>📍 {order.shippingAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className={styles.orderItems}>
                        <h3>Sản phẩm đã đặt</h3>
                        <div className={styles.itemsList}>
                            {order.items && order.items.map((item, index) => (
                                <div key={index} className={styles.orderItem}>
                                    <div className={styles.itemImage}>
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'}
                                            alt={item.productName || 'Sản phẩm'}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h4>{item.productName || 'Tên sản phẩm'}</h4>
                                        <div className={styles.itemVariants}>
                                            <span className={styles.variantTag}>
                                                {item.color || 'Màu sắc'}
                                            </span>
                                            <span className={styles.variantTag}>
                                                {item.size || 'Kích thước'}
                                            </span>
                                        </div>
                                        <p className={styles.itemSku}>
                                            SKU: {item.sku || 'N/A'}
                                        </p>
                                    </div>
                                    <div className={styles.itemQuantity}>
                                        <span>x{item.quantity}</span>
                                    </div>
                                    <div className={styles.itemPrice}>
                                        <div className={styles.unitPrice}>
                                            {formatPrice(item.price)}
                                        </div>
                                        <div className={styles.totalPrice}>
                                            {formatPrice(item.totalPrice)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Order Summary */}
                    <div className={styles.orderSummary}>
                        <h3>Tổng kết đơn hàng</h3>
                        <div className={styles.summaryContent}>
                            <div className={styles.summaryRow}>
                                <span>Tạm tính:</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Phí vận chuyển:</span>
                                <span>{order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}</span>
                            </div>
                            <hr />
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Tổng cộng:</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code nếu là chuyển khoản */}
                    {order.paymentMethod === 'BANK_TRANSFER' && order.qrCodeUrl && (
                        <div className={styles.qrCodeSection}>
                            <h3>Thông tin thanh toán</h3>
                            <div className={styles.qrCodeContent}>
                                <div className={styles.qrCodeContainer}>
                                    <img
                                        src={order.qrCodeUrl}
                                        alt="QR Code thanh toán"
                                        className={styles.qrCodeImage}
                                    />
                                </div>
                                <div className={styles.paymentInfo}>
                                    <p className={styles.paymentNote}>
                                        Quét mã QR để thanh toán hoặc chuyển khoản với nội dung:
                                    </p>
                                    <div className={styles.transferInfo}>
                                        <div className={styles.amount}>
                                            Số tiền: <strong>{formatPrice(order.total)}</strong>
                                        </div>
                                        <div className={styles.content}>
                                            Nội dung: <strong>ORDER{order.id}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.orderActions}>
                        <button
                            onClick={handleContinueShopping}
                            className={styles.continueButton}
                        >
                            Tiếp tục mua hàng
                        </button>
                        {order.status === 'PENDING' && (
                            <button
                                className={styles.cancelButton}
                                onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                                        // Gọi API hủy đơn hàng
                                        console.log('Cancel order:', order.id);
                                    }
                                }}
                            >
                                Hủy đơn hàng
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;