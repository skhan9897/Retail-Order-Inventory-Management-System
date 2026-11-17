import api from './api';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../utils/mockData';

export const productService = {
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (err) {
      // Mock filtering fallback
      let filtered = [...MOCK_PRODUCTS];
      if (params.category) {
        filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
      }
      if (params.minPrice) {
        filtered = filtered.filter(p => p.price >= Number(params.minPrice));
      }
      if (params.maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
      }
      if (params.sort) {
        if (params.sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
        if (params.sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
        if (params.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      }
      return { products: filtered, totalCount: filtered.length };
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      const found = MOCK_PRODUCTS.find(p => p.id === id);
      if (found) return found;
      throw new Error('Product not found');
    }
  },

  async getCategories() {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (err) {
      return MOCK_CATEGORIES;
    }
  }
};
