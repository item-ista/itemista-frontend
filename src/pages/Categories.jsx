import { useState } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(0);

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

  return (
    <div className="categories-page">
      {/* Mobile Search Header */}
      <div className="categories-mobile-header">
        <Link to="/" className="back-btn">
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
              <span className="sidebar-emoji">{category.emoji}</span>
              <span className="sidebar-text">{category.name}</span>
            </div>
          ))}
        </div>

        {/* Category Cards Grid - Click to go to products */}
        <div className="subcategories-container">
          <div className="subcategories-grid">
            {(activeCategory === 0 ? mainCategories.filter(c => c.id !== 0) : [mainCategories.find(c => c.id === activeCategory)]).map((cat) => (
              <Link
                key={cat.id}
                to={`/flash-sale?category=${encodeURIComponent(cat.name)}`}
                className="subcat-card"
              >
                <div className="subcat-image-wrapper">
                  <span className="subcat-emoji">{cat.emoji}</span>
                </div>
                <span className="subcat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
