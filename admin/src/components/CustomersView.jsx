import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Gift,
  Award,
  AlertTriangle,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  Building,
  TrendingUp,
  Percent,
  Download,
  Upload,
  Pencil,
  Trash2
} from 'lucide-react';
import ImportModal from './ImportModal.jsx';
import ExportModal from './ExportModal.jsx';
import EditCustomerModal from './EditCustomerModal.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import { customerExportColumns, sampleCustomerTemplate } from '../utils/dataTransfer.js';

export default function CustomersView({
  customers = [],
  setCustomers,
  isFetchingCustomers = false,
  fetchCustomers,
  showToast,
  initialSubTab = 'all' // 'all', 'pending_approval', 'dead', 'referral', 'pending_reg'
}) {
  const [subTab, setSubTab] = useState(initialSubTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Import / Export modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Edit / Delete modal states
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  // Local state for dynamic list of customers to allow mock approvals/updates
  const [localCustomers, setLocalCustomers] = useState([]);

  // Sync with prop when fetched
  useEffect(() => {
    if (customers.length > 0) {
      setLocalCustomers(customers);
    } else {
      // Fallback robust mock dataset if server database is empty or running offline
      setLocalCustomers([
        {
          _id: 'CUST-1029',
          name: 'Shivam Gupta',
          email: 'shivam.delhi@gmail.com',
          phone: '+91 80060 33345',
          role: 'wholesaler',
          status: 'Active',
          companyName: 'Delhi Electronics & CCTV Solutions',
          gstin: '07AAAAA1111A1Z1',
          createdAt: '2026-05-10T08:00:00.000Z',
          cashbackBalance: 345,
          orderCount: 14,
          totalSpent: 85400,
          referralCount: 3,
          lastActive: '2026-07-21T09:00:00.000Z'
        },
        {
          _id: 'CUST-2934',
          name: 'Alok Khandelwal',
          email: 'alok.khandelwal@yahoo.com',
          phone: '+91 98765 43210',
          role: 'retailer',
          status: 'Active',
          companyName: '',
          gstin: '',
          createdAt: '2026-06-18T10:30:00.000Z',
          cashbackBalance: 120,
          orderCount: 4,
          totalSpent: 12500,
          referralCount: 1,
          lastActive: '2026-07-20T14:22:00.000Z'
        },
        {
          _id: 'CUST-4912',
          name: 'Sumit Agrawal',
          email: 'sumit.wiring@outlook.com',
          phone: '+91 99112 23344',
          role: 'retailer',
          status: 'Suspended',
          companyName: '',
          gstin: '',
          createdAt: '2026-04-12T11:45:00.000Z',
          cashbackBalance: 0,
          orderCount: 0,
          totalSpent: 0,
          referralCount: 0,
          lastActive: '2026-05-30T10:00:00.000Z'
        },
        {
          _id: 'CUST-5012',
          name: 'Harish Chandra Tech',
          email: 'harish.cctv@gmail.com',
          phone: '+91 91234 56789',
          role: 'wholesaler',
          status: 'Pending',
          companyName: 'Harish Security Systems',
          gstin: '09BCDE1234F1Z5',
          createdAt: '2026-07-21T04:12:00.000Z',
          cashbackBalance: 0,
          orderCount: 0,
          totalSpent: 0,
          referralCount: 0,
          lastActive: '2026-07-21T04:12:00.000Z'
        },
        {
          _id: 'CUST-6104',
          name: 'Narendra Singh',
          email: 'nsingh.networking@gmail.com',
          phone: '+91 95432 10987',
          role: 'retailer',
          status: 'Active',
          companyName: '',
          gstin: '',
          createdAt: '2026-01-15T09:00:00.000Z',
          cashbackBalance: 450,
          orderCount: 22,
          totalSpent: 145000,
          referralCount: 8,
          lastActive: '2026-07-21T11:30:00.000Z'
        },
        {
          _id: 'CUST-7088',
          name: 'Vijay Kumar CCTV',
          email: 'vijay.kumar@gmail.com',
          phone: '+91 88776 65544',
          role: 'customer',
          status: 'Active',
          companyName: '',
          gstin: '',
          createdAt: '2025-11-20T10:00:00.000Z',
          cashbackBalance: 15,
          orderCount: 1,
          totalSpent: 2100,
          referralCount: 0,
          lastActive: '2026-03-12T08:15:00.000Z' // Dead customer
        },
        {
          _id: 'CUST-9128',
          name: 'Suresh Cables Store',
          email: 'suresh.accessories@gmail.com',
          phone: '+91 77665 54433',
          role: 'wholesaler',
          status: 'PendingApproval',
          companyName: 'Suresh Cable & Conduits Store',
          gstin: '07CHIPP4567M1Z9',
          createdAt: '2026-07-20T15:40:00.000Z',
          cashbackBalance: 0,
          orderCount: 0,
          totalSpent: 0,
          referralCount: 0,
          lastActive: '2026-07-20T15:40:00.000Z'
        }
      ]);
    }
  }, [customers]);

  // Handle Tab Switch from parent submenus
  useEffect(() => {
    setSubTab(initialSubTab);
    setCurrentPage(1);
  }, [initialSubTab]);

  // Actions
  const approveWholesaler = (id) => {
    setLocalCustomers(prev =>
      prev.map(c => c._id === id ? { ...c, role: 'wholesaler', status: 'Active' } : c)
    );
    showToast('Customer B2B trade account approved! Wholesaler status is active.');
  };

  const suspendCustomer = (id) => {
    setLocalCustomers(prev =>
      prev.map(c => c._id === id ? { ...c, status: 'Suspended' } : c)
    );
    showToast('Customer login session suspended.', 'error');
  };

  const activateCustomer = (id) => {
    setLocalCustomers(prev =>
      prev.map(c => c._id === id ? { ...c, status: 'Active' } : c)
    );
    showToast('Customer login restored to active state.');
  };

  const adjustCashback = (id, amount) => {
    setLocalCustomers(prev =>
      prev.map(c => {
        if (c._id === id) {
          const current = c.cashbackBalance || 0;
          const next = Math.max(0, current + amount);
          showToast(`Adjusted cashback balance for ${c.name}: ₹${next}`);
          const updated = { ...c, cashbackBalance: next };
          return updated;
        }
        return c;
      })
    );
  };

  // Customer Edit Save Handler
  const handleSaveCustomer = (updatedCustomer) => {
    setLocalCustomers(prev => {
      const next = prev.map(c => c._id === updatedCustomer._id ? updatedCustomer : c);
      localStorage.setItem('admin_customers', JSON.stringify(next));
      if (setCustomers) setCustomers(next);
      return next;
    });
    showToast(`Customer profile "${updatedCustomer.name}" updated successfully!`);
  };

  // Customer Delete Handler
  const handleDeleteCustomer = () => {
    if (!deletingCustomer) return;
    const custId = deletingCustomer._id;
    const custName = deletingCustomer.name;
    setLocalCustomers(prev => {
      const next = prev.filter(c => c._id !== custId);
      localStorage.setItem('admin_customers', JSON.stringify(next));
      if (setCustomers) setCustomers(next);
      return next;
    });
    showToast(`Customer account "${custName}" deleted!`, 'info');
    setDeletingCustomer(null);
  };

  // Filter Logic based on subTab
  const filtered = localCustomers.filter(c => {
    // Search filter
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole = selectedRole === 'All' || c.role === selectedRole.toLowerCase();

    if (!matchesSearch || !matchesRole) return false;

    // Subtab filter
    if (subTab === 'pending_approval' || subTab === 'pending_reg') {
      return c.status === 'Pending' || c.status === 'PendingApproval';
    }
    if (subTab === 'dead') {
      // Last active > 60 days ago
      if (!c.lastActive) return true;
      const lastActiveDate = new Date(c.lastActive);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      return lastActiveDate < sixtyDaysAgo;
    }
    if (subTab === 'referral') {
      return (c.referralCount || 0) > 0;
    }

    return true;
  });

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, subTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Directory & B2B Console</h1>
          <p className="text-slate-500 text-sm">
            Manage Wholesalers and Retailers, approve B2B trade account requests, track loyalty cashbacks and review active referral metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition"
            title="Export customers to CSV or JSON"
          >
            <Download size={14} className="text-red-600" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 font-bold text-xs py-2.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition"
            title="Import customers from CSV or JSON"
          >
            <Upload size={14} />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Segment tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {[
          { id: 'all', label: 'All Customers', count: localCustomers.length },
          { id: 'pending_reg', label: 'Pending Approvals', count: localCustomers.filter(c => c.status === 'Pending' || c.status === 'PendingApproval').length, alert: true },
          { id: 'dead', label: 'Dead Customers', count: localCustomers.filter(c => {
            if (!c.lastActive) return true;
            return new Date(c.lastActive) < new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
          }).length },
          { id: 'referral', label: 'Referral Program', count: localCustomers.filter(c => (c.referralCount || 0) > 0).length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              subTab === tab.id
                ? 'border-red-600 text-red-700 bg-red-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              tab.alert && tab.count > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, phone or company details..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 transition focus:border-red-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white focus:outline-none"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="All">All Tiers</option>
              <option value="Customer">Retail Customer</option>
              <option value="Retailer">Retailer</option>
              <option value="Wholesaler">Wholesaler Partner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {isFetchingCustomers ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-slate-200 border-t-red-600 mb-3" />
            <p className="text-xs font-bold text-slate-500">Retrieving customers records...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="py-16 text-center bg-white">
            <Users className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-sm font-bold text-slate-900">No Customers Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              No registered profiles match the active segmentation filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4">Customer Details</th>
                  <th className="px-5 py-4">Trade Company Details</th>
                  <th className="px-5 py-4">Status & Tier</th>
                  <th className="px-5 py-4 text-center">Checkout metrics</th>
                  <th className="px-5 py-4 text-right">Cashback Balance</th>
                  {subTab === 'referral' && <th className="px-5 py-4 text-center">Referrals Logged</th>}
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {currentItems.map((c) => {
                  let statusBg = 'bg-slate-100 text-slate-600';
                  if (c.status === 'Active') statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  else if (c.status === 'Suspended') statusBg = 'bg-red-50 text-red-600 border-red-200';
                  else if (c.status === 'Pending' || c.status === 'PendingApproval') statusBg = 'bg-amber-50 text-amber-700 border-amber-200';

                  const isWholesalerRequest = c.status === 'Pending' || c.status === 'PendingApproval';

                  return (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition items-start align-top">
                      {/* Name, email, phone */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                          <Mail size={10} className="text-slate-400" />
                          <span>{c.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <Phone size={10} className="text-slate-400" />
                          <span>{c.phone || 'N/A'}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1 font-bold">
                          REG: {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>

                      {/* Company Name & GSTIN */}
                      <td className="px-5 py-4">
                        {c.companyName ? (
                          <div className="space-y-1">
                            <div className="font-bold text-slate-800 flex items-center gap-1">
                              <Building size={11} className="text-red-500" />
                              <span>{c.companyName}</span>
                            </div>
                            {c.gstin && (
                              <div className="font-mono text-[10px] text-slate-500 font-bold bg-slate-50 border rounded p-1 px-1.5 inline-block">
                                GSTIN: {c.gstin}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">B2C Retail Individual</span>
                        )}
                      </td>

                      {/* Role & status */}
                      <td className="px-5 py-4 space-y-1.5">
                        <div>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${statusBg}`}>
                            {c.status === 'PendingApproval' ? 'Pending Approval' : c.status}
                          </span>
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                            c.role === 'wholesaler'
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {c.role === 'wholesaler' ? '★ Wholesale partner' : 'Retailer'}
                          </span>
                        </div>
                      </td>

                      {/* Orders Count and spent */}
                      <td className="px-5 py-4 text-center">
                        <div className="font-bold text-slate-900">{c.orderCount || 0} orders</div>
                        <div className="text-[11px] text-slate-400 font-bold mt-0.5">₹{(c.totalSpent || 0).toLocaleString('en-IN')} billing</div>
                      </td>

                      {/* Cashback Balance */}
                      <td className="px-5 py-4 text-right">
                        <div className="font-black text-emerald-600 text-sm">₹{c.cashbackBalance || 0}</div>
                        <div className="flex justify-end gap-1 mt-1">
                          <button
                            onClick={() => adjustCashback(c._id, 100)}
                            className="text-[9px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border rounded px-1 py-0.5 font-bold transition"
                          >
                            +₹100
                          </button>
                          <button
                            onClick={() => adjustCashback(c._id, -100)}
                            className="text-[9px] bg-slate-100 hover:bg-red-50 hover:text-red-700 border rounded px-1 py-0.5 font-bold transition"
                          >
                            -₹100
                          </button>
                        </div>
                      </td>

                      {/* Referral details (Optional) */}
                      {subTab === 'referral' && (
                        <td className="px-5 py-4 text-center">
                          <div className="font-black text-purple-700 flex items-center justify-center gap-1 text-sm">
                            <Award size={12} />
                            <span>{c.referralCount || 0} users</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">₹{Math.round((c.referralCount || 0) * 200)} pending reward</div>
                        </td>
                      )}

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingCustomer(c)}
                            className="rounded-xl px-2.5 py-1.5 text-[10px] font-bold transition inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-2xs cursor-pointer"
                            title="Edit customer information, role, balance, gstin"
                          >
                            <Pencil size={11} className="text-blue-600" />
                            <span>Edit</span>
                          </button>

                          {isWholesalerRequest ? (
                            <>
                              <button
                                onClick={() => approveWholesaler(c._id)}
                                className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-lg p-1.5 px-2.5 transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                              >
                                <UserCheck size={11} />
                                <span>Approve B2B</span>
                              </button>
                              <button
                                onClick={() => suspendCustomer(c._id)}
                                className="border border-slate-200 hover:bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg p-1.5 px-2 transition cursor-pointer"
                              >
                                Deny
                              </button>
                            </>
                          ) : (
                            <>
                              {c.status === 'Active' ? (
                                <button
                                  onClick={() => suspendCustomer(c._id)}
                                  className="border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold rounded-lg p-1 px-2 transition inline-flex items-center gap-1 cursor-pointer"
                                  title="Suspend operator access"
                                >
                                  <UserX size={11} />
                                  <span>Suspend</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => activateCustomer(c._id)}
                                  className="border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold rounded-lg p-1 px-2 transition inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <UserCheck size={11} />
                                  <span>Activate</span>
                                </button>
                              )}
                            </>
                          )}

                          <button
                            onClick={() => setDeletingCustomer(c)}
                            className="rounded-xl p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition inline-flex items-center justify-center cursor-pointer"
                            title="Delete customer permanently"
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

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-4">
            <span className="text-[11px] font-bold text-slate-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} profiles
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft size={14} />
              </button>

              <span className="text-[11px] font-bold text-slate-700 px-1">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Import Modal */}
      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="customers"
          onImportSuccess={(importedRows, mode) => {
            if (mode === 'merge') {
              setLocalCustomers(prev => {
                const merged = [...prev];
                importedRows.forEach((newC) => {
                  const idx = merged.findIndex(c => c._id === newC._id || c.email === newC.email);
                  if (idx >= 0) {
                    merged[idx] = { ...merged[idx], ...newC };
                  } else {
                    merged.push(newC);
                  }
                });
                localStorage.setItem('admin_customers', JSON.stringify(merged));
                return merged;
              });
            } else {
              setLocalCustomers(prev => {
                const appended = [...prev, ...importedRows];
                localStorage.setItem('admin_customers', JSON.stringify(appended));
                return appended;
              });
            }
          }}
          sampleTemplate={sampleCustomerTemplate}
          sampleColumns={customerExportColumns}
          sampleFileName="customers_sample_template.csv"
          showToast={showToast}
        />
      )}

      {/* Customer Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          type="customers"
          data={localCustomers}
          filteredData={filtered}
          columns={customerExportColumns}
          fileNamePrefix="IT_SAATHI_Customers"
          showToast={showToast}
        />
      )}

      {/* Edit Customer Profile Modal */}
      {editingCustomer && (
        <EditCustomerModal
          isOpen={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          showToast={showToast}
        />
      )}

      {/* Delete Customer Confirmation Modal */}
      {deletingCustomer && (
        <DeleteConfirmModal
          isOpen={!!deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={handleDeleteCustomer}
          title="Delete Customer Account"
          message="Are you sure you want to permanently delete this customer account? All association history, billing records, and cashback wallet balances will be removed."
          itemName={deletingCustomer.name}
          itemDetail={`${deletingCustomer.email} • Role: ${deletingCustomer.role} • Status: ${deletingCustomer.status}`}
        />
      )}
    </div>
  );
}
