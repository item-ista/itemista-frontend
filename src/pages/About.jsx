import { Link } from 'react-router';
import { ShoppingBag, Truck, Shield, Heart, Users, Star } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About ItemIsta</h1>
          <p className="about-subtitle">
            Pakistan's trusted online store for toiletries, personal care & hygiene products.
          </p>
        </div>
      </section>

      <div className="about-container">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            ItemIsta is Pakistan's dedicated online marketplace for toiletries and personal care products. 
            We bring you a wide range of skin care, hair care, oral care, personal hygiene, feminine care, 
            confectionery, and beverages — all in one convenient place. Our mission is to make quality 
            personal care products accessible to everyone across Pakistan.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe everyone deserves access to genuine, high-quality personal care products at 
            competitive prices. ItemIsta is committed to providing a seamless shopping experience with 
            authentic products, fast delivery, and exceptional customer service.
          </p>
        </section>

        <section className="about-features">
          <h2>Why Shop With Us?</h2>
          <div className="about-features-grid">
            <div className="about-feature-card">
              <ShoppingBag size={32} className="about-feature-icon" />
              <h3>Wide Selection</h3>
              <p>Thousands of products across all personal care categories.</p>
            </div>
            <div className="about-feature-card">
              <Shield size={32} className="about-feature-icon" />
              <h3>100% Authentic</h3>
              <p>We guarantee genuine products from trusted brands.</p>
            </div>
            <div className="about-feature-card">
              <Truck size={32} className="about-feature-icon" />
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery across Pakistan.</p>
            </div>
            <div className="about-feature-card">
              <Heart size={32} className="about-feature-icon" />
              <h3>Customer First</h3>
              <p>Your satisfaction is our top priority.</p>
            </div>
            <div className="about-feature-card">
              <Star size={32} className="about-feature-icon" />
              <h3>Best Prices</h3>
              <p>Competitive prices and regular deals & discounts.</p>
            </div>
            <div className="about-feature-card">
              <Users size={32} className="about-feature-icon" />
              <h3>Trusted Community</h3>
              <p>Join thousands of happy customers shopping with us.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded with a vision to simplify personal care shopping in Pakistan, ItemIsta started as a 
            small initiative to bring authentic toiletries and hygiene products to doorsteps nationwide. 
            Today, we serve customers across the country with a growing catalog of trusted brands and 
            products. We continue to expand our offerings and improve our services to deliver the best 
            shopping experience possible.
          </p>
        </section>

        <section className="about-cta">
          <h2>Start Shopping Today</h2>
          <p>Browse our collection and find the perfect products for your daily care routine.</p>
          <Link to="/" className="about-cta-btn">Shop Now</Link>
        </section>
      </div>
    </div>
  );
};

export default About;
