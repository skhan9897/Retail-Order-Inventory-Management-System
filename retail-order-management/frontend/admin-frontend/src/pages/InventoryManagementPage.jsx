import React, { useState, useEffect } from 'react';
import { Warehouse, RefreshCw, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import DataTable from '../components/DataTable';
import { adminServices } from '../services/adminServices';
import { useAdminToast } from '../context/AdminToastContext';

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deltaQty, setDeltaQty] = useState(10);

  const { showToast } = useAdminToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await adminServices.getInventory();
      setInventory(data);
    } catch (err) {
      showToast('Failed to load inventory levels', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async (sku, delta) => {
    try {
      await adminServices.updateStock(sku, delta);
      showToast(`Stock updated for ${sku} by ${delta > 0 ? '+' : ''}${delta} units`, 'success');
      setSelectedItem(null);
      fetchInventory();
    } catch (err) {
      showToast('Stock adjustment failed', 'error');
    }
  };

  const columns = [
    { header: 'SKU', accessor: 'sku', render: (r) => <strong>{r.sku}</strong> },
    { header: 'Product Name', accessor: 'productName' },
    { header: 'Warehouse Location', accessor: 'location' },
    { header: 'Current Total Stock', accessor: 'currentStock' },
    { header: 'Reserved Stock', accessor: 'reservedStock', render: (r) => <span className="text-muted">{r.reservedStock}</span> },
    { header: 'Available Stock', accessor: 'availableStock', render: (r) => (
      <strong style={{ color: r.availableStock <= r.threshold ? 'var(--btn-danger)' : 'var(--text-main)' }}>
        {r.availableStock} Units
      </strong>
    )},
    {
      header: 'Health Status',
      accessor: 'status',
      render: (r) => {
        const bg = r.status === 'CRITICAL' ? 'badge-danger' : 'badge-success';
        return <span className={`badge ${bg}`}>{r.status}</span>;
      }
    },
    {
      header: 'Stock Action',
      accessor: 'actions',
      render: (r) => (
        <button onClick={() => setSelectedItem(r)} className="btn btn-outline btn-sm">
          <RefreshCw size={14} />
          <span>Adjust Stock</span>
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Warehouse Inventory & Stock Control</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Manage physical stock quantities, reserved inventory allocations, and safety thresholds</p>
        </div>

        <button onClick={fetchInventory} className="btn btn-outline">
          <RefreshCw size={16} />
          <span>Refresh Stock</span>
        </button>
      </div>

      <div className="card">
        {loading ? <p>Loading stock data...</p> : <DataTable columns={columns} data={inventory} searchPlaceholder="Search inventory by SKU, location, product name..." />}
      </div>

      {/* Stock Adjustment Modal */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Adjust Stock Level</h3>
              <button onClick={() => setSelectedItem(null)} style={{ fontWeight: 700 }}>✕</button>
            </div>

            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Product: <strong>{selectedItem.productName}</strong><br />
              SKU: <strong>{selectedItem.sku}</strong> | Current Stock: <strong>{selectedItem.currentStock} Units</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Quantity to Add (+) or Deduct (-)</label>
              <input
                type="number"
                className="form-control"
                value={deltaQty}
                onChange={(e) => setDeltaQty(Number(e.target.value))}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => handleStockAdjustment(selectedItem.sku, Math.abs(deltaQty))}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <ArrowUp size={16} />
                <span>Add +{Math.abs(deltaQty)} Stock</span>
              </button>

              <button
                onClick={() => handleStockAdjustment(selectedItem.sku, -Math.abs(deltaQty))}
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                <ArrowDown size={16} />
                <span>Deduct -{Math.abs(deltaQty)} Stock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
