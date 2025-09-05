import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/user/ProductSearch.module.scss"; // Sử dụng cùng style với search

export default function ProductsByCategory() {
    const { categoryId } = useParams(); // Lấy categoryId từ URL
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm lấy ảnh chính từ variants
    const getMainImage = (variants) => {
        if (!variants || variants.length === 0) return '';

        // Tìm ảnh có isMain = true từ variant đầu tiên có ảnh
        for (const variant of variants) {
            if (variant.images && variant.images.length > 0) {
                const mainImage = variant.images.find(img => img.isMain === true);
                if (mainImage) return mainImage.imageUrl;
                // Nếu không có ảnh main, lấy ảnh đầu tiên
                return variant.images[0].imageUrl;
            }
        }
        return '';
    };

    // Hàm chuyển đến trang chi tiết sản phẩm
    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Lấy thông tin danh mục
    const fetchCategoryInfo = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/categories/${categoryId}`);
            setCategoryInfo(res.data.data);
        } catch (err) {
            console.error("Error fetching category info:", err);
        }
    };

    // Lấy sản phẩm theo danh mục
    const fetchProductsByCategory = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get("http://localhost:8080/api/v1/products/filter", {
                params: {
                    categoryId: categoryId,
                    page: 0,
                    size: 20 // Có thể tăng số lượng sản phẩm hiển thị
                }
            });

            setProducts(res.data.data.content || []);
        } catch (err) {
            console.error("Error fetching products by category:", err);
            setError("Có lỗi xảy ra khi tải sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryId) {
            fetchCategoryInfo();
            fetchProductsByCategory();
        }
    }, [categoryId]);

    if (loading) {
        return (
            <div className={styles.container}>
                <p className={styles.loadingText}>Đang tải sản phẩm...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <p className={styles.noResults}>{error}</p>
            </div>
        );
    }

    return (
        <div className={"container"}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <span className={styles.breadcrumbItem} onClick={() => navigate('/')}>
                    Trang chủ
                </span>
                <span className={styles.breadcrumbItem} style={{ color: "#871b1b" }}>
                    {categoryInfo ? categoryInfo.name : 'Danh mục sản phẩm'}
                </span>
            </nav>

            {/* Products Grid */}
            {products.length === 0 ? (
                <p className={styles.noResults}>
                    Danh mục này chưa có sản phẩm nào.
                </p>
            ) : (
                <div className={styles.productsGrid}>
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className={styles.productCard}
                        >
                            <img
                                src={getMainImage(product.variants)}
                                alt={product.name}
                                className={styles.productImage}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/280x280?text=No+Image';
                                }}
                            />
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productCode}>{product.sku}</p>
                                <p className={styles.productPrice}>
                                    {product.discountPrice && product.discountPrice !== product.price ? (
                                        <>
                                            <span className={styles.discountPrice}>
                                                {product.discountPrice.toLocaleString('vi-VN')}đ
                                            </span>
                                            <span className={styles.originalPrice}>
                                                {product.price.toLocaleString('vi-VN')}đ
                                            </span>
                                        </>
                                    ) : (
                                        <span>{product.price.toLocaleString('vi-VN')}đ</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}