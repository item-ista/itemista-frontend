import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHomepageSliderData } from '../../services/bannerService';
import './BannerSlider.css';

const defaultBanners = [
  { image_url: '/banner images/14467a43-3f12-4a22-8b79-ecb66960cf53_PK-1976-688.jpg_2200x2200q80.jpg_.avif', alt_text: 'Banner 1' },
  { image_url: '/banner images/535dd818-e979-4b11-82e2-42e0f220e18f_PK-1976-688.jpg_2200x2200q80.jpg_.avif', alt_text: 'Banner 2' },
  { image_url: '/banner images/6b1fa028-5102-4ae3-9175-6c9b5565af7c_PK-1976-688.jpg_2200x2200q80.jpg_.avif', alt_text: 'Banner 3' },
  { image_url: '/banner images/6cd12443-88f0-437e-aeab-771aba83bdb1_PK-1976-688.jpg_2200x2200q80.jpg_.avif', alt_text: 'Banner 4' },
  { image_url: '/banner images/c44c9e89-f6ed-4cdf-bb23-0ac63d089cd9_PK-1976-688.jpg_2200x2200q80.jpg_.avif', alt_text: 'Banner 5' },
  { image_url: '/banner images/deedaff9-e743-48c4-8f81-5d9bb1d22366_PK-1976-688.jpg_2200x2200q80.jpg_.avif', alt_text: 'Banner 6' },
  { image_url: '/banner images/e79f19e9-968f-4e43-911f-a850a5abc925_PK-1976-688.jpg_2200x2200q80.jpg_.avif', alt_text: 'Banner 7' },
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState(defaultBanners);
  const [autoplayDelayMs, setAutoplayDelayMs] = useState(2000);

  useEffect(() => {
    const loadSliderData = async () => {
      try {
        const data = await getHomepageSliderData();
        if (data.banners?.length) {
          setBanners(data.banners);
        }
        if (data.autoplayDelayMs) {
          setAutoplayDelayMs(data.autoplayDelayMs);
        }
      } catch (error) {
        console.error('Failed to load homepage slider data:', error);
      }
    };

    loadSliderData();
  }, []);

  useEffect(() => {
    if (!banners.length) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, autoplayDelayMs);

    return () => clearInterval(interval);
  }, [autoplayDelayMs, banners.length]);

  useEffect(() => {
    if (currentIndex > banners.length - 1) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  return (
    <motion.div 
      className="banner-slider"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div 
        className="banner-track" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="banner-slide">
            <img src={banner.image_url} alt={banner.alt_text || `Banner ${index + 1}`} className="banner-image" />
          </div>
        ))}
      </div>
      
      <div className="banner-indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BannerSlider;
