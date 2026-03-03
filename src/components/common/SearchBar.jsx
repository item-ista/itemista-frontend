import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { X, Search } from 'lucide-react';
import { productService } from '../../services/productService';
import './SearchBar.css';

const CATEGORIES = [
  'Skin Care',
  'Hair Care',
  'Face Care',
  'Sexual Wellness',
  'Personal Hygiene',
  'Feminine Care',
  'Confectionery',
  'Pet Foods',
  'Juice & Beverages',
  'Oral Care',
  'Toiletries'
];

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Rotate placeholders every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % CATEGORIES.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search functionality
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await productService.searchProducts(searchQuery);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300); // Debounce delay

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
      // Navigate to selected product
      handleProductClick(searchResults[selectedIndex].slug);
    } else if (searchQuery.trim()) {
      navigate(`/flash-sale?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  const handleProductClick = (productSlug) => {
    navigate(`/product/${productSlug}`);
    setShowResults(false);
    setSearchQuery('');
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < Math.min(searchResults.length - 1, 7) ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="highlighted-text">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <Search className="search-icon-left" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder={`search for ${CATEGORIES[placeholderIndex].toLowerCase()}`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => searchQuery && setShowResults(true)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="search-clear-btn"
              onClick={clearSearch}
            >
              <X size={16} />
            </button>
          )}
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>
      </form>

      {/* Live Search Results Dropdown */}
      {showResults && (
        <div className="search-results-dropdown">
          {isSearching ? (
            <div className="search-loading">Searching...</div>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.slice(0, 8).map((product, index) => (
                <div
                  key={product.id}
                  className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleProductClick(product.slug)}
                >
                  <div className="search-result-image">
                    <img src={product.image || '/placeholder-product.jpg'} alt={product.name} />
                  </div>
                  <div className="search-result-info">
                    <div className="search-result-name">
                      {highlightMatch(product.name || product.title || '', searchQuery)}
                    </div>
                    <div className="search-result-price">Rs. {product.price?.toLocaleString()}</div>
                  </div>
                  <div className="search-result-arrow">→</div>
                </div>
              ))}
              {searchResults.length > 8 && (
                <div className="search-show-all" onClick={handleSearch}>
                  Show all {searchResults.length} results
                </div>
              )}
            </>
          ) : (
            <div className="search-no-results">
              No products found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
