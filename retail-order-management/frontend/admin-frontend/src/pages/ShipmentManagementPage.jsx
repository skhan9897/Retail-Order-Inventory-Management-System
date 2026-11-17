import React, { useState, useEffect } from 'react';
import { Truck, Plus, CheckCircle, Package } from 'lucide-react';
import DataTable from '../components/DataTable';
import { adminServices } from '../services/adminServices';
import { useAdminToast } from '../context/AdminToastContext';

export default function ShipmentManagementPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { showToast } = useAdminToast();

  const [formData, setFormData] = useState({
    orderId: 'ORD-982405',
    carrier: 'FedEx Express',
    trackingNo: `FX-${Math.floor(100000000 + Math.random() * 900000000)}`,
    status: 'DISPATCHED',
    estimatedDelivery: '2026-03-20'
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const data = await adminServices.getShipments();
      setShipments(data);
    } catch (err) {
      showToast('Failed to load shipments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      await adminServices.createShipment(formData);
      showToast(`Created shipment for Order #${formData.orderId}`, 'success');
      setShowCreateModal(false);
      fetchShipments();
    } catch (err) {
      showToast('Shipment creation failed', 'error');
    }
  };

  const columns = [
    { header: 'Shipment ID', accessor: 'shipmentId', render: (r) => <strong>{r.shipmentId}</strong> },
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'Logistics Carrier', accessor: 'carrier' },
    { header: 'Tracking Number', accessor: 'trackingNo', render: (r) => <code>{r.trackingNo}</code> },
    { header: 'Dispatch Date', accessor: 'dispatchDate' },
    {
      header: 'Delivery Status',
      accessor: 'status',
      render: (r) => {
        const bg = r.status === 'DELIVERED' ? 'badge-success' : r.status === 'IN_TRANSIT' ? 'badge-info' : 'badge-warning';
        return <span className={`badge ${bg}`}>{r.status}</span>;
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Logistics & Shipment Dispatch</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Generate courier shipments, assign AWB tracking numbers, and update delivery status</p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Create New Shipment</span>
        </button>
      </div>

      <div className="card">
        {loading ? <p>Loading shipments...</p> : <DataTable columns={columns} data={shipments} searchPlaceholder="Search shipment ID, tracking number, order ID..." />}
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Dispatch & Create Shipment</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ fontWeight: 700 }}>✕</button>
            </div>

            <form onSubmit={handleCreateShipment}>
              <div className="form-group">
                <label className="form-label">Order ID *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.orderId}
                  onChange={(e) => setFormData(p => ({ ...p, orderId: e.target.value }))}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Carrier Name *</label>
                  <select
                    className="form-control"
                    value={formData.carrier}
                    onChange={(e) => setFormData(p => ({ ...p, carrier: e.target.value }))}
                  >
                    <option value="FedEx Express">FedEx Express</option>
                    <option value="DHL Express">DHL Express</option>
                    <option value="USPS Priority">USPS Priority</option>
                    <option value="BlueDart Logistics">BlueDart Logistics</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tracking Number (AWB) *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.trackingNo}
                    onChange={(e) => setFormData(p => ({ ...p, trackingNo: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Dispatch Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
