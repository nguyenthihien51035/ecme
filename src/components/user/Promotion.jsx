import styles from '../../styles/user/Promotion.module.scss';

export default function Promotion() {
    return (
        <div className="container">
            <div className={styles.promotionSection}>
                <div className={styles.promotionGrid}>
                    {/* Item 1 */}
                    <div className={styles.promotionItem}>
                        <div className={styles.promotionIcon}>
                            <img
                                src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_1.png?1724310613023"
                                alt=""
                                width="50"
                                height="50"
                            />
                        </div>
                        <div className={styles.promotionText}>
                            Vận chuyển <b>MIỄN PHÍ</b>
                            <br />
                            Trong khu vực <b>TP.HCM</b>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className={styles.promotionItem}>
                        <div className={styles.promotionIcon}>
                            <img
                                src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_2.png?1724310613023"
                                alt=""
                                width="50"
                                height="50"
                            />
                        </div>
                        <div className={styles.promotionText}>
                            Tích điểm nâng hạng
                            <br />
                            <b>THẺ THÀNH VIÊN</b>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className={styles.promotionItem}>
                        <div className={styles.promotionIcon}>
                            <img
                                src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_3.png?1724310613023"
                                alt=""
                                width="50"
                                height="50"
                            />
                        </div>
                        <div className={styles.promotionText}>
                            Tiến hành thanh toán
                            <br />
                            Với nhiều <b>HÌNH THỨC</b>
                        </div>
                    </div>

                    {/* Item 4 */}
                    <div className={styles.promotionItem}>
                        <div className={styles.promotionIcon}>
                            <img
                                src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_4.png?1724310613023"
                                alt=""
                                width="50"
                                height="50"
                            />
                        </div>
                        <div className={styles.promotionText}>
                            <b>100% HOÀN TIỀN</b>
                            <br />
                            nếu sản phẩm lỗi
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
