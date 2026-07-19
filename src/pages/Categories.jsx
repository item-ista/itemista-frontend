import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Loader2 } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import './Categories.css';

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const mainCategories = [
    { id: 0, name: 'All Categories', emoji: '📋' },
    { id: 1, name: 'Skin Care', emoji: '🧴' },
    { id: 2, name: 'Hair Care', emoji: '💇' },
    { id: 3, name: 'Face Care', emoji: '🧖' },
    { id: 4, name: 'Sexual Wellness', emoji: '💊' },
    { id: 5, name: 'Personal Hygiene', emoji: '🧼' },
    { id: 6, name: 'Feminine Care', emoji: '🌸' },
    { id: 7, name: 'Confectionery', emoji: '🍬' },
    { id: 8, name: 'Pet Foods', emoji: '🐾' },
    { id: 9, name: 'Juice & Beverages', emoji: '🥤' },
    { id: 10, name: 'Oral Care', emoji: '🪥' },
    { id: 11, name: 'Toiletries', emoji: '🚿' },
  ];

  useEffect(() => {
    if (activeCategory !== 0) {
      fetchCategoryProducts();
    }
  }, [activeCategory]);

  const fetchCategoryProducts = async () => {
    setLoading(true);
    try {
      const categoryName = mainCategories.find(c => c.id === activeCategory)?.name;
      if (categoryName) {
        const data = await productService.getProductsByCategory(categoryName);
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categories-page">
      {/* Mobile Search Header */}
      <div className="categories-mobile-header">
        <Link to="/" className="back-btn-cat">
          &larr;
        </Link>
        <span className="header-title">Categories</span>
        <button className="search-btn-cat">
          <Search size={20} />
        </button>
      </div>

      <div className="categories-content">
        {/* Sidebar */}
        <div className="categories-sidebar">
          {mainCategories.map((category) => (
            <div
              key={category.id}
              className={`sidebar-item ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="sidebar-item-inner">
                <span className="sidebar-emoji">{category.emoji}</span>
                <span className="sidebar-text">{category.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="subcategories-container">
          {activeCategory === 0 ? (
            /* Show Categories Grid when "All Categories" is selected */
            <div className="subcategories-grid">
              {mainCategories.filter(c => c.id !== 0).map((cat) => (
                <div
                  key={cat.id}
                  className="subcat-card"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="subcat-image-wrapper">
                    <span className="subcat-emoji">{cat.emoji}</span>
                  </div>
                  <span className="subcat-name">{cat.name}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Show Products for selected category */
            <div className="category-products-view">
              <div className="category-banner">
                <h3>{mainCategories.find(c => c.id === activeCategory)?.name}</h3>
                <span className="product-count">{products.length} Items</span>
              </div>

              {loading ? (
                <div className="cat-loading">
                  <Loader2 className="spin" size={32} />
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="cat-empty">
                  <p>No products found in this category.</p>
                </div>
              ) : (
                <div className="cat-products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
