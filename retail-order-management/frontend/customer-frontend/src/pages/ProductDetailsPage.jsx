import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Zap, Star, ShieldCheck, Truck, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Catalogue</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} x "${product.name}" to your cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        {/* Gallery */}
        <div>
          <div className="card" style={{ position: 'relative', overflow: 'hidden', paddingTop: '75%', backgroundColor: '#f8fafc', marginBottom: '1rem' }}>
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x400'}
              alt={product.name}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '8px',
                    border: selectedImage === idx ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    overflow: 'hidden',
                    padding: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-secondary">{product.category}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>SKU: {product.sku}</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
              <Star size={18} fill="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{product.rating}</span>
            </div>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>({product.reviewsCount} customer reviews)</span>
          </div>

          {/* Price Box */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="badge badge-danger">Save {product.discountPercent}%</span>
              )}
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {product.stock > 0 ? `In Stock (${product.stock} units ready for immediate dispatch)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          {/* Quantity Controls & Purchase Buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0.6rem 1rem', backgroundColor: '#f1f5f9', fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ padding: '0.6rem 1.25rem', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ padding: '0.6rem 1rem', backgroundColor: '#f1f5f9', fontWeight: 700 }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-outline btn-lg"
              style={{ flex: 1 }}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="btn btn-accent btn-lg"
              style={{ flex: 1 }}
              disabled={product.stock <= 0}
            >
              <Zap size={20} />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Product Specifications Table */}
          {product.specifications && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Technical Specifications</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 600, width: '40%', backgroundColor: '#f8fafc' }}>{spec.key}</td>
                      <td style={{ padding: '0.6rem' }}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
