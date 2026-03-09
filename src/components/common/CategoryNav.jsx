import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import './CategoryNav.css';

const CATEGORIES = [
  {
    name: 'Skin Care',
    subcategories: [
      {
        heading: 'Face Care',
        items: ['Face Serum', 'Face Toner', 'Face Masks & Sheets', 'Sunscreen', 'Moisturizers', 'Creams & Lotions'],
      },
      {
        heading: 'Cleansers & Exfoliators',
        items: ['Face Wash', 'Cleansers', 'Scrub'],
      },
      {
        heading: 'Body Care',
        items: ['Face & Body Oil', 'Body Wash', 'Body Lotion', 'Hand & Foot Care'],
      },
    ],
  },
  {
    name: 'Hair Care',
    subcategories: [
      {
        heading: 'Shampoo & Conditioner',
        items: ['Shampoo', 'Conditioner'],
      },
      {
        heading: 'Hair Masks & Serums',
        items: ['Hair Oil & Serums', 'Hair Masks'],
      },
      {
        heading: 'Hair Styling & Grooming',
        items: ['Styling Tools', 'Styling Products', 'Heat Protection'],
      },
    ],
  },
  {
    name: 'Face Care',
    subcategories: [
      {
        heading: 'Treatments',
        items: ['Acne Treatment', 'Anti-Aging', 'Brightening', 'Eye Cream & Care', 'Lip Care'],
      },
    ],
  },
  {
    name: 'Personal Hygiene',
    subcategories: [
      {
        heading: 'Hygiene Essentials',
        items: ['Deodorants', 'Body Sprays', 'Sanitizers', 'Wipes'],
      },
    ],
  },
  {
    name: 'Oral Care',
    subcategories: [
      {
        heading: 'Oral Hygiene',
        items: ['Toothpaste', 'Toothbrush', 'Mouthwash'],
      },
    ],
  },
  {
    name: 'Feminine Care',
    subcategories: [],
  },
  {
    name: 'Confectionery',
    subcategories: [],
  },
  {
    name: 'Juice & Beverages',
    subcategories: [],
  },
  {
    name: 'Support',
    isSupport: true,
    subcategories: [
      {
        heading: '',
        items: [
          { label: 'About Us', to: '/about' },
          { label: 'Contact Us', to: '/contact' },
          { label: 'FAQs', to: '/faq' },
          { label: 'Help Center', to: '/help' },
        ],
      },
    ],
  },
];

const CategoryNav = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const navRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleCategory = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openCat = openIndex !== null ? CATEGORIES[openIndex] : null;

  return (
    <nav className="category-nav" ref={navRef}>
      <div className="category-nav-inner">
        {CATEGORIES.map((cat, index) => (
          <div key={cat.name} className="category-nav-item">
            {cat.subcategories.length > 0 ? (
              <button
                className={`category-nav-link ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleCategory(index)}
              >
                {cat.name}
                <ChevronDown
                  size={14}
                  className={`category-chevron ${openIndex === index ? 'rotated' : ''}`}
                />
              </button>
            ) : (
              <Link
                to={`/categories/${encodeURIComponent(cat.name)}`}
                className="category-nav-link"
                onClick={() => setOpenIndex(null)}
              >
                {cat.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Full-screen mega menu rendered outside the inner nav */}
      {openCat && (
        <>
          <div className="mega-overlay" onClick={() => setOpenIndex(null)} />
          <div className="mega-menu">
            <div className="mega-menu-inner">
              {!openCat.isSupport && (
                <Link
                  to={`/categories/${encodeURIComponent(openCat.name)}`}
                  className="mega-all-link"
                  onClick={() => setOpenIndex(null)}
                >
                  All {openCat.name}
                </Link>
              )}
              <div className="mega-groups-row">
                {openCat.subcategories.map((group) => (
                  <div key={group.heading || 'support'} className="mega-group">
                    {group.heading && <h4 className="mega-group-heading">{group.heading}</h4>}
                    {group.items.map((item) => {
                      const label = typeof item === 'string' ? item : item.label;
                      const to = typeof item === 'string'
                        ? `/categories/${encodeURIComponent(item)}`
                        : item.to;
                      return (
                        <Link
                          key={label}
                          to={to}
                          className="mega-group-link"
                          onClick={() => setOpenIndex(null)}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default CategoryNav;
