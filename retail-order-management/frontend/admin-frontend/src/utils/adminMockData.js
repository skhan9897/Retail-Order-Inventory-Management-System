export const ADMIN_STATS = {
  totalOrders: 1482,
  totalRevenue: 384920.50,
  totalCustomers: 894,
  totalProducts: 126,
  pendingOrders: 42,
  completedOrders: 1320,
  cancelledOrders: 120,
  lowStockProducts: 7
};

export const ADMIN_ORDERS = [
  {
    id: 'ORD-982341',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    date: '2026-03-10',
    totalAmount: 439.98,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'Credit Card',
    itemsCount: 2,
    items: [
      { name: 'Pro Noise Cancelling Wireless Headphones', price: 249.99, quantity: 1 },
      { name: 'UltraFit GPS Smartwatch Series 7', price: 189.99, quantity: 1 }
    ],
    shipment: { carrier: 'FedEx Express', trackingNo: 'FX-889302149', status: 'Delivered' }
  },
  {
    id: 'ORD-982390',
    customerName: 'Alice Smith',
    customerEmail: 'alice@example.com',
    date: '2026-03-14',
    totalAmount: 299.00,
    status: 'IN_TRANSIT',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI / NetBanking',
    itemsCount: 1,
    items: [
      { name: 'Barista Touch Espresso Coffee Maker', price: 299.00, quantity: 1 }
    ],
    shipment: { carrier: 'DHL Express', trackingNo: 'DHL-99201482', status: 'In Transit' }
  },
  {
    id: 'ORD-982405',
    customerName: 'Robert Johnson',
    customerEmail: 'robert@corp.com',
    date: '2026-03-15',
    totalAmount: 1199.99,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    paymentMethod: 'Cash on Delivery',
    itemsCount: 1,
    items: [
      { name: 'ZenBook Pro 15.6" Ultra Thin Laptop', price: 1199.99, quantity: 1 }
    ],
    shipment: { carrier: 'Unassigned', trackingNo: 'N/A', status: 'Unfulfilled' }
  },
  {
    id: 'ORD-982410',
    customerName: 'Emily Davis',
    customerEmail: 'emily@tech.com',
    date: '2026-03-15',
    totalAmount: 149.50,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'Credit Card',
    itemsCount: 1,
    items: [
      { name: 'Classic Genuine Leather Biker Jacket', price: 149.50, quantity: 1 }
    ],
    shipment: { carrier: 'USPS Priority', trackingNo: 'USPS-7740192', status: 'Dispatched' }
  }
];

export const ADMIN_PRODUCTS = [
  {
    id: 'prod-101',
    sku: 'SKU-PRO-MAX-01',
    name: 'Pro Noise Cancelling Wireless Headphones',
    category: 'Electronics',
    brand: 'SoundPulse',
    price: 249.99,
    originalPrice: 329.99,
    stock: 45,
    warehouse: 'Main Warehouse A1',
    status: 'ACTIVE',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
  },
  {
    id: 'prod-102',
    sku: 'SKU-SMART-W-02',
    name: 'UltraFit GPS Smartwatch Series 7',
    category: 'Electronics',
    brand: 'TechGear',
    price: 189.99,
    originalPrice: 229.99,
    stock: 18,
    warehouse: 'East Warehouse B3',
    status: 'ACTIVE',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'
  },
  {
    id: 'prod-103',
    sku: 'SKU-SLIM-LAP-03',
    name: 'ZenBook Pro 15.6" Ultra Thin Laptop',
    category: 'Electronics',
    brand: 'AsusTech',
    price: 1199.99,
    originalPrice: 1399.99,
    stock: 4,
    warehouse: 'Main Warehouse A2',
    status: 'LOW_STOCK',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200'
  },
  {
    id: 'prod-104',
    sku: 'SKU-LEATH-JKT-04',
    name: 'Classic Genuine Leather Biker Jacket',
    category: 'Fashion & Apparel',
    brand: 'UrbanCraft',
    price: 149.50,
    originalPrice: 199.00,
    stock: 22,
    warehouse: 'South Warehouse C1',
    status: 'ACTIVE',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200'
  },
  {
    id: 'prod-105',
    sku: 'SKU-ESPRESSO-05',
    name: 'Barista Touch Espresso Coffee Maker',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    price: 299.00,
    originalPrice: 349.00,
    stock: 2,
    warehouse: 'Main Warehouse A1',
    status: 'LOW_STOCK',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200'
  }
];

