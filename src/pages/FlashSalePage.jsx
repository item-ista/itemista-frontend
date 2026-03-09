import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { Filter, Grid, List, ChevronDown, Loader2 } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import './FlashSalePage.css';

const FlashSalePage = ({ pageType }) => {
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    // Update filters.category when searchParams change
    const catParam = searchParams.get('category') || '';
    if (catParam !== filters.category) {
      setFilters(prev => ({ ...prev, category: catParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, sortBy, slug]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const category = filters.category || searchParams.get('category') || (slug ? decodeURIComponent(slug) : '');
      const searchQuery = searchParams.get('q') || searchParams.get('search');

      let data;
      if (pageType === 'flash-sale') {
        data = await productService.getFlashSaleProducts();
      } else if (pageType === 'just-for-you') {
        data = await productService.getJustForYouProducts();
      } else if (searchQuery) {
        data = await productService.searchProducts(searchQuery);
      } else if (category) {
        data = await productService.getProductsByCategory(category);
      } else {
        data = await productService.getProducts();
      }

      // Apply price filters
      if (filters.minPrice) {
        data = data.filter(p => p.price >= parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        data = data.filter(p => p.price <= parseFloat(filters.maxPrice));
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          data.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          data.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          data.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
        default:
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
      }

      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' });
    fetchProducts();
  };

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Header */}
        <div className="products-header">
          <div className="products-header-left">
            <h1>
              {pageType === 'flash-sale'
                ? 'Flash Sale'
                : pageType === 'just-for-you'
                ? 'Just For You'
                : (searchParams.get('category') || (slug ? decodeURIComponent(slug) : ''))
                ? `${searchParams.get('category') || decodeURIComponent(slug || '')}` 
                : searchParams.get('q') || searchParams.get('search')
                ? `Search: "${searchParams.get('q') || searchParams.get('search')}"`
                : 'All Products'}
            </h1>
            <p className="products-count">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          <div className="products-header-right">
            <div className="sort-dropdown">
              <label>Sort:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                <Grid size={20} />
              </button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                <List size={20} />
              </button>
            </div>

            <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={20} />
              Filters
              <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            className="filters-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="filters-content">
              <div className="filter-group">
                <label>Min Price (Rs)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Max Price (Rs)</label>
                <input
                  type="number"
                  placeholder="100000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
              <button className="apply-filters-btn" onClick={applyFilters}>Apply</button>
              <button className="clear-filters-btn" onClick={clearFilters}>Clear</button>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className={`products-content ${viewMode}`}>
          {loading ? (
            <div className="products-loading">
              <Loader2 size={48} className="spinner" />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <p>No products found</p>
              <button onClick={clearFilters} className="reset-btn">Clear Filters</button>
            </div>
          ) : (
            <div className={`products-${viewMode}`}>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} viewMode={viewMode} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashSalePage;
