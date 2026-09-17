import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Eye,
  Layers,
  ArrowRight,
  Database,
  FileCheck,
  FileType
} from 'lucide-react';
import {
  parseAnyFile,
  downloadFile,
  arrayToCsv,
  arrayToXml,
  arrayToExcelBlob
} from '../utils/dataTransfer.js';

export default function ImportModal({
  isOpen,
  onClose,
  type = 'products', // 'products', 'customers', 'orders', 'coupons'
  onImportSuccess,
  sampleTemplate = [],
  sampleColumns = [],
  sampleFileName = 'sample_template.csv',
  showToast
}) {
  const [file, setFile] = useState(null);
  const [fileFormatDetected, setFileFormatDetected] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [importMode, setImportMode] = useState('merge'); // 'merge' or 'append'
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview & Confirm
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    processFile(uploadedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (!uploadedFile) return;
    processFile(uploadedFile);
  };

  const processFile = async (uploadedFile) => {
    setErrorMsg('');
    setIsLoadingFile(true);
    setFile(uploadedFile);

    try {
      const { format, rows } = await parseAnyFile(uploadedFile);
      setFileFormatDetected(format);

      if (!rows || rows.length === 0) {
        setIsLoadingFile(false);
        setErrorMsg(`The file "${uploadedFile.name}" does not contain any readable data rows.`);
        return;
      }

      // Normalize rows depending on entity type
      const normalized = rows.map((r, idx) => {
        if (type === 'products') {
          return {
            id: r.id || r.product_id || r.productid || `prod-import-${Date.now()}-${idx}`,
            name: r.name || r.product_name || r.productname || r.title || `Imported Hardware Product #${idx + 1}`,
            slug: r.slug || (r.name ? String(r.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}-${idx}`),
            category: r.category || 'General IT Hardware',
            price: Number(r.price || r.price_inr || r.priceinr || 0),
            oldPrice: r.oldprice || r.old_price || r.oldpriceinr ? Number(r.oldprice || r.old_price || r.oldpriceinr) : null,
            sku: r.sku || r.sku_code || r.skucode || `ITS-IMP-${idx + 1}`,
            badge: r.badge || 'In Stock',
            section: r.section || 'featured',
            short: r.short || r.short_description || r.shortdescription || '',
            description: r.description || r.full_description || r.fulldescription || r.short || '',
            specs: Array.isArray(r.specs) ? r.specs : (typeof r.specs === 'string' ? r.specs.split(/[;\n]/).map(s => s.trim()).filter(Boolean) : [])
          };
        } else if (type === 'customers') {
          return {
            _id: r._id || r.customer_id || r.customerid || r.id || `CUST-IMP-${Date.now()}-${idx}`,
            name: r.name || r.full_name || r.fullname || 'Customer Name',
            email: r.email || `customer${idx + 1}@example.com`,
            phone: r.phone || r.phone_number || r.phonenumber || '+91 80060 33345',
            role: r.role || 'retailer',
            status: r.status || 'Active',
            companyName: r.companyname || r.company_firm || r.company || '',
            gstin: r.gstin || '',
            orderCount: Number(r.ordercount || r.total_orders || r.totalorders || 0),
            totalSpent: Number(r.totalspent || r.total_spent || r.totalspent || 0),
            cashbackBalance: Number(r.cashbackbalance || r.cashback_balance || 0),
            createdAt: r.createdat || r.registration_date || r.registrationdate || new Date().toISOString()
          };
        } else if (type === 'orders') {
          return {
            orderId: r.orderid || r.order_id || `ITS-IMP-${Date.now().toString().slice(-5)}-${idx}`,
            customerName: r.customername || r.customer_name || 'Direct Buyer',
            customerEmail: r.customeremail || r.customer_email || 'buyer@example.com',
            customerPhone: r.customerphone || r.customer_phone || '+91 80060 33345',
            shippingAddress: r.shippingaddress || r.delivery_address || 'India',
            paymentMethod: r.paymentmethod || r.payment_mode || 'COD',
            totalAmount: Number(r.totalamount || r.grand_total || 0),
            status: r.status || r.order_status || 'Delivered',
            trackingNumber: r.trackingnumber || r.courier_tracking_no || '',
            createdAt: r.createdat || r.order_date || new Date().toISOString(),
            items: r.items || []
          };
        }
        return r;
      });

      setParsedRows(normalized);
      setIsLoadingFile(false);
      setStep(2);
    } catch (err) {
      setIsLoadingFile(false);
      setErrorMsg('Failed to process file: ' + err.message);
    }
  };

  const handleDownloadSampleCsv = () => {
    if (!sampleTemplate || !sampleColumns) return;
    const csvData = arrayToCsv(sampleTemplate, sampleColumns);
    downloadFile(csvData, sampleFileName);
    showToast && showToast(`Sample CSV template (${sampleFileName}) downloaded`);
  };

  const handleDownloadSampleXml = () => {
    if (!sampleTemplate || !sampleColumns) return;
    const xmlFileName = sampleFileName.replace(/\.csv$/, '.xml');
    const rootTag = type;
    const itemTag = type === 'products' ? 'product' : (type === 'customers' ? 'customer' : (type === 'orders' ? 'order' : 'item'));
    const xmlData = arrayToXml(sampleTemplate, rootTag, itemTag, sampleColumns);
    downloadFile(xmlData, xmlFileName, 'application/xml;charset=utf-8;');
    showToast && showToast(`Sample XML template (${xmlFileName}) downloaded`);
  };

  const handleDownloadSampleExcel = () => {
    if (!sampleTemplate || !sampleColumns) return;
    const xlsxFileName = sampleFileName.replace(/\.csv$/, '.xlsx');
    const excelBlob = arrayToExcelBlob(sampleTemplate, sampleColumns, type.toUpperCase());
    downloadFile(excelBlob, xlsxFileName);
    showToast && showToast(`Sample Excel template (${xlsxFileName}) downloaded`);
  };

  const handleDownloadSampleJson = () => {
    if (!sampleTemplate) return;
    const jsonFileName = sampleFileName.replace(/\.csv$/, '.json');
    const jsonData = JSON.stringify(sampleTemplate, null, 2);
    downloadFile(jsonData, jsonFileName, 'application/json;charset=utf-8;');
    showToast && showToast(`Sample JSON template (${jsonFileName}) downloaded`);
  };

  const handleExecuteImport = () => {
    if (!parsedRows || parsedRows.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      try {
        onImportSuccess(parsedRows, importMode);
        showToast && showToast(`Successfully imported ${parsedRows.length} ${type} records!`);
        setIsProcessing(false);
        onClose();
      } catch (err) {
        setIsProcessing(false);
        setErrorMsg('Import error: ' + err.message);
      }
    }, 400);
  };

  const resetState = () => {
    setFile(null);
    setFileFormatDetected('');
    setParsedRows([]);
    setStep(1);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-pop-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/30 text-red-400 border border-red-500/40">
                <Upload size={18} />
              </div>
              <div>
                <h3 className="text-base font-black capitalize">
                  Universal Import {type} Data
                </h3>
                <p className="text-[11px] text-slate-400">
                  Accepts Excel, CSV, TSV, XML, JSON, JSONL, YAML, SQL, or HTML tables
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

          {/* Body Content */}
          <div className="p-6 space-y-6">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 sm:p-10 text-center cursor-pointer transition hover:border-red-500 hover:bg-red-50/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md text-emerald-600 group-hover:scale-110 transition duration-300">
                      <FileSpreadsheet size={24} />
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md text-red-600 group-hover:scale-110 transition duration-300">
                      <Upload size={28} />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md text-amber-600 group-hover:scale-110 transition duration-300">
                      <FileCode size={24} />
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900">
                    {isLoadingFile ? 'Analyzing and parsing file...' : 'Click to select or drag & drop any data file'}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-lg">
                    Supports all file formats: Excel (.xlsx, .xls, .ods), CSV, TSV, XML, JSON, JSONL, YAML, SQL dump, and HTML tables
                  </p>

                  {/* Supported Format Tags */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-md">
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 border border-emerald-300">
                      Excel (.xlsx / .xls)
                    </span>
                    <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-black uppercase text-teal-800 border border-teal-300">
                      .CSV / .TSV
                    </span>
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800 border border-amber-300">
                      .XML / Feed
                    </span>
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase text-blue-800 border border-blue-300">
                      .JSON / .JSONL
                    </span>
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-black uppercase text-purple-800 border border-purple-300">
                      .YAML / .YML
                    </span>
                    <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase text-rose-800 border border-rose-300">
                      .SQL
                    </span>
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-black uppercase text-slate-800 border border-slate-300">
                      .HTML
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.ods,.xlsm,.xlsb,.csv,.tsv,.tab,.txt,.xml,.rss,.atom,.json,.jsonl,.ndjson,.yaml,.yml,.sql,.html,.htm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/xml,text/xml,application/json,text/csv,text/plain"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Sample Template Shortcuts */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-100 text-red-800 shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900">Download Verified Sample Templates</h5>
                      <p className="text-[11px] text-slate-600">Choose your preferred format pre-filled with the right schema:</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleDownloadSampleExcel}
                      className="inline-flex items-center gap-1 rounded-xl bg-white border border-emerald-300 px-2.5 py-1.5 text-xs font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 transition"
                    >
                      <FileSpreadsheet size={13} className="text-emerald-700" />
                      Excel (.xlsx)
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSampleCsv}
                      className="inline-flex items-center gap-1 rounded-xl bg-white border border-teal-300 px-2.5 py-1.5 text-xs font-bold text-teal-900 shadow-sm hover:bg-teal-50 transition"
                    >
                      <Download size={13} className="text-teal-700" />
                      CSV
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSampleXml}
                      className="inline-flex items-center gap-1 rounded-xl bg-white border border-amber-300 px-2.5 py-1.5 text-xs font-bold text-amber-900 shadow-sm hover:bg-amber-50 transition"
                    >
                      <FileCode size={13} className="text-amber-700" />
                      XML
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSampleJson}
                      className="inline-flex items-center gap-1 rounded-xl bg-white border border-blue-300 px-2.5 py-1.5 text-xs font-bold text-blue-900 shadow-sm hover:bg-blue-50 transition"
                    >
                      <FileType size={13} className="text-blue-700" />
                      JSON
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* File summary */}
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-black text-slate-900 truncate max-w-xs">{file?.name}</h5>
                        <span className="rounded bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 uppercase">
                          {fileFormatDetected || 'PARSED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {parsedRows.length} total records successfully validated and ready to import
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetState}
                    className="text-xs font-bold text-red-600 hover:text-red-700 underline"
                  >
                    Choose different file
                  </button>
                </div>

                {/* Import Strategy */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Import Action Strategy
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                        importMode === 'merge'
                          ? 'border-red-600 bg-red-50/40'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="importMode"
                        value="merge"
                        checked={importMode === 'merge'}
                        onChange={(e) => setImportMode(e.target.value)}
                        className="mt-0.5 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900">Merge & Update Existing</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Updates matching records (by SKU / ID) and appends newly found records.
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                        importMode === 'append'
                          ? 'border-red-600 bg-red-50/40'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="importMode"
                        value="append"
                        checked={importMode === 'append'}
                        onChange={(e) => setImportMode(e.target.value)}
                        className="mt-0.5 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900">Append Only</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Adds all rows as new items without replacing existing database entries.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Data Preview Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-slate-700">
                    <span>Parsed Data Preview (First 5 Rows)</span>
                    <span className="text-slate-400">Total: {parsedRows.length} Rows</span>
                  </div>

                  <div className="max-h-48 overflow-auto rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          {type === 'products' && (
                            <>
                              <th className="p-2.5">Name</th>
                              <th className="p-2.5">SKU</th>
                              <th className="p-2.5">Category</th>
                              <th className="p-2.5">Price</th>
                            </>
                          )}
                          {type === 'customers' && (
                            <>
                              <th className="p-2.5">Name</th>
                              <th className="p-2.5">Email</th>
                              <th className="p-2.5">Phone</th>
                              <th className="p-2.5">Role</th>
                            </>
                          )}
                          {type === 'orders' && (
                            <>
                              <th className="p-2.5">Order ID</th>
                              <th className="p-2.5">Customer</th>
                              <th className="p-2.5">Amount</th>
                              <th className="p-2.5">Status</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            {type === 'products' && (
                              <>
                                <td className="p-2.5 font-bold text-slate-900 truncate max-w-xs">{row.name}</td>
                                <td className="p-2.5 font-mono text-slate-500">{row.sku}</td>
                                <td className="p-2.5 text-slate-600">{row.category}</td>
                                <td className="p-2.5 font-black text-red-700">₹{row.price}</td>
                              </>
                            )}
                            {type === 'customers' && (
                              <>
                                <td className="p-2.5 font-bold text-slate-900">{row.name}</td>
                                <td className="p-2.5 text-slate-500">{row.email}</td>
                                <td className="p-2.5 font-mono text-slate-600">{row.phone}</td>
                                <td className="p-2.5 capitalize">{row.role}</td>
                              </>
                            )}
                            {type === 'orders' && (
                              <>
                                <td className="p-2.5 font-bold font-mono text-red-600">{row.orderId}</td>
                                <td className="p-2.5 text-slate-900">{row.customerName}</td>
                                <td className="p-2.5 font-black text-slate-900">₹{row.totalAmount}</td>
                                <td className="p-2.5">{row.status}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            {step === 2 && (
              <button
                onClick={handleExecuteImport}
                disabled={isProcessing || parsedRows.length === 0}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-red-900/20 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Processing Import...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    Confirm & Import {parsedRows.length} Records
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
