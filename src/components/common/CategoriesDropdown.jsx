import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import './CategoriesDropdown.css';

const CategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: "Electronic Accessories",
      subcategories: []
    },
    {
      id: 2,
      name: "TV & Home Appliances",
      subcategories: []
    },
    {
      id: 3,
      name: "Health & Beauty",
      subcategories: []
    },
    {
      id: 4,
      name: "Mother & Baby",
      hasSubmenu: true,
      subcategories: [
        "Clothing & Accessories",
        "Maternity Care",
        "Baby Gear",
        "Remote Control & Vehicles",
        "Feeding",
        "Milk Formula & Baby Food",
        "Diapering & Potty",
        "Nursery",
        "Sports & Outdoor Play",
        "Baby & Toddler Toys",
        "Baby Personal Care",
        "Toys & Games"
      ]
    },
    {
      id: 5,
      name: "Electronic Devices",
      hasSubmenu: true,
      subcategories: [
        "Feature Phones",
        "Daraz Like New",
        "Security Cameras",
        "Gaming Consoles",
        "Smart Phones",
        "Smart Watches",
        "Monitors",
        "Landline Phones",
        "Laptops",
        "Desktops",
        "Cameras & Drones",
        "Point & Shoot",
        "DSLR",
        "Instant Cameras",
        "Video Camera",
        "Drones"
      ]
    },
    {
      id: 6,
      name: "Groceries & Pets",
      subcategories: []
    },
    {
      id: 7,
      name: "Home & Lifestyle",
      subcategories: []
    },
    {
      id: 8,
      name: "Women's Fashion",
      subcategories: []
    },
    {
      id: 9,
      name: "Men's Fashion",
      subcategories: []
    },
    {
      id: 10,
      name: "Watches, Bags & Jewellery",
      subcategories: []
    },
    {
      id: 11,
      name: "Sports & Outdoor",
      subcategories: []
    },
    {
      id: 12,
      name: "Automotive & Motorbike",
      subcategories: []
    }
  ];

  const getSubmenuCategories = (categoryId) => {
    if (categoryId === 4) { // Mother & Baby
      return [
        "Play Vehicles",
        "RC Vehicles & Batteries",
        "Drones & Accessories",
        "Die-Cast Vehicles",
        "Play Trains & Railway Sets"
      ];
    } else if (categoryId === 5) { // Electronic Devices -> Cameras & Drones
      if (hoveredCategory === 'Cameras & Drones') {
        return [
          "Drones",
          "Point & Shoot",
          "DSLR",
          "Instant Cameras",
          "Video Camera"
        ];
      }
    }
    return [];
  };

  return (
    <div className="categories-dropdown-wrapper">
      <button 
        className="categories-btn"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span>Categories</span>
        <ChevronDown size={18} className={isOpen ? 'rotate' : ''} />
      </button>

      {isOpen && (
        <div 
          className="categories-dropdown"
          onMouseLeave={() => {
            setIsOpen(false);
            setHoveredCategory(null);
          }}
        >
          <div className="categories-main-list">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-item ${hoveredCategory === category.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCategory(category.id)}
              >
                <span className="category-name">{category.name}</span>
                {category.hasSubmenu && <ChevronRight size={16} className="arrow-icon" />}
              </div>
            ))}
          </div>

          {/* Subcategories Panel */}
          {hoveredCategory && categories.find(c => c.id === hoveredCategory)?.subcategories.length > 0 && (
            <div className="categories-submenu">
              <div className="submenu-grid">
                {categories.find(c => c.id === hoveredCategory)?.subcategories.map((subcat, index) => (
                  <div 
                    key={index} 
                    className={`submenu-item ${subcat.includes('&') || subcat === 'Cameras & Drones' ? 'has-more' : ''}`}
                    onMouseEnter={() => setHoveredCategory(subcat)}
                  >
                    <span>{subcat}</span>
                    {(subcat.includes('&') || subcat === 'Cameras & Drones' || subcat === 'Remote Control & Vehicles') && 
                      <ChevronRight size={14} className="submenu-arrow" />
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Third Level Menu */}
          {typeof hoveredCategory === 'string' && getSubmenuCategories(5).length > 0 && (
            <div className="categories-third-level">
              <div className="third-level-list">
                {getSubmenuCategories(5).map((item, index) => (
                  <div key={index} className="third-level-item">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesDropdown;
