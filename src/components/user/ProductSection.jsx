import React from 'react';
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

    const newProducts = [
        {
            id: 7,
            name: "Đầm Dài Becka Dress RR250D36",
            price: "560.000đ",
            image: "https://bizweb.dktcdn.net/100/462/587/products/2-7470bcef-0a2a-494f-bc22-4ffc30716a3f.png?v=1727497396320"
        },
        {
            id: 8,
            name: "Đầm Dài Misel Dress RS25D006",
            price: "840.000đ",
            image: "https://bizweb.dktcdn.net/100/462/587/products/2-10b524bd-7d73-47ab-8bea-35034a2904e1.png?v=1727600803113"
        },
        {
            id: 9,
            name: "Áo Kiểu Nữ Isa Top RR25AK66",
            price: "500.000đ",
            image: "https://bizweb.dktcdn.net/100/462/587/products/5-62033f88-81bb-41e4-af0a-3865ef590e84.png?v=1727768915573"
        },
        {
            id: 10,
            name: "Áo Kiểu Nữ Tristy Top RR25AK72",
            price: "460.000đ",
            image: "https://bizweb.dktcdn.net/100/462/587/products/23-608fedc6-1cf9-4140-aab5-e32641ecb19f.png?v=1728635121860"
        }
    ];

    const ProductCard = ({ product, showBadge = false }) => (
        <div className={styles.productCard}>
            <div className={styles.productImageContainer}>
                <img
                    src={product.image}
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
                <h3 className={styles.productName}>
                    {product.name}
                </h3>
                <p className={styles.productPrice}>
                    {product.price}
                </p>
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
                        {newProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
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