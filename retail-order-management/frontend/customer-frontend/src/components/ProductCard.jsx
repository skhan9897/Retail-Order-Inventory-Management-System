import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <span style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'var(--danger)',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          zIndex: 10
        }}>
          -{product.discountPercent}% OFF
        </span>
      )}

      {/* Stock Status Badge */}
      {product.stock <= 5 && product.stock > 0 && (
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#fef3c7',
          color: '#b45309',
          fontSize: '0.7rem',
          fontWeight: 600,
          padding: '0.2rem 0.4rem',
          borderRadius: '4px',
          zIndex: 10
        }}>
          Low Stock ({product.stock})
        </span>
      )}

      {/* Image Container */}
      <Link to={`/products/${product.id}`} style={{ position: 'relative', overflow: 'hidden', paddingTop: '75%', backgroundColor: '#f1f5f9' }}>
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400x300'}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Card Details */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              {product.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.8125rem' }}>
              <Star size={14} fill="#f59e0b" />
              <span style={{ fontWeight: 600 }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.reviewsCount})</span>
            </div>
          </div>

          <Link to={`/products/${product.id}`} style={{ color: 'var(--text-main)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.35, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.name}
            </h3>
          </Link>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            SKU: {product.sku} | Brand: {product.brand}
          </p>
        </div>

        <div>
          {/* Price & Action */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={16} />
              <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
            <Link to={`/products/${product.id}`} className="btn btn-outline btn-sm" title="View details">
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
