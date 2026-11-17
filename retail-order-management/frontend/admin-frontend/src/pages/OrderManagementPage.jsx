import React, { useState, useEffect } from 'react';
import { Eye, Edit, XCircle, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import { adminServices } from '../services/adminServices';
import { useAdminToast } from '../context/AdminToastContext';

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const { showToast } = useAdminToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminServices.getOrders();
      setOrders(data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await adminServices.updateOrderStatus(orderId, status);
      showToast(`Order #${orderId} status updated to ${status}`, 'success');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  const columns = [
    { header: 'Order ID', accessor: 'id', render: (r) => <strong>{r.id}</strong> },
    { header: 'Customer', accessor: 'customerName', render: (r) => (
      <div>
        <p style={{ fontWeight: 600 }}>{r.customerName}</p>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{r.customerEmail}</span>
      </div>
    )},
    { header: 'Date', accessor: 'date' },
    { header: 'Payment Method', accessor: 'paymentMethod' },
    { header: 'Total', accessor: 'totalAmount', render: (r) => `$${r.totalAmount.toFixed(2)}` },
    {
      header: 'Fulfillment Status',
      accessor: 'status',
      render: (r) => {
        let badgeStyle = 'badge-secondary';
        if (r.status === 'DELIVERED') badgeStyle = 'badge-success';
        if (r.status === 'IN_TRANSIT' || r.status === 'PROCESSING') badgeStyle = 'badge-info';
        if (r.status === 'PENDING') badgeStyle = 'badge-warning';
        if (r.status === 'CANCELLED') badgeStyle = 'badge-danger';
        return <span className={`badge ${badgeStyle}`}>{r.status}</span>;
      }
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (r) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => { setSelectedOrder(r); setNewStatus(r.status); }}
            className="btn btn-outline btn-sm"
            title="View Details & Update"
          >
            <Eye size={14} />
          </button>
          {r.status !== 'CANCELLED' && r.status !== 'DELIVERED' && (
            <button
              onClick={() => handleUpdateStatus(r.id, 'CANCELLED')}
              className="btn btn-danger btn-sm"
              title="Cancel Order"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order Management</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Track, update fulfillment status, and inspect customer orders</p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'PENDING', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading order management table...</p>
        ) : (
          <DataTable columns={columns} data={filteredOrders} searchPlaceholder="Search by ID, customer name or email..." />
        )}
      </div>

      {/* Order Details & Status Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Order #{selectedOrder.id} Details</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ fontWeight: 700, fontSize: '1.2rem' }}>✕</button>
            </div>

            <div className="grid-2" style={{ marginBottom: '1rem' }}>
              <div>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Customer</span>
                <p style={{ fontWeight: 700 }}>{selectedOrder.customerName} ({selectedOrder.customerEmail})</p>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Payment Method</span>
                <p style={{ fontWeight: 700 }}>{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
              </div>
            </div>

            {/* Change Status Dropdown */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Update Fulfillment Status</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, newStatus)}
                  className="btn btn-primary btn-sm"
                >
                  Save Status
                </button>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ordered Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {selectedOrder.items?.map((it, idx) => (
                <div key={idx} className="flex-between" style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                  <span>{it.name} x {it.quantity}</span>
                  <span style={{ fontWeight: 600 }}>${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex-between" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--admin-primary)' }}>${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
