import '../../styles/user/HomePage.module.scss';
import Slider from '../../components/user/Slider';
import Promotion from '../../components/user/Promotion';
import CategorySlider from "../../components/user/CategorySlider";


function HomePage() {
  return (
    <>
      <Slider />
      <Promotion />
      <CategorySlider />
      <main className="container mt-4">
        <h2>Welcome to Rubies Fashion!</h2>
      </main>

    </>
  );
}

export default HomePage;
