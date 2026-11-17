import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    tax,
    shipping,
    totalAmount
  } = useCart();

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      showToast(`Coupon applied! ${res.discount}% discount added.`, 'success');
      setCouponCode('');
    } else {
      showToast(res.message, 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShoppingBag size={64} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Looks like you haven't added any products to your shopping cart yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Explore Catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Shopping Cart ({cart.length} items)</h1>
        <button onClick={clearCart} className="btn btn-outline btn-sm" style={{ color: 'var(--danger)' }}>
          <Trash2 size={16} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        {/* Cart Item List */}
        <div>
          <div className="card" style={{ padding: '0 1.25rem' }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem 0',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#f8fafc' }}
                />

                <div style={{ flex: 1 }}>
                  <Link to={`/products/${item.id}`} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {item.name}
                  </Link>
                  <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.2rem' }}>
                    SKU: {item.sku} | Unit Price: ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.3rem 0.6rem', fontWeight: 700 }}>-</button>
                  <span style={{ padding: '0.3rem 0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.3rem 0.6rem', fontWeight: 700 }}>+</button>
                </div>

                {/* Item Total */}
                <div style={{ minWidth: '90px', textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove Item */}
                <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-muted)' }} title="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/products" className="btn btn-outline btn-sm">
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Box */}
        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h3>

            {/* Coupon Code Section */}
            <div style={{ marginBottom: '1.25rem' }}>
              {appliedCoupon ? (
                <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.6rem 0.8rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                  <span>Coupon <strong>{appliedCoupon}</strong> Applied!</span>
                  <button onClick={removeCoupon} style={{ color: '#b91c1c', fontWeight: 700 }}>Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Coupon code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ fontSize: '0.8125rem' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm">Apply</button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
              <div className="flex-between">
                <span className="text-muted">Subtotal</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex-between" style={{ color: 'var(--success)' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 600 }}>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex-between">
                <span className="text-muted">Estimated Tax (10%)</span>
                <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
              </div>

              <div className="flex-between">
                <span className="text-muted">Shipping Fee</span>
                <span style={{ fontWeight: 600 }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }} className="flex-between">
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Final Order Amount</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '1rem' }}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} />
              <span>100% Encrypted & Safe Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
