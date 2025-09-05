import styles from "../../styles/user/Header.module.scss";
import logo from "../../assets/img/logo.png";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setFavoriteCount(favorites.length);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavoriteCount(0);
    }
  }, []);

  // Lắng nghe favoritesUpdated
  useEffect(() => {
    const handleFavoritesUpdated = (e) => {
      setFavoriteCount(e.detail.favoriteCount);
    };
    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
    return () =>
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
  }, []);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchText)}`);
  };

  useEffect(() => {
    try {
      const existingCart = localStorage.getItem("cart");
      if (existingCart) {
        const cart = JSON.parse(existingCart);
        setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
      }
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const handleCartUpdated = (event) => {
      setCartCount(event.detail.cartCount);
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className="container d-flex justify-content-between align-items-center">
        {/* LEFT: Logo */}
        <div className={styles.headerLeft}>
          <a href="/">
            <img src={logo} alt="Rubies Logo" className={styles.logoImg} />
          </a>
        </div>

        {/* MID: Hotline, Store, Search, Menu */}
        <div className={styles.headerMid}>
          <div className={styles.topBar}>
            <span className={styles.iconText}>
              <span className={styles.iconCircle}>
                <i className="fas fa-phone"></i>
              </span>
              HOTLINE:
              <strong style={{ fontSize: "16px" }}> 070 347 0938</strong>
            </span>

            <span className={styles.iconText}>
              <span className={styles.iconCircle}>
                <i className="fas fa-map-marker-alt"></i>
              </span>
              HỆ THỐNG CỬA HÀNG
            </span>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button onClick={handleSearch}>
                <i className="fas fa-search" />
              </button>
            </div>

          </div>
          {/* Nếu muốn hiển thị kết quả ngay dưới ô tìm kiếm */}
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              <ul>
                {searchResults.map(product => (
                  <li key={product.id}>
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <nav className={styles.nav}>
            <ul>
              <li className={currentPath === "/" ? styles.active : ""}>
                <Link to="/">TRANG CHỦ</Link>
              </li>
              <li
                className={`${styles.hasMegaMenu} ${currentPath.startsWith("/products") ? styles.active : ""
                  }`}
              >
                <Link to="/products">
                  THỜI TRANG NỮ <i className="fas fa-caret-down"></i>
                </Link>
                <div className={styles.megaMenu}>
                  <div className="container">
                    <div className={styles.menuContent}>
                      {/* Ảnh bên trái */}
                      <div className={styles.leftImage}>
                        <img
                          src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-1.jpg?1751344003198"
                          alt="Fashion Left"
                        />
                      </div>

                      {/* Các cột danh mục ở giữa */}
                      <div className={styles.menuCols}>
                        <div className={styles.menuCol}>
                          <h5>ÁO NỮ</h5>
                          <Link to="/products/ao-thun">Áo Thun Nữ</Link>
                          <Link to="/products/ao-so-mi">Áo Sơ Mi Nữ</Link>
                          <Link to="/products/ao-kieu">Áo Kiểu Nữ</Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>ÁO KHOÁC NỮ</h5>
                          <Link to="/products/ao-khoac-kieu">
                            Áo Khoác Kiểu Nữ
                          </Link>
                          <Link to="/products/ao-khoac-blazer">
                            Áo Khoác Blazer Nữ
                          </Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>QUẦN NỮ</h5>
                          <Link to="/products/quan-dai">Quần Dài Nữ</Link>
                          <Link to="/products/quan-sooc">Quần Jeans Nữ</Link>
                          <Link to="/products/quan-ngan">Quần Ngắn Nữ</Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>VÁY</h5>
                          <Link to="/products/vay-ngan">Váy Ngắn</Link>
                          <Link to="/products/vay-dai">Váy Dài</Link>
                          <Link to="/products/vay-quan">Váy Quần</Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>ĐẦM</h5>
                          <Link to="/products/dam-dai">Đầm Dài</Link>
                          <Link to="/products/dam-ngan">Đầm Ngắn</Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>SET ĐỒ NỮ</h5>
                          <Link to="/products/set-ao-vay">
                            Set Áo và Váy Nữ
                          </Link>
                          <Link to="/products/set-ao-quan">
                            Set Áo và Quần Nữ
                          </Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>PHỤ KIỆN</h5>
                          <Link to="/products/tui">Túi</Link>
                          <Link to="/products/non">Nón</Link>
                          <Link to="/products/noi-y">Nội Y</Link>
                          <Link to="/products/khan">Khăn</Link>
                          <Link to="/products/cai-ao">Cài Áo</Link>
                          <Link to="/products/that-lung">Thắt Lưng</Link>
                          <Link to="/products/quan-tat">Quần Tất</Link>
                          <Link to="/products/giay">Giày</Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>JUMPSUIT</h5>
                          <Link to="/products/jumpsuit-ngan">
                            Jumpsuit Ngắn
                          </Link>
                          <Link to="/products/jumpsuit-dai">Jumpsuit Dài</Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>ĐỒ BỘ NỮ</h5>
                          <Link to="/products/do-bo-dai">Đồ Bộ Nữ Dài</Link>
                          <Link to="/products/do-bo-ngan">Đồ Bộ Nữ Ngắn</Link>
                        </div>
                      </div>

                      {/* Ảnh bên phải */}
                      <div className={styles.rightImage}>
                        <img
                          src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-2.jpg?1751344003198"
                          alt="Fashion Right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li
                className={`${styles.hasMegaMenu} ${currentPath.startsWith("/collections") ? styles.active : ""
                  }`}
              >
                <Link to="/collections">
                  BỘ SƯU TẬP<i className="fas fa-caret-down"></i>
                </Link>
                <div className={styles.megaMenu}>
                  <div className="container">
                    <div className={styles.menuContent}>
                      {/* Ảnh bên trái */}
                      <div className={styles.leftImage}>
                        <img
                          src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-2-image-1.jpg?1751344003198"
                          alt="Fashion Left"
                        />
                      </div>

                      {/* Các cột danh mục ở giữa */}
                      <div className={styles.menuCols}>
                        <div className={styles.menuCol}>
                          <h5>BST TẾT 2025</h5>
                          <Link to="/collections/ao-dai-tet-2025">
                            Áo Dài Tết 2025
                          </Link>
                        </div>

                        <div className={styles.menuCol}>
                          <h5>KNITWEAR</h5>
                          <Link to="/collections/det-kim">Dệt kim</Link>
                        </div>
                      </div>

                      {/* Ảnh bên phải */}
                      <div className={styles.rightImage}>
                        <img
                          src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-2-image-2.jpg?1751344003198"
                          alt="Fashion Right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.hasDropdown}>
                <Link to="/news">
                  TIN TỨC THỜI TRANG <i className="fas fa-caret-down"></i>
                </Link>
                <ul className={styles.dropdownMenu}>
                  <li>
                    <Link to="/news/tin-tuc-tong-hop">Tin Tức Tổng Hợp</Link>
                  </li>
                  <li>
                    <Link to="/news/tin-tuc-khuyen-mai">Tin Tức Khuyến Mại</Link>
                  </li>
                </ul>
              </li>
              <li className={styles.hasDropdown}>
                <Link to="/helps">
                  TRỢ GIÚP<i className="fas fa-caret-down"></i>
                </Link>
                <ul className={styles.dropdownMenu}>
                  <li>
                    <Link to="/news/ve-chung-toi">Về Chúng Tôi</Link>
                  </li>
                  <li>
                    <Link to="/news/cham-soc-khach-hang">Chăm Sóc Khách Hàng</Link>
                  </li>
                  <li>
                    <Link to="/news/tuyen-dung-va-viec-lam">Tuyển Dụng Và Việc Làm</Link>
                  </li>
                </ul>
              </li>
              <li
                className={
                  currentPath.startsWith("/promotions")
                    ? `${styles.active} ${styles.sale}`
                    : styles.sale
                }
              >
                <Link to="/promotions">
                  <img
                    src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/code_dis.gif?1751344003198"
                    alt=""
                  />
                  <span className={styles.flashText}>KHUYẾN MÃI</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* RIGHT: Icons */}
        <div className={styles.headerRight}>
          <div className={styles.iconGroup}>
            <Link to="/favorites">
              <div className={styles.iconCircle}>
                <i className="far fa-heart"></i>
                <span className={styles.iconBadge}>{favoriteCount}</span>
              </div>
              <div className={styles.iconLabel}>Yêu thích</div>
            </Link>
          </div>

          <div
            className={styles.iconGroup}
            onClick={() => setShowAccount(!showAccount)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <div className={styles.iconCircle}>
              <i className="far fa-user"></i>
            </div>
            <div className={styles.iconLabel}>Tài khoản</div>

            {showAccount && (
              <ul className={styles.accountDropdown}>
                <li>
                  <a href="/login">
                    <i className="fas fa-sign-in-alt" /> Đăng nhập
                  </a>
                </li>
                <li>
                  <a href="/register">
                    <i className="far fa-user" /> Đăng ký
                  </a>
                </li>
              </ul>
            )}
          </div>

          <div className={styles.iconGroup}>
            <Link to="/cart">
              <div className={styles.iconCircle}>
                <i className="fas fa-shopping-bag"></i>
                <span className={styles.iconBadge}>{cartCount}</span>
              </div>
              <div className={styles.iconLabel}>Giỏ hàng</div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