export const ADMIN_INVENTORY = [
  { sku: 'SKU-PRO-MAX-01', productName: 'Pro Noise Cancelling Wireless Headphones', location: 'Main Warehouse A1', currentStock: 45, reservedStock: 5, availableStock: 40, threshold: 10, status: 'HEALTHY' },
  { sku: 'SKU-SMART-W-02', productName: 'UltraFit GPS Smartwatch Series 7', location: 'East Warehouse B3', currentStock: 18, reservedStock: 3, availableStock: 15, threshold: 8, status: 'HEALTHY' },
  { sku: 'SKU-SLIM-LAP-03', productName: 'ZenBook Pro 15.6" Ultra Thin Laptop', location: 'Main Warehouse A2', currentStock: 4, reservedStock: 2, availableStock: 2, threshold: 5, status: 'CRITICAL' },
  { sku: 'SKU-LEATH-JKT-04', productName: 'Classic Genuine Leather Biker Jacket', location: 'South Warehouse C1', currentStock: 22, reservedStock: 0, availableStock: 22, threshold: 5, status: 'HEALTHY' },
  { sku: 'SKU-ESPRESSO-05', productName: 'Barista Touch Espresso Coffee Maker', location: 'Main Warehouse A1', currentStock: 2, reservedStock: 1, availableStock: 1, threshold: 5, status: 'CRITICAL' }
];

export const ADMIN_CUSTOMERS = [
  { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 234-5678', ordersCount: 14, totalSpent: 3480.50, status: 'ACTIVE', joinedDate: '2025-01-15' },
  { id: 'CUST-002', name: 'Alice Smith', email: 'alice@example.com', phone: '+1 (555) 987-6543', ordersCount: 8, totalSpent: 1850.00, status: 'ACTIVE', joinedDate: '2025-03-22' },
  { id: 'CUST-003', name: 'Robert Johnson', email: 'robert@corp.com', phone: '+1 (555) 345-6789', ordersCount: 3, totalSpent: 2499.00, status: 'ACTIVE', joinedDate: '2025-08-10' },
  { id: 'CUST-004', name: 'Emily Davis', email: 'emily@tech.com', phone: '+1 (555) 876-5432', ordersCount: 5, totalSpent: 920.75, status: 'ACTIVE', joinedDate: '2025-11-04' }
];

export const ADMIN_PAYMENTS = [
  { txnId: 'TXN-908123', orderId: 'ORD-982341', customer: 'John Doe', amount: 439.98, method: 'Credit Card', status: 'SUCCESS', date: '2026-03-10' },
  { txnId: 'TXN-908188', orderId: 'ORD-982390', customer: 'Alice Smith', amount: 299.00, method: 'UPI / NetBanking', status: 'SUCCESS', date: '2026-03-14' },
  { txnId: 'TXN-908200', orderId: 'ORD-982410', customer: 'Emily Davis', amount: 149.50, method: 'Credit Card', status: 'SUCCESS', date: '2026-03-15' },
  { txnId: 'TXN-908205', orderId: 'ORD-982405', customer: 'Robert Johnson', amount: 1199.99, method: 'Cash on Delivery', status: 'PENDING', date: '2026-03-15' }
];

export const ADMIN_SHIPMENTS = [
  { shipmentId: 'SHP-401', orderId: 'ORD-982341', carrier: 'FedEx Express', trackingNo: 'FX-889302149', status: 'DELIVERED', dispatchDate: '2026-03-10', deliveryDate: '2026-03-12' },
  { shipmentId: 'SHP-402', orderId: 'ORD-982390', carrier: 'DHL Express', trackingNo: 'DHL-99201482', status: 'IN_TRANSIT', dispatchDate: '2026-03-14', deliveryDate: '2026-03-17' },
  { shipmentId: 'SHP-403', orderId: 'ORD-982410', carrier: 'USPS Priority', trackingNo: 'USPS-7740192', status: 'DISPATCHED', dispatchDate: '2026-03-15', deliveryDate: '2026-03-18' }
];

export const REVENUE_MONTHLY_CHART = [
  { month: 'Oct', revenue: 42000, orders: 340 },
  { month: 'Nov', revenue: 58000, orders: 490 },
  { month: 'Dec', revenue: 89000, orders: 750 },
  { month: 'Jan', revenue: 64000, orders: 510 },
  { month: 'Feb', revenue: 71000, orders: 580 },
  { month: 'Mar', revenue: 98000, orders: 820 }
];
