import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from '../../styles/user/ProductDetail.module.scss';

const ProductDetail = () => {
    const { productId } = useParams(); // Lấy productId từ URL params
    console.log('ProductDetail rendered with ID:', productId);
    const [productData, setProductData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [thumbnails, setThumbnails] = useState([]);
    const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();


    // Load favorites from localStorage on component mount
    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem('favorites');
            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites([]);
        }
    }, []);

    // Fetch product data from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`http://localhost:8080/api/v1/products/${productId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.errorMessage) {
                    throw new Error(data.errorMessage);
                }

                setProductData(data.data);

                // Set initial values
                if (data.data.variants.length > 0) {
                    const firstVariant = data.data.variants[0];
                    setSelectedColor(firstVariant.colorName);
                    setSelectedSize(firstVariant.size);
                    setSelectedVariant(firstVariant);

                    const mainImg = firstVariant.images.find(img => img.isMain) || firstVariant.images[0];
                    setMainImage(mainImg.imageUrl);
                    setThumbnails(firstVariant.images);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    // Get unique colors with their hexCode from variants
    const getUniqueColors = () => {
        if (!productData) return [];
        const uniqueVariants = [];
        const seenColors = new Set();

        productData.variants.forEach(variant => {
            if (!seenColors.has(variant.colorName)) {
                seenColors.add(variant.colorName);
                uniqueVariants.push({
                    colorName: variant.colorName,
                    hexCode: variant.hexCode || '#f0f0f0' // Sử dụng hexCode từ variant
                });
            }
        });

        return uniqueVariants;
    };

    const getAvailableSizes = () => {
        if (!productData || !selectedColor) return [];
        const sizes = productData.variants
            .filter(v => v.colorName === selectedColor)
            .map(v => v.size);
        return [...new Set(sizes)];
    };

    // Handle color selection
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        const availableSizes = productData.variants
            .filter(v => v.colorName === color)
            .map(v => v.size);

        // Set first available size
        if (availableSizes.length > 0) {
            const firstSize = availableSizes[0];
            setSelectedSize(firstSize);
            updateVariant(color, firstSize);
        }
        // Reset quantity when changing variant
        setQuantity(1);
    };

    // Handle size selection
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        updateVariant(selectedColor, size);
        // Reset quantity when changing variant
        setQuantity(1);
    };

    // Update variant based on color and size
    const updateVariant = (color, size) => {
        const variant = productData.variants.find(v =>
            v.colorName === color && v.size === size
        );

        if (variant) {
            setSelectedVariant(variant);
            const mainImg = variant.images.find(img => img.isMain) || variant.images[0];
            setMainImage(mainImg.imageUrl);
            setThumbnails(variant.images);
            setCurrentThumbnailIndex(0);
        }
    };

    // Handle thumbnail navigation
    const handleThumbnailNavigation = (direction) => {
        const maxIndex = Math.max(0, thumbnails.length - 4); // Show 4 thumbnails at a time
        if (direction === 'left' && currentThumbnailIndex > 0) {
            setCurrentThumbnailIndex(currentThumbnailIndex - 1);
        } else if (direction === 'right' && currentThumbnailIndex < maxIndex) {
            setCurrentThumbnailIndex(currentThumbnailIndex + 1);
        }
    };

    // Handle quantity change
    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= (selectedVariant?.quantity || 0)) {
            setQuantity(newQuantity);
        }
    };

    const handleQuantityInput = (e) => {
        const value = parseInt(e.target.value) || 1;
        if (value >= 1 && value <= (selectedVariant?.quantity || 0)) {
            setQuantity(value);
        }
    };

    // Handle favorites
    const handleToggleFavorite = () => {
        if (!productData) return;

        const favoriteItem = {
            productId: productData.id,
            name: productData.name,
            image: mainImage,
            price: productData.price,
            discountPrice: productData.discountPrice,
            addedAt: new Date().toISOString()
        };

        let updatedFavorites;
        const existingIndex = favorites.findIndex(fav => fav.productId === productData.id);

        if (existingIndex !== -1) {
            // Remove from favorites
            updatedFavorites = favorites.filter(fav => fav.productId !== productData.id);
        } else {
            // Add to favorites
            updatedFavorites = [...favorites, favoriteItem];
        }

        setFavorites(updatedFavorites);

        try {
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            window.dispatchEvent(
                new CustomEvent("favoritesUpdated", {
                    detail: { favoriteCount: updatedFavorites.length },
                })
            );
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    const isFavorited = productData ? favorites.some(fav => fav.productId === productData.id) : false;

    // Handle add to cart - Save to localStorage
    const handleAddToCart = () => {
        if (!selectedVariant) {
            alert('Vui lòng chọn màu sắc và kích thước');
            return;
        }

        const cartItem = {
            productId: productData.id,
            variantId: selectedVariant.id,
            name: productData.name,
            sku: productData.sku,
            color: selectedColor,
            size: selectedSize,
            price: productData.price,
            discountPrice: productData.discountPrice,
            quantity: quantity,
            image: mainImage,
            maxQuantity: selectedVariant.quantity,
            addedAt: new Date().toISOString(),
            categoryName: productData.category.name
        };

        // Get existing cart from localStorage
        let cart = [];
        try {
            const existingCart = localStorage.getItem('cart');
            if (existingCart) {
                cart = JSON.parse(existingCart);
            }
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            cart = [];
        }

        // Check if item already exists in cart (same product, variant)
        const existingItemIndex = cart.findIndex(item =>
            item.productId === cartItem.productId &&
            item.variantId === cartItem.variantId
        );

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
            cart[existingItemIndex].addedAt = new Date().toISOString();
            cart.push(cartItem);
        }
        else {
            // Add new item to cart
            cart.push(cartItem);
        }

        // Save updated cart to localStorage
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Đã thêm sản phẩm vào giỏ hàng!');
            console.log('Cart updated:', cart);

            // Optional: Dispatch custom event to update cart count in header
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { cartCount: cart.reduce((total, item) => total + item.quantity, 0) }
            }));

        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
            alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return <div className={styles.loading}>Đang tải sản phẩm...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <h2>Có lỗi xảy ra</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Thử lại</button>
            </div>
        );
    }

    if (!productData) {
        return <div className={styles.loading}>Không tìm thấy sản phẩm</div>;
    }

    return (
        <div className={styles.productDetail}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <div className={styles.container}>
                    <ul className={styles.breadcrumbList}>
                        <li><a href="/">Trang chủ</a></li>
                        <li><i className="fa-solid fa-angle-right"></i></li>

                        <li>
                            <Link to={`/products/category/${productData.category.id}`}>
                                {productData.category.name}
                            </Link>
                        </li>
                        <li><i className="fa-solid fa-angle-right"></i></li>
                        <li className={styles.current}>{productData.name}</li>
                    </ul>
                </div>
            </div>

            {/* Product Container */}
            <div className={styles.productContainer}>
                {/* Product Images */}
                <div className={styles.productImageSection}>
                    <img
                        src={mainImage}
                        alt={productData.name}
                        className={styles.mainImage}
                    />

                    {/* Hiển thị tất cả thumbnails */}
                    {thumbnails.length > 1 && (
                        <div className={styles.thumbnailContainer}>
                            {thumbnails.length > 4 && (
                                <button
                                    className={`${styles.arrow} ${styles.arrowLeft}`}
                                    onClick={() => handleThumbnailNavigation('left')}
                                    disabled={currentThumbnailIndex === 0}
                                >
                                    &#8249;
                                </button>
                            )}

                            <div className={styles.thumbnailWrapper}>
                                {thumbnails.slice(currentThumbnailIndex, currentThumbnailIndex + 4).map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.imageUrl}
                                        alt={`Product image ${image.id}`}
                                        className={`${styles.thumbnail} ${mainImage === image.imageUrl ? styles.active : ''}`}
                                        onClick={() => setMainImage(image.imageUrl)}
                                    />
                                ))}
                            </div>

                            {thumbnails.length > 4 && (
                                <button
                                    className={`${styles.arrow} ${styles.arrowRight}`}
                                    onClick={() => handleThumbnailNavigation('right')}
                                    disabled={currentThumbnailIndex >= Math.max(0, thumbnails.length - 4)}
                                >
                                    &#8250;
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className={styles.productInfoSection}>
                    <h1 className={styles.productTitle}>{productData.name}</h1>

                    <div className={styles.productMeta}>
                        <p className={styles.productCode}>
                            Mã: {productData.sku}
                            {selectedSize && selectedColor && `-${selectedSize}-${selectedColor.charAt(0).toUpperCase()}`}
                        </p>
                        <p className={styles.productBrand}>Thương hiệu: Rubies Rubies</p>
                        <p className={`${styles.productStatus} ${productData.inStock ? styles.inStock : styles.outOfStock}`}>
                            Tình trạng: {productData.inStock ? 'Còn hàng' : 'Hết hàng'}
                        </p>
                    </div>
                    <div className={styles.productPrice}>
                        {productData.discountPrice && productData.discountPrice < productData.price ? (
                            <>
                                <span className={styles.salePrice}>
                                    {formatPrice(productData.discountPrice)}
                                </span>
                                <span className={styles.originalPrice}>
                                    {formatPrice(productData.price)}
                                </span>

                            </>
                        ) : (
                            <span className={styles.salePrice}>{formatPrice(productData.price)}</span>
                        )}
                    </div>


                    <p className={styles.productDescription}>
                        {productData.description || 'Mô tả đang cập nhật'}
                    </p>

                    {/* Product Options */}
                    <div className={styles.productOptions}>
                        {/* Color Selection */}
                        <div className={styles.colorSelection}>
                            <p>Màu sắc:</p>
                            <div className={styles.colorOptions}>
                                {getUniqueColors().map(colorInfo => (
                                    <span
                                        key={colorInfo.colorName}
                                        className={`${styles.color} ${selectedColor === colorInfo.colorName ? styles.active : ''}`}
                                        style={{ backgroundColor: colorInfo.hexCode }}
                                        onClick={() => handleColorSelect(colorInfo.colorName)}
                                        title={colorInfo.colorName}
                                    ></span>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className={styles.sizeSelection}>
                            <p>Kích thước:</p>
                            <div className={styles.sizeButtons}>
                                {getAvailableSizes().map(size => (
                                    <button
                                        key={size}
                                        className={`${styles.sizeButton} ${selectedSize === size ? styles.active : ''}`}
                                        onClick={() => handleSizeSelect(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className={styles.additionalLinks}>
                        <a href="#" className={styles.viewRelatedProducts}>
                            <span className={styles.zoomIcon}>🔍</span> Sản phẩm đi kèm
                        </a>
                        <div className={styles.actions}>
                            <button
                                className={styles.favorite}
                                onClick={handleToggleFavorite}
                                title={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                            >
                                {isFavorited ? '❤️' : '🤍'}
                            </button>
                            <button className={styles.share} title="Chia sẻ">🔗</button>
                        </div>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <h3>Chọn Số Lượng Sản Phẩm</h3>

                    <div className={styles.quantityContainer}>
                        <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            className={styles.quantityInput}
                            value={quantity}
                            onChange={handleQuantityInput}
                            min="1"
                            max={selectedVariant?.quantity || 0}
                        />
                        <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= (selectedVariant?.quantity || 0)}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className={styles.addToCartButton}
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || !productData.inStock || selectedVariant?.quantity === 0}
                    >
                        {!selectedVariant ? 'Chọn size và màu' :
                            !productData.inStock || selectedVariant?.quantity === 0 ? 'Hết hàng' :
                                'Thêm vào giỏ hàng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;