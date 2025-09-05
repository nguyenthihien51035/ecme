import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
    RefreshCw
} from 'lucide-react';
import styles from '../../styles/admin/ProductTable.module.scss';

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

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    // Filter state
    const [filters, setFilters] = useState({
        name: '',
        sku: '',
        categoryId: '',
        hasDiscount: '',
        minPrice: '',
        maxPrice: '',
        inStock: ''
    });

    // Load initial data
    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    // Load products when filters or pagination change
    useEffect(() => {
        loadProducts();
    }, [pagination.page, pagination.size]);

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data || response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);

            const filterParams = {
                page: pagination.page,
                size: pagination.size,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
                )
            };

            const response = await api.get('/products/filter', { params: filterParams });
            const data = response.data.data || response.data;

            setProducts(data.content || []);
            setPagination(prev => ({
                ...prev,
                totalPages: data.totalPages || 0,
                totalElements: data.totalElements || 0
            }));

        } catch (error) {
            console.error('Error loading products:', error);
            alert('Lỗi khi tải danh sách sản phẩm!');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyFilters = () => {
        setPagination(prev => ({ ...prev, page: 0 }));
        loadProducts();
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            sku: '',
            categoryId: '',
            hasDiscount: '',
            minPrice: '',
            maxPrice: '',
            inStock: ''
        });
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handlePageSizeChange = (newSize) => {
        setPagination(prev => ({ ...prev, size: parseInt(newSize), page: 0 }));
    };

    const calculateTotalQuantity = (variants) => {
        if (!variants || variants.length === 0) return 0;
        return variants.reduce((total, variant) => total + (variant.quantity || 0), 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleView = (productId) => {
        navigate(`/admin/products/view/${productId}`);
    };

    const handleEdit = (productId) => {
        navigate(`/admin/products/edit/${productId}`);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await api.delete(`/products/${productId}`);
                alert('Xóa sản phẩm thành công!');
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Lỗi khi xóa sản phẩm!');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Danh Sách Sản Phẩm</h1>
                    <span className={styles.subtitle}>
                        Tổng: {pagination.totalElements} sản phẩm
                    </span>
                </div>

                <div className={styles.headerRight}>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
                    >
                        <Filter size={20} />
                        Bộ lọc
                    </button>

                    <button
                        onClick={loadProducts}
                        className={styles.refreshButton}
                        disabled={loading}
                    >
                        <RefreshCw size={20} className={loading ? styles.spinning : ''} />
                        Làm mới
                    </button>

                    <button className={styles.addButton} onClick={() => navigate('/admin/products/create')}>
                        <Plus size={20} />
                        Thêm sản phẩm
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className={styles.filtersPanel}>
                    <div className={styles.filtersHeader}>
                        <h3>Bộ lọc tìm kiếm</h3>
                        <button
                            onClick={() => setShowFilters(false)}
                            className={styles.closeFiltersButton}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.filtersGrid}>
                        <div className={styles.filterGroup}>
                            <label>Tên sản phẩm</label>
                            <input
                                type="text"
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                                placeholder="Tìm theo tên..."
                                className={styles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Mã sản phẩm</label>
                            <input
                                type="text"
                                value={filters.sku}
                                onChange={(e) => handleFilterChange('sku', e.target.value)}
                                placeholder="Tìm theo SKU..."
                                className={styles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Danh mục</label>
                            <select
                                value={filters.categoryId}
                                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Có khuyến mãi</label>
                            <select
                                value={filters.hasDiscount}
                                onChange={(e) => handleFilterChange('hasDiscount', e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Tất cả</option>
                                <option value="true">Có khuyến mãi</option>
                                <option value="false">Không khuyến mãi</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Giá từ</label>
                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                placeholder="0"
                                min="0"
                                className={styles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Giá đến</label>
                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                placeholder="999999999"
                                min="0"
                                className={styles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Trạng thái kho</label>
                            <select
                                value={filters.inStock}
                                onChange={(e) => handleFilterChange('inStock', e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Tất cả</option>
                                <option value="true">Còn hàng</option>
                                <option value="false">Hết hàng</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.filtersActions}>
                        <button
                            onClick={resetFilters}
                            className={styles.resetButton}
                        >
                            Xóa bộ lọc
                        </button>
                        <button
                            onClick={applyFilters}
                            className={styles.applyButton}
                        >
                            <Search size={16} />
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Mã sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Giá gốc</th>
                            <th>Giá KM</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9" className={styles.loading}>
                                    <div className={styles.spinner}></div>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="9" className={styles.noData}>
                                    Không tìm thấy sản phẩm nào
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>
                                        <div className={styles.productInfo}>
                                            {product.mainImageUrl && (
                                                <img
                                                    src={product.mainImageUrl}
                                                    alt={product.name}
                                                    className={styles.productImage}
                                                />
                                            )}
                                            <span className={styles.productName}>{product.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <code className={styles.sku}>{product.sku}</code>
                                    </td>
                                    <td>{product.categoryName || 'N/A'}</td>
                                    <td className={styles.price}>
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className={styles.price}>
                                        {product.discountPrice ? (
                                            <span className={styles.discountPrice}>
                                                {formatPrice(product.discountPrice)}
                                            </span>
                                        ) : (
                                            <span className={styles.noDiscount}>—</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={styles.quantity}>
                                            {calculateTotalQuantity(product.variants)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.status} ${product.inStock ? styles.inStock : styles.outOfStock
                                            }`}>
                                            {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => handleView(product.id)}
                                                className={`${styles.actionButton} ${styles.viewButton}`}
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(product.id)}
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <div className={styles.paginationLeft}>
                    <span className={styles.paginationInfo}>
                        Hiển thị {Math.min(pagination.page * pagination.size + 1, pagination.totalElements)} - {' '}
                        {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} của {' '}
                        {pagination.totalElements} kết quả
                    </span>

                    <div className={styles.pageSizeSelector}>
                        <label>Hiển thị:</label>
                        <select
                            value={pagination.size}
                            onChange={(e) => handlePageSizeChange(e.target.value)}
                            className={styles.pageSizeSelect}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className={styles.paginationRight}>
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 0}
                        className={styles.pageButton}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <div className={styles.pageNumbers}>
                        {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                            const pageNumber = pagination.page <= 2
                                ? index
                                : pagination.page >= pagination.totalPages - 3
                                    ? pagination.totalPages - 5 + index
                                    : pagination.page - 2 + index;

                            if (pageNumber < 0 || pageNumber >= pagination.totalPages) return null;

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`${styles.pageNumber} ${pageNumber === pagination.page ? styles.active : ''
                                        }`}
                                >
                                    {pageNumber + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        className={styles.pageButton}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;