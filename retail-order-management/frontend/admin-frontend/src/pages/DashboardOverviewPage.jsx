import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Users, Package, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartWidget from '../components/ChartWidget';
import DataTable from '../components/DataTable';
import { adminServices } from '../services/adminServices';
import { REVENUE_MONTHLY_CHART } from '../utils/adminMockData';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [st, ords, inv] = await Promise.all([
          adminServices.getDashboardStats(),
          adminServices.getOrders(),
          adminServices.getInventory()
        ]);
        setStats(st);
        setOrders(ords);
        setInventory(inv);
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <p>Loading dashboard analytics...</p>;

  const lowStockAlerts = inventory.filter(i => i.status === 'CRITICAL');

  const orderColumns = [
    { header: 'Order ID', accessor: 'id', render: (r) => <strong>{r.id}</strong> },
    { header: 'Customer', accessor: 'customerName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Total', accessor: 'totalAmount', render: (r) => `$${r.totalAmount.toFixed(2)}` },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => {
        const bg = r.status === 'DELIVERED' ? 'badge-success' : r.status === 'PENDING' ? 'badge-warning' : 'badge-info';
        return <span className={`badge ${bg}`}>{r.status}</span>;
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Enterprise Dashboard Overview</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Real-time metrics on sales, fulfillment, stock levels, and revenue</p>
        </div>
        <span className="badge badge-success" style={{ padding: '0.5rem 0.8rem', fontSize: '0.8125rem' }}>
          ● Live Gateway Sync
        </span>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid-4">
        <StatCard title="Total Orders" value={stats?.totalOrders} icon={ShoppingBag} color="#4f46e5" trend="+14.2%" subtext="vs last month" />
        <StatCard title="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString()}`} icon={DollarSign} color="#10b981" trend="+22.8%" subtext="growth" />
        <StatCard title="Total Customers" value={stats?.totalCustomers} icon={Users} color="#0284c7" trend="+8.5%" subtext="new accounts" />
        <StatCard title="Total Products" value={stats?.totalProducts} icon={Package} color="#8b5cf6" subtext="active catalog" />

        <StatCard title="Pending Orders" value={stats?.pendingOrders} icon={Clock} color="#f59e0b" subtext="awaiting action" />
        <StatCard title="Completed Orders" value={stats?.completedOrders} icon={CheckCircle2} color="#059669" subtext="fulfilled" />
        <StatCard title="Cancelled Orders" value={stats?.cancelledOrders} icon={XCircle} color="#ef4444" subtext="refunded" />
        <StatCard title="Low Stock Products" value={stats?.lowStockProducts} icon={AlertTriangle} color="#ea580c" trend="Action Required" />
      </div>

      {/* Revenue Charts & Sales Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        <ChartWidget title="Revenue Growth & Sales Monthly Statistics" data={REVENUE_MONTHLY_CHART} />

        {/* Low Stock Alerts Widget */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle color="#f59e0b" size={18} />
              <span>Low Stock Alerts</span>
            </h3>
            <span className="badge badge-danger">{lowStockAlerts.length} Items</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lowStockAlerts.map((item, idx) => (
              <div key={idx} style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#991b1b' }}>{item.productName}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#b91c1c' }}>SKU: {item.sku} | Warehouse: {item.location}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-danger">{item.availableStock} Left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Order Activity</h3>
        <DataTable columns={orderColumns} data={orders} pageSize={5} />
      </div>
    </div>
  );
}
