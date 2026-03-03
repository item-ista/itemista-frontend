import BannerSlider from '../components/home/BannerSlider';
import FlashSale from '../components/home/FlashSale';
import CategoriesSection from '../components/home/CategoriesSection';
import JustForYou from '../components/home/JustForYou';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <BannerSlider />
      <FlashSale />
      <CategoriesSection />
      <JustForYou />
    </div>
  );
};

export default Home;
