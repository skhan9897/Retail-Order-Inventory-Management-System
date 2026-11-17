import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, Award, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { MOCK_BANNERS } from '../utils/mockData';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prodData] = await Promise.all([
          productService.getCategories(),
          productService.getProducts()
        ]);
        setCategories(cats);
        setProducts(prodData.products || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextBanner = () => setActiveBanner((prev) => (prev + 1) % MOCK_BANNERS.length);
  const prevBanner = () => setActiveBanner((prev) => (prev - 1 + MOCK_BANNERS.length) % MOCK_BANNERS.length);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  const banner = MOCK_BANNERS[activeBanner];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '3rem' }}>
      {/* Hero Banner Section */}
      <section className="container" style={{ paddingTop: '1.5rem' }}>
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          background: banner.bg,
          color: 'white',
          padding: '3.5rem 2.5rem',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '600px', zIndex: 2, position: 'relative' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.8rem', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Special Promo
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              {banner.title}
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem' }}>
              {banner.subtitle}
            </p>
            <Link to={banner.link} className="btn btn-accent btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{banner.ctaText}</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Banner Controls */}
          <button onClick={prevBanner} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '0.5rem' }}>
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextBanner} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '0.5rem' }}>
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Top Categories Grid */}
      <section className="container">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Explore Categories</h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Find products tailored for your lifestyle and tech needs</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-3">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="card"
              style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem' }}
            >
              <img src={cat.image} alt={cat.name} style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{cat.name}</h3>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{cat.count}+ Products Available</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers Countdown Banner */}
      <section className="container">
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
              <Zap size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#92400e' }}>Flash Sale - Limited Time Deals!</h3>
              <p style={{ color: '#b45309', fontSize: '0.875rem' }}>Extra 15% instant discount applied at checkout. Offer ends soon!</p>
            </div>
          </div>
          <Link to="/products?filter=offers" className="btn btn-accent">
            Grab Deals Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Featured Products</h2>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">See All</Link>
        </div>

        {loading ? (
          <p>Loading featured products...</p>
        ) : (
          <div className="grid-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trending & Best Sellers */}
      <section className="container">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame color="var(--danger)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Trending & Best Sellers</h2>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">Explore More</Link>
        </div>

        {loading ? (
          <p>Loading trending products...</p>
        ) : (
          <div className="grid-4">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
