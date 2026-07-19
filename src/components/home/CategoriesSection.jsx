import { Link } from 'react-router';
import { motion } from 'framer-motion';
import './CategoriesSection.css';

const CategoriesSection = () => {
  const categories = [
    { id: 1, name: 'Skin Care', image: '/CategoriesLogo/SKIN CARE.png' },
    { id: 2, name: 'Hair Care', image: '/CategoriesLogo/HAIR CARE.png' },
    { id: 3, name: 'Face Care', image: '/CategoriesLogo/FACE CARE.png' },
    { id: 4, name: 'Sexual Wellness', image: '/CategoriesLogo/SEXUAL WELLNESS.png' },
    { id: 6, name: 'Feminine Care', image: '/CategoriesLogo/FEMININE CARE.png' },
    { id: 7, name: 'Confectionery', image: '/CategoriesLogo/CONFECTIONERY.png' },
    { id: 10, name: 'Oral Care', image: '/CategoriesLogo/ORAL CARE.png' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <section className="categories-section">
      {/* Desktop Header */}
      <motion.div 
        className="categories-header-desktop"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
      >
        <h2 className="categories-title">Categories</h2>
      </motion.div>

      {/* Mobile Header */}
      <motion.div 
        className="categories-header-mobile"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
      >
        <h2 className="categories-title-mobile">Popular Categories For You</h2>
        <Link to="/categories" className="scroll-more-link">Scroll More &gt;</Link>
      </motion.div>

      {/* Categories Grid */}
      <motion.div 
        className="categories-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
      >
        {categories.map(category => (
          <motion.div key={category.id} variants={itemVariants}>
            <Link 
              to={`/flash-sale?category=${encodeURIComponent(category.name)}`} 
              className="category-card"
            >
              <div className="category-image-wrapper">
                <img src={category.image} alt={category.name} className="category-logo-img" />
              </div>
              <span className="category-name">{category.name}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategoriesSection;
