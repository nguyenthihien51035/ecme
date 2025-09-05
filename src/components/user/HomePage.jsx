import React from 'react';
import '../../styles/user/HomePage.module.scss';
import Slider from '../../components/user/Slider';
import Promotion from '../../components/user/Promotion';
import CategorySlider from "../../components/user/CategorySlider";
import ProductSection from '../../components/user/ProductSection';

function HomePage() {
  return (
    <>
      <Slider />
      <Promotion />
      <CategorySlider />
      <ProductSection />
    </>
  );
}

export default HomePage;