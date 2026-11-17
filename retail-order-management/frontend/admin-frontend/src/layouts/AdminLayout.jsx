import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Warehouse,
  Users,
  CreditCard,
  Truck,
  BarChart3,
  LogOut,
  ShieldAlert,
  Bell,
  Search
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLayout() {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Product Management', path: '/admin/products', icon: Package },
    { label: 'Inventory Management', path: '/admin/inventory', icon: Warehouse },
    { label: 'Customer Management', path: '/admin/customers', icon: Users },
    { label: 'Payment Management', path: '/admin/payments', icon: CreditCard },
    { label: 'Shipment Management', path: '/admin/shipments', icon: Truck },
    { label: 'Reports & Analytics', path: '/admin/analytics', icon: BarChart3 }
  ];

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--admin-primary)', color: 'white', padding: '0.4rem', borderRadius: '6px' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>RetailHub</h2>
            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Enterprise Admin</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive ? 'white' : '#94a3b8',
                  backgroundColor: isActive ? 'var(--admin-primary)' : 'transparent',
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin User Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{adminUser?.name || 'Admin User'}</p>
            <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{adminUser?.email || 'admin@retailhub.com'}</p>
          </div>
          <button onClick={handleSignOut} style={{ color: '#f43f5e', padding: '0.4rem' }} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div style={{ position: 'relative', width: '320px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search orders, SKU, customers..."
              style={{ paddingLeft: '2.5rem', height: '38px', borderRadius: '8px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: '#f43f5e', borderRadius: '50%' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'var(--admin-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{adminUser?.name || 'Administrator'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
