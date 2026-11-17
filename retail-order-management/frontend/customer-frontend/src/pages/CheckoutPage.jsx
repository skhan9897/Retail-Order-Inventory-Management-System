import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';

export default function CheckoutPage() {
  const { cart, subtotal, discountAmount, tax, shipping, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? user.name : '',
    addressLine: '123 Retail Enterprise Blvd',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    phone: user ? (user.phone || '+1 (555) 123-4567') : '+1 (555) 123-4567'
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.postalCode) {
      showToast('Please fill in all mandatory shipping address fields.', 'error');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        items: cart,
        totalAmount,
        shippingAddress,
        paymentMethod
      };

      const order = await orderService.createOrder(orderPayload);
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${order.id}`, { state: { order } });
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Checkout</h1>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        {/* Left Column: Shipping & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Address */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck color="var(--primary)" />
              <span>1. Shipping Address</span>
            </h3>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  required
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  required
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input
                type="text"
                name="addressLine"
                className="form-control"
                required
                value={shippingAddress.addressLine}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  required
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal / ZIP Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  className="form-control"
                  required
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Payment Selection */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard color="var(--primary)" />
              <span>2. Select Payment Method</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Credit Card', 'UPI / NetBanking', 'Cash on Delivery'].map((method) => (
                <label
                  key={method}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: paymentMethod === method ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: paymentMethod === method ? '#eff6ff' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Order Preview ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h3>

            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 500, flex: 1, paddingRight: '0.5rem' }}>
                    {item.name} x {item.quantity}
                  </span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div className="flex-between">
                <span className="text-muted">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex-between" style={{ color: 'var(--success)' }}>
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex-between">
                <span className="text-muted">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary)' }}>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-accent btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
              disabled={isPlacingOrder}
            >
              <Lock size={18} />
              <span>{isPlacingOrder ? 'Processing Order...' : 'Confirm & Place Order'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
