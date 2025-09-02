import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Package,
    Tag,
    Calendar,
    User,
    Image as ImageIcon,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import styles from '../../styles/admin/ProductDetail.module.scss';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/products/${id}`);
            const productData = response.data.data || response.data;
            setProduct(productData);
        } catch (error) {
            console.error('Error loading product:', error);
            setError('Không thể tải thông tin sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/admin/products/edit/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await api.delete(`/products/${id}`);
                alert('Xóa sản phẩm thành công!');
                navigate('/admin/products');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Lỗi khi xóa sản phẩm!');
            }
        }
    };

    const handleBack = () => {
        navigate('/admin/products');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTotalQuantity = (variants) => {
        if (!variants || variants.length === 0) return 0;
        return variants.reduce((total, variant) => total + (variant.quantity || 0), 0);
    };

    const calculateDiscountPercent = (originalPrice, discountPrice) => {
        if (!discountPrice || discountPrice >= originalPrice) return 0;
        return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <span>Đang tải thông tin sản phẩm...</span>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.container}>
                <div className={styles.errorWrapper}>
                    <AlertCircle size={48} className={styles.errorIcon} />
                    <h2>Có lỗi xảy ra</h2>
                    <p>{error || 'Không tìm thấy sản phẩm'}</p>
                    <button onClick={handleBack} className={styles.backButton}>
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }
    const getAllImages = (variants) => {
        const allImages = [];
        variants?.forEach(variant => {
            variant.images?.forEach(image => {
                if (!allImages.some(img => img.imageUrl === image.imageUrl)) {
                    allImages.push(image);
                }
            });
        });
        return allImages;
    };

    const images = getAllImages(product.variants) || [];
    const variants = product.variants || [];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <button onClick={handleBack} className={styles.backButton}>
                        <ArrowLeft size={20} />
                        Quay lại
                    </button>
                    <div>
                        <h1 className={styles.title}>{product.name}</h1>
                        <div className={styles.breadcrumb}>
                            <span>Sản phẩm</span>
                            <span>/</span>
                            <span>{product.category?.name || 'N/A'}</span>
                            <span>/</span>
                            <span>Chi tiết</span>
                        </div>
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <button onClick={loadProduct} className={styles.refreshButton}>
                        <RefreshCw size={20} />
                        Làm mới
                    </button>
                    <button onClick={handleEdit} className={styles.editButton}>
                        <Edit size={20} />
                        Chỉnh sửa
                    </button>
                    <button onClick={handleDelete} className={styles.deleteButton}>
                        <Trash2 size={20} />
                        Xóa
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {/* Main Info */}
                <div className={styles.mainInfo}>
                    {/* Images */}
                    <div className={styles.imageSection}>
                        <div className={styles.mainImageContainer}>
                            {images.length > 0 ? (
                                <img
                                    src={images[selectedImage]?.imageUrl} // Hiển thị ảnh theo index được chọn
                                    alt={product.name}
                                    className={styles.mainImage}
                                />
                            ) : (
                                <div className={styles.noImage}>
                                    <ImageIcon size={64} />
                                    <span>Không có hình ảnh</span>
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.imageUrl}
                                        alt={`${product.name} ${index + 1}`}
                                        className={`${styles.thumbnail} ${index === selectedImage ? styles.active : ''}`} // Click để thay đổi ảnh chính
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className={styles.basicInfo}>
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <h2>Thông tin cơ bản</h2>
                                <div className={styles.statusBadges}>
                                    <span className={`${styles.status} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
                                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                    <span className={`${styles.status} ${product.isActive ? styles.active : styles.inactive}`}>
                                        {product.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <label>ID sản phẩm</label>
                                    <span className={styles.productId}>#{product.id}</span>
                                </div>

                                <div className={styles.infoItem}>
                                    <label>Mã sản phẩm (SKU)</label>
                                    <code className={styles.sku}>{product.sku}</code>
                                </div>

                                <div className={styles.infoItem}>
                                    <label>Danh mục</label>
                                    <div className={styles.categoryInfo}>
                                        {product.category?.image && (
                                            <img
                                                src={product.category.image}
                                                alt={product.category.name}
                                                className={styles.categoryImage}
                                            />
                                        )}
                                        <span>{product.category?.name || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <label>Giá gốc</label>
                                    <span className={styles.price}>{formatPrice(product.price)}</span>
                                </div>

                                <div className={styles.infoItem}>
                                    <label>Giá khuyến mãi</label>
                                    {product.discountPrice ? (
                                        <div className={styles.discountInfo}>
                                            <span className={styles.discountPrice}>
                                                {formatPrice(product.discountPrice)}
                                            </span>
                                            <span className={styles.discountPercent}>
                                                (-{calculateDiscountPercent(product.price, product.discountPrice)}%)
                                            </span>
                                        </div>
                                    ) : (
                                        <span className={styles.noDiscount}>Không có</span>
                                    )}
                                </div>

                                <div className={styles.infoItem}>
                                    <label>Tổng số lượng</label>
                                    <span className={styles.totalQuantity}>
                                        {calculateTotalQuantity(variants)} sản phẩm
                                    </span>
                                </div>

                                <div className={styles.infoItem}>
                                    <label>Ngày tạo</label>
                                    <span>{formatDate(product.createdAt)}</span>
                                </div>

                                <div className={styles.infoItem}>
                                    <label>Cập nhật cuối</label>
                                    <span>{formatDate(product.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {product.description && (
                    <div className={styles.descriptionSection}>
                        <div className={styles.infoCard}>
                            <h2 className={styles.cardTitle}>Mô tả sản phẩm</h2>
                            <div className={styles.description}>
                                {product.description}
                            </div>
                        </div>
                    </div>
                )}

                {/* Variants */}
                {variants.length > 0 && (
                    <div className={styles.variantsSection}>
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>
                                    Biến thể sản phẩm ({variants.length})
                                </h2>
                            </div>

                            <div className={styles.variantsList}>
                                {variants.map((variant, index) => (
                                    <div key={variant.id || index} className={styles.variantCard}>
                                        <div className={styles.variantHeader}>
                                            <h3 className={styles.variantTitle}>
                                                Biến thể #{index + 1}
                                            </h3>
                                            <div className={styles.variantStatus}>
                                                <span className={`${styles.stockBadge} ${variant.quantity > 0 ? styles.inStock : styles.outOfStock
                                                    }`}>
                                                    {variant.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.variantInfo}>
                                            <div className={styles.variantDetail}>
                                                <label>Màu sắc</label>
                                                <div className={styles.colorInfo}>
                                                    <span>{variant.colorName || 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className={styles.variantDetail}>
                                                <label>Kích thước</label>
                                                <span className={styles.sizeTag}>{variant.size}</span>
                                            </div>

                                            <div className={styles.variantDetail}>
                                                <label>Số lượng</label>
                                                <span className={styles.quantity}>{variant.quantity}</span>
                                            </div>
                                        </div>

                                        {variant.images && variant.images.length > 0 && (
                                            <div className={styles.variantImages}>
                                                <label>Ảnh biến thể ({variant.images.length})</label>
                                                <div className={styles.imageGrid}>
                                                    {variant.images.map((image, imgIndex) => (
                                                        <div key={imgIndex} className={styles.imageItem}>
                                                            <img
                                                                src={image.imageUrl}
                                                                alt={`Variant ${index + 1} - Image ${imgIndex + 1}`}
                                                                className={styles.variantImage}
                                                            />
                                                            {image.isMain && (
                                                                <div className={styles.mainBadge}>
                                                                    Chính
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;