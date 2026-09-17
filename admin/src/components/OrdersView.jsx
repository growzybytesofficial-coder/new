import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Trash2,
  X,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  Truck,
  Download,
  Upload
} from 'lucide-react';
import ExportModal from './ExportModal.jsx';
import ImportModal from './ImportModal.jsx';
import { orderExportColumns } from '../utils/dataTransfer.js';

export default function OrdersView({
  orders,
  setOrders,
  isFetchingOrders,
  orderSearchTerm,
  setOrderSearchTerm,
  orderStatusFilter,
  setOrderStatusFilter,
  updateOrderStatus,
  deleteOrder,
  showToast,
  onGenerateTaxInvoice
}) {
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Export / Import modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Search/Filter logic
  const filteredOrders = orders.filter((o) => {
    const customerField = (o.customerName || '').toLowerCase();
    const emailField = (o.customerEmail || '').toLowerCase();
    const phoneField = (o.customerPhone || '').toLowerCase();
    const idField = (o.orderId || '').toLowerCase();
    const term = orderSearchTerm.toLowerCase();

    const matchesSearch = 
      customerField.includes(term) || 
      emailField.includes(term) || 
      phoneField.includes(term) || 
      idField.includes(term);

    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const openInvoiceModal = (order) => {
    setSelectedOrderForInvoice(order);
    setTrackingNumber(order.trackingNumber || '');
    setPrivateNote(order.privateNote || '');
  };

  const handleSaveInvoiceDetails = () => {
    if (!selectedOrderForInvoice) return;
    
    // Save locally to selected order
    selectedOrderForInvoice.trackingNumber = trackingNumber;
    selectedOrderForInvoice.privateNote = privateNote;

    showToast(`Invoice tracking updated for order ${selectedOrderForInvoice.orderId}`);
    setSelectedOrderForInvoice(null);
  };

  const triggerPrint = () => {
    if (!selectedOrderForInvoice) return;

    const o = selectedOrderForInvoice;
    const dateStr = new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const itemsRows = (o.items || []).map((it, idx) => {
      const lineSubtotal = (it.price * it.qty);
      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 10px; color: #64748b; font-family: monospace;">${idx + 1}</td>
          <td style="padding: 8px 10px; font-weight: 700; color: #0f172a;">${it.name || 'Product'}</td>
          <td style="padding: 8px 10px; text-align: center; font-family: monospace;">₹${Number(it.price || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 8px 10px; text-align: center; font-weight: 700;">${it.qty || 1}</td>
          <td style="padding: 8px 10px; text-align: right; font-family: monospace; font-weight: 700;">₹${lineSubtotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('');

    const taxableVal = Math.max(0, (o.totalAmount || 0) - 49);

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice - ${o.orderId || 'Order'}</title>
          <style>
            @page {
              size: A4;
              margin: 12mm;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 0;
              font-size: 12px;
              line-height: 1.4;
              background: #fff;
            }
            .invoice-card {
              max-width: 800px;
              margin: 0 auto;
              padding: 24px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .brand-name {
              font-size: 22px;
              font-weight: 900;
              color: #c8102e;
              letter-spacing: 0.5px;
              margin: 0;
            }
            .brand-tagline {
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              color: #64748b;
              letter-spacing: 1px;
              margin-top: 2px;
            }
            .brand-contact {
              font-size: 11px;
              color: #64748b;
              margin-top: 8px;
              line-height: 1.5;
            }
            .badge {
              display: inline-block;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 4px 10px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              color: #334155;
            }
            .order-meta {
              text-align: right;
              margin-top: 10px;
              font-size: 11px;
            }
            .order-ref {
              font-weight: 900;
              color: #c8102e;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 20px;
            }
            .section-label {
              font-size: 9px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #94a3b8;
              margin-bottom: 4px;
            }
            .cust-name {
              font-size: 14px;
              font-weight: 800;
              color: #0f172a;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background: #f1f5f9;
              border-bottom: 2px solid #cbd5e1;
              padding: 8px 10px;
              text-align: left;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              color: #475569;
            }
            .totals-container {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-top: 1px solid #e2e8f0;
              padding-top: 16px;
            }
            .thankyou-note {
              max-width: 320px;
              font-style: italic;
              color: #64748b;
              font-size: 11px;
            }
            .totals-table {
              width: 220px;
              font-size: 12px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 3px 0;
              color: #475569;
              font-weight: 600;
            }
            .grand-total {
              border-top: 2px dashed #cbd5e1;
              padding-top: 6px;
              margin-top: 6px;
              font-size: 14px;
              font-weight: 900;
              color: #c8102e;
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div>
                <h1 class="brand-name">IT SAATHI</h1>
                <div class="brand-tagline">Smart Tech, Trusted Service</div>
                <div class="brand-contact">
                  <div>CCTV, networking, adapters & wiring range</div>
                  <div>Phone: +91 80060 33345</div>
                  <div>Email: Support@itsaathi.com</div>
                </div>
              </div>
              <div style="text-align: right;">
                <span class="badge">Commercial Tax Invoice</span>
                <div class="order-meta">
                  <div>Order Ref: <span class="order-ref">${o.orderId || ''}</span></div>
                  <div>Date: ${dateStr}</div>
                  <div>Status: <strong>${o.status || 'Processing'}</strong></div>
                </div>
              </div>
            </div>

            <div class="grid-2">
              <div>
                <div class="section-label">Billing / Shipping Consignee</div>
                <div class="cust-name">${o.customerName || 'Valued Customer'}</div>
                <div style="color: #475569; margin-top: 4px;">
                  <div>Mobile: ${o.customerPhone || 'N/A'}</div>
                  <div>Email: ${o.customerEmail || 'N/A'}</div>
                </div>
              </div>
              <div>
                <div class="section-label">Delivery Destination Address</div>
                <div style="color: #334155; font-weight: 600; font-style: italic; line-height: 1.4;">
                  ${o.shippingAddress || 'N/A'}
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 40px;">S.No</th>
                  <th>Product Specification</th>
                  <th style="text-align: center;">Unit Price</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Net Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div class="totals-container">
              <div class="thankyou-note">
                Thank you for doing business with IT SAATHI! All technical claims are subject to warranty stamps.
              </div>
              <div class="totals-table">
                <div class="totals-row">
                  <span>Taxable Value:</span>
                  <span style="font-family: monospace;">₹${taxableVal.toLocaleString('en-IN')}</span>
                </div>
                <div class="totals-row">
                  <span>GST (CGST/SGST):</span>
                  <span style="font-family: monospace;">₹49</span>
                </div>
                <div class="totals-row grand-total">
                  <span>Grand Total:</span>
                  <span style="font-family: monospace;">₹${(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            };
          </script>
        </body>
      </html>
    `;

    // Try popup window first
    try {
      const printWin = window.open('', '_blank', 'width=850,height=900,scrollbars=yes');
      if (printWin) {
        printWin.document.open();
        printWin.document.write(printHTML);
        printWin.document.close();
        return;
      }
    } catch (e) {
      console.warn('Popup window error or blocked:', e);
    }

    // Fallback iframe print
    let iframe = document.getElementById('printable-invoice-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'printable-invoice-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(printHTML);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders Processing Desk</h1>
          <p className="text-slate-500 text-sm">
            Track order dispatch, print commercial invoices, register shipping tracking IDs, and cancel transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition"
            title="Export orders to CSV or JSON"
          >
            <Download size={14} className="text-red-600" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 font-bold text-xs py-2.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition"
            title="Import orders from CSV or JSON"
          >
            <Upload size={14} />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Filters and search panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search orders by ID, Name, Phone or Email..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 transition focus:border-red-500 focus:outline-none"
              value={orderSearchTerm}
              onChange={(e) => {
                setOrderSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white focus:outline-none"
              value={orderStatusFilter}
              onChange={(e) => {
                setOrderStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Tracking States</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {isFetchingOrders ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-slate-200 border-t-red-600 mb-3" />
            <p className="text-xs font-bold text-slate-500">Retrieving checkout orders dataset...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto text-slate-300 mb-4" size={40} />
            <h3 className="text-sm font-bold text-slate-900">No Orders Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Either no checkouts have been placed yet, or search criteria is too specific.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4">Order ID & Date</th>
                  <th className="px-5 py-4">Customer Details</th>
                  <th className="px-5 py-4">Hardware Items</th>
                  <th className="px-5 py-4">Grand Total</th>
                  <th className="px-5 py-4">Tracking Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {currentOrders.map((o) => {
                  let statusColor = 'bg-slate-100 text-slate-700';
                  if (o.status === 'Pending') statusColor = 'bg-amber-100 text-amber-700';
                  else if (o.status === 'Processing') statusColor = 'bg-indigo-100 text-indigo-700';
                  else if (o.status === 'Shipped') statusColor = 'bg-sky-100 text-sky-700';
                  else if (o.status === 'Delivered') statusColor = 'bg-emerald-100 text-emerald-700';
                  else if (o.status === 'Cancelled') statusColor = 'bg-red-100 text-red-700';

                  return (
                    <tr key={o._id} className="hover:bg-slate-50/50 transition items-start align-top">
                      {/* Order Ref */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-red-700">{o.orderId}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-1">
                          <Calendar size={10} />
                          {new Date(o.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        {o.trackingNumber && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-sky-700 font-bold">
                            <Truck size={10} />
                            <span>{o.trackingNumber}</span>
                          </div>
                        )}
                      </td>

                      {/* Customer Details */}
                      <td className="px-5 py-4 space-y-1">
                        <div className="font-black text-slate-900 leading-tight">{o.customerName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Phone size={10} />
                          <a href={`tel:${o.customerPhone}`} className="hover:underline">{o.customerPhone}</a>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail size={10} />
                          <span className="truncate max-w-[150px]">{o.customerEmail}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-start gap-1 max-w-[180px] leading-tight mt-0.5">
                          <MapPin size={10} className="shrink-0 mt-0.5" />
                          <span className="line-clamp-2 italic">{o.shippingAddress}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4">
                        <div className="max-w-[200px] divide-y divide-slate-100">
                          {o.items && o.items.map((it, idx) => (
                            <div key={idx} className="py-1 flex justify-between gap-3 font-semibold text-slate-700 text-[11px]">
                              <span className="truncate max-w-[140px]" title={it.name}>
                                {it.qty}x {it.name}
                              </span>
                              <span className="text-slate-400 shrink-0 font-mono">₹{(it.price * it.qty).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Grand Total */}
                      <td className="px-5 py-4">
                        <div className="font-black text-slate-900 text-sm">₹{o.totalAmount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">{o.paymentMethod || 'COD'}</div>
                      </td>

                      {/* Tracking Status */}
                      <td className="px-5 py-4 space-y-1.5">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${statusColor}`}>
                          {o.status}
                        </span>
                        
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                          className="block w-full text-[11px] font-bold border border-slate-200 bg-slate-50 rounded-lg p-1 px-1.5 focus:border-red-500 focus:outline-none focus:bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Invoice & Delete Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onGenerateTaxInvoice && (
                            <button
                              onClick={() => onGenerateTaxInvoice(o)}
                              className="inline-flex items-center gap-1 h-8 px-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition shadow-2xs font-bold text-[11px] cursor-pointer"
                              title="Generate Official GST Tax Invoice"
                            >
                              <FileText size={12} />
                              <span className="hidden sm:inline">Tax Bill</span>
                            </button>
                          )}
                          <button
                            onClick={() => openInvoiceModal(o)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900 transition shadow-2xs"
                            title="Quick Print Slip"
                          >
                            <Printer size={13} />
                          </button>
                          <button
                            onClick={() => deleteOrder(o._id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:text-red-600 transition shadow-2xs"
                            title="Delete Order Record"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-4">
            <span className="text-[11px] font-bold text-slate-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} orders
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

      {/* Invoice packing modal (Printable style overlay) */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 print:hidden">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Tax Invoice & Packing Slip</span>
                <h3 className="text-sm font-black text-slate-900">Generate Dispatch slip</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerPrint}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
                >
                  <Printer size={12} />
                  Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Invoice Print Container */}
            <div className="p-8 space-y-6 text-xs max-h-[75vh] overflow-y-auto print:overflow-visible print:max-h-none">
              
              {/* IT SAATHI Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-lg font-black tracking-wide text-red-700">IT SAATHI</h2>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">Smart Tech, Trusted Service</p>
                  <div className="mt-2 space-y-0.5 text-slate-400 font-medium">
                    <div>CCTV, networking, adapters & wiring range</div>
                    <div>Phone: +91 80060 33345</div>
                    <div>Email: Support@itsaathi.com</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-md bg-slate-100 border px-2.5 py-1 text-[10px] font-black tracking-wider text-slate-700 uppercase">
                    Commercial Slip
                  </span>
                  <div className="mt-3 space-y-1 font-bold text-slate-700">
                    <div>Order Ref: <span className="font-black text-red-700">{selectedOrderForInvoice.orderId}</span></div>
                    <div className="text-slate-400 font-medium">Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}</div>
                    <div className="text-slate-400 font-medium">Status: <span className="text-slate-800">{selectedOrderForInvoice.status}</span></div>
                  </div>
                </div>
              </div>

              {/* Customer Billing details */}
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Billing / Shipping Consignee</h4>
                  <div className="font-black text-slate-800 text-sm">{selectedOrderForInvoice.customerName}</div>
                  <div className="mt-1 space-y-0.5 font-medium text-slate-500">
                    <div>Mobile: {selectedOrderForInvoice.customerPhone}</div>
                    <div>Email: {selectedOrderForInvoice.customerEmail}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Delivery Destination Address</h4>
                  <p className="text-slate-600 font-semibold leading-relaxed italic">{selectedOrderForInvoice.shippingAddress}</p>
                </div>
              </div>

              {/* Order Items Lines Table */}
              <table className="w-full text-left border-collapse border-b border-slate-200">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 font-bold uppercase text-[9px] text-slate-500 tracking-wider">
                    <th className="p-2.5">S.No</th>
                    <th className="p-2.5">Product Specification</th>
                    <th className="p-2.5 text-center">Unit Price</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Net Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {selectedOrderForInvoice.items && selectedOrderForInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="p-2.5 font-black text-slate-900">{it.name}</td>
                      <td className="p-2.5 text-center font-mono">₹{it.price.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-center">{it.qty}</td>
                      <td className="p-2.5 text-right font-mono">₹{(it.price * it.qty).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary totals */}
              <div className="flex justify-between items-start pt-2">
                <div className="max-w-xs font-semibold text-slate-400 leading-normal italic">
                  Thank you for business with IT SAATHI! All technical claims are subject to warranty stamps.
                </div>
                <div className="w-52 space-y-1.5 font-bold text-slate-500 text-right">
                  <div className="flex justify-between">
                    <span>Taxable Value:</span>
                    <span className="font-mono text-slate-800">₹{(selectedOrderForInvoice.totalAmount - 49).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (Integrated/CGST):</span>
                    <span className="font-mono text-slate-800">₹49</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed pt-1.5 text-slate-950 font-black text-sm">
                    <span>Grand Total:</span>
                    <span className="font-mono text-red-700">₹{selectedOrderForInvoice.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Logistics & Tracking Form */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 print:hidden">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Logistics tracking / Docket No
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-red-500"
                      placeholder="e.g. Delhivery #DL192834"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Internal Operator Private Notes
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-red-500"
                    placeholder="e.g. Awaiting customer callback confirmation"
                    value={privateNote}
                    onChange={(e) => setPrivateNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 print:hidden">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  Close without saving
                </button>
                <button
                  type="button"
                  onClick={handleSaveInvoiceDetails}
                  className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-red-700 transition"
                >
                  Save Invoice properties
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Order Import Modal */}
      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="orders"
          onImportSuccess={(importedRows, mode) => {
            if (setOrders) {
              if (mode === 'merge') {
                setOrders(prev => {
                  const merged = [...prev];
                  importedRows.forEach((newO) => {
                    const idx = merged.findIndex(o => o.orderId === newO.orderId);
                    if (idx >= 0) {
                      merged[idx] = { ...merged[idx], ...newO };
                    } else {
                      merged.push(newO);
                    }
                  });
                  localStorage.setItem('admin_orders', JSON.stringify(merged));
                  return merged;
                });
              } else {
                setOrders(prev => {
                  const appended = [...prev, ...importedRows];
                  localStorage.setItem('admin_orders', JSON.stringify(appended));
                  return appended;
                });
              }
            }
          }}
          sampleTemplate={[]}
          sampleColumns={orderExportColumns}
          sampleFileName="orders_sample_template.csv"
          showToast={showToast}
        />
      )}

      {/* Order Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          type="orders"
          data={orders}
          filteredData={filteredOrders}
          columns={orderExportColumns}
          fileNamePrefix="IT_SAATHI_Orders"
          showToast={showToast}
        />
      )}

    </div>
  );
}
