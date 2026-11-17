import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, DollarSign } from 'lucide-react';
import DataTable from '../components/DataTable';
import { adminServices } from '../services/adminServices';
import { useAdminToast } from '../context/AdminToastContext';

export default function PaymentManagementPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useAdminToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await adminServices.getPayments();
      setPayments(data);
    } catch (err) {
      showToast('Failed to load payment transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (txnId, amount) => {
    if (window.confirm(`Issue refund of $${amount.toFixed(2)} for Transaction #${txnId}?`)) {
      try {
        await adminServices.processRefund(txnId);
        showToast(`Refund of $${amount.toFixed(2)} processed successfully for ${txnId}`, 'success');
        fetchPayments();
      } catch (err) {
        showToast('Refund failed', 'error');
      }
    }
  };

  const columns = [
    { header: 'Transaction ID', accessor: 'txnId', render: (r) => <strong>{r.txnId}</strong> },
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Payment Method', accessor: 'method' },
    { header: 'Amount', accessor: 'amount', render: (r) => <strong>${r.amount.toFixed(2)}</strong> },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Payment Status',
      accessor: 'status',
      render: (r) => {
        const bg = r.status === 'SUCCESS' ? 'badge-success' : 'badge-warning';
        return <span className={`badge ${bg}`}>{r.status}</span>;
      }
    },
    {
      header: 'Refund Action',
      accessor: 'actions',
      render: (r) => (
        r.status === 'SUCCESS' ? (
          <button onClick={() => handleRefund(r.txnId, r.amount)} className="btn btn-outline btn-sm" style={{ color: 'var(--btn-danger)' }}>
            <RefreshCw size={14} />
            <span>Process Refund</span>
          </button>
        ) : (
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>N/A</span>
        )
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Payment Transactions & Refunds</h1>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Monitor payment gateway transactions, verify settlement status, and issue customer refunds</p>
      </div>

      <div className="card">
        {loading ? <p>Loading payment transactions...</p> : <DataTable columns={columns} data={payments} searchPlaceholder="Search by transaction ID, order ID, customer name..." />}
      </div>
    </div>
  );
}
