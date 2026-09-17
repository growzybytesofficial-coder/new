import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Image as ImageIcon,
  Tag,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Upload,
  Download,
  FileSpreadsheet,
  Link as LinkIcon,
  X,
  AlertCircle,
  Plus,
  Check,
  Edit,
  Pencil,
  Trash2,
  Globe,
  Database,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import ImportModal from './ImportModal.jsx';
import ExportModal from './ExportModal.jsx';
import EditProductModal from './EditProductModal.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import { productExportColumns, sampleProductTemplate } from '../utils/dataTransfer.js';

export default function ProductsView({
  products = [],
  setProducts, // Optional prop to allow adding products dynamically
  imageMap = {},
  isFetchingImages = false,
  fetchProductImages,
  openInsertModal,
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  showToast,
  productFilterMode = 'all', // 'all', 'out_of_stock', 'inventory', 'seo'
  setProductFilterMode,
  showAddProduct = false,
  setShowAddProduct
}) {
  const itemsPerPage = 12;

  // Import / Export Modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Edit / Delete Modal states
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Local state to keep track of stock, visibility, and SEO
  const [localStock, setLocalStock] = useState({});
  const [localStatus, setLocalStatus] = useState({});
  const [seoData, setSeoData] = useState(() => {
    return JSON.parse(localStorage.getItem('admin_product_seo_data')) || {};
  });

  // Add Product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('CCTV Solutions');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOldPrice, setNewProdOldPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdSpec, setNewProdSpec] = useState('');

  // SEO Editing state
  const [editingSeoId, setEditingSeoId] = useState(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Loaded stock and status locally for quick edits
  useEffect(() => {
    const stockMap = { ...localStock };
    const statusMap = { ...localStatus };
    let changed = false;

    products.forEach((p, idx) => {
      if (stockMap[p.id] === undefined) {
        stockMap[p.id] = [20, 15, 34, 0, 50, 5, 12, 45, 90, 8][idx % 10] ?? 25;
        changed = true;
      }
      if (statusMap[p.id] === undefined) {
        statusMap[p.id] = p.badge !== 'Discontinued';
        changed = true;
      }
    });

    if (changed) {
      setLocalStock(stockMap);
      setLocalStatus(statusMap);
    }
  }, [products]);

  // Persist SEO edits
  useEffect(() => {
    localStorage.setItem('admin_product_seo_data', JSON.stringify(seoData));
  }, [seoData]);

  // Unique categories
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Handle inline stock adjust
  const adjustStock = (productId, delta) => {
    setLocalStock((prev) => {
      const current = prev[productId] || 0;
      const nextStock = Math.max(0, current + delta);
      showToast(`Stock levels updated for product: ${nextStock} units`);
      return {
        ...prev,
        [productId]: nextStock
      };
    });
  };

  const toggleStatus = (productId) => {
    setLocalStatus((prev) => {
      const current = prev[productId];
      showToast(`Product listing status toggled to ${!current ? 'Active' : 'Inactive'}`);
      return {
        ...prev,
        [productId]: !current
      };
    });
  };

  // Filter products based on search, filters, and sidebar specific mode
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    const hasImage = !!imageMap[product.slug];
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'With' && hasImage) ||
      (selectedStatus === 'Without' && !hasImage);

    // Sidebar filter mode checks
    if (productFilterMode === 'out_of_stock') {
      const stock = localStock[product.id] ?? 10;
      if (stock > 5) return false;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, productFilterMode]);

  const withImageCount = Object.keys(imageMap).length;
  const imageCoveragePercent = Math.round((withImageCount / products.length) * 100) || 0;

  // Form submit handler
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdSku.trim() || !newProdPrice.trim()) {
      showToast('Please fill in all mandatory fields (Name, SKU, Trade Price).', 'error');
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Trade Price must be a positive number.', 'error');
      return;
    }

    const stockNum = parseInt(newProdStock) || 0;

    // Create a new product slug based on name
    const slug = newProdName.toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    const newProduct = {
      id: `PROD-${Date.now().toString().slice(-4)}`,
      name: newProdName,
      sku: newProdSku.toUpperCase(),
      category: newProdCategory,
      price: priceNum,
      oldPrice: newProdOldPrice ? parseFloat(newProdOldPrice) : null,
      slug: slug,
      specs: newProdSpec ? newProdSpec.split('\n').filter(s => s.trim()) : [],
      badge: stockNum === 0 ? 'Out of Stock' : 'New'
    };

    if (setProducts) {
      setProducts(prev => [newProduct, ...prev]);
    }

    // Set initial stock and status in our local state
    setLocalStock(prev => ({ ...prev, [newProduct.id]: stockNum }));
    setLocalStatus(prev => ({ ...prev, [newProduct.id]: true }));

    showToast(`Successfully added "${newProdName}" to catalog!`);

    // Reset Form
    setNewProdName('');
    setNewProdSku('');
    setNewProdPrice('');
    setNewProdOldPrice('');
    setNewProdStock('10');
    setNewProdSpec('');
    setShowAddProduct(false);
  };

  // Product Edit Save handler
  const handleSaveProduct = (updatedProduct) => {
    if (setProducts) {
      setProducts(prev => {
        const next = prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        localStorage.setItem('admin_products', JSON.stringify(next));
        return next;
      });
    }
    if (updatedProduct.stock !== undefined) {
      setLocalStock(prev => ({
        ...prev,
        [updatedProduct.id]: updatedProduct.stock
      }));
    }
    showToast(`Product "${updatedProduct.name}" updated successfully!`);
  };

  // Product Delete handler
  const handleDeleteProduct = () => {
    if (!deletingProduct) return;
    const prodId = deletingProduct.id;
    const prodName = deletingProduct.name;
    if (setProducts) {
      setProducts(prev => {
        const next = prev.filter(p => p.id !== prodId);
        localStorage.setItem('admin_products', JSON.stringify(next));
        return next;
      });
    }
    setLocalStock(prev => {
      const next = { ...prev };
      delete next[prodId];
      return next;
    });
    setLocalStatus(prev => {
      const next = { ...prev };
      delete next[prodId];
      return next;
    });
    showToast(`Product "${prodName}" deleted from catalog!`, 'info');
    setDeletingProduct(null);
  };

  // SEO Save handler
  const handleSaveSeo = (id) => {
    setSeoData(prev => ({
      ...prev,
      [id]: {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords
      }
    }));
    setEditingSeoId(null);
    showToast('Product SEO parameters synchronized successfully.');
  };

  const startEditingSeo = (product) => {
    setEditingSeoId(product.id);
    const existing = seoData[product.id] || {};
    setSeoTitle(existing.title || `${product.name} | IT SAATHI`);
    setSeoDescription(existing.description || `Buy ${product.name} at wholesale price. Genuine tech accessories and installation tools in India.`);
    setSeoKeywords(existing.keywords || `${product.name}, ${product.category}, IT SAATHI, India`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {productFilterMode === 'out_of_stock' && '⚠️ Out of Stock & Reorder Alerts'}
            {productFilterMode === 'inventory' && '📦 Warehouse Inventory Management'}
            {productFilterMode === 'seo' && '🔍 Product Search Engine Optimization (SEO)'}
            {productFilterMode === 'all' && 'Product Catalog Management'}
          </h1>
          <p className="text-slate-500 text-sm">
            {productFilterMode === 'out_of_stock' && 'Review catalog items running extremely low on safety warehouse counts.'}
            {productFilterMode === 'inventory' && 'Batch-adjust warehouse stocks, log inventory corrections, and configure safety thresholds.'}
            {productFilterMode === 'seo' && 'Configure custom Google search titles, descriptions, and keywords to rank on tech search.'}
            {productFilterMode === 'all' && 'Associate HD images, modify warehouse stock quantities, and adjust visibility settings for IT SAATHI devices.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition"
            title="Export products to CSV or JSON"
          >
            <Download size={14} className="text-red-600" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 font-bold text-xs py-2.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition"
            title="Import products from CSV or JSON"
          >
            <Upload size={14} />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setShowAddProduct(true)}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition"
          >
            <Plus size={14} />
            <span>Add New Device</span>
          </button>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex flex-wrap border-b gap-1">
        {[
          { id: 'all', label: 'All Catalog' },
          { id: 'out_of_stock', label: 'Out of Stock Alerts' },
          { id: 'inventory', label: 'Warehouse Inventory' },
          { id: 'seo', label: 'SEO Config' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setProductFilterMode(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              productFilterMode === tab.id
                ? 'border-red-600 text-red-700 bg-red-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Statistics widgets */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Catalog SKU Count</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{products.length}</span>
            <span className="text-xs text-slate-400 font-bold">registered devices</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Out of Stock Alert count</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">
              {products.filter(p => (localStock[p.id] ?? 10) <= 5).length}
            </span>
            <span className="text-xs text-slate-400 font-bold">devices below critical limit</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Image Sync Coverage</span>
            <button 
              onClick={fetchProductImages} 
              className={`text-slate-400 hover:text-red-600 transition ${isFetchingImages ? 'animate-spin' : ''}`}
              title="Sync with cloud imagery database"
            >
              <RefreshCw size={12} />
            </button>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 mt-2.5">
            <div 
              className="h-full bg-red-600 transition-all duration-500 rounded-full" 
              style={{ width: `${imageCoveragePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters panels */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search products by brand, name, specification or SKU code..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 transition focus:border-red-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Filters</span>
            </div>

            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white focus:outline-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Image States</option>
              <option value="With">Has Image Only</option>
              <option value="Without">No Image Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table view conditional display */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {isFetchingImages ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-slate-200 border-t-red-600 mb-3" />
            <p className="text-xs font-bold text-slate-500">Retrieving active image database...</p>
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="py-20 text-center">
            <ImageIcon className="mx-auto text-slate-300 mb-4" size={40} />
            <h3 className="text-sm font-bold text-slate-900">No products match criteria</h3>
            <p className="text-xs text-slate-400 mt-1">Adjust search tags or try resetting filter drops.</p>
          </div>
        ) : productFilterMode === 'seo' ? (
          /* SEO EDITOR LISTING */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4 w-1/4">Device Name & Category</th>
                  <th className="px-5 py-4 w-1/2">Google Search Preview</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {currentProducts.map((p) => {
                  const isEditing = editingSeoId === p.id;
                  const seo = seoData[p.id] || {};
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {p.sku}</div>
                        <div className="text-[10px] text-slate-500 font-semibold bg-slate-100 border rounded px-1.5 py-0.5 inline-block mt-2">
                          {p.category}
                        </div>
                      </td>
                      
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="space-y-3 bg-slate-50 p-4 border rounded-xl">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-slate-400">Google Title</label>
                              <input
                                type="text"
                                className="w-full rounded-lg border bg-white p-2 text-xs font-semibold focus:outline-none focus:border-red-500 text-slate-800"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-slate-400">Meta Description</label>
                              <textarea
                                rows={2}
                                className="w-full rounded-lg border bg-white p-2 text-xs font-semibold focus:outline-none focus:border-red-500 text-slate-800"
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-slate-400">Keywords (Comma separated)</label>
                              <input
                                type="text"
                                className="w-full rounded-lg border bg-white p-2 text-xs font-semibold focus:outline-none focus:border-red-500 text-slate-800"
                                value={seoKeywords}
                                onChange={(e) => setSeoKeywords(e.target.value)}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 max-w-xl">
                            {/* Simulated Google snippet */}
                            <div className="text-[#1a0dab] font-bold text-sm hover:underline cursor-pointer block truncate">
                              {seo.title || `${p.name} | IT SAATHI`}
                            </div>
                            <div className="text-[#006621] text-[11px] block truncate">
                              https://itsaathi.in/shop/devices/{p.slug}
                            </div>
                            <p className="text-[#545454] leading-relaxed text-[11px] line-clamp-2">
                              {seo.description || `Procure ${p.name} at wholesale prices. IT SAATHI is India's premium wholesale hardware distributor of CCTV cameras, cords, adapters.`}
                            </p>
                            {seo.keywords && (
                              <div className="flex flex-wrap gap-1 pt-1.5">
                                {seo.keywords.split(',').map((kw, i) => (
                                  <span key={i} className="text-[9px] bg-slate-100 font-bold px-1.5 py-0.5 rounded text-slate-500">
                                    {kw.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-5 py-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingSeoId(null)}
                              className="border rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveSeo(p.id)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-[11px] font-black cursor-pointer shadow-2xs"
                            >
                              Save SEO
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditingSeo(p)}
                            className="border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-700 rounded-xl px-3 py-1.5 text-[10px] font-bold transition inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Globe size={11} />
                            <span>Edit Metadata</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* STANDARD & INVENTORY & LOW STOCK LISTING */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4">Thumbnail</th>
                  <th className="px-5 py-4">SKU Code</th>
                  <th className="px-5 py-4">Device Specifications</th>
                  <th className="px-5 py-4">Trade Price</th>
                  <th className="px-5 py-4">Stock Control</th>
                  <th className="px-5 py-4">Listing Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {currentProducts.map((product) => {
                  const hasImage = !!imageMap[product.slug];
                  const imageUrl = imageMap[product.slug];
                  const stock = localStock[product.id] ?? 10;
                  const active = localStatus[product.id] ?? true;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition">
                      
                      {/* Image Thumbnail */}
                      <td className="px-5 py-3">
                        {hasImage ? (
                          <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1598450847827-7a7be5258086?w=100';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400 border border-dashed border-slate-200">
                            <ImageIcon size={14} />
                          </div>
                        )}
                      </td>

                      {/* SKU Code */}
                      <td className="px-5 py-3 text-slate-500 font-mono font-bold tracking-tight text-[10px]">
                        {product.sku}
                      </td>

                      {/* Product Name */}
                      <td className="px-5 py-3">
                        <div className="font-bold text-slate-900 leading-tight">{product.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold mt-1">
                          <Tag size={10} className="text-red-500" />
                          <span>{product.category}</span>
                        </div>
                      </td>

                      {/* Price tag */}
                      <td className="px-5 py-3">
                        <div className="font-black text-slate-900 text-xs">₹{product.price.toLocaleString('en-IN')}</div>
                        {product.oldPrice && (
                          <div className="text-[10px] text-slate-400 line-through font-bold mt-0.5">₹{product.oldPrice.toLocaleString('en-IN')}</div>
                        )}
                      </td>

                      {/* Stock Adjuster */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustStock(product.id, -1)}
                            className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 border text-slate-700 font-bold text-xs shadow-2xs flex items-center justify-center transition cursor-pointer"
                          >
                            -
                          </button>
                          <span className={`w-12 text-center font-mono font-black text-xs ${stock <= 5 ? 'text-amber-600 animate-pulse font-extrabold' : 'text-slate-800'}`}>
                            {stock} pcs
                          </span>
                          <button
                            onClick={() => adjustStock(product.id, 1)}
                            className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 border text-slate-700 font-bold text-xs shadow-2xs flex items-center justify-center transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        {stock <= 5 && (
                          <div className="text-[9px] text-amber-600 font-bold tracking-wide mt-1">⚠️ Low Safety Stock</div>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleStatus(product.id)}
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                            active 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {active ? 'Listed Active' : 'Hidden Draft'}
                        </button>
                      </td>

                      {/* Action buttons: Edit, Delete, Photo */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="rounded-xl px-2.5 py-1.5 text-[10px] font-bold transition inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-2xs cursor-pointer"
                            title="Edit Product details, price, specs and stock"
                          >
                            <Pencil size={11} className="text-blue-600" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => openInsertModal(product)}
                            className={`rounded-xl px-2.5 py-1.5 text-[10px] font-bold transition inline-flex items-center gap-1 shadow-2xs border cursor-pointer ${
                              hasImage
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            }`}
                            title="Update or insert product photo"
                          >
                            <ImageIcon size={11} />
                            <span>{hasImage ? 'Photo' : '+ Photo'}</span>
                          </button>

                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="rounded-xl p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition inline-flex items-center justify-center cursor-pointer"
                            title="Delete product permanently"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-4">
            <span className="text-[11px] font-bold text-slate-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} devices
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft size={14} />
              </button>

              <span className="text-[11px] font-bold text-slate-700 px-1">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ADD NEW PRODUCT DIALOG MODAL */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inventory Additions</span>
                <h3 className="text-sm font-black text-slate-900">Add New Device specification</h3>
              </div>
              <button
                onClick={() => setShowAddProduct(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 font-semibold text-slate-700 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Device SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKU-ITSAATHI-10045"
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold focus:outline-none focus:border-red-500 text-slate-800 text-xs"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category Category</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-white font-bold focus:outline-none text-slate-800 text-xs"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                  >
                    <option value="CCTV Solutions">CCTV Solutions</option>
                    <option value="Power Solutions">Power Solutions</option>
                    <option value="Cables Range">Cables Range</option>
                    <option value="Networking Accessories">Networking Accessories</option>
                    <option value="Computer Essentials">Computer Essentials</option>
                    <option value="Storage Devices">Storage Devices</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Product Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CP PLUS 2.4MP FULL HD DOME CAMERA"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold focus:outline-none focus:border-red-500 text-slate-800 text-xs"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Wholesale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1450"
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold focus:outline-none focus:border-red-500 text-slate-800 text-xs"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Retail MRP Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2100"
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold focus:outline-none focus:border-red-500 text-slate-800 text-xs"
                    value={newProdOldPrice}
                    onChange={(e) => setNewProdOldPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Initial Warehouse Stock</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold focus:outline-none focus:border-red-500 text-slate-800 text-xs"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Technical Specifications (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Resolution: 1080p Full HD&#10;Night Vision: Up to 20 meters IR&#10;Weatherproof IP66 rated"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold focus:outline-none focus:border-red-500 text-slate-800 text-xs leading-relaxed"
                  value={newProdSpec}
                  onChange={(e) => setNewProdSpec(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-red-700 transition cursor-pointer"
                >
                  Save Specification
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Product Import Modal */}
      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="products"
          onImportSuccess={(importedRows, mode) => {
            if (setProducts) {
              if (mode === 'merge') {
                setProducts(prev => {
                  const merged = [...prev];
                  importedRows.forEach((newP) => {
                    const idx = merged.findIndex(p => p.sku === newP.sku || p.id === newP.id);
                    if (idx >= 0) {
                      merged[idx] = { ...merged[idx], ...newP };
                    } else {
                      merged.push(newP);
                    }
                  });
                  localStorage.setItem('admin_products', JSON.stringify(merged));
                  return merged;
                });
              } else {
                setProducts(prev => {
                  const appended = [...prev, ...importedRows];
                  localStorage.setItem('admin_products', JSON.stringify(appended));
                  return appended;
                });
              }
            }
          }}
          sampleTemplate={sampleProductTemplate}
          sampleColumns={productExportColumns}
          sampleFileName="products_sample_template.csv"
          showToast={showToast}
        />
      )}

      {/* Product Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          type="products"
          data={products}
          filteredData={filteredProducts}
          columns={productExportColumns}
          fileNamePrefix="IT_SAATHI_Products"
          showToast={showToast}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onSave={handleSaveProduct}
          categories={categories}
          showToast={showToast}
        />
      )}

      {/* Delete Product Confirmation Modal */}
      {deletingProduct && (
        <DeleteConfirmModal
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDeleteProduct}
          title="Delete Hardware Device"
          message="Are you sure you want to permanently remove this device specification from the wholesale catalog? It will no longer be visible in the catalog, cart, or inventory tables."
          itemName={deletingProduct.name}
          itemDetail={`SKU: ${deletingProduct.sku} • Category: ${deletingProduct.category} • Price: ₹${deletingProduct.price}`}
        />
      )}

    </div>
  );
}
