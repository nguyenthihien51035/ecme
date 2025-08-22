import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Slider() {
    return (
        <div
            id="mainCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="5000"
        >
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" className="active" />
                <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1" />
                <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2" />
            </div>

            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img style={{ width: '400px', objectFit: 'cover' }} src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/slider_1.jpg?1751344003198" className="d-block w-100" alt="Slide 1" />
                </div>
                <div className="carousel-item">
                    <img style={{ width: '400px', objectFit: 'cover' }} src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/slider_3.jpg?1751344003198" className="d-block w-100" alt="Slide 2" />
                </div>
                <div className="carousel-item">
                    <img style={{ width: '400px', objectFit: 'cover' }} src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/slider_2.jpg?1751344003198" className="d-block w-100" alt="Slide 3" />
                </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
        </div>
    );
}
