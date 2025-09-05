import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/user/Favorites.module.scss";

export default function Favorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Remove from favorites
    const handleRemoveFavorite = (productId, e) => {
        e.stopPropagation(); // Prevent navigation when clicking remove

        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?')) {
            const updatedFavorites = favorites.filter(item => item.productId !== productId);
            setFavorites(updatedFavorites);

            // Update localStorage
            try {
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            } catch (error) {
                console.error('Error saving favorites:', error);
            }
        }
    };

    useEffect(() => {
        const loadFavorites = () => {
            try {
                setLoading(true);
                const savedFavorites = localStorage.getItem('favorites');
                if (savedFavorites) {
                    const favoritesList = JSON.parse(savedFavorites);
                    // Sort by addedAt descending (newest first)
                    favoritesList.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
                    setFavorites(favoritesList);
                } else {
                    setFavorites([]);
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <p className={styles.loadingText}>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className={"container"}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <span className={styles.breadcrumbItem} onClick={() => navigate('/')}>Trang chủ</span>
                <span className={styles.breadcrumbItem} style={{ 'color': "#871b1b" }}>Sản phẩm yêu thích</span>
            </nav>

            {/* Title */}
            <h2 className={styles.title}>
                Sản phẩm yêu thích ({favorites.length})
            </h2>

            {/* Products Grid */}
            {favorites.length === 0 ? (
                <div className={styles.emptyFavorites}>
                    <p className={styles.noResults}>Chưa có sản phẩm yêu thích nào.</p>
                    <button
                        className={styles.shopNowBtn}
                        onClick={() => navigate('/')}
                    >
                        Khám phá sản phẩm
                    </button>
                </div>
            ) : (
                <div className={styles.productsGrid}>
                    {favorites.map(product => (
                        <div key={product.productId}
                            onClick={() => handleProductClick(product.productId)}
                            className={`${styles.productCard} ${styles.favoriteCard}`}>

                            {/* Remove button */}
                            <button
                                className={styles.removeBtn}
                                onClick={(e) => handleRemoveFavorite(product.productId, e)}
                                title="Xóa khỏi yêu thích"
                            >
                                ❤️
                            </button>

                            <img
                                src={product.image}
                                alt={product.name}
                                className={styles.productImage}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/280x280?text=No+Image';
                                }}
                            />
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
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