import React, { useEffect, useState } from "react";
import styles from "../../styles/user/CategorySlider.module.scss";

export default function CategorySlider() {
    const [categories, setCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/categories")
            .then((res) => res.json())
            .then((result) => {
                console.log("Dữ liệu nhận về:", result);
                setCategories(result.data || []);
            })
            .catch((error) => console.error("Lỗi khi gọi API:", error));
    }, []);

    const nextSlide = () => {
        if (categories.length <= 3) return;
        setCurrentIndex((prev) => (prev + 1) % categories.length);
    };

    const prevSlide = () => {
        if (categories.length <= 3) return;
        setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    };



    // Tạo mảng để hiển thị 3 items liên tiếp (circular)
    const getVisibleCategories = () => {
        if (categories.length === 0) return [];
        if (categories.length <= 3) return categories;

        const visible = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % categories.length;
            visible.push(categories[index]);
        }
        return visible;
    };

    if (categories.length === 0) {
        return (
            <div className="container my-5">
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                    rel="stylesheet"
                />
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    const visibleCategories = getVisibleCategories();

    return (
        <div className="container my-5">
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <div className={styles.categorySliderWrapper}>
                {/* Main slider container */}
                <div className={styles.sliderContainer}>
                    <div className={styles.sliderTrack}>
                        {visibleCategories.map((cate, index) => (
                            <div key={`${cate.id}-${currentIndex}-${index}`} className={styles.sliderItem}>
                                <div className={styles.card}>
                                    <img
                                        src={cate.image}
                                        className={styles.cardImg}
                                        alt={cate.name}
                                    />
                                    <div className={styles.cardBody}>
                                        <h5 className={styles.cardTitle}>{cate.name}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Controls - Chỉ hiển thị khi có nhiều hơn 3 items */}
                {categories.length > 3 && (
                    <>
                        <button
                            className={`${styles.carouselControl} ${styles.carouselControlPrev}`}
                            type="button"
                            onClick={prevSlide}
                        >
                            <span className={styles.carouselControlIcon}>‹</span>
                            <span className={styles.visuallyHidden}>Previous</span>
                        </button>

                        <button
                            className={`${styles.carouselControl} ${styles.carouselControlNext}`}
                            type="button"
                            onClick={nextSlide}
                        >
                            <span className={styles.carouselControlIcon}>›</span>
                            <span className={styles.visuallyHidden}>Next</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}