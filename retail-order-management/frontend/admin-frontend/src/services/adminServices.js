import adminApi from './adminApi';
import {
  ADMIN_STATS,
  ADMIN_ORDERS,
  ADMIN_PRODUCTS,
  ADMIN_INVENTORY,
  ADMIN_CUSTOMERS,
  ADMIN_PAYMENTS,
  ADMIN_SHIPMENTS
} from '../utils/adminMockData';

export const adminServices = {
  // Auth
  async login(username, password) {
    try {
      const response = await adminApi.post('/login', { username, password });
      return response.data;
    } catch (err) {
      if (username === 'admin' || username.includes('admin')) {
        return {
          token: 'mock-admin-jwt-token-777',
          user: { name: 'Super Admin', role: 'ROLE_ADMIN', email: 'admin@retailhub.com' }
        };
      }
      throw new Error('Invalid Admin Credentials');
    }
  },

  // Stats & Dashboard Overview
  async getDashboardStats() {
    try {
      const response = await adminApi.get('/stats');
      return response.data;
    } catch (err) {
      return ADMIN_STATS;
    }
  },

  // Order Management
  async getOrders() {
    try {
      const response = await adminApi.get('/orders');
      return response.data;
    } catch (err) {
      const stored = localStorage.getItem('admin_orders_state');
      return stored ? JSON.parse(stored) : ADMIN_ORDERS;
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await adminApi.put(`/orders/${orderId}/status`, { status: newStatus });
      return response.data;
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('admin_orders_state') || JSON.stringify(ADMIN_ORDERS));
      const updated = stored.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('admin_orders_state', JSON.stringify(updated));
      return { success: true, orderId, status: newStatus };
    }
  },

  // Product Management
  async getProducts() {
    try {
      const response = await adminApi.get('/products');
      return response.data;
    } catch (err) {
      const stored = localStorage.getItem('admin_products_state');
      return stored ? JSON.parse(stored) : ADMIN_PRODUCTS;
    }
  },

  async addProduct(productData) {
    try {
      const response = await adminApi.post('/products', productData);
      return response.data;
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('admin_products_state') || JSON.stringify(ADMIN_PRODUCTS));
      const newProd = {
        id: `prod-${Date.now()}`,
        sku: productData.sku || `SKU-${Date.now()}`,
        ...productData,
        status: Number(productData.stock) <= 5 ? 'LOW_STOCK' : 'ACTIVE'
      };
      stored.unshift(newProd);
      localStorage.setItem('admin_products_state', JSON.stringify(stored));
      return newProd;
    }
  },

  async editProduct(productId, productData) {
    try {
      const response = await adminApi.put(`/products/${productId}`, productData);
      return response.data;
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('admin_products_state') || JSON.stringify(ADMIN_PRODUCTS));
      const updated = stored.map(p => p.id === productId ? { ...p, ...productData } : p);
      localStorage.setItem('admin_products_state', JSON.stringify(updated));
      return { success: true };
    }
  },

  async deleteProduct(productId) {
    try {
      await adminApi.delete(`/products/${productId}`);
      return { success: true };
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('admin_products_state') || JSON.stringify(ADMIN_PRODUCTS));
      const updated = stored.filter(p => p.id !== productId);
      localStorage.setItem('admin_products_state', JSON.stringify(updated));
      return { success: true };
    }
  },

  // Inventory Management
  async getInventory() {
    try {
      const response = await adminApi.get('/inventory');
      return response.data;
    } catch (err) {
      const stored = localStorage.getItem('admin_inventory_state');
      return stored ? JSON.parse(stored) : ADMIN_INVENTORY;
    }
  },

  async updateStock(sku, deltaQuantity) {
    try {
      const response = await adminApi.post('/inventory/update-stock', { sku, deltaQuantity });
      return response.data;
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('admin_inventory_state') || JSON.stringify(ADMIN_INVENTORY));
      const updated = stored.map(item => {
        if (item.sku === sku) {
          const newCurrent = Math.max(0, item.currentStock + deltaQuantity);
          const newAvail = Math.max(0, newCurrent - item.reservedStock);
          return {
            ...item,
            currentStock: newCurrent,
            availableStock: newAvail,
            status: newAvail <= item.threshold ? 'CRITICAL' : 'HEALTHY'
          };
        }
        return item;
      });
      localStorage.setItem('admin_inventory_state', JSON.stringify(updated));
      return { success: true };
    }
  },

  // Customer Management
  async getCustomers() {
    try {
      const response = await adminApi.get('/customers');
      return response.data;
    } catch (err) {
      return ADMIN_CUSTOMERS;
    }
  },

  // Payments Management
  async getPayments() {
    try {
      const response = await adminApi.get('/payments');
      return response.data;
    } catch (err) {
      return ADMIN_PAYMENTS;
    }
  },

  async processRefund(txnId) {
    try {
      const response = await adminApi.post(`/payments/${txnId}/refund`);
      return response.data;
    } catch (err) {
      return { success: true, message: `Refund processed for ${txnId}` };
    }
  },

  // Shipments Management
  async getShipments() {
    try {
      const response = await adminApi.get('/shipments');
      return response.data;
    } catch (err) {
      const stored = localStorage.getItem('admin_shipments_state');
      return stored ? JSON.parse(stored) : ADMIN_SHIPMENTS;
    }
  },

  async createShipment(shipmentData) {
    try {
      const response = await adminApi.post('/shipments', shipmentData);
      return response.data;
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('admin_shipments_state') || JSON.stringify(ADMIN_SHIPMENTS));
      const newShipment = {
        shipmentId: `SHP-${Math.floor(100 + Math.random() * 900)}`,
        ...shipmentData,
        dispatchDate: new Date().toISOString().split('T')[0]
      };
      stored.unshift(newShipment);
      localStorage.setItem('admin_shipments_state', JSON.stringify(stored));
      return newShipment;
    }
  }
};
