import React, { useState, useRef } from 'react';
import {
  Database,
  Upload,
  Download,
  FileSpreadsheet,
  FileCode,
  Package,
  Users,
  ShoppingBag,
  Tag,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FolderDown,
  FolderUp,
  Sparkles,
  Layers
} from 'lucide-react';
import ImportModal from './ImportModal.jsx';
import ExportModal from './ExportModal.jsx';
import {
  downloadFile,
  productExportColumns,
  customerExportColumns,
  orderExportColumns,
  sampleProductTemplate,
  sampleCustomerTemplate
} from '../utils/dataTransfer.js';

export default function DataManagementView({
  products = [],
  setProductsList,
  customers = [],
  setCustomersList,
  orders = [],
  setOrdersList,
  coupons = [],
  setCouponsList,
  categories = [],
  setCategoriesList,
  brands = [],
  setBrandsList,
  storeSettings = {},
  setStoreSettings,
  showToast
}) {
  // Modal states
  const [activeImportType, setActiveImportType] = useState(null);
  const [activeExportType, setActiveExportType] = useState(null);

  // Backup restore file input ref
  const restoreInputRef = useRef(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Handle Full System Backup
  const handleFullBackup = () => {
    const backupSnapshot = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      store: 'IT SAATHI',
      data: {
        products,
        customers,
        orders,
        coupons,
        categories,
        brands,
        storeSettings
      }
    };

    const jsonString = JSON.stringify(backupSnapshot, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadFile(jsonString, `IT_SAATHI_FULL_BACKUP_${dateStr}.json`, 'application/json;charset=utf-8;');
    showToast && showToast('Full store backup archive successfully generated and downloaded!');
  };

  // Handle Full System Restore
  const handleFullRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsRestoring(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const data = parsed.data || parsed;

        if (data.products && Array.isArray(data.products)) {
          setProductsList && setProductsList(data.products);
          localStorage.setItem('admin_products', JSON.stringify(data.products));
        }
        if (data.customers && Array.isArray(data.customers)) {
          setCustomersList && setCustomersList(data.customers);
          localStorage.setItem('admin_customers', JSON.stringify(data.customers));
        }
        if (data.orders && Array.isArray(data.orders)) {
          setOrdersList && setOrdersList(data.orders);
          localStorage.setItem('admin_orders', JSON.stringify(data.orders));
        }
        if (data.coupons && Array.isArray(data.coupons)) {
          setCouponsList && setCouponsList(data.coupons);
          localStorage.setItem('admin_coupons', JSON.stringify(data.coupons));
        }
        if (data.categories && Array.isArray(data.categories)) {
          setCategoriesList && setCategoriesList(data.categories);
          localStorage.setItem('admin_categories', JSON.stringify(data.categories));
        }
        if (data.brands && Array.isArray(data.brands)) {
          setBrandsList && setBrandsList(data.brands);
          localStorage.setItem('admin_brands', JSON.stringify(data.brands));
        }
        if (data.storeSettings) {
          setStoreSettings && setStoreSettings(data.storeSettings);
          localStorage.setItem('admin_store_settings', JSON.stringify(data.storeSettings));
        }

        showToast && showToast('Store database restored successfully from snapshot!');
      } catch (err) {
        showToast && showToast('Failed to restore backup: ' + err.message, 'error');
      } finally {
        setIsRestoring(false);
        if (restoreInputRef.current) restoreInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Import handler routing
  const handleImportSuccess = (importedRows, mode) => {
    if (activeImportType === 'products') {
      if (mode === 'merge') {
        const merged = [...products];
        importedRows.forEach((newProd) => {
          const idx = merged.findIndex((p) => p.sku === newProd.sku || p.id === newProd.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...newProd };
          } else {
            merged.push(newProd);
          }
        });
        setProductsList && setProductsList(merged);
        localStorage.setItem('admin_products', JSON.stringify(merged));
      } else {
        const appended = [...products, ...importedRows];
        setProductsList && setProductsList(appended);
        localStorage.setItem('admin_products', JSON.stringify(appended));
      }
    } else if (activeImportType === 'customers') {
      if (mode === 'merge') {
        const merged = [...customers];
        importedRows.forEach((newCust) => {
          const idx = merged.findIndex((c) => c._id === newCust._id || c.email === newCust.email);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...newCust };
          } else {
            merged.push(newCust);
          }
        });
        setCustomersList && setCustomersList(merged);
        localStorage.setItem('admin_customers', JSON.stringify(merged));
      } else {
        const appended = [...customers, ...importedRows];
        setCustomersList && setCustomersList(appended);
        localStorage.setItem('admin_customers', JSON.stringify(appended));
      }
    } else if (activeImportType === 'orders') {
      const merged = [...orders];
      importedRows.forEach((newOrd) => {
        const idx = merged.findIndex((o) => o.orderId === newOrd.orderId);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...newOrd };
        } else {
          merged.push(newOrd);
        }
      });
      setOrdersList && setOrdersList(merged);
      localStorage.setItem('admin_orders', JSON.stringify(merged));
    }
  };

  const modules = [
    {
      id: 'products',
      title: 'Products & Inventory',
      count: `${products.length} Items`,
      desc: 'Export hardware catalog to CSV/JSON, upload new products in bulk, or update stock and pricing via spreadsheet.',
      icon: Package,
      color: 'from-red-600 to-orange-600',
      columns: productExportColumns,
      sampleTemplate: sampleProductTemplate,
      sampleFile: 'products_import_sample.csv',
      data: products
    },
    {
      id: 'customers',
      title: 'Customers & Wholesalers',
      count: `${customers.length} Accounts`,
      desc: 'Export registered retail & B2B buyers, upload installer databases, or sync partner dealer contact lists.',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      columns: customerExportColumns,
      sampleTemplate: sampleCustomerTemplate,
      sampleFile: 'customers_import_sample.csv',
      data: customers
    },
    {
      id: 'orders',
      title: 'Orders & Shipments',
      count: `${orders.length} Orders`,
      desc: 'Export sales reports, courier tracking manifests, or import processed invoice batches for accounting.',
      icon: ShoppingBag,
      color: 'from-emerald-600 to-teal-600',
      columns: orderExportColumns,
      sampleTemplate: [],
      sampleFile: 'orders_export.csv',
      data: orders
    },
    {
      id: 'coupons',
      title: 'Coupons & Vouchers',
      count: `${coupons.length} Vouchers`,
      desc: 'Manage discount codes, B2B percentage slabs, and promotional campaign vouchers.',
      icon: Tag,
      color: 'from-purple-600 to-pink-600',
      columns: [
        { key: 'code', label: 'Coupon Code' },
        { key: 'discount', label: 'Discount Amount / %' },
        { key: 'type', label: 'Discount Type' },
        { key: 'minOrder', label: 'Minimum Order' },
        { key: 'status', label: 'Status' }
      ],
      sampleTemplate: coupons,
      sampleFile: 'coupons_export.csv',
      data: coupons
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/30 border border-red-500/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-red-300">
            <Database size={13} /> Data Hub & Migration Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Import & Export Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Universal bulk data hub supporting all file formats: Microsoft Excel (.xlsx, .xls, .ods), CSV, TSV, XML feeds, JSON, JSONL, YAML, SQL dumps, and HTML tables.
          </p>
        </div>

        {/* Global Master Snapshot Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleFullBackup}
            className="inline-flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-5 py-3 text-xs font-black shadow-lg hover:bg-slate-100 transition hover:scale-105 active:scale-95"
          >
            <FolderDown size={16} className="text-red-600" />
            Full Backup (JSON)
          </button>

          <button
            onClick={() => restoreInputRef.current?.click()}
            disabled={isRestoring}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 text-white px-5 py-3 text-xs font-black shadow-lg shadow-red-900/40 hover:bg-red-500 transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <FolderUp size={16} />
            {isRestoring ? 'Restoring...' : 'Restore Backup'}
          </button>
          <input
            ref={restoreInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFullRestore}
            className="hidden"
          />
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6 transition hover:shadow-md hover:border-slate-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${mod.color} text-white shadow-md`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">{mod.title}</h3>
                      <span className="text-xs font-mono font-bold text-slate-500">{mod.count}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mt-4">
                  {mod.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveExportType(mod.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-white py-2.5 px-4 text-xs font-bold hover:bg-slate-800 transition shadow-sm"
                >
                  <Download size={14} className="text-red-400" />
                  Export Data
                </button>

                <button
                  type="button"
                  onClick={() => setActiveImportType(mod.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 py-2.5 px-4 text-xs font-bold hover:bg-red-100 transition shadow-sm"
                >
                  <Upload size={14} />
                  Import Data
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Formatting Guide */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
          <Sparkles size={18} className="text-amber-500" />
          <span>Import & Export Best Practices</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <h4 className="font-bold text-slate-900">All Formats Supported</h4>
            <p>Directly drop Microsoft Excel (.xlsx/.xls/.ods), CSV, TSV, XML feeds, JSON, JSONL, YAML, SQL dumps, or HTML table files without converting beforehand.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <h4 className="font-bold text-slate-900">Smart Schema Normalization</h4>
            <p>Automatic field name mapping standardizes common supplier headers (e.g. SKU, Price, GSTIN, Phone) with merge or append strategy options.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <h4 className="font-bold text-slate-900">Multi-Format Sample Downloads</h4>
            <p>Download pre-formatted sample templates in Excel, CSV, XML, or JSON format to verify structure before bulk uploading.</p>
          </div>
        </div>
      </div>

      {/* Render Active Import Modal */}
      {activeImportType && (
        <ImportModal
          isOpen={Boolean(activeImportType)}
          onClose={() => setActiveImportType(null)}
          type={activeImportType}
          onImportSuccess={handleImportSuccess}
          sampleTemplate={modules.find(m => m.id === activeImportType)?.sampleTemplate}
          sampleColumns={modules.find(m => m.id === activeImportType)?.columns}
          sampleFileName={modules.find(m => m.id === activeImportType)?.sampleFile}
          showToast={showToast}
        />
      )}

      {/* Render Active Export Modal */}
      {activeExportType && (
        <ExportModal
          isOpen={Boolean(activeExportType)}
          onClose={() => setActiveExportType(null)}
          type={activeExportType}
          data={modules.find(m => m.id === activeExportType)?.data || []}
          filteredData={[]}
          columns={modules.find(m => m.id === activeExportType)?.columns || []}
          fileNamePrefix={`IT_SAATHI_${activeExportType}`}
          showToast={showToast}
        />
      )}
    </div>
  );
}
