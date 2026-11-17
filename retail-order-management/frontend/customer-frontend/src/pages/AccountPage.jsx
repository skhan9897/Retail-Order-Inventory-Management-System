import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, Clock, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';

export default function AccountPage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    showToast('Profile updated successfully!', 'success');
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to cancel order #${orderId}?`)) {
      try {
        await orderService.cancelOrder(orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
        showToast('Order cancelled successfully', 'info');
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: 'CANCELLED' }));
        }
      } catch (err) {
        showToast('Failed to cancel order', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED': return <span className="badge badge-success">Delivered</span>;
      case 'IN_TRANSIT': return <span className="badge badge-info">In Transit</span>;
      case 'PENDING': return <span className="badge badge-warning">Pending</span>;
      case 'CANCELLED': return <span className="badge badge-danger">Cancelled</span>;
      default: return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Customer Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        {/* Sidebar Navigation */}
        <aside className="card" style={{ padding: '0.75rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                backgroundColor: activeTab === 'profile' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'profile' ? 'white' : 'var(--text-main)',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                backgroundColor: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'orders' ? 'white' : 'var(--text-main)',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <Package size={18} />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                backgroundColor: activeTab === 'addresses' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'addresses' ? 'white' : 'var(--text-main)',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <MapPin size={18} />
              <span>Saved Addresses</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main>
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                Account Profile Settings
              </h2>
              <form onSubmit={handleProfileSave} style={{ maxWidth: '500px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    disabled
                    value={profileForm.email}
                    style={{ backgroundColor: '#f1f5f9' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email cannot be altered</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>

                <button type="submit" className="btn btn-primary">Save Profile Changes</button>
              </form>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                Order History & Live Tracking
              </h2>

              {loadingOrders ? (
                <p>Loading your orders...</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '1.25rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Order #{ord.id}</span>
                          <span className="text-muted" style={{ fontSize: '0.8125rem', marginLeft: '0.75rem' }}>Placed on {ord.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {getStatusBadge(ord.status)}
                          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${ord.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {ord.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', backgroundColor: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                            <img src={it.image || 'https://via.placeholder.com/40'} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                            <span>{it.name} (x{it.quantity})</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex-between">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="btn btn-outline btn-sm"
                        >
                          <Truck size={14} />
                          <span>Track & View Details</span>
                        </button>

                        {ord.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <XCircle size={14} />
                            <span>Cancel Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                Saved Shipping Addresses
              </h2>
              <div className="card" style={{ padding: '1.25rem', maxWidth: '400px', backgroundColor: '#f8fafc' }}>
                <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Default Shipping Address</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{user?.name || 'Customer Name'}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  123 Retail Enterprise Blvd, Suite 400<br />
                  New York, NY 10001<br />
                  Phone: {user?.phone || '+1 (555) 234-5678'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Tracking & Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Order Details #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ fontWeight: 700, fontSize: '1.2rem' }}>✕</button>
            </div>

            {/* Tracking Status Timeline */}
            {selectedOrder.tracking && (
              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Courier: {selectedOrder.tracking.carrier} | Tracking #: {selectedOrder.tracking.trackingNumber}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  {selectedOrder.tracking.steps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                      <CheckCircle size={18} color={step.completed ? 'var(--success)' : 'var(--border-color)'} />
                      <span style={{ fontWeight: step.completed ? 600 : 400, flex: 1 }}>{step.label}</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{step.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Items List</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex-between" style={{ fontSize: '0.875rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span>{it.name} (Qty: {it.quantity})</span>
                  <span style={{ fontWeight: 600 }}>${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex-between" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary)' }}>${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
