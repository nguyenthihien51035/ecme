import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/user/ProductSection.module.scss';

const ProductSection = () => {
    const bestSellerProducts = [
        {
            id: 1,
            name: "Áo Nữ Dệt Kim Noah Top RR24DK01",
            price: "330.000đ",
            image: "https://bizweb.dktcdn.net/100/462/587/products/2-7470bcef-0a2a-494f-bc22-4ffc30716a3f.png?v=1727497396320",
            badge: "1"
        },
        {
            id: 2,
            name: "Váy Quần Moji Skort RR24VQ30",
            price: "480.000đ",
            image: "https://bizweb.dktcdn.net/100/462/587/products/2-10b524bd-7d73-47ab-8bea-35034a2904e1.png?v=1727600803113",
            badge: "2"
        },
        {
            id: 3,
            name: "Áo Dệt Kim Nini Top RR24DK19",
            price: "290.000đ",
            image: "https://bizweb.dktcdn.net/100/462/587/products/5-62033f88-81bb-41e4-af0a-3865ef590e84.png?v=1727768915573",
            badge: "3"
        },
        {
            id: 4,
            name: "Đầm Dệt Kim Joie Dress RR24DK15",
            price: "480.000đ",
            image: "https://bizweb.dktcdn.net/100/462/587/products/23-608fedc6-1cf9-4140-aab5-e32641ecb19f.png?v=1728635121860",
            badge: "4"
        }
    ];

    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/v1/products/top4newest');
                setNewProducts(response.data.data || []);
            } catch (error) {
                console.error('Error fetching new products:', error);
                setNewProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    const navigate = useNavigate();
    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    const ProductCard = ({ product, showBadge = false }) => (
        <div
            className={styles.productCard}
            onClick={() => handleProductClick(product.id)}
        >
            <div className={styles.productImageContainer}>
                <img
                    src={product.image || product.variants?.[0]?.images?.[0]?.imageUrl}
                    alt={product.name}
                    className={styles.productImage}
                />
                {showBadge && (
                    <div className={styles.productBadge}>
                        {product.badge}
                    </div>
                )}
            </div>
            <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>

                {/* Hiển thị giá */}
                {product.discountPrice && product.discountPrice < product.price ? (
                    <p className={styles.productPrice}>
                        <span className={styles.discountPrice}>
                            {product.discountPrice.toLocaleString("vi-VN")}đ
                        </span>
                        <span className={styles.oldPrice}>
                            {product.price.toLocaleString("vi-VN")}đ
                        </span>{" "}
                    </p>
                ) : (
                    <p className={styles.productPrice}>
                        {product.price?.toLocaleString("vi-VN")}đ
                    </p>
                )}
            </div>
        </div>
    );


    return (
        <div className={styles.productSection}>
            {/* Best Seller Section */}
            <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Sản Phẩm Bán Chạy</h2>
                </div>
                <div className={styles.bestSellerGrid}>
                    {bestSellerProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            showBadge={true}
                        />
                    ))}
                </div>
            </div>

            {/* New Products Section */}
            <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Sản Phẩm Mới</h2>
                </div>
                <div className={styles.newProductsContainer}>
                    <div className={styles.bannerContainer}>
                        <img
                            src="https://bizweb.dktcdn.net/100/462/587/themes/880841/assets/img_banner_tab.jpg?1724310613023"
                            alt="Banner"
                            className={styles.bannerImage}
                        />
                    </div>
                    <div className={styles.newProductsGrid}>
                        {loading ? (
                            <div>Đang tải...</div>
                        ) : (
                            newProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Banner */}
            <div className={styles.bottomBanner}>
                <div
                    className={styles.bannerBackground}
                    style={{
                        backgroundImage: 'url("https://bizweb.dktcdn.net/100/462/587/themes/880841/assets/bg_banner_big.jpg?1724310613023")'
                    }}
                />
            </div>
        </div>
    );
};

export default ProductSection;