import React, { useState, useEffect } from 'react';
import { Eye, Mail, Phone, ShoppingBag } from 'lucide-react';
import DataTable from '../components/DataTable';
import { adminServices } from '../services/adminServices';

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await adminServices.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const columns = [
    { header: 'Customer ID', accessor: 'id', render: (r) => <strong>{r.id}</strong> },
    {
      header: 'Full Name',
      accessor: 'name',
      render: (r) => (
        <div>
          <p style={{ fontWeight: 700 }}>{r.name}</p>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{r.email}</span>
        </div>
      )
    },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Total Orders', accessor: 'ordersCount', render: (r) => <span className="badge badge-info">{r.ordersCount} Orders</span> },
    { header: 'Total Spent', accessor: 'totalSpent', render: (r) => <strong style={{ color: 'var(--admin-primary)' }}>${r.totalSpent.toFixed(2)}</strong> },
    { header: 'Joined Date', accessor: 'joinedDate' },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (r) => (
        <button onClick={() => setSelectedCustomer(r)} className="btn btn-outline btn-sm">
          <Eye size={14} />
          <span>Inspect History</span>
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Directory</h1>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>View registered retail customers, purchase metrics, and spending history</p>
      </div>

      <div className="card">
        {loading ? <p>Loading customers table...</p> : <DataTable columns={columns} data={customers} searchPlaceholder="Search customers by name, email, phone..." />}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Customer Profile: {selectedCustomer.name}</h3>
              <button onClick={() => setSelectedCustomer(null)} style={{ fontWeight: 700 }}>✕</button>
            </div>

            <div className="grid-2" style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Contact Information</p>
                <p style={{ fontWeight: 700, marginTop: '0.2rem' }}>Email: {selectedCustomer.email}</p>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Phone: {selectedCustomer.phone}</p>
              </div>

              <div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Lifetime Metrics</p>
                <p style={{ fontWeight: 700, marginTop: '0.2rem' }}>Total Orders: {selectedCustomer.ordersCount}</p>
                <p style={{ fontWeight: 800, color: 'var(--admin-primary)', fontSize: '1.1rem' }}>Total Spent: ${selectedCustomer.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
