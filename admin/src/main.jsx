import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Upload,
  ArrowDownUp,
  FolderDown,
  Link as LinkIcon,
  Search,
  Image as ImageIcon,
  Tag,
  Database,
  LogOut,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Circle,
  AlertCircle,
  X,
  Sparkles,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  FileText,
  Activity,
  Mail,
  Globe,
  Gift
} from 'lucide-react';

// Import local data and components
import { products } from './data/products.js';
import {
  defaultStaff,
  defaultCategories,
  defaultBrands,
  defaultCoupons,
  defaultBanners,
  defaultBlogs,
  defaultFaqs,
  defaultTestimonials,
  defaultSuppliers,
  defaultLogistics,
  initialApps,
  initialSystemLogs
} from './data/mockData.js';

import DashboardView from './components/DashboardView.jsx';
import OrdersView from './components/OrdersView.jsx';
import ProductsView from './components/ProductsView.jsx';
import CustomersView from './components/CustomersView.jsx';
import OtherModulesView from './components/OtherModulesView.jsx';
import DataManagementView from './components/DataManagementView.jsx';
import TaxInvoiceView from './components/TaxInvoiceView.jsx';
import Logo from './components/Logo.jsx';

import './index.css';

function AdminApp() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('admin@itsaathi.in');
  const [loginPassword, setLoginPassword] = useState('ChangeMe@2026');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Submenu and specialized filters
  const [productsMenuOpen, setProductsMenuOpen] = useState(true);
  const [ordersMenuOpen, setOrdersMenuOpen] = useState(false);
  const [customersMenuOpen, setCustomersMenuOpen] = useState(false);
  const [productFilterMode, setProductFilterMode] = useState('all');
  const [customerSubTab, setCustomerSubTab] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Loaded/Mock datasets with LocalStorage persistence
  const [productsList, setProductsList] = useState(() => JSON.parse(localStorage.getItem('admin_products')) || products);
  const [staffList, setStaffList] = useState(() => JSON.parse(localStorage.getItem('admin_staff')) || defaultStaff);
  const [categoriesList, setCategoriesList] = useState(() => JSON.parse(localStorage.getItem('admin_categories')) || defaultCategories);
  const [brandsList, setBrandsList] = useState(() => JSON.parse(localStorage.getItem('admin_brands')) || defaultBrands);
  const [couponsList, setCouponsList] = useState(() => JSON.parse(localStorage.getItem('admin_coupons')) || defaultCoupons);
  const [bannersList, setBannersList] = useState(() => JSON.parse(localStorage.getItem('admin_banners')) || defaultBanners);
  const [blogsList, setBlogsList] = useState(() => JSON.parse(localStorage.getItem('admin_blogs')) || defaultBlogs);
  const [faqsList, setFaqsList] = useState(() => JSON.parse(localStorage.getItem('admin_faqs')) || defaultFaqs);
  const [testimonialsList, setTestimonialsList] = useState(() => JSON.parse(localStorage.getItem('admin_testimonials')) || defaultTestimonials);
  const [suppliersList, setSuppliersList] = useState(() => JSON.parse(localStorage.getItem('admin_suppliers')) || defaultSuppliers);
  const [logisticsZones, setLogisticsZones] = useState(() => JSON.parse(localStorage.getItem('admin_logistics')) || defaultLogistics);
  const [appsList, setAppsList] = useState(() => JSON.parse(localStorage.getItem('admin_apps')) || initialApps);
  const [systemLogs, setSystemLogs] = useState(() => JSON.parse(localStorage.getItem('admin_system_logs')) || initialSystemLogs);
  const [storeSettings, setStoreSettings] = useState(() => JSON.parse(localStorage.getItem('admin_store_settings')) || {
    storeName: 'IT SAATHI',
    gstRate: 18,
    storePhone: '+91 80060 33345',
    storeEmail: 'Support@itsaathi.com',
    lowStockLimit: 10,
    globalCashbackPercent: 2
  });

  // DB Sync collections
  const [imageMap, setImageMap] = useState({});
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [isFetchingEnquiries, setIsFetchingEnquiries] = useState(false);

  // Shared sub-filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Image Upload modal overlay
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [insertMethod, setInsertMethod] = useState('upload');
  const [externalUrl, setExternalUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  // Global Toaster notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Persistent local cache updates
  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(productsList));
  }, [productsList]);
  useEffect(() => {
    localStorage.setItem('admin_staff', JSON.stringify(staffList));
  }, [staffList]);
  useEffect(() => {
    localStorage.setItem('admin_categories', JSON.stringify(categoriesList));
  }, [categoriesList]);
  useEffect(() => {
    localStorage.setItem('admin_brands', JSON.stringify(brandsList));
  }, [brandsList]);
  useEffect(() => {
    localStorage.setItem('admin_coupons', JSON.stringify(couponsList));
  }, [couponsList]);
  useEffect(() => {
    localStorage.setItem('admin_banners', JSON.stringify(bannersList));
  }, [bannersList]);
  useEffect(() => {
    localStorage.setItem('admin_blogs', JSON.stringify(blogsList));
  }, [blogsList]);
  useEffect(() => {
    localStorage.setItem('admin_faqs', JSON.stringify(faqsList));
  }, [faqsList]);
  useEffect(() => {
    localStorage.setItem('admin_testimonials', JSON.stringify(testimonialsList));
  }, [testimonialsList]);
  useEffect(() => {
    localStorage.setItem('admin_suppliers', JSON.stringify(suppliersList));
  }, [suppliersList]);
  useEffect(() => {
    localStorage.setItem('admin_logistics', JSON.stringify(logisticsZones));
  }, [logisticsZones]);
  useEffect(() => {
    localStorage.setItem('admin_apps', JSON.stringify(appsList));
  }, [appsList]);
  useEffect(() => {
    localStorage.setItem('admin_system_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);
  useEffect(() => {
    localStorage.setItem('admin_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Auth checks & bootstrapping
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (savedToken && savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    fetchProductImages();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProductImages();
      fetchOrders();
      fetchCustomers();
      fetchEnquiries();
    }
  }, [isAuthenticated]);

  const getHeaders = () => {
    const token = localStorage.getItem('admin_token') || 'demo-token';
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // API requests
  const fetchProductImages = async () => {
    setIsFetchingImages(true);
    try {
      const response = await fetch('/api/products/images');
      const data = await response.json();
      if (data.success && data.images) {
        setImageMap(data.images);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setIsFetchingImages(false);
    }
  };

  const fetchOrders = async () => {
    setIsFetchingOrders(true);
    try {
      const response = await fetch('/api/orders', { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsFetchingOrders(false);
    }
  };

  const fetchCustomers = async () => {
    setIsFetchingCustomers(true);
    try {
      const response = await fetch('/api/auth/users', { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setIsFetchingCustomers(false);
    }
  };

  const fetchEnquiries = async () => {
    setIsFetchingEnquiries(true);
    try {
      const response = await fetch('/api/enquiries', { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setIsFetchingEnquiries(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(`Order status updated to "${newStatus}"`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        throw new Error(data.message || 'Failed to update order status');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel and delete this order record?')) return;
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast('Order successfully cancelled.');
        setOrders(prev => prev.filter(o => o._id !== orderId));
      } else {
        throw new Error(data.message || 'Failed to delete order');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Submit image maps
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('productSlug', activeProduct.slug);

      if (insertMethod === 'upload') {
        if (selectedFile) {
          formData.append('image', selectedFile);
        } else if (filePreview.startsWith('/uploads/')) {
          formData.append('imageUrl', filePreview);
        } else {
          throw new Error('Please select an image file to upload.');
        }
      } else {
        if (!externalUrl.trim()) {
          throw new Error('Please enter a valid web image URL.');
        }
        formData.append('imageUrl', externalUrl.trim());
      }

      const response = await fetch('/api/products/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setImageMap(prev => ({
          ...prev,
          [activeProduct.slug]: data.data.imageUrl
        }));
        showToast(`Image updated successfully for ${activeProduct.name}`);
        setIsModalOpen(false);
      } else {
        throw new Error(data.message || 'Image upload failed');
      }
    } catch (err) {
      setModalError(err.message || 'Something went wrong while connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageDelete = async () => {
    if (!activeProduct) return;
    if (!confirm(`Are you sure you want to remove the image for ${activeProduct.name}?`)) return;

    setIsSubmitting(true);
    setModalError('');

    try {
      const response = await fetch('/api/products/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: activeProduct.slug,
          imageUrl: ''
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setImageMap(prev => {
          const next = { ...prev };
          delete next[activeProduct.slug];
          return next;
        });
        showToast(`Image mapping removed for ${activeProduct.name}`);
        setIsModalOpen(false);
      } else {
        throw new Error(data.message || 'Failed to remove association');
      }
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openInsertModal = (product) => {
    setActiveProduct(product);
    const existingImage = imageMap[product.slug] || '';
    if (existingImage && !existingImage.startsWith('/uploads/')) {
      setInsertMethod('url');
      setExternalUrl(existingImage);
      setSelectedFile(null);
      setFilePreview('');
    } else if (existingImage && existingImage.startsWith('/uploads/')) {
      setInsertMethod('upload');
      setExternalUrl('');
      setSelectedFile(null);
      setFilePreview(existingImage);
    } else {
      setInsertMethod('upload');
      setExternalUrl('');
      setSelectedFile(null);
      setFilePreview('');
    }
    setModalError('');
    setIsModalOpen(true);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file) => {
    if (!file.type.startsWith('image/')) {
      setModalError('Please upload a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    setSelectedFile(file);
    setModalError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Auth submissions
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const role = data.user?.role || 'admin';
        if (role !== 'admin' && role !== 'manager') {
          throw new Error('Access denied. Administrator privileges required.');
        }

        localStorage.setItem('admin_token', data.token || 'demo-token');
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        setAdminUser(data.user);
        setIsAuthenticated(true);
        showToast('Authenticated as administrative operator!');
      } else {
        throw new Error(data.message || 'Invalid administrative credentials');
      }
    } catch (err) {
      setAuthError(err.message || 'Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoBypass = () => {
    const demoUser = {
      name: 'Demo Admin',
      email: 'demo@itsaathi.in',
      role: 'admin'
    };
    localStorage.setItem('admin_token', 'demo-token');
    localStorage.setItem('admin_user', JSON.stringify(demoUser));
    setAdminUser(demoUser);
    setIsAuthenticated(true);
    showToast('Entered Administration Sandbox', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
    showToast('Logged out successfully');
  };

  // Auth gate render
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-slate-200 bg-white p-8 shadow-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Logo variant="horizontal" size="md" />
            </div>
            <h1 className="mt-2 text-xl font-black text-slate-900 tracking-tight">
              Administrative Control Desk
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Provide authorization credentials to access product and order databases
            </p>
          </div>

          {authError && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-100 font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4 font-semibold text-slate-700">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-red-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-red-700 disabled:bg-red-400 transition cursor-pointer"
            >
              {isLoading ? 'Verifying Credentials...' : 'Authenticate Access'}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-150"></div></div>
            <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Sandbox Preview Bypass</span>
          </div>

          <button
            type="button"
            onClick={handleDemoBypass}
            className="w-full rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer shadow-2xs"
          >
            Enter Demo Administrative Sandbox
          </button>
        </div>
      </div>
    );
  }

  // Sidebar Menu specification
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Database, category: 'Overview' },
    { id: 'products', label: 'Products Master', icon: ImageIcon, category: 'Catalog' },
    { id: 'orders', label: 'Orders Processing', icon: ShoppingBag, category: 'Sales' },
    { id: 'invoice', label: 'Tax Invoices & Billing', icon: FileText, category: 'Sales' },
    { id: 'enquiry', label: 'Inquiries Box', icon: Mail, category: 'Sales' },
    { id: 'staff', label: 'Staff Logins', icon: Users, category: 'Corporate' },
    { id: 'coupons', label: 'Promo Coupons', icon: Tag, category: 'Marketing' },
    { id: 'cashbacks', label: 'Cashback loyalty', icon: Gift, category: 'Marketing' },
    { id: 'categories', label: 'Categories Range', icon: Tag, category: 'Catalog' },
    { id: 'brands', label: 'Brands Partner', icon: Tag, category: 'Catalog' },
    { id: 'faq', label: 'FAQ CMS Editor', icon: FileText, category: 'CMS Content' },
    { id: 'blog', label: 'Blogs CMS Editor', icon: FileText, category: 'CMS Content' },
    { id: 'testimonials', label: 'Reviews Moderation', icon: FileText, category: 'CMS Content' },
    { id: 'suppliers', label: 'Suppliers directory', icon: Users, category: 'Corporate' },
    { id: 'app_store', label: 'Integration Apps', icon: Globe, category: 'Corporate' },
    { id: 'settings', label: 'Storefront config', icon: Settings, category: 'Settings' },
    { id: 'logs', label: 'System Action Logs', icon: Activity, category: 'Settings' }
  ];

  // Grouped Menu
  const categories = ['Overview', 'Catalog', 'Sales', 'Marketing', 'CMS Content', 'Corporate', 'Settings'];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl p-4 shadow-xl border animate-in slide-in-from-bottom duration-300 ${
          toastType === 'success' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-black tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* MOBILE HEADER BAR */}
      <div className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">
        <div className="flex items-center gap-2">
          <Logo variant="horizontal" size="sm" showTagline={false} />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* COLLAPSIBLE SIDEBAR */}
      <aside className={`fixed bottom-0 top-16 z-20 w-64 border-r border-slate-200 bg-white overflow-y-auto transition-transform duration-300 lg:top-0 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand header */}
        <div className="hidden h-16 items-center justify-between border-b border-slate-200 px-4 lg:flex">
          <Logo variant="horizontal" size="sm" showTagline={false} />
        </div>

        {/* User context widget */}
        <div className="p-4 border-b border-slate-100">
          <div className="rounded-xl bg-slate-50 p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-black text-xs shrink-0">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <div className="font-black text-xs text-slate-800 truncate leading-tight">{adminUser?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{adminUser?.email || 'admin@itsaathi.in'}</div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-3 block">Main Overview</span>
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-red-50 text-red-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Database size={14} className={activeTab === 'dashboard' ? 'text-red-600' : 'text-slate-400'} />
                <span>Dashboard Overview</span>
              </span>
              {activeTab === 'dashboard' && <ChevronRight size={10} className="text-red-500" />}
            </button>

            <button
              onClick={() => {
                setActiveTab('data_management');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'data_management'
                  ? 'bg-red-50 text-red-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ArrowDownUp size={14} className={activeTab === 'data_management' ? 'text-red-600' : 'text-slate-400'} />
                <span>Import / Export Hub</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-red-600 text-white">
                CSV / JSON
              </span>
            </button>
          </div>

          {/* PRODUCTS ACCORDION */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-3 block">Catalog Master</span>
            <button
              onClick={() => setProductsMenuOpen(!productsMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <ImageIcon size={14} className="text-slate-400" />
                <span>Products Catalog</span>
              </span>
              {productsMenuOpen ? <ChevronUp size={12} className="text-slate-400" /> : <ChevronDown size={12} className="text-slate-400" />}
            </button>

            {productsMenuOpen && (
              <div className="pl-6 space-y-1 pr-1 border-l border-slate-100 ml-4 animate-in slide-in-from-top-1 duration-150">
                {[
                  { label: 'All Product', action: () => { setActiveTab('products'); setProductFilterMode('all'); setShowAddProduct(false); } },
                  { label: 'Add Product', action: () => { setActiveTab('products'); setProductFilterMode('all'); setShowAddProduct(true); } },
                  { label: 'Import / Export CSV', action: () => { setActiveTab('data_management'); } },
                  { label: 'Product Review', action: () => { setActiveTab('testimonials'); } },
                  { label: 'Out of Stock', action: () => { setActiveTab('products'); setProductFilterMode('out_of_stock'); setShowAddProduct(false); } },
                  { label: 'Inventory Management', action: () => { setActiveTab('products'); setProductFilterMode('inventory'); setShowAddProduct(false); } },
                  { label: 'Product SEO', action: () => { setActiveTab('products'); setProductFilterMode('seo'); setShowAddProduct(false); } }
                ].map((sub, i) => {
                  const isCurrent = activeTab === 'products' && (
                    (sub.label === 'All Product' && productFilterMode === 'all' && !showAddProduct) ||
                    (sub.label === 'Add Product' && showAddProduct) ||
                    (sub.label === 'Out of Stock' && productFilterMode === 'out_of_stock') ||
                    (sub.label === 'Inventory Management' && productFilterMode === 'inventory') ||
                    (sub.label === 'Product SEO' && productFilterMode === 'seo')
                  ) || (sub.label === 'Product Review' && activeTab === 'testimonials') ||
                  (sub.label === 'Import / Export CSV' && activeTab === 'data_management');

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        sub.action();
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-[11px] font-semibold rounded-lg flex items-center gap-2 transition cursor-pointer ${
                        isCurrent
                          ? 'text-red-700 bg-red-50 font-bold'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Circle size={5} fill={isCurrent ? '#dc2626' : 'transparent'} className={isCurrent ? 'text-red-600' : 'text-slate-300'} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ORDERS ACCORDION */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-3 block">Sales Desk</span>
            <button
              onClick={() => setOrdersMenuOpen(!ordersMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBag size={14} className="text-slate-400" />
                <span>Orders Processing</span>
              </span>
              {ordersMenuOpen ? <ChevronUp size={12} className="text-slate-400" /> : <ChevronDown size={12} className="text-slate-400" />}
            </button>

            {ordersMenuOpen && (
              <div className="pl-6 space-y-1 pr-1 border-l border-slate-100 ml-4 animate-in slide-in-from-top-1 duration-150">
                {[
                  { label: 'All Orders', action: () => { setActiveTab('orders'); setOrderStatusFilter('All'); } },
                  { label: 'Pre Order Report', action: () => { setActiveTab('orders'); setOrderStatusFilter('Pending'); } },
                  { label: 'GST Tax Invoices', action: () => { setActiveTab('invoice'); } }
                ].map((sub, i) => {
                  const isCurrent = (activeTab === 'orders' && (
                    (sub.label === 'All Orders' && orderStatusFilter === 'All') ||
                    (sub.label === 'Pre Order Report' && orderStatusFilter === 'Pending')
                  )) || (sub.label === 'GST Tax Invoices' && activeTab === 'invoice');

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        sub.action();
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-[11px] font-semibold rounded-lg flex items-center gap-2 transition cursor-pointer ${
                        isCurrent
                          ? 'text-red-700 bg-red-50 font-bold'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Circle size={5} fill={isCurrent ? '#dc2626' : 'transparent'} className={isCurrent ? 'text-red-600' : 'text-slate-300'} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Standalone Tax Invoice Direct Button */}
            <button
              onClick={() => {
                setActiveTab('invoice');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'invoice'
                  ? 'bg-red-50 text-red-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText size={14} className={activeTab === 'invoice' ? 'text-red-600' : 'text-slate-400'} />
                <span>GST Tax Invoices</span>
              </span>
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-black text-red-700">GST</span>
            </button>
          </div>

          {/* CUSTOMERS ACCORDION */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-3 block">Corporate CRM</span>
            <button
              onClick={() => setCustomersMenuOpen(!customersMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Users size={14} className="text-slate-400" />
                <span>Customers Directory</span>
              </span>
              {customersMenuOpen ? <ChevronUp size={12} className="text-slate-400" /> : <ChevronDown size={12} className="text-slate-400" />}
            </button>

            {customersMenuOpen && (
              <div className="pl-6 space-y-1 pr-1 border-l border-slate-100 ml-4 animate-in slide-in-from-top-1 duration-150">
                {[
                  { label: 'Pending Customers', action: () => { setActiveTab('customers'); setCustomerSubTab('pending_reg'); } },
                  { label: 'All Customers', action: () => { setActiveTab('customers'); setCustomerSubTab('all'); } },
                  { label: 'Import / Export CSV', action: () => { setActiveTab('data_management'); } },
                  { label: 'Dead Customers', action: () => { setActiveTab('customers'); setCustomerSubTab('dead'); } },
                  { label: 'Referral Customers', action: () => { setActiveTab('customers'); setCustomerSubTab('referral'); } },
                  { label: 'Cashback Management', action: () => { setActiveTab('cashbacks'); } },
                  { label: 'Pending Registration', action: () => { setActiveTab('customers'); setCustomerSubTab('pending_reg'); } }
                ].map((sub, i) => {
                  const isCurrent = (activeTab === 'customers' && (
                    (sub.label === 'Pending Customers' && customerSubTab === 'pending_reg') ||
                    (sub.label === 'All Customers' && customerSubTab === 'all') ||
                    (sub.label === 'Dead Customers' && customerSubTab === 'dead') ||
                    (sub.label === 'Referral Customers' && customerSubTab === 'referral') ||
                    (sub.label === 'Pending Registration' && customerSubTab === 'pending_reg')
                  )) || (sub.label === 'Cashback Management' && activeTab === 'cashbacks') ||
                  (sub.label === 'Import / Export CSV' && activeTab === 'data_management');

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        sub.action();
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-[11px] font-semibold rounded-lg flex items-center gap-2 transition cursor-pointer ${
                        isCurrent
                          ? 'text-red-700 bg-red-50 font-bold'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Circle size={5} fill={isCurrent ? '#dc2626' : 'transparent'} className={isCurrent ? 'text-red-600' : 'text-slate-300'} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* OTHERS / CONFIG GROUP */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-3 block">Configuration & CMS</span>
            {[
              { id: 'enquiry', label: 'Inquiries Box', icon: Mail },
              { id: 'coupons', label: 'Promo Coupons', icon: Tag },
              { id: 'categories', label: 'Categories Range', icon: Tag },
              { id: 'brands', label: 'Brands Partner', icon: Tag },
              { id: 'faq', label: 'FAQ CMS Editor', icon: FileText },
              { id: 'blog', label: 'Blogs CMS Editor', icon: FileText },
              { id: 'staff', label: 'Staff Logins', icon: Users },
              { id: 'suppliers', label: 'Suppliers directory', icon: Users },
              { id: 'settings', label: 'Storefront config', icon: Settings },
              { id: 'logs', label: 'Action Logs', icon: Activity }
            ].map(item => {
              const Icon = item.icon;
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    isCurrent
                      ? 'bg-red-50 text-red-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={14} className={isCurrent ? 'text-red-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </span>
                  {isCurrent && <ChevronRight size={10} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
            >
              <LogOut size={14} />
              <span>Terminate Session</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MASTER CONTENT CONTAINER */}
      <main className="flex-1 lg:pl-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        {/* Top bar header */}
        <header className="hidden h-16 items-center justify-between bg-white border-b border-slate-200 px-8 shrink-0 lg:flex">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700 border border-emerald-100">
              Surveillance Node Active
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <span>Store ID: <span className="text-slate-900 font-black font-mono">#ITSAATHI-99</span></span>
            <span className="h-4 w-px bg-slate-200" />
            <span>Role: <span className="text-red-700 font-black uppercase">{adminUser?.role || 'admin'}</span></span>
          </div>
        </header>

        {/* Switch tab contents */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              orders={orders}
              customers={customers}
              products={productsList}
              enquiries={enquiries}
              suppliers={suppliersList}
              brands={brandsList}
              testimonials={testimonialsList}
              imageMap={imageMap}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              isFetchingOrders={isFetchingOrders}
              orderSearchTerm={orderSearchTerm}
              setOrderSearchTerm={setOrderSearchTerm}
              orderStatusFilter={orderStatusFilter}
              setOrderStatusFilter={setOrderStatusFilter}
              updateOrderStatus={updateOrderStatus}
              deleteOrder={deleteOrder}
              showToast={showToast}
              onGenerateTaxInvoice={(order) => {
                setSelectedOrderForInvoice(order);
                setActiveTab('invoice');
              }}
            />
          )}

          {activeTab === 'invoice' && (
            <TaxInvoiceView
              orders={orders}
              showToast={showToast}
              selectedOrderForInvoice={selectedOrderForInvoice}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={productsList}
              setProducts={setProductsList}
              imageMap={imageMap}
              isFetchingImages={isFetchingImages}
              fetchProductImages={fetchProductImages}
              openInsertModal={openInsertModal}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              showToast={showToast}
              productFilterMode={productFilterMode}
              setProductFilterMode={setProductFilterMode}
              showAddProduct={showAddProduct}
              setShowAddProduct={setShowAddProduct}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              setCustomers={setCustomers}
              isFetchingCustomers={isFetchingCustomers}
              fetchCustomers={fetchCustomers}
              showToast={showToast}
              initialSubTab={customerSubTab}
            />
          )}

          {activeTab === 'data_management' && (
            <DataManagementView
              products={productsList}
              setProductsList={setProductsList}
              customers={customers.length > 0 ? customers : (JSON.parse(localStorage.getItem('admin_customers')) || [])}
              setCustomersList={(newList) => {
                setCustomers(newList);
                localStorage.setItem('admin_customers', JSON.stringify(newList));
              }}
              orders={orders}
              setOrdersList={setOrders}
              coupons={couponsList}
              setCouponsList={setCouponsList}
              categories={categoriesList}
              setCategoriesList={setCategoriesList}
              brands={brandsList}
              setBrandsList={setBrandsList}
              storeSettings={storeSettings}
              setStoreSettings={setStoreSettings}
              showToast={showToast}
            />
          )}

          {/* Grouped lesser tabs inside OtherModulesView */}
          {activeTab !== 'dashboard' && activeTab !== 'orders' && activeTab !== 'products' && activeTab !== 'customers' && activeTab !== 'data_management' && (
            <OtherModulesView
              activeTab={activeTab}
              staffList={staffList} setStaffList={setStaffList}
              categoriesList={categoriesList} setCategoriesList={setCategoriesList}
              brandsList={brandsList} setBrandsList={setBrandsList}
              couponsList={couponsList} setCouponsList={setCouponsList}
              bannersList={bannersList} setBannersList={setBannersList}
              blogsList={blogsList} setBlogsList={setBlogsList}
              faqsList={faqsList} setFaqsList={setFaqsList}
              testimonialsList={testimonialsList} setTestimonialsList={setTestimonialsList}
              suppliersList={suppliersList} setSuppliersList={setSuppliersList}
              logisticsZones={logisticsZones} setLogisticsZones={setLogisticsZones}
              appsList={appsList} setAppsList={setAppsList}
              systemLogs={systemLogs} setSystemLogs={setSystemLogs}
              storeSettings={storeSettings} setStoreSettings={setStoreSettings}
              enquiries={enquiries} setEnquiries={setEnquiries}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      {/* CLOUDINARY IMAGE ASSOCIATE MODAL */}
      {isModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cloud Imagery Sync</span>
                <h3 className="text-sm font-black text-slate-900">Map Photo: {activeProduct.name}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleImageSubmit} className="p-6 space-y-4 font-semibold text-slate-700">
              {modalError && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-100">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Toggle upload method */}
              <div className="flex gap-2 rounded-xl bg-slate-100 p-1 border">
                <button
                  type="button"
                  onClick={() => {
                    setInsertMethod('upload');
                    setModalError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    insertMethod === 'upload' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Upload File (Cloudinary)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInsertMethod('url');
                    setModalError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    insertMethod === 'url' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Paste Web Image URL
                </button>
              </div>

              {insertMethod === 'upload' ? (
                /* DRAG AND DROP ZONE */
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition text-center ${
                    isDragActive ? 'border-red-500 bg-red-50/50' : 'border-slate-200 hover:border-red-300'
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {filePreview ? (
                    <div className="space-y-3">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 rounded-xl object-cover border bg-slate-50 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreview('');
                        }}
                        className="text-xs font-black text-red-600 hover:underline inline-flex items-center gap-1"
                      >
                        <X size={12} />
                        Clear Selected
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="file-upload" className="cursor-pointer space-y-2">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
                        <Upload size={16} />
                      </div>
                      <div className="text-xs text-slate-500">
                        <span className="font-black text-red-600 hover:underline">Click to browse file</span> or drag image here
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">PNG, JPG, JPEG, WEBP (Max 5MB)</div>
                    </label>
                  )}
                </div>
              ) : (
                /* EXTERNAL URL */
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <LinkIcon size={12} className="text-slate-400" />
                    Web Image Link URL
                  </label>
                  <input
                    type="url"
                    className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none focus:border-red-500"
                    placeholder="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-slate-100 pt-4 justify-between">
                <div>
                  {imageMap[activeProduct.slug] && (
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      disabled={isSubmitting}
                      className="rounded-xl border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                    >
                      Delete Association
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Syncing...' : 'Save Mapping'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Render root
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
