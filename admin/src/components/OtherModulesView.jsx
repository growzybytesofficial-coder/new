import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Tag,
  Plus,
  Trash2,
  Pencil,
  Calendar,
  Truck,
  Database,
  FileText,
  Activity,
  Globe,
  PlusCircle,
  HelpCircle,
  MessageSquare,
  Gift,
  AlertCircle,
  CheckCircle,
  Settings,
  Mail,
  Sliders
} from 'lucide-react';

export default function OtherModulesView({
  activeTab,
  staffList, setStaffList,
  categoriesList, setCategoriesList,
  brandsList, setBrandsList,
  couponsList, setCouponsList,
  bannersList, setBannersList,
  blogsList, setBlogsList,
  faqsList, setFaqsList,
  testimonialsList, setTestimonialsList,
  suppliersList, setSuppliersList,
  logisticsZones, setLogisticsZones,
  appsList, setAppsList,
  systemLogs, setSystemLogs,
  storeSettings, setStoreSettings,
  enquiries, setEnquiries,
  showToast
}) {
  
  // Local Form state managers
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('staff');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponAmount, setNewCouponAmount] = useState(10);
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [testCouponInput, setTestCouponInput] = useState('');
  const [testResult, setTestResult] = useState('');

  const [cashbackPercent, setCashbackPercent] = useState(2);
  const [adjustCashbackUserId, setAdjustCashbackUserId] = useState('');
  const [adjustCashbackAmount, setAdjustCashbackAmount] = useState(100);

  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSummary, setNewBlogSummary] = useState('');

  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [newSupplierBal, setNewSupplierBal] = useState(0);

  // Helper log action
  const logAction = (user, type, module, details) => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      user,
      type,
      module,
      details,
      date: new Date().toISOString()
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  // Staff managers
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      showToast('Please provide a name and email address.', 'error');
      return;
    }
    const newMember = {
      id: `STF0${staffList.length + 1}`,
      name: newStaffName,
      email: newStaffEmail,
      phone: '+91 80060 33345',
      role: newStaffRole,
      status: 'Active'
    };
    setStaffList(prev => [...prev, newMember]);
    logAction('Admin', 'Create', 'Staff', `Created new staff profile for ${newStaffName}`);
    showToast(`Staff profile configured for ${newStaffName}`);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  const toggleStaffStatus = (id) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Suspended' : 'Active';
        logAction('Admin', 'Edit', 'Staff', `Toggled ${s.name} access status to ${nextStatus}`);
        showToast(`Staff access status toggled to ${nextStatus}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Categories & Brands
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCat = {
      id: `CAT0${categoriesList.length + 1}`,
      name: newCategoryName,
      displayOrder: categoriesList.length + 1,
      status: 'Active',
      count: 0
    };
    setCategoriesList(prev => [...prev, newCat]);
    logAction('Admin', 'Create', 'Catalog', `Added new product category: ${newCategoryName}`);
    showToast(`Category "${newCategoryName}" registered successfully`);
    setNewCategoryName('');
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const newBrd = {
      id: `BRD0${brandsList.length + 1}`,
      name: newBrandName,
      status: 'Active',
      slug: newBrandName.toLowerCase().replace(/\s+/g, '-'),
      desc: newBrandDesc || 'Authorized products brand partner'
    };
    setBrandsList(prev => [...prev, newBrd]);
    logAction('Admin', 'Create', 'Catalog', `Added brand partner: ${newBrandName}`);
    showToast(`Brand partner "${newBrandName}" registered successfully`);
    setNewBrandName('');
    setNewBrandDesc('');
  };

  // Coupon manager
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCpn = {
      id: `CPN0${couponsList.length + 1}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountAmount: Number(newCouponAmount),
      minPurchase: 1000,
      maxUsage: 100,
      usageCount: 0,
      status: 'Active'
    };
    setCouponsList(prev => [...prev, newCpn]);
    logAction('Admin', 'Create', 'Marketing', `Created coupon ${newCouponCode.toUpperCase()}`);
    showToast(`Promo Code ${newCouponCode.toUpperCase()} compiled successfully`);
    setNewCouponCode('');
  };

  const handleTestCoupon = () => {
    const codeUpper = testCouponInput.trim().toUpperCase();
    const found = couponsList.find(c => c.code === codeUpper && c.status === 'Active');
    if (found) {
      setTestResult(`✅ VALID! Yields a ${found.discountAmount}${found.discountType === 'percentage' ? '%' : ' ₹'} flat deduction on orders above ₹1,000.`);
    } else {
      setTestResult('❌ INVALID! Code expired, deactivated, or mismatch.');
    }
  };

  // Cashback config
  const handleCashbackSlider = (e) => {
    const val = Number(e.target.value);
    setCashbackPercent(val);
    setStoreSettings(prev => ({ ...prev, globalCashbackPercent: val }));
    logAction('Admin', 'Edit', 'Marketing', `Adjusted store loyalty cashback base reward rate to ${val}%`);
  };

  const handleAdjustCashback = (e) => {
    e.preventDefault();
    if (!adjustCashbackUserId) {
      showToast('Please specify target account.', 'error');
      return;
    }
    logAction('Admin', 'Credit', 'Marketing', `Manually adjusted cashback balance for customer ID ${adjustCashbackUserId} by ₹${adjustCashbackAmount}`);
    showToast(`Cashback ledger updated: ₹${adjustCashbackAmount} credit associated with account #${adjustCashbackUserId}`);
    setAdjustCashbackUserId('');
  };

  // FAQ CRUD
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const newFaq = {
      id: `FAQ0${faqsList.length + 1}`,
      question: newFaqQuestion,
      answer: newFaqAnswer
    };
    setFaqsList(prev => [...prev, newFaq]);
    logAction('Admin', 'Create', 'CMS', `Added FAQ card: ${newFaqQuestion}`);
    showToast('New FAQ accordion card registered.');
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  // Blog CRUD
  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogSummary.trim()) return;
    const newBlg = {
      id: `BLG0${blogsList.length + 1}`,
      title: newBlogTitle,
      summary: newBlogSummary,
      author: 'Adarsh Jain',
      date: 'Today',
      views: 0,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400'
    };
    setBlogsList(prev => [...prev, newBlg]);
    logAction('Admin', 'Create', 'CMS', `Published blog article: ${newBlogTitle}`);
    showToast(`Blog post "${newBlogTitle}" published to website cms`);
    setNewBlogTitle('');
    setNewBlogSummary('');
  };

  // Testimonials moderation
  const moderateReview = (id, action) => {
    setTestimonialsList(prev => prev.map(t => {
      if (t.id === id) {
        logAction('Admin', 'Moderate', 'Reviews', `${action} customer review from ${t.reviewer}`);
        showToast(`Review status updated to: ${action}`);
        return { ...t, status: action };
      }
      return t;
    }));
  };

  // Supplier
  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierName.trim() || !newSupplierPhone.trim()) return;
    const newSup = {
      id: `SPL0${suppliersList.length + 1}`,
      name: newSupplierName,
      contact: 'General Account',
      phone: newSupplierPhone,
      address: 'Industrial Area, India',
      balance: Number(newSupplierBal),
      status: 'Active'
    };
    setSuppliersList(prev => [...prev, newSup]);
    logAction('Admin', 'Create', 'Suppliers', `Added B2B supplier profile: ${newSupplierName}`);
    showToast(`Supplier profile configured for ${newSupplierName}`);
    setNewSupplierName('');
    setNewSupplierPhone('');
    setNewSupplierBal(0);
  };

  // Delete helpers
  const deleteStaff = (id, name) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
    logAction('Admin', 'Delete', 'Staff', `Removed staff member ${name}`);
    showToast(`Staff member "${name}" removed.`, 'info');
  };

  const deleteCategory = (id, name) => {
    setCategoriesList(prev => prev.filter(c => c.id !== id));
    logAction('Admin', 'Delete', 'Catalog', `Deleted category: ${name}`);
    showToast(`Category "${name}" deleted.`, 'info');
  };

  const deleteBrand = (id, name) => {
    setBrandsList(prev => prev.filter(b => b.id !== id));
    logAction('Admin', 'Delete', 'Catalog', `Deleted brand partner: ${name}`);
    showToast(`Brand partner "${name}" deleted.`, 'info');
  };

  const deleteCoupon = (id, code) => {
    setCouponsList(prev => prev.filter(c => c.id !== id));
    logAction('Admin', 'Delete', 'Marketing', `Deleted promo voucher: ${code}`);
    showToast(`Coupon "${code}" deleted.`, 'info');
  };

  const deleteFaq = (id) => {
    setFaqsList(prev => prev.filter(f => f.id !== id));
    showToast('FAQ entry removed.', 'info');
  };

  const deleteBlog = (id, title) => {
    setBlogsList(prev => prev.filter(b => b.id !== id));
    showToast(`Blog article "${title}" deleted.`, 'info');
  };

  const deleteSupplier = (id, name) => {
    setSuppliersList(prev => prev.filter(s => s.id !== id));
    showToast(`Supplier "${name}" removed.`, 'info');
  };

  // Apps integration toggler
  const toggleAppIntegration = (id) => {
    setAppsList(prev => prev.map(app => {
      if (app.id === id) {
        const nextStatus = app.status === 'Active' ? 'Inactive' : 'Active';
        logAction('Admin', 'Integrate', 'AppStore', `Toggled ${app.name} service to ${nextStatus}`);
        showToast(`${app.name} status updated to ${nextStatus}`);
        return { ...app, status: nextStatus };
      }
      return app;
    }));
  };

  // Public Enquiries
  const resolveEnquiry = async (id, name, email) => {
    try {
      const response = await fetch(`/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo-token'}`
        },
        body: JSON.stringify({ status: 'Resolved' })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEnquiries(prev => prev.map(enq => enq._id === id ? { ...enq, status: 'Resolved' } : enq));
        logAction('Admin', 'Resolve', 'Enquiry', `Marked enquiry ticket #${id} from ${name} as Resolved`);
        showToast(`Ticket #${id.slice(-5)} marked as Resolved! draft auto-email logged to ${email}`);
      } else {
        throw new Error(data.message || 'Resolution failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const deleteEnquiryObj = async (id) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo-token'}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEnquiries(prev => prev.filter(enq => enq._id !== id));
        showToast('Enquiry ticket record deleted.');
      } else {
        throw new Error(data.message || 'Deletion failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // General config save
  const handleSaveStoreConfig = (e) => {
    e.preventDefault();
    logAction('Admin', 'Update', 'Config', 'Saved modified general storefront settings');
    showToast('Storefront configurations updated.');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs animate-in fade-in duration-200">
      
      {/* 1. STAFF AND ROLES */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-red-600" />
              Administrative Staff Directory
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure operator logins, suspend access, and edit staff authority levels.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Table */}
            <div className="lg:col-span-2 overflow-x-auto rounded-xl border">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                    <th className="p-3">Staff Operator</th>
                    <th className="p-3">Role Authority</th>
                    <th className="p-3">Access State</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold text-slate-700">
                  {staffList.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          s.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${s.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {s.status}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => toggleStaffStatus(s.id)}
                          className="text-[10px] font-black text-slate-700 hover:underline cursor-pointer"
                        >
                          {s.status === 'Active' ? 'Suspend' : 'Reinstate'}
                        </button>
                        <button
                          onClick={() => deleteStaff(s.id, s.name)}
                          className="text-[10px] font-black text-red-600 hover:text-red-700 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                          title="Remove staff member"
                        >
                          <Trash2 size={11} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Form */}
            <form onSubmit={handleAddStaff} className="p-5 border rounded-xl bg-slate-50/50 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Register New Staff Profile</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Operator Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none focus:border-red-500"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Login Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@itsaathi.in"
                  className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none focus:border-red-500"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Access Role Authority</label>
                <select
                  className="w-full text-xs font-bold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                >
                  <option value="staff">Standard Operator (Staff)</option>
                  <option value="manager">Catalog Manager (Manager)</option>
                  <option value="admin">System Administrator (Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle size={13} />
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. CATEGORIES AND BRANDS */}
      {(activeTab === 'categories' || activeTab === 'brands') && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Tag size={16} className="text-red-600" />
              Store Catalog Attributes ({activeTab === 'categories' ? 'Categories' : 'Brands'})
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure taxonomic segmentation, navigation display order priorities, and brand listing indices.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {activeTab === 'categories' ? (
              <>
                {/* Categories Table */}
                <div className="lg:col-span-2 overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                        <th className="p-3">Category Name</th>
                        <th className="p-3 text-center">Display Order</th>
                        <th className="p-3">Listing State</th>
                        <th className="p-3 text-right">Items</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-semibold text-slate-700">
                      {categoriesList.map(cat => (
                        <tr key={cat.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{cat.name}</td>
                          <td className="p-3 text-center font-mono">{cat.displayOrder}</td>
                          <td className="p-3">
                            <span className="inline-block h-2 w-2 rounded-full mr-1.5 bg-emerald-500" />
                            {cat.status}
                          </td>
                          <td className="p-3 text-right font-mono text-slate-400">{cat.count || 0}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteCategory(cat.id, cat.name)}
                              className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Categories Form */}
                <form onSubmit={handleAddCategory} className="p-5 border rounded-xl bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Add Taxonomy Category</h3>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CCTV IP Cameras"
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Add Category
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Brands Table */}
                <div className="lg:col-span-2 overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                        <th className="p-3">Brand Label</th>
                        <th className="p-3">Slug Filter</th>
                        <th className="p-3">Tax Description</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-semibold text-slate-700">
                      {brandsList.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{b.name}</td>
                          <td className="p-3 font-mono text-slate-400 text-[10px]">{b.slug}</td>
                          <td className="p-3 text-slate-500 max-w-xs truncate">{b.desc}</td>
                          <td className="p-3">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteBrand(b.id, b.name)}
                              className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                              title="Delete Brand"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Brands Form */}
                <form onSubmit={handleAddBrand} className="p-5 border rounded-xl bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Register Brand Partner</h3>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Brand Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CP PLUS"
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Tagline / Description</label>
                    <input
                      type="text"
                      placeholder="World-class security cameras"
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                      value={newBrandDesc}
                      onChange={(e) => setNewBrandDesc(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Register Brand
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      {/* 3. DISCOUNT COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Gift size={16} className="text-red-600" />
              Store Discount Coupons Console
            </h2>
            <p className="text-xs text-slate-400 mt-1">Formulate promotional discount voucher rules, track redemption frequencies, and test code validity.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Table */}
            <div className="lg:col-span-2 overflow-x-auto rounded-xl border">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Discount Value</th>
                    <th className="p-3 text-center">Min Order Required</th>
                    <th className="p-3 text-right">Redemptions</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold text-slate-700">
                  {couponsList.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <span className="font-mono font-black text-xs text-red-700 bg-red-50 border border-red-100 rounded px-1.5 py-0.5">{c.code}</span>
                      </td>
                      <td className="p-3">
                        {c.discountAmount}{c.discountType === 'percentage' ? '%' : ' ₹'} off
                      </td>
                      <td className="p-3 text-center font-mono">₹{c.minPurchase || 1000}</td>
                      <td className="p-3 text-right font-mono text-slate-400">
                        {c.usageCount || 0} / {c.maxUsage || 100}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteCoupon(c.id, c.code)}
                          className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Coupon Test validation widget */}
              <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                  <Sliders size={14} className="text-slate-400" />
                  <span>Sandbox Coupon Validation Tool:</span>
                </div>
                <div className="flex gap-1.5 w-full sm:w-auto shrink-0">
                  <input
                    type="text"
                    className="rounded-lg border px-2.5 py-1 text-xs font-mono font-bold bg-white focus:outline-none focus:border-red-500 uppercase w-32"
                    placeholder="e.g. ITSAATHI10"
                    value={testCouponInput}
                    onChange={(e) => setTestCouponInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleTestCoupon}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>
              {testResult && (
                <div className="p-3 bg-red-50/50 border-t border-dashed text-xs text-red-800 font-bold flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{testResult}</span>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleAddCoupon} className="p-5 border rounded-xl bg-slate-50/50 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Configure Voucher Code</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Voucher String Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SECURITY15"
                  className="w-full text-xs font-mono font-black rounded-lg border px-3 py-2 bg-white focus:outline-none focus:border-red-500 uppercase"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Discount Deduction</label>
                  <input
                    type="number"
                    required
                    className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none focus:border-red-500"
                    value={newCouponAmount}
                    onChange={(e) => setNewCouponAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Discount Type</label>
                  <select
                    className="w-full text-xs font-bold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value)}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Value (₹)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                Compile Voucher Code
              </button>
            </form>

          </div>
        </div>
      )}

      {/* 4. CASHBACK CONFIGURATIONS */}
      {activeTab === 'cashbacks' && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Gift size={16} className="text-red-600" />
              Customer Cashback & Rewards Configurator
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure automated cashback reward sliders, check ledgers, and manually credit loyalty rewards points.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* General Rules */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Slider */}
              <div className="rounded-xl border p-5 bg-slate-50">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex justify-between items-center">
                  <span>Loyalty cashback award rate</span>
                  <span className="text-red-700 text-sm font-black">{cashbackPercent}% Reward</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">Every checkout order generates a pending reward credit calculated from this percentage multiplier.</p>
                
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 mt-5"
                  value={cashbackPercent}
                  onChange={handleCashbackSlider}
                />
                
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
                  <span>0% (Disabled)</span>
                  <span>5% Recommended</span>
                  <span>10% Max Limit</span>
                </div>
              </div>

              {/* Ledger list */}
              <div className="rounded-xl border overflow-hidden">
                <div className="p-4 bg-slate-50 border-b">
                  <h4 className="font-bold text-slate-800 text-xs uppercase">Simulated customer cashback balances</h4>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 border-b font-bold text-slate-400 uppercase">
                      <th className="p-3">Customer Reference</th>
                      <th className="p-3">Primary Phone</th>
                      <th className="p-3 text-right">Available Cashback Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-semibold text-slate-700">
                    {[
                      { id: 'CUST-1029', name: 'Shivam Gupta (Delhi Electronics)', phone: '+91 80060 33345', bal: 345 },
                      { id: 'CUST-2934', name: 'Alok Khandelwal', phone: '+91 98765 43210', bal: 120 },
                      { id: 'CUST-4912', name: 'Sumit Agrawal', phone: '+91 99112 23344', bal: 0 }
                    ].map(u => (
                      <tr key={u.id}>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {u.id}</div>
                        </td>
                        <td className="p-3 text-slate-500 font-mono">{u.phone}</td>
                        <td className="p-3 text-right font-black text-emerald-600 text-xs">₹{u.bal} Available</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Manual credit Form */}
            <form onSubmit={handleAdjustCashback} className="p-5 border rounded-xl bg-slate-50/50 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Manual Balance Credit</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Target Customer ID / Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CUST-1029"
                  className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                  value={adjustCashbackUserId}
                  onChange={(e) => setAdjustCashbackUserId(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Adjustment Amount (₹)</label>
                <input
                  type="number"
                  required
                  className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                  value={adjustCashbackAmount}
                  onChange={(e) => setAdjustCashbackAmount(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                Apply Balance Adjustment
              </button>
            </form>

          </div>
        </div>
      )}

      {/* 5. CMS FAQ & CMS BLOG & REVIEW MODERATION */}
      {(activeTab === 'faq' || activeTab === 'blog' || activeTab === 'testimonials') && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-red-600" />
              Store CMS & Testimonials Moderation ({activeTab.toUpperCase()})
            </h2>
            <p className="text-xs text-slate-400 mt-1">Author marketing blog articles, curate collapsible FAQ accordions, and approve/reject user product reviews.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* FAQ Submodule */}
            {activeTab === 'faq' && (
              <>
                {/* FAQs Table Accordion preview */}
                <div className="lg:col-span-2 space-y-4">
                  {faqsList.map(faq => (
                    <div key={faq.id} className="rounded-xl border p-4 bg-slate-50/50 relative group">
                      <div className="font-black text-slate-900 text-xs flex justify-between items-start gap-4 pr-6">
                        <span>Q: {faq.question}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">#{faq.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed italic">A: {faq.answer}</p>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-600 transition p-1 cursor-pointer"
                        title="Delete FAQ"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* FAQ Form */}
                <form onSubmit={handleAddFaq} className="p-5 border rounded-xl bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Create FAQ Accordion Card</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Question title string</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Do adaptors carry warranty?"
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Detailed answer text</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="e.g. Yes, our professional adaptive lines..."
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none resize-none"
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Confirm Card Creation
                  </button>
                </form>
              </>
            )}

            {/* Blog CMS Submodule */}
            {activeTab === 'blog' && (
              <>
                {/* Blogs list */}
                <div className="lg:col-span-2 space-y-4">
                  {blogsList.map(b => (
                    <div key={b.id} className="rounded-xl border p-4 bg-white flex gap-4 items-start shadow-2xs relative group">
                      {b.image && (
                        <img src={b.image} alt={b.title} className="h-16 w-24 rounded-lg object-cover border shrink-0 bg-slate-100" />
                      )}
                      <div className="space-y-1 flex-1 pr-6">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span>By {b.author} | {b.date}</span>
                          <span>{b.views} Views</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">{b.title}</h4>
                        <p className="text-slate-500 text-[11px] line-clamp-2">{b.summary}</p>
                      </div>
                      <button
                        onClick={() => deleteBlog(b.id, b.title)}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-600 transition p-1 cursor-pointer"
                        title="Delete Blog Post"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Blog editor Form */}
                <form onSubmit={handleAddBlog} className="p-5 border rounded-xl bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Publish Blog Post</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Article Headline Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Choosing the compatible IP Camera"
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Article Synopsis Summary</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Provide quick key paragraphs..."
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:outline-none resize-none"
                      value={newBlogSummary}
                      onChange={(e) => setNewBlogSummary(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Publish Article
                  </button>
                </form>
              </>
            )}

            {/* Testimonials Moderation */}
            {activeTab === 'testimonials' && (
              <div className="lg:col-span-3 overflow-x-auto rounded-xl border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                      <th className="p-3">Reviewer Details</th>
                      <th className="p-3">Rated Device</th>
                      <th className="p-3">Feedback Review Message</th>
                      <th className="p-3">Moderate State</th>
                      <th className="p-3 text-right">Moderator Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-semibold text-slate-700">
                    {testimonialsList.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{t.reviewer}</div>
                          <div className="text-[10px] font-bold text-amber-500 mt-0.5">{'★'.repeat(t.rating)}</div>
                        </td>
                        <td className="p-3 font-bold text-slate-500">{t.product}</td>
                        <td className="p-3 text-slate-600 max-w-sm font-medium leading-relaxed italic">"{t.review}"</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 shrink-0">
                          {t.status !== 'Approved' && (
                            <button
                              onClick={() => moderateReview(t.id, 'Approved')}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => moderateReview(t.id, 'Spam')}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded cursor-pointer"
                          >
                            Spam
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 6. B2B SUPPLIERS AND LOGISTICS */}
      {(activeTab === 'suppliers' || activeTab === 'logistics') && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck size={16} className="text-red-600" />
              Procurement & Freight Management ({activeTab.toUpperCase()})
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure localized logistics delivery matrices and track outstanding trade dues of partner manufacturing units.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {activeTab === 'suppliers' ? (
              <>
                {/* Table */}
                <div className="lg:col-span-2 overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                        <th className="p-3">Procurement Unit</th>
                        <th className="p-3">Primary Phone</th>
                        <th className="p-3">Office Location</th>
                        <th className="p-3 text-right">Outstanding Trade Dues</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-semibold text-slate-700">
                      {suppliersList.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{s.name}</td>
                          <td className="p-3 text-slate-500 font-mono">{s.phone}</td>
                          <td className="p-3 text-slate-400">{s.address}</td>
                          <td className="p-3 text-right font-black text-red-700 font-mono">
                            ₹{s.balance.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteSupplier(s.id, s.name)}
                              className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                              title="Delete Supplier"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Form */}
                <form onSubmit={handleAddSupplier} className="p-5 border rounded-xl bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Register Procurement Supplier</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Supplier Firm Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hikvision India Corp"
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white"
                      value={newSupplierName}
                      onChange={(e) => setNewSupplierName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Mobile Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 99887 76655"
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white"
                      value={newSupplierPhone}
                      onChange={(e) => setNewSupplierPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Opening outstanding Balance (₹)</label>
                    <input
                      type="number"
                      className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white"
                      value={newSupplierBal}
                      onChange={(e) => setNewSupplierBal(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Configure Supplier
                  </button>
                </form>
              </>
            ) : (
              <div className="lg:col-span-3 space-y-4">
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                        <th className="p-3">Freight Carrier Name</th>
                        <th className="p-3 text-center">Consignment Shipping Fee</th>
                        <th className="p-3">Estimated Transit time</th>
                        <th className="p-3 text-right">Channel Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-semibold text-slate-700">
                      {logisticsZones.map(l => (
                        <tr key={l.id}>
                          <td className="p-3 font-bold text-slate-900">{l.partner}</td>
                          <td className="p-3 text-center font-mono font-black text-red-700">₹{l.rate}</td>
                          <td className="p-3 text-slate-500 italic">{l.estDays}</td>
                          <td className="p-3 text-right">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 7. CUSTOMER ENQUIRIES */}
      {activeTab === 'enquiry' && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Mail size={16} className="text-red-600" />
              Store Public Contact Enquiries Registry
            </h2>
            <p className="text-xs text-slate-400 mt-1">Review callback requests and public messages submitted via website forms.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            {enquiries.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold text-xs">
                No active contact enquiries listed yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                    <th className="p-3">Submitter Details</th>
                    <th className="p-3">Requirement / Inquiry Type</th>
                    <th className="p-3">Public Message Text</th>
                    <th className="p-3">Callback?</th>
                    <th className="p-3">Tracking State</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold text-slate-700">
                  {enquiries.map(enq => (
                    <tr key={enq._id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{enq.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{enq.email}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{enq.phone}</div>
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-600">
                          {enq.inquiryType || 'General Inquiry'}
                        </span>
                        <div className="text-[10px] text-slate-500 font-bold mt-1">Req: {enq.productRequirement || 'N/A'}</div>
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs leading-relaxed italic">"{enq.message}"</td>
                      <td className="p-3">
                        {enq.needCallback ? (
                          <span className="text-red-600 font-bold">Yes, Call Back</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          enq.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {enq.status || 'New'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5 shrink-0">
                        {enq.status !== 'Resolved' && (
                          <button
                            onClick={() => resolveEnquiry(enq._id, enq.name, enq.email)}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => deleteEnquiryObj(enq._id)}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                          title="Delete Enquiry Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 8. GENERAL STORE CONFIGURATIONS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Settings size={16} className="text-red-600" />
              General Storefront Settings Console
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure general metadata parameters, system safety stock reorder thresholds, and support contacts.</p>
          </div>

          <form onSubmit={handleSaveStoreConfig} className="max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Enterprise Store Label</label>
                <input
                  type="text"
                  className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-slate-50"
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Integrated CGST / GST Rate (%)</label>
                <input
                  type="number"
                  className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-slate-50"
                  value={storeSettings.gstRate}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, gstRate: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Support Telephone</label>
                <input
                  type="text"
                  className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-slate-50"
                  value={storeSettings.storePhone}
                  onChange={(e) => setSessionStorage(prev => ({ ...prev, storePhone: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Administrative Support Email</label>
                <input
                  type="email"
                  className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-slate-50"
                  value={storeSettings.storeEmail}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Global Low-Stock Warning Threshold</label>
              <input
                type="number"
                className="w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-slate-50"
                value={storeSettings.lowStockLimit}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, lowStockLimit: Number(e.target.value) }))}
              />
              <p className="text-[10px] text-slate-400">Products with physical quantities below this value generate alert tags in the warehouse registry.</p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Save Configurations
            </button>
          </form>
        </div>
      )}

      {/* 9. APP STORE INTEGRATIONS */}
      {activeTab === 'app_store' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Globe size={16} className="text-red-600" />
              Administrative Apps Integration Directory
            </h2>
            <p className="text-xs text-slate-400 mt-1">Activate third-party customer chat triggers, SMS OTP gateways, and credit card checkout tunnels.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appsList.map(app => (
              <div key={app.id} className="rounded-xl border p-4 hover:shadow-sm transition flex gap-4 bg-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 shrink-0 border">
                  <Globe size={18} />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-900 text-xs leading-none">{app.name}</h4>
                    <button
                      onClick={() => toggleAppIntegration(app.id)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        app.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {app.status === 'Active' ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider inline-block">{app.category}</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{app.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. SYSTEM ACTIVITY LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="border-b pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-red-600" />
              Security Compliance & Action Audit Trail
            </h2>
            <p className="text-xs text-slate-400 mt-1">Review diagnostic logs recording staff operations and configurations adjustments.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-400 uppercase">
                  <th className="p-3">Log Docket</th>
                  <th className="p-3">Staff Operator</th>
                  <th className="p-3">Target Module</th>
                  <th className="p-3">Action Details</th>
                  <th className="p-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono font-bold text-slate-500">
                {systemLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-400">{l.id}</td>
                    <td className="p-3 font-sans text-slate-800 font-bold">{l.user}</td>
                    <td className="p-3 font-sans"><span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{l.module}</span></td>
                    <td className="p-3 font-sans text-slate-600 font-medium">{l.details}</td>
                    <td className="p-3 text-right text-[10px]">
                      {new Date(l.date).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
