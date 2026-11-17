import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Home } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <CheckCircle size={44} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Thank You! Order Confirmed
        </h1>
        <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
          We have received your order <strong>#{orderId}</strong> and are preparing it for shipment.
        </p>

        {/* Order Details Card */}
        {order && (
          <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: '2rem' }}>
            <div className="grid-2" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Order Reference ID</span>
                <p style={{ fontWeight: 700, fontSize: '1rem' }}>{order.id}</p>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Payment Method</span>
                <p style={{ fontWeight: 700, fontSize: '1rem' }}>{order.paymentMethod}</p>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Items Ordered:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }} className="flex-between">
              <span style={{ fontWeight: 700 }}>Total Paid:</span>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-outline btn-lg">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
          <Link to="/account?tab=orders" className="btn btn-primary btn-lg">
            <Package size={18} />
            <span>Track My Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
