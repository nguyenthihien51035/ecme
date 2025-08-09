import { Edit, MessageCircle, Trash2, Facebook, Twitter, Linkedin } from 'lucide-react';
import styles from '../styles/UserDetails.module.scss';
import { useNavigate, useParams } from "react-router-dom";


const UserDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // để lấy id hiện tại từ URL

    const purchaseHistory = [
        { plan: 'Acme pro plan (monthly)', status: 'Pending', date: '02/10/2025', amount: '$59.90' },
        { plan: 'Acme pro plan (monthly)', status: 'Paid', date: '01/14/2025', amount: '$59.90' },
        { plan: 'Acme pro plan (monthly)', status: 'Paid', date: '12/13/2024', amount: '$59.90' },
    ];

    const paymentMethods = [
        { type: 'visa', name: 'Angelina Gotelli •••• 0392', label: 'Primary', expired: 'Dec 2025' },
        { type: 'mastercard', name: 'Angelina Gotelli •••• 8461', expired: 'Jun 2025' },
    ];

    return (
        <div className={styles.full}>

            <div className={styles.container}>
                {/* Left Panel - Customer Info */}
                <div className={styles.leftPanel}>
                    <div className={styles.edtiIconRight}>
                        <div className={styles.editIcon} onClick={() => navigate(`/user/edit/${id}`)}>
                            <Edit size={16} />
                        </div>
                    </div>
                    <div className={styles.profileSection}>
                        <div className={styles.avatar}>
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww" alt="Angelina Gotelli" />
                        </div>
                        <h2 className={styles.name}>Angelina Gotelli</h2>
                    </div>

                    <div >
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Email</span>
                            <span className={styles.value}>carolyn_h@hotmail.com</span>
                        </div>

                        <div className={styles.infoItem}>
                            <span className={styles.label}>Phone</span>
                            <span className={styles.value}>+12-123-1234</span>
                        </div>

                        <div className={styles.infoItem}>
                            <span className={styles.label}>Date of birth</span>
                            <span className={styles.value}>10/10/1992</span>
                        </div>

                        <div className={styles.infoItem}>
                            <span className={styles.label}>Last Online</span>
                            <span className={styles.value}>12 Aug 2024 09:40 AM</span>
                        </div>

                        <div className={styles.infoItem}>
                            <span className={styles.label}>Social</span>
                            <div className={styles.socialIcons}>
                                <Facebook size={16} className={styles.socialIcon} />
                                <Twitter size={16} className={styles.socialIcon} />
                                <Linkedin size={16} className={styles.socialIcon} />
                                <div className={styles.pinterestIcon}>P</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.messageBtn}>
                            <MessageCircle size={16} />
                            Send Message
                        </button>
                        <button className={styles.deleteBtn}>
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Right Panel - Billing Info */}
                <div className={styles.rightPanel}>
                    <div className={styles.tabs}>
                        <button className={`${styles.tab} ${styles.active}`}>Billing</button>
                        <button className={styles.tab}>Activity</button>
                    </div>

                    {/* Purchase History */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Purchase history</h3>
                        <div className={styles.purchaseList}>
                            {purchaseHistory.map((item, index) => (
                                <div key={index} className={styles.purchaseItem}>
                                    <span className={styles.planName}>{item.plan}</span>
                                    <span className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>
                                        <span className={styles.statusDot}></span>
                                        {item.status}
                                    </span>
                                    <span className={styles.date}>{item.date}</span>
                                    <span className={styles.amount}>{item.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Addresses</h3>
                        <div className={styles.addressGrid}>
                            <div className={styles.addressCard}>
                                <h4 className={styles.addressTitle}>Billing Address</h4>
                                <div className={styles.addressDetails}>
                                    <p>123 Main St</p>
                                    <p>New York</p>
                                    <p>10001</p>
                                    <p>United States</p>
                                </div>
                            </div>
                            <div className={styles.addressCard}>
                                <h4 className={styles.addressTitle}>Delivery Address</h4>
                                <div className={styles.addressDetails}>
                                    <p>123 Main St</p>
                                    <p>New York</p>
                                    <p>10001</p>
                                    <p>United States</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Payment Methods</h3>
                        <div className={styles.paymentList}>
                            {paymentMethods.map((method, index) => (
                                <div key={index} className={styles.paymentItem}>
                                    <div className={styles.paymentInfo}>
                                        <div className={`${styles.cardIcon} ${styles[method.type]}`}>
                                            {method.type === 'visa' ? 'VISA' : 'MC'}
                                        </div>
                                        <div className={styles.cardDetails}>
                                            <span className={styles.cardName}>
                                                {method.name}
                                                {method.label && <span className={styles.primaryLabel}>{method.label}</span>}
                                            </span>
                                            <span className={styles.cardExpiry}>Expired {method.expired}</span>
                                        </div>
                                    </div>
                                    <button className={styles.editPaymentBtn}>Edit</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;