import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Save, ArrowLeft } from 'lucide-react';
import styles from '../../styles/admin/ProductEdit.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductEdit = () => {
    const navigate = useNavigate();
    const { productId } = useParams(); // Sửa từ 'id' thành 'productId'
    const id = productId; // Giữ biến id để không phải sửa nhiều chỗ

    console.log('All URL params:', useParams());
    console.log('Product ID from params:', productId);
    console.log('Current location:', window.location.href);

    // API base URL
    const API_BASE_URL = 'http://localhost:8080/api/v1';

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [productLoading, setProductLoading] = useState(true);
    const [productNotFound, setProductNotFound] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        checkUserPermission();
    }, []);

    const checkUserPermission = () => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (!token || !userData) {
                showUnauthorizedMessage();
                redirectToLogin();
                return;
            }

            const user = JSON.parse(userData);
            console.log('Current user:', user);

            if (user.role !== 'ADMIN' && user.role !== 'admin') {
                showUnauthorizedMessage();
                redirectToLogin();
                return;
            }

            if (isTokenExpired(token)) {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                redirectToLogin();
                return;
            }

            setIsAuthorized(true);
        } catch (error) {
            console.error('Error checking user permission:', error);
            showUnauthorizedMessage();
            redirectToLogin();
        } finally {
            setAuthLoading(false);
        }
    };

    const showUnauthorizedMessage = () => {
        alert('Bạn không có quyền truy cập trang này!');
    };

    const redirectToLogin = () => {
        navigate('/login');
    };

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    };

    // Axios instance
    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    const categoryAPI = {
        getAll: () => api.get('/categories'),
        create: (data) => api.post('/categories', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    };

    const colorAPI = {
        getAll: () => api.get('/colors'),
        create: (data) => api.post('/colors', data)
    };

    const productAPI = {
        getById: (id) => api.get(`/products/${id}`),
        update: (id, data) => api.put(`/products/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    };

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        discountPrice: '',
        categoryId: '',
        inStock: true,
        mainImageUrl: null,
        currentMainImageUrl: '', // Store current image URL from server
        variant: []
    });

    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddColorModal, setShowAddColorModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [newColor, setNewColor] = useState({ name: '', code: '#000000' });
    const [newCategory, setNewCategory] = useState({ name: '', image: null });

    const [sizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FreeSize']);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    useEffect(() => {
        console.log('Auth useEffect triggered, isAuthorized:', isAuthorized);
        if (isAuthorized) {
            loadInitialData();
        }
    }, [isAuthorized]);

    useEffect(() => {
        console.log('Product useEffect triggered, isAuthorized:', isAuthorized, 'productId:', productId);
        if (isAuthorized && productId) {
            loadProductData();
        }
    }, [isAuthorized, productId]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [categoriesResponse, colorsResponse] = await Promise.all([
                categoryAPI.getAll(),
                colorAPI.getAll()
            ]);

            setCategories(categoriesResponse.data.data || categoriesResponse.data);
            setColors(colorsResponse.data.data || colorsResponse.data);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Lỗi khi tải dữ liệu. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const loadProductData = async () => {
        try {
            setProductLoading(true);
            console.log('Đang tải sản phẩm với ID:', productId);

            if (!productId) {
                console.error('Product ID không tồn tại');
                setProductNotFound(true);
                return;
            }

            const response = await productAPI.getById(productId);
            console.log('Phản hồi API hoàn chỉnh:', response);
            console.log('Response data:', response.data);
            const product = response.data.data || response.data;
            console.log('Product data:', product);

            // Lấy danh sách màu để ánh xạ
            const colorsResponse = await colorAPI.getAll();
            const allColors = colorsResponse.data.data || colorsResponse.data;
            console.log('Danh sách màu:', allColors);

            const mainImage =
                product.variants
                    ?.flatMap(v => v.images)
                    ?.find(img => img.isMain)?.imageUrl || '';

            setFormData({
                name: product.name || '',
                sku: product.sku || '',
                description: product.description || '',
                price: product.price ? product.price.toString() : '',
                discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
                categoryId: product.category?.id ? product.category.id.toString() : '',
                inStock: product.inStock !== undefined ? product.inStock : true,
                mainImageUrl: null,
                currentMainImageUrl: mainImage,
                variant: (product.variants || []).map(variant => {
                    // Tìm màu theo tên (colorName từ response)
                    const matchingColor = allColors.find(color => color.name === variant.colorName);
                    return {
                        id: variant.id, // Giữ nguyên ID từ server
                        originalId: variant.id, // Lưu ID gốc để gửi lên server
                        colorId: matchingColor ? matchingColor.id.toString() : '',
                        colorName: variant.colorName || '',
                        size: variant.size || '',
                        quantity: variant.quantity ? variant.quantity.toString() : '',
                        images: (variant.images || []).map(img => ({
                            id: img.id, // Giữ nguyên ID từ server
                            imageUrl: img.imageUrl || '',
                            isMain: img.isMain || false,
                            preview: img.imageUrl || '',
                            isExisting: true
                        }))
                    };
                })
            });
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
            console.error('Chi tiết lỗi:', error.response?.data);
            if (error.response?.status === 404) {
                setProductNotFound(true);
            } else {
                setError('Lỗi khi tải thông tin sản phẩm. Vui lòng thử lại!');
            }
        } finally {
            setProductLoading(false);
        }
    };

    const handleMainImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                mainImageUrl: file
            }));
        }
    };

    const addVariant = () => {
        const newVariant = {
            id: Date.now(),
            colorId: '',
            size: '',
            quantity: '',
            images: []
        };
        setFormData(prev => ({
            ...prev,
            variant: [...prev.variant, newVariant]
        }));
    };

    const removeVariant = (variantId) => {
        setFormData(prev => ({
            ...prev,
            variant: prev.variant.filter(v => v.id !== variantId)
        }));
    };

    const updateVariant = (variantId, field, value) => {
        setFormData(prev => ({
            ...prev,
            variant: prev.variant.map(v =>
                v.id === variantId ? { ...v, [field]: value } : v
            )
        }));
    };

    const addVariantImage = (variantId) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;

        input.onchange = (event) => {
            const files = Array.from(event.target.files);
            const newImages = files.map((file, index) => ({
                id: Date.now() + index,
                imageUrl: file,
                isMain: false,
                preview: URL.createObjectURL(file),
                isExisting: false // Mark as new image
            }));

            setFormData(prev => ({
                ...prev,
                variant: prev.variant.map(v =>
                    v.id === variantId
                        ? { ...v, images: [...v.images, ...newImages] }
                        : v
                )
            }));
        };

        input.click();
    };

    const removeVariantImage = (variantId, imageId) => {
        setFormData(prev => ({
            ...prev,
            variant: prev.variant.map(v =>
                v.id === variantId
                    ? { ...v, images: v.images.filter(img => img.id !== imageId) }
                    : v
            )
        }));
    };

    const setMainVariantImage = (variantId, imageId) => {
        setFormData(prev => ({
            ...prev,
            variant: prev.variant.map(v =>
                v.id === variantId
                    ? {
                        ...v,
                        images: v.images.map(img => ({
                            ...img,
                            isMain: img.id === imageId
                        }))
                    }
                    : v
            )
        }));
    };

    const addNewColor = async () => {
        if (!newColor.name.trim()) {
            alert('Vui lòng nhập tên màu!');
            return;
        }

        try {
            setLoading(true);

            const colorData = {
                name: newColor.name.trim(),
                hexCode: newColor.code
            };

            const response = await colorAPI.create(colorData);
            const createdColor = response.data.data || response.data;

            setColors(prev => [...prev, createdColor]);
            setNewColor({ name: '', code: '#000000' });
            setShowAddColorModal(false);

            alert('Thêm màu thành công!');
        } catch (error) {
            console.error('Error creating color:', error);
            if (error.response?.status === 400) {
                alert(error.response.data.message || 'Màu này đã tồn tại!');
            } else {
                alert('Lỗi khi thêm màu. Vui lòng thử lại!');
            }
        } finally {
            setLoading(false);
        }
    };

    const addNewCategory = async () => {
        if (!newCategory.name.trim()) {
            alert('Vui lòng nhập tên danh mục!');
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', newCategory.name.trim());
            if (newCategory.image) {
                formData.append('image', newCategory.image);
            }

            const response = await categoryAPI.create(formData);
            const createdCategory = response.data.data || response.data;

            setCategories(prev => [...prev, createdCategory]);
            setNewCategory({ name: '', image: null });
            setShowAddCategoryModal(false);

            alert('Thêm danh mục thành công!');
        } catch (error) {
            console.error('Error creating category:', error);
            if (error.response?.status === 400) {
                alert(error.response.data.message || 'Danh mục này đã tồn tại!');
            } else {
                alert('Lỗi khi thêm danh mục. Vui lòng thử lại!');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewCategory(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên sản phẩm!');
            return;
        }

        if (!formData.sku.trim()) {
            alert('Vui lòng nhập SKU!');
            return;
        }

        if (!formData.price || formData.price <= 0) {
            alert('Vui lòng nhập giá hợp lệ!');
            return;
        }

        if (!formData.categoryId) {
            alert('Vui lòng chọn danh mục!');
            return;
        }

        try {
            setLoading(true);

            const productFormData = new FormData();

            // Basic product info
            productFormData.append('name', formData.name.trim());
            productFormData.append('sku', formData.sku.trim());
            productFormData.append('description', formData.description.trim());
            productFormData.append('price', formData.price);
            productFormData.append('categoryId', formData.categoryId);
            productFormData.append('inStock', formData.inStock);

            if (formData.discountPrice) {
                productFormData.append('discountPrice', formData.discountPrice);
            }

            // Main image - only append if new file selected
            if (formData.mainImageUrl) {
                productFormData.append('mainImageUrl', formData.mainImageUrl);
            } else if (formData.currentMainImageUrl) {
                // Nếu không chọn ảnh mới, gửi ảnh cũ lên dưới tên mainImageUrlOld
                productFormData.append('mainImageUrlOld', formData.currentMainImageUrl);
            }

            // Variants
            formData.variant.forEach((variant, index) => {
                if (variant.colorId && variant.size && variant.quantity) {
                    // Nếu có id (update), gửi id lên
                    if (variant.id) {
                        productFormData.append(`variant[${index}].id`, variant.id);
                    }

                    productFormData.append(`variant[${index}].colorId`, variant.colorId);
                    productFormData.append(`variant[${index}].size`, variant.size);
                    productFormData.append(`variant[${index}].quantity`, variant.quantity);

                    // Xử lý images
                    let imageIndex = 0;
                    variant.images.forEach((image) => {
                        if (image.isExisting) {
                            // Ảnh cũ
                            productFormData.append(`variant[${index}].images[${imageIndex}].id`, image.id);
                            productFormData.append(`variant[${index}].images[${imageIndex}].isMain`, image.isMain);
                        } else if (image.imageUrl instanceof File) {
                            // Ảnh mới
                            productFormData.append(`variant[${index}].images[${imageIndex}].imageUrl`, image.imageUrl);
                            productFormData.append(`variant[${index}].images[${imageIndex}].isMain`, image.isMain);
                        }
                        imageIndex++;
                    });
                }
            });

            const response = await productAPI.update(productId, productFormData);

            alert('Cập nhật sản phẩm thành công!');
            console.log('Updated product:', response.data);

            // Navigate back to product list or detail
            navigate('/admin/products/list');

        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response?.status === 400) {
                alert(error.response.data.message || 'Dữ liệu không hợp lệ!');
            } else if (error.response?.status === 409) {
                alert('SKU đã tồn tại!');
            } else {
                alert('Lỗi khi cập nhật sản phẩm. Vui lòng thử lại!');
            }
        } finally {
            setLoading(false);
        }
    };

    // Rest of the component remains the same...
    if (authLoading || productLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                    <p>
                        {authLoading ? 'Đang kiểm tra quyền truy cập...' : 'Đang tải thông tin sản phẩm...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className={styles.unauthorizedContainer}>
                <div className={styles.unauthorizedMessage}>
                    <h2>Truy cập bị từ chối</h2>
                    <p>Bạn không có quyền truy cập trang này.</p>
                    <button
                        onClick={redirectToLogin}
                        className={styles.backToLoginButton}
                    >
                        Quay về đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    if (productNotFound) {
        return (
            <div className={styles.unauthorizedContainer}>
                <div className={styles.unauthorizedMessage}>
                    <h2>Không tìm thấy sản phẩm</h2>
                    <p>Sản phẩm có ID {productId} không tồn tại hoặc đã bị xóa.</p>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className={styles.backToLoginButton}
                    >
                        Quay về danh sách sản phẩm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className={styles.title}>Chỉnh Sửa Sản Phẩm #{productId}</h1>
                </div>

                <div className={styles.formContent}>
                    {/* Basic Information */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Thông Tin Cơ Bản</h2>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tên sản phẩm *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Nhập tên sản phẩm"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Mã sản phẩm *</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => handleInputChange('sku', e.target.value)}
                                    placeholder="Nhập mã sản phẩm"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Giá gốc *</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Giá khuyến mãi</label>
                                <input
                                    type="number"
                                    value={formData.discountPrice}
                                    onChange={(e) => handleInputChange('discountPrice', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    className={styles.input}
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Danh mục *</label>
                                <div className={styles.categorySelectWrapper}>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => {
                                            if (e.target.value === 'add_new') {
                                                setShowAddCategoryModal(true);
                                            } else {
                                                handleInputChange('categoryId', e.target.value);
                                            }
                                        }}
                                        className={styles.select}
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                        <option value="add_new" className={styles.addNewOption}>
                                            + Thêm danh mục mới
                                        </option>
                                    </select>

                                    {formData.categoryId && (
                                        <div className={styles.categoryPreview}>
                                            {categories.find(c => c.id == formData.categoryId)?.image ? (
                                                <img
                                                    src={categories.find(c => c.id == formData.categoryId).image}
                                                    alt="Category"
                                                    className={styles.categoryImage}
                                                />
                                            ) : (
                                                <div className={styles.categoryImagePlaceholder}>
                                                    <Upload size={16} />
                                                </div>
                                            )}
                                            <span className={styles.categoryName}>
                                                {categories.find(c => c.id == formData.categoryId)?.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Mô tả sản phẩm</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Nhập mô tả chi tiết sản phẩm..."
                                    rows={4}
                                    className={styles.textarea}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Image */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Ảnh Chính Sản Phẩm</h2>

                        <div
                            className={styles.imageUpload}
                            onClick={() => document.getElementById('mainImage').click()}
                        >
                            <input
                                id="mainImage"
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageUpload}
                                style={{ display: 'none' }}
                            />

                            {formData.mainImageUrl || formData.currentMainImageUrl ? (
                                <div className={styles.imagePreview}>
                                    <img
                                        src={formData.mainImageUrl
                                            ? URL.createObjectURL(formData.mainImageUrl)
                                            : formData.currentMainImageUrl
                                        }
                                        alt="Main product"
                                        className={styles.previewImage}
                                    />
                                    <p className={styles.successText}>
                                        {formData.mainImageUrl ? 'Ảnh mới đã được chọn' : 'Ảnh hiện tại'}
                                    </p>
                                    {formData.mainImageUrl && (
                                        <small className={styles.uploadSubtext}>
                                            (Ảnh mới sẽ thay thế ảnh cũ khi lưu)
                                        </small>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <Upload size={48} className={styles.uploadIcon} />
                                    <p className={styles.uploadText}>Nhấp để chọn ảnh chính sản phẩm</p>
                                    <p className={styles.uploadSubtext}>PNG, JPG, JPEG (tối đa 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Variants */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                Biến Thể Sản Phẩm ({formData.variant.length})
                            </h2>

                            <button
                                type="button"
                                onClick={addVariant}
                                className={styles.addButton}
                            >
                                <Plus size={16} />
                                Thêm biến thể
                            </button>
                        </div>

                        {formData.variant.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>Chưa có biến thể nào. Nhấp "Thêm biến thể" để bắt đầu.</p>
                            </div>
                        ) : (
                            <div className={styles.variantList}>
                                {formData.variant.map((variant, index) => (
                                    <div key={variant.id} className={styles.variantCard}>
                                        <div className={styles.variantHeader}>
                                            <h3 className={styles.variantTitle}>Biến thể #{index + 1}</h3>
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(variant.id)}
                                                className={styles.removeButton}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        <div className={styles.variantGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Màu sắc</label>
                                                <div className={styles.colorSelectWrapper}>
                                                    <select
                                                        value={variant.colorId}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'add_new') {
                                                                setShowAddColorModal(true);
                                                            } else {
                                                                updateVariant(variant.id, 'colorId', e.target.value);
                                                            }
                                                        }}
                                                        className={styles.select}
                                                    >
                                                        <option value="">Chọn màu</option>
                                                        {colors.map(color => (
                                                            <option key={color.id} value={color.id}>
                                                                {color.name}
                                                            </option>
                                                        ))}
                                                        <option value="add_new" className={styles.addNewOption}>
                                                            + Thêm màu mới
                                                        </option>
                                                    </select>

                                                    {variant.colorId && (
                                                        <div
                                                            className={styles.colorPreview}
                                                            style={{
                                                                backgroundColor: colors.find(c => c.id == variant.colorId)?.code || colors.find(c => c.id == variant.colorId)?.hexCode
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Kích thước</label>
                                                <select
                                                    value={variant.size}
                                                    onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                                                    className={styles.select}
                                                >
                                                    <option value="">Chọn size</option>
                                                    {sizes.map(size => (
                                                        <option key={size} value={size}>
                                                            {size}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Số lượng</label>
                                                <input
                                                    type="number"
                                                    value={variant.quantity}
                                                    onChange={(e) => updateVariant(variant.id, 'quantity', e.target.value)}
                                                    placeholder="0"
                                                    min="0"
                                                    className={styles.input}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.variantImages}>
                                            <div className={styles.imagesHeader}>
                                                <label className={styles.label}>
                                                    Ảnh biến thể ({variant.images.length})
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={() => addVariantImage(variant.id)}
                                                    className={styles.addImageButton}
                                                >
                                                    <Plus size={14} />
                                                    Thêm ảnh
                                                </button>
                                            </div>

                                            <div className={styles.imageGrid}>
                                                {variant.images.map((image) => (
                                                    <div key={image.id} className={styles.imageItem}>
                                                        <img
                                                            src={image.preview}
                                                            alt="Variant"
                                                            className={styles.variantImage}
                                                        />

                                                        <div className={styles.imageActions}>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeVariantImage(variant.id, image.id)}
                                                                className={styles.deleteImageButton}
                                                            >
                                                                <X size={12} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => setMainVariantImage(variant.id, image.id)}
                                                                className={`${styles.mainImageButton} ${image.isMain ? styles.active : ''}`}
                                                                title={image.isMain ? 'Ảnh chính' : 'Đặt làm ảnh chính'}
                                                            >
                                                                {image.isMain ? '★' : '☆'}
                                                            </button>
                                                        </div>

                                                        {image.isExisting && (
                                                            <div className={styles.existingImageBadge}>
                                                                Ảnh cũ
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className={styles.submitSection}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => navigate('/admin/products')}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            <Save size={16} />
                            {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
                        </button>
                    </div>
                </div>

                {/* Add Color Modal */}
                {showAddColorModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitle}>Thêm Màu Mới</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAddColorModal(false)}
                                    className={styles.closeButton}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={styles.modalContent}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tên màu *</label>
                                    <input
                                        type="text"
                                        value={newColor.name}
                                        onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ví dụ: Xanh navy, Đỏ đô..."
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Mã màu *</label>
                                    <div className={styles.colorPickerWrapper}>
                                        <input
                                            type="color"
                                            value={newColor.code}
                                            onChange={(e) => setNewColor(prev => ({ ...prev, code: e.target.value }))}
                                            className={styles.colorPicker}
                                        />
                                        <input
                                            type="text"
                                            value={newColor.code}
                                            onChange={(e) => setNewColor(prev => ({ ...prev, code: e.target.value }))}
                                            placeholder="#000000"
                                            className={styles.colorCodeInput}
                                        />
                                        <div
                                            className={styles.colorPreviewLarge}
                                            style={{ backgroundColor: newColor.code }}
                                        />
                                    </div>
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddColorModal(false)}
                                        className={styles.cancelButton}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addNewColor}
                                        className={styles.submitButton}
                                        disabled={!newColor.name.trim() || loading}
                                    >
                                        <Plus size={16} />
                                        {loading ? 'Đang thêm...' : 'Thêm màu'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Category Modal */}
                {showAddCategoryModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitle}>Thêm Danh Mục Mới</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAddCategoryModal(false)}
                                    className={styles.closeButton}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={styles.modalContent}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tên danh mục *</label>
                                    <input
                                        type="text"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ví dụ: Vòng cổ, Khuyên tai..."
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Ảnh danh mục</label>
                                    <div
                                        className={styles.categoryImageUpload}
                                        onClick={() => document.getElementById('categoryImage').click()}
                                    >
                                        <input
                                            id="categoryImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCategoryImageUpload}
                                            style={{ display: 'none' }}
                                        />

                                        {newCategory.image ? (
                                            <div className={styles.categoryImagePreview}>
                                                <img
                                                    src={URL.createObjectURL(newCategory.image)}
                                                    alt="Category preview"
                                                    className={styles.categoryPreviewImage}
                                                />
                                                <p className={styles.successText}>Ảnh đã được chọn</p>
                                            </div>
                                        ) : (
                                            <div className={styles.uploadPlaceholder}>
                                                <Upload size={32} className={styles.uploadIcon} />
                                                <p className={styles.uploadText}>Nhấp để chọn ảnh danh mục</p>
                                                <p className={styles.uploadSubtext}>PNG, JPG, JPEG (không bắt buộc)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCategoryModal(false)}
                                        className={styles.cancelButton}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addNewCategory}
                                        className={styles.submitButton}
                                        disabled={!newCategory.name.trim() || loading}
                                    >
                                        <Plus size={16} />
                                        {loading ? 'Đang thêm...' : 'Thêm danh mục'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductEdit;