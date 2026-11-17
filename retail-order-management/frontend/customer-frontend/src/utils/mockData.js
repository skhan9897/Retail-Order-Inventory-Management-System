export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Electronics', icon: 'Laptop', count: 42, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { id: 'cat-2', name: 'Fashion & Apparel', icon: 'Shirt', count: 128, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { id: 'cat-3', name: 'Home & Kitchen', icon: 'Home', count: 65, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400' },
  { id: 'cat-4', name: 'Smartphones', icon: 'Smartphone', count: 34, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
  { id: 'cat-5', name: 'Fitness & Sports', icon: 'Activity', count: 48, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400' },
  { id: 'cat-6', name: 'Books & Stationery', icon: 'BookOpen', count: 90, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400' }
];

export const MOCK_PRODUCTS = [
  {
    id: 'prod-101',
    sku: 'SKU-PRO-MAX-01',
    name: 'Pro Noise Cancelling Wireless Headphones',
    brand: 'SoundPulse',
    category: 'Electronics',
    price: 249.99,
    originalPrice: 329.99,
    discountPercent: 24,
    rating: 4.8,
    reviewsCount: 342,
    stock: 45,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isSpecialOffer: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'
    ],
    description: 'Experience studio-quality audio with ultra-active noise cancellation, 40-hour battery life, and crystal-clear microphone setup.',
    specifications: [
      { key: 'Connectivity', value: 'Bluetooth 5.3' },
      { key: 'Battery Life', value: 'Up to 40 Hours' },
      { key: 'Noise Control', value: 'Hybrid ANC' },
      { key: 'Warranty', value: '1 Year Manufacturer' }
    ]
  },
  {
    id: 'prod-102',
    sku: 'SKU-SMART-W-02',
    name: 'UltraFit GPS Smartwatch Series 7',
    brand: 'TechGear',
    category: 'Electronics',
    price: 189.99,
    originalPrice: 229.99,
    discountPercent: 17,
    rating: 4.6,
    reviewsCount: 188,
    stock: 18,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
    ],
    description: 'Track your health metrics, heart rate, sleep quality, and workouts in real time with high-precision AMOLED touchscreen.',
    specifications: [
      { key: 'Display', value: '1.43" AMOLED' },
      { key: 'Water Resistance', value: '5 ATM' },
      { key: 'Sensors', value: 'SpO2, Optical Heart Rate, GPS' }
    ]
  },
  {
    id: 'prod-103',
    sku: 'SKU-SLIM-LAP-03',
    name: 'ZenBook Pro 15.6" Ultra Thin Laptop',
    brand: 'AsusTech',
    category: 'Electronics',
    price: 1199.99,
    originalPrice: 1399.99,
    discountPercent: 14,
    rating: 4.9,
    reviewsCount: 512,
    stock: 8,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    isSpecialOffer: true,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
    ],
    description: 'Powered by Intel Core i7 13th Gen, 16GB DDR5 RAM, 1TB NVMe SSD, and Iris Xe Graphics for ultra-responsive performance.',
    specifications: [
      { key: 'Processor', value: 'Intel Core i7 13th Gen' },
      { key: 'RAM', value: '16GB LPDDR5' },
      { key: 'Storage', value: '1TB M.2 NVMe SSD' },
      { key: 'OS', value: 'Windows 11 Home' }
    ]
  },
  {
    id: 'prod-104',
    sku: 'SKU-LEATH-JKT-04',
    name: 'Classic Genuine Leather Biker Jacket',
    brand: 'UrbanCraft',
    category: 'Fashion & Apparel',
    price: 149.50,
    originalPrice: 199.00,
    discountPercent: 25,
    rating: 4.7,
    reviewsCount: 94,
    stock: 22,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
    ],
    description: 'Handcrafted premium lambskin leather jacket with asymmetrical zip closure, quilted shoulder accents, and soft viscose lining.',
    specifications: [
      { key: 'Material', value: '100% Genuine Lambskin' },
      { key: 'Fit Type', value: 'Slim Fit' },
      { key: 'Closure', value: 'YKK Zippers' }
    ]
  },
  {
    id: 'prod-105',
    sku: 'SKU-ESPRESSO-05',
    name: 'Barista Touch Espresso Coffee Maker',
    brand: 'BrewMaster',
    category: 'Home & Kitchen',
    price: 299.00,
    originalPrice: 349.00,
    discountPercent: 14,
    rating: 4.8,
    reviewsCount: 156,
    stock: 12,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'
    ],
    description: 'Create third-wave specialty coffee at home with 19-bar pressure pump, built-in conical grinder, and automatic steam wand.',
    specifications: [
      { key: 'Pressure', value: '19 Bar Italian Pump' },
      { key: 'Water Tank', value: '2.0 Liters' },
      { key: 'Grinder', value: '15 Precision Settings' }
    ]
  },
  {
    id: 'prod-106',
    sku: 'SKU-S24-ULT-06',
    name: 'Galaxy Pro 5G Smartphone 256GB',
    brand: 'AeroMobile',
    category: 'Smartphones',
    price: 899.99,
    originalPrice: 999.99,
    discountPercent: 10,
    rating: 4.9,
    reviewsCount: 420,
    stock: 30,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isSpecialOffer: true,
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800'
    ],
    description: '108MP quad-camera setup, 120Hz Dynamic AMOLED display, Snapdragon 8 Gen 3 chipset, and all-day 5000mAh battery.',
    specifications: [
      { key: 'Screen', value: '6.7" QHD+ 120Hz' },
      { key: 'Camera', value: '108MP + 12MP + 10MP' },
      { key: 'Battery', value: '5000 mAh 45W Fast Charging' }
    ]
  }
];

