import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/user/ProductSearch.module.scss";

export default function ProductsSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // lấy query param
    const queryParams = new URLSearchParams(location.search);
    const searchText = queryParams.get("search") || "";

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:8080/api/v1/products/filter", {
                    params: {
                        name: searchText,
                        page: 0,
                        size: 12
                    }
                });
                setProducts(res.data.data.content);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        if (searchText) {
            fetchProducts();
        }
    }, [searchText]);

    if (loading) {
        return (
            <div className={styles.container}>
                <p className={styles.loadingText}>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <span className={styles.breadcrumbItem} onClick={() => navigate('/')}>Trang chủ</span>
                <span className={styles.breadcrumbItem}>Kết quả tìm kiếm</span>
            </nav>

            {/* Title */}
            <h1 className={styles.title}>
                Có {products.length} kết quả tìm kiếm phù hợp
            </h1>

            {/* Products Grid */}
            {products.length === 0 ? (
                <p className={styles.noResults}>Không tìm thấy sản phẩm nào.</p>
            ) : (
                <div className={styles.productsGrid}>
                    {products.map(product => (
                        <div key={product.id} className={styles.productCard}>
                            <img
                                src={getMainImage(product.variants)}
                                alt={product.name}
                                className={styles.productImage}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/280x280?text=No+Image'; // fallback image
                                }}
                            />
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productCode}>{product.sku}</p>
                                <p className={styles.productPrice}>
                                    {product.discountPrice ? (
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