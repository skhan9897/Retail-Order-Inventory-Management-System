import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import { adminServices } from '../services/adminServices';
import { useAdminToast } from '../context/AdminToastContext';

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { showToast } = useAdminToast();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    brand: '',
    price: '',
    originalPrice: '',
    stock: '',
    warehouse: 'Main Warehouse A1',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminServices.getProducts();
      setProducts(data);
    } catch (err) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'Electronics',
      brand: '',
      price: '',
      originalPrice: '',
      stock: '20',
      warehouse: 'Main Warehouse A1',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      warehouse: product.warehouse || 'Main Warehouse A1',
      image: product.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (productId, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory catalog?`)) {
      try {
        await adminServices.deleteProduct(productId);
        showToast(`Deleted product "${name}"`, 'info');
        fetchProducts();
      } catch (err) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stock: Number(formData.stock)
    };

    try {
      if (editingProduct) {
        await adminServices.editProduct(editingProduct.id, payload);
        showToast(`Updated product "${formData.name}"`, 'success');
      } else {
        await adminServices.addProduct(payload);
        showToast(`Added new product "${formData.name}"`, 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast('Error saving product', 'error');
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={r.image || 'https://via.placeholder.com/40'} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
          <div>
            <p style={{ fontWeight: 700 }}>{r.name}</p>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>SKU: {r.sku} | {r.brand}</span>
          </div>
        </div>
      )
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: 'price', render: (r) => <strong>${r.price.toFixed(2)}</strong> },
    { header: 'Stock Units', accessor: 'stock', render: (r) => (
      <span className={`badge ${r.stock <= 5 ? 'badge-danger' : 'badge-success'}`}>
        {r.stock} Units
      </span>
    )},
    { header: 'Warehouse', accessor: 'warehouse' },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (r) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleOpenEdit(r)} className="btn btn-outline btn-sm" title="Edit Product">
            <Edit size={14} />
          </button>
          <button onClick={() => handleDelete(r.id, r.name)} className="btn btn-danger btn-sm" title="Delete Product">
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Product Catalogue Management</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Add new items, modify pricing, upload images and manage SKU configurations</p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="card">
        {loading ? <p>Loading products catalog...</p> : <DataTable columns={columns} data={products} searchPlaceholder="Search products by SKU, name, brand..." />}
      </div>

      {/* Product Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ fontWeight: 700 }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">SKU *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData(p => ({ ...p, sku: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Fitness & Sports">Fitness & Sports</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData(p => ({ ...p, brand: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sale Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(p => ({ ...p, originalPrice: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Warehouse Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.warehouse}
                    onChange={(e) => setFormData(p => ({ ...p, warehouse: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.image}
                  onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingProduct ? 'Save Product Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