export const MOCK_BANNERS = [
  {
    id: 1,
    title: 'Mega Retail Shopping Fest',
    subtitle: 'Up to 50% OFF on Top Tech & Lifestyle Brands',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    ctaText: 'Shop Now',
    link: '/products'
  },
  {
    id: 2,
    title: 'New Season Fashion Collection',
    subtitle: 'Explore Trendy Styles & Premium Apparel',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    ctaText: 'Discover Fashion',
    link: '/products?category=Fashion%20%26%20Apparel'
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-982341',
    date: '2026-03-10',
    totalAmount: 439.98,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      fullName: 'John Doe',
      addressLine: '123 Enterprise Blvd, Suite 400',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        id: 'prod-101',
        name: 'Pro Noise Cancelling Wireless Headphones',
        price: 249.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      },
      {
        id: 'prod-102',
        name: 'UltraFit GPS Smartwatch Series 7',
        price: 189.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
      }
    ],
    tracking: {
      carrier: 'FedEx Express',
      trackingNumber: 'FX-889302149',
      estimatedDelivery: '2026-03-12',
      steps: [
        { label: 'Order Confirmed', date: 'Mar 10, 09:30 AM', completed: true },
        { label: 'Packed & Dispatched', date: 'Mar 10, 03:15 PM', completed: true },
        { label: 'In Transit', date: 'Mar 11, 08:00 AM', completed: true },
        { label: 'Out for Delivery', date: 'Mar 12, 09:10 AM', completed: true },
        { label: 'Delivered', date: 'Mar 12, 02:45 PM', completed: true }
      ]
    }
  },
  {
    id: 'ORD-982390',
    date: '2026-03-14',
    totalAmount: 299.00,
    status: 'IN_TRANSIT',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI / NetBanking',
    shippingAddress: {
      fullName: 'John Doe',
      addressLine: '123 Enterprise Blvd, Suite 400',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        id: 'prod-105',
        name: 'Barista Touch Espresso Coffee Maker',
        price: 299.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'
      }
    ],
    tracking: {
      carrier: 'DHL Express',
      trackingNumber: 'DHL-99201482',
      estimatedDelivery: '2026-03-17',
      steps: [
        { label: 'Order Confirmed', date: 'Mar 14, 11:20 AM', completed: true },
        { label: 'Packed & Dispatched', date: 'Mar 14, 05:40 PM', completed: true },
        { label: 'In Transit', date: 'Mar 15, 06:30 AM', completed: true },
        { label: 'Out for Delivery', date: 'Mar 17', completed: false },
        { label: 'Delivered', date: 'Pending', completed: false }
      ]
    }
  }
];

export const MOCK_COUPONS = {
  'WELCOME10': 10,
  'RETAIL20': 20,
  'FREESHIP': 5
};
