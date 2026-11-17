import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, Package, Menu, X, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', sticky: 'top', top: 0, zIndex: 100, position: 'sticky' }}>
      {/* Top Banner Notice */}
      <div style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '0.4rem 1rem', fontSize: '0.8125rem', textAlign: 'center' }}>
        <span>🚀 Free Shipping on orders over $500! Use code <strong>WELCOME10</strong> for 10% off.</span>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', gap: '1.5rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.35rem', color: 'var(--primary)' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
            <ShoppingBag size={22} />
          </div>
          <span style={{ color: '#0f172a' }}>Retail<span style={{ color: 'var(--primary)' }}>Hub</span></span>
        </Link>

        {/* Global Product Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '560px', display: 'flex', position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search for products, brands, electronics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: '2.5rem', borderRadius: '8px' }}
          />
          <button type="submit" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={18} />
          </button>
        </form>

        {/* Navigation & User Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/products" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Tag size={16} />
            <span>Catalogue</span>
          </Link>

          {/* Cart Icon with badge */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '0.4rem' }}>
            <ShoppingBag size={24} />
            {totalItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-4px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* User Account Menu */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}
              >
                <User size={18} color="var(--primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '200px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-color)',
                  zIndex: 200,
                  padding: '0.5rem 0'
                }}>
                  <Link
                    to="/account"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                  >
                    <Package size={16} />
                    <span>My Account & Orders</span>
                  </Link>
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.35rem 0' }} />
                  <button
                    onClick={() => { logout(); setUserDropdownOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--danger)', width: '100%', textAlign: 'left' }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-toggle" style={{ display: 'none' }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
