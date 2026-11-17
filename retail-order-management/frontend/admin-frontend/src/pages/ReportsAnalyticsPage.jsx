import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Award, Download } from 'lucide-react';
import ChartWidget from '../components/ChartWidget';
import { REVENUE_MONTHLY_CHART } from '../utils/adminMockData';

export default function ReportsAnalyticsPage() {
  const topProducts = [
    { name: 'ZenBook Pro 15.6" Ultra Thin Laptop', category: 'Electronics', unitsSold: 142, revenue: 170398.58 },
    { name: 'Pro Noise Cancelling Wireless Headphones', category: 'Electronics', unitsSold: 320, revenue: 79996.80 },
    { name: 'Barista Touch Espresso Coffee Maker', category: 'Home & Kitchen', unitsSold: 180, revenue: 53820.00 },
    { name: 'Galaxy Pro 5G Smartphone 256GB', category: 'Smartphones', unitsSold: 55, revenue: 49499.45 }
  ];

  const handleExportCSV = () => {
    alert('Exporting Enterprise Sales & Inventory Valuation Report (CSV)...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Reports & Analytics</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Comprehensive breakdown of daily sales, monthly revenue streams, and product performance</p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-primary">
          <Download size={18} />
          <span>Export Financial Report</span>
        </button>
      </div>

      {/* Chart Section */}
      <ChartWidget title="Monthly Revenue Performance ($)" data={REVENUE_MONTHLY_CHART} />

      {/* Top Performing Products Ranking */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award color="var(--admin-primary)" size={20} />
          <span>Top Performing Products Ranking</span>
        </h3>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Gross Revenue ($)</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, idx) => (
                <tr key={idx}>
                  <td><strong>#{idx + 1}</strong></td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.unitsSold} Units</td>
                  <td style={{ color: 'var(--admin-primary)', fontWeight: 800 }}>${p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
