import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Package,
  Layers,
  Tag,
  DollarSign,
  AlertCircle,
  Sparkles,
  AlignLeft,
  CheckCircle2
} from 'lucide-react';

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSave,
  categories = [],
  showToast
}) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'CCTV Solutions',
    price: '',
    oldPrice: '',
    stock: 10,
    badge: 'In Stock',
    short: '',
    description: '',
    specs: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'CCTV Solutions',
        price: product.price !== undefined ? product.price : '',
        oldPrice: product.oldPrice !== undefined && product.oldPrice !== null ? product.oldPrice : '',
        stock: product.stock !== undefined ? product.stock : 10,
        badge: product.badge || 'In Stock',
        short: product.short || '',
        description: product.description || '',
        specs: Array.isArray(product.specs)
          ? product.specs.join('\n')
          : typeof product.specs === 'string'
          ? product.specs
          : ''
      });
      setErrorMsg('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Product name is required');
      return;
    }
    if (!formData.sku.trim()) {
      setErrorMsg('SKU code is required');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Trade Price must be a valid positive number');
      return;
    }

    const updatedSpecs = formData.specs
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedProduct = {
      ...product,
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      price: priceNum,
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      stock: parseInt(formData.stock) >= 0 ? parseInt(formData.stock) : 0,
      badge: formData.badge,
      short: formData.short.trim(),
      description: formData.description.trim() || formData.short.trim(),
      specs: updatedSpecs
    };

    onSave(updatedProduct);
    onClose();
  };

  const defaultCategories = [
    'CCTV Solutions',
    'Power Solutions',
    'Cables Range',
    'Networking Accessories',
    'Computer Essentials',
    'Storage Devices',
    'Hardware & Tools'
  ];

  const categoryOptions = Array.from(new Set([...defaultCategories, ...categories.filter(c => c !== 'All')]));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-pop-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/30 text-red-400 border border-red-500/40">
                <Package size={18} />
              </div>
              <div>
                <h3 className="text-base font-black">Edit Hardware Product</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  ID: {product.id} • SKU: {product.sku}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-200">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SKU */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g. ITS-PWR-8CH"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full product model and title"
                className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
              />
            </div>

            {/* Pricing and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Wholesale Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="₹ Trade Price"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-black text-xs text-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  MRP / Old Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  placeholder="Optional MRP"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs text-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Inventory Stock (Units)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="Stock count"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold text-xs text-slate-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>
            </div>

            {/* Badge & Short description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Badge Tag
                </label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Popular">Popular</option>
                  <option value="New">New Arrival</option>
                  <option value="Sale">Special Sale</option>
                  <option value="Hot Deal">Hot Deal</option>
                  <option value="Limited Stock">Limited Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formData.short}
                  onChange={(e) => setFormData({ ...formData, short: e.target.value })}
                  placeholder="e.g. Pure Copper with Overload Surge Protection"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-medium text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                />
              </div>
            </div>

            {/* Full Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Detailed Product Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Write detailed product information, use cases, compatibility..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
              />
            </div>

            {/* Specs */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Specifications (Enter each specification on a new line)
              </label>
              <textarea
                rows={3}
                value={formData.specs}
                onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                placeholder="Output: 12V DC 10A&#10;8 Individual Fuse Channels&#10;Pure Copper Wire Coil&#10;Warranty: 1 Year"
                className="w-full rounded-xl border border-slate-200 p-2.5 font-mono text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-red-900/20 transition"
              >
                <Save size={14} />
                Save Product Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
