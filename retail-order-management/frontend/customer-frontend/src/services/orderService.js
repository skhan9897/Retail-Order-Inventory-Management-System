import api from './api';
import { MOCK_ORDERS } from '../utils/mockData';

export const orderService = {
  async createOrder(orderPayload) {
    try {
      const response = await api.post('/orders', orderPayload);
      return response.data;
    } catch (err) {
      // Mock order creation fallback
      const newOrder = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        totalAmount: orderPayload.totalAmount,
        status: 'PENDING',
        paymentStatus: orderPayload.paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
        paymentMethod: orderPayload.paymentMethod,
        shippingAddress: orderPayload.shippingAddress,
        items: orderPayload.items,
        tracking: {
          carrier: 'Express Logistics',
          trackingNumber: `EXP-${Math.floor(100000000 + Math.random() * 900000000)}`,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          steps: [
            { label: 'Order Confirmed', date: 'Just now', completed: true },
            { label: 'Packed & Dispatched', date: 'Processing', completed: false },
            { label: 'In Transit', date: 'Pending', completed: false },
            { label: 'Out for Delivery', date: 'Pending', completed: false },
            { label: 'Delivered', date: 'Pending', completed: false }
          ]
        }
      };

      const localOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
      localOrders.unshift(newOrder);
      localStorage.setItem('customer_orders', JSON.stringify(localOrders));

      return newOrder;
    }
  },

  async getMyOrders() {
    try {
      const response = await api.get('/orders/my-orders');
      return response.data;
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
      return [...localOrders, ...MOCK_ORDERS];
    }
  },

  async cancelOrder(orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
      const updated = localOrders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o);
      localStorage.setItem('customer_orders', JSON.stringify(updated));
      return { success: true, message: 'Order cancelled successfully' };
    }
  }
};
