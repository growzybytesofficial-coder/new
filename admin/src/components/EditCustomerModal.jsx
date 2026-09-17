import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  Building,
  AlertCircle,
  ShieldCheck,
  Award,
  Wallet
} from 'lucide-react';

export default function EditCustomerModal({
  isOpen,
  onClose,
  customer,
  onSave,
  showToast
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'retailer',
    status: 'Active',
    companyName: '',
    gstin: '',
    cashbackBalance: 0,
    orderCount: 0,
    totalSpent: 0
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        role: customer.role || 'retailer',
        status: customer.status || 'Active',
        companyName: customer.companyName || '',
        gstin: customer.gstin || '',
        cashbackBalance: customer.cashbackBalance !== undefined ? customer.cashbackBalance : 0,
        orderCount: customer.orderCount !== undefined ? customer.orderCount : 0,
        totalSpent: customer.totalSpent !== undefined ? customer.totalSpent : 0
      });
      setErrorMsg('');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Customer name is required');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Email address is required');
      return;
    }

    const updatedCustomer = {
      ...customer,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      status: formData.status,
      companyName: formData.companyName.trim(),
      gstin: formData.gstin.trim().toUpperCase(),
      cashbackBalance: Number(formData.cashbackBalance) || 0,
      orderCount: Number(formData.orderCount) || 0,
      totalSpent: Number(formData.totalSpent) || 0
    };

    onSave(updatedCustomer);
    onClose();
  };

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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-base font-black">Edit Customer Account</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  ID: {customer._id}
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
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 80060 33345"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Account Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                >
                  <option value="retailer">Retailer / Direct Buyer</option>
                  <option value="wholesaler">Wholesaler / Trade Partner</option>
                  <option value="installer">Technician / CCTV Installer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                >
                  <option value="Active">Active</option>
                  <option value="PendingApproval">Pending Approval</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Company and GSTIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Business / Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Ramesh Surveillance & Networks"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  GSTIN Number
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-900 uppercase"
                />
              </div>
            </div>

            {/* Financials & metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Cashback Wallet Balance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.cashbackBalance}
                  onChange={(e) => setFormData({ ...formData, cashbackBalance: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-black text-xs text-emerald-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Total Orders Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.orderCount}
                  onChange={(e) => setFormData({ ...formData, orderCount: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-xs text-slate-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Lifetime Spent (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalSpent}
                  onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-black text-xs text-slate-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>
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
                Save Customer Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
