import React from 'react';
import styles from '../../styles/user/Footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.topSection}>
                <div className={styles.contentWrapper}>
                    {/* Company Info */}
                    <div className={styles.companyColumn}>
                        <h2>CÔNG TY TNHH RUBIES</h2>
                        <div className={styles.companyInfo}>
                            47 - 49 Trần Quang Diệu, Phường 14, Quận 3, TP. HCM
                        </div>
                        <div className={styles.contactInfo}>
                            Điện thoại: <a href="tel:0703470938">070 347 0938</a>
                        </div>
                        <div className={styles.contactInfo}>
                            Email: <a href="mailto:rubiesin2015@gmail.com">rubiesin2015@gmail.com</a>
                        </div>

                        <div className={styles.socialIcons}>
                            <a href="https://www.facebook.com/rubiesin2015" title="Facebook">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com/rubies.sg/" title="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://www.youtube.com/channel/UCALOExnNJaJG9YS9lvTnhsg" title="Youtube">
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                            <a href="https://www.tiktok.com/@rubiesin2015" title="Tiktok">
                                <i className="fa-brands fa-tiktok"></i>
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className={styles.companyLinksColumn}>
                        <h2>CÔNG TY</h2>
                        <ul>
                            <li><a href="#">RUBIES RUBIES</a></li>
                            <li><a href="#">Tuyển Dụng & Việc Làm</a></li>
                            <li><a href="#">Tin Tức Thời Trang</a></li>
                            <li><a href="#">Chăm Sóc Khách Hàng</a></li>
                        </ul>
                    </div>

                    {/* Customer Policies */}
                    <div className={styles.policiesColumn}>
                        <h2>CHÍNH SÁCH KHÁCH HÀNG</h2>
                        <ul>
                            <li><a href="#">Chính Sách KH Thân Thiết</a></li>
                            <li><a href="#">Chính Sách Đổi và Trả Hàng</a></li>
                            <li><a href="#">Chính Sách Bảo Hành</a></li>
                            <li><a href="#">Chính Sách Bảo Mật</a></li>
                            <li><a href="#">Hướng Dẫn Sử Dụng</a></li>
                            <li><a href="#">Các Câu Hỏi Thường Gặp</a></li>
                        </ul>
                    </div>

                    {/* Store Info */}
                    <div className={styles.storeInfoColumn}>
                        <h2>THÔNG TIN CỬA HÀNG</h2>
                        <div className={styles.storeName}>CỬA HÀNG SỐ 1</div>
                        <div className={styles.storeAddress}>
                            26 Lý Tự Trọng, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh
                        </div>
                        <div className={styles.viewAllStores}>
                            <a href="#">Xem tất cả cửa hàng</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bottomSection}>
                © Bản quyền thuộc về Hiền
            </div>
        </footer>
    );
};

export default Footer;