import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminToastProvider } from './context/AdminToastContext';

import AdminLayout from './layouts/AdminLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import OrderManagementPage from './pages/OrderManagementPage';
import ProductManagementPage from './pages/ProductManagementPage';
import InventoryManagementPage from './pages/InventoryManagementPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import PaymentManagementPage from './pages/PaymentManagementPage';
import ShipmentManagementPage from './pages/ShipmentManagementPage';
import ReportsAnalyticsPage from './pages/ReportsAnalyticsPage';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <AdminToastProvider>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<DashboardOverviewPage />} />
              <Route path="orders" element={<OrderManagementPage />} />
              <Route path="products" element={<ProductManagementPage />} />
              <Route path="inventory" element={<InventoryManagementPage />} />
              <Route path="customers" element={<CustomerManagementPage />} />
              <Route path="payments" element={<PaymentManagementPage />} />
              <Route path="shipments" element={<ShipmentManagementPage />} />
              <Route path="analytics" element={<ReportsAnalyticsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AdminToastProvider>
      </AdminAuthProvider>
    </Router>
  );
}
