import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', marginTop: '4rem', borderTop: '1px solid #1e293b' }}>
      {/* Features Ribbon */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem 0' }}>
        <div className="container grid-4" style={{ textAlign: 'center' }}>
          <div>
            <Truck size={28} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>Fast Nationwide Delivery</h4>
            <p style={{ fontSize: '0.8125rem' }}>Express dispatch on all orders</p>
          </div>
          <div>
            <ShieldCheck size={28} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>100% Secure Checkout</h4>
            <p style={{ fontSize: '0.8125rem' }}>Encrypted payments via SSL & JWT</p>
          </div>
          <div>
            <RefreshCw size={28} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>30-Day Money Back</h4>
            <p style={{ fontSize: '0.8125rem' }}>Hassle-free replacement policy</p>
          </div>
          <div>
            <PhoneCall size={28} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>Dedicated 24/7 Support</h4>
            <p style={{ fontSize: '0.8125rem' }}>Call or email anytime</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div className="grid-4">
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'white', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.3rem', borderRadius: '6px' }}>
                <ShoppingBag size={20} />
              </div>
              <span>RetailHub</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Enterprise Retail & Inventory Management Platform providing a seamless shopping experience for global customers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8125rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> 100 Commerce Way, Tech Park, US</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PhoneCall size={14} /> +1 (800) 555-RETAIL</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> support@retailhub.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Shop & Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/products?category=Electronics">Electronics & Gadgets</Link></li>
              <li><Link to="/products?category=Fashion%20%26%20Apparel">Fashion & Clothing</Link></li>
              <li><Link to="/products?category=Home%20%26%20Kitchen">Home & Kitchen</Link></li>
              <li><Link to="/products?category=Smartphones">Smartphones</Link></li>
              <li><Link to="/products">All Products</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Customer Portal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/account?tab=orders">Order Tracking</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/login">Customer Login</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Subscribe to Offers</h4>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>Get exclusive weekly discounts, promo codes, and product arrivals directly in your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to RetailHub updates!'); }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Your email address" className="form-control" required style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: 'white', fontSize: '0.8125rem' }} />
              <button type="submit" className="btn btn-primary btn-sm">Join</button>
            </form>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', marginTop: '2.5rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem' }}>
          <p>© {new Date().getFullYear()} RetailHub Inc. All rights reserved. Built for Retail Order & Inventory Management System.</p>
        </div>
      </div>
    </footer>
  );
}
