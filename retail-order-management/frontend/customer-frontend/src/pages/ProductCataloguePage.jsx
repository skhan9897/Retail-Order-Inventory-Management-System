import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

export default function ProductCataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cats, prodData] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({
            category: selectedCategory,
            search: searchQuery,
            minPrice,
            maxPrice,
            sort: sortOption
          })
        ]);
        setCategories(cats);
        let result = prodData.products || [];
        if (selectedBrand) {
          result = result.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
        }
        if (inStockOnly) {
          result = result.filter(p => p.stock > 0);
        }
        setProducts(result);
      } catch (err) {
        console.error('Error fetching catalogue products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, selectedBrand, sortOption, inStockOnly]);

  const handleCategoryChange = (catName) => {
    const params = new URLSearchParams(searchParams);
    if (catName) {
      params.set('category', catName);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('');
    setSortOption('featured');
    setInStockOnly(false);
    setSearchParams({});
  };

  const brandsList = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header Banner & Breadcrumbs */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          {selectedCategory ? `${selectedCategory} Collection` : 'All Product Catalogue'}
        </h1>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
          {searchQuery ? `Showing results for "${searchQuery}"` : 'Browse high-quality retail products with enterprise inventory guarantees'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        {/* Sidebar Filters */}
        <aside className="card" style={{ padding: '1.25rem', height: 'fit-content' }}>
          <div className="flex-between" style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
              <Filter size={18} color="var(--primary)" />
              <span>Filters</span>
            </div>
            <button onClick={resetFilters} className="btn btn-outline btn-sm" title="Reset Filters" style={{ fontSize: '0.75rem' }}>
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Categories</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="category"
                  checked={!selectedCategory}
                  onChange={() => handleCategoryChange('')}
                />
                <span>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} style={{ fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory.toLowerCase() === cat.name.toLowerCase()}
                    onChange={() => handleCategoryChange(cat.name)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />

          {/* Price Range Filter */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Price Range ($)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="Min"
                className="form-control"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />

          {/* Stock Availability Filter */}
          <div className="form-group">
            <label style={{ fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main>
          {/* Top Bar Sort & Count */}
          <div className="card flex-between" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {products.length} products
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sort By:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.875rem' }}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Listing */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p>Loading products catalogue...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Products Found</h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Try adjusting your search criteria or clear applied filters.</p>
              <button onClick={resetFilters} className="btn btn-primary btn-sm">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
