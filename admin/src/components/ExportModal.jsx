import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  X,
  Layers,
  Filter,
  ArrowRight,
  FileType
} from 'lucide-react';
import {
  downloadFile,
  arrayToCsv,
  arrayToXml,
  arrayToExcelBlob
} from '../utils/dataTransfer.js';
import { dump as yamlDump } from 'js-yaml';

export default function ExportModal({
  isOpen,
  onClose,
  type = 'products',
  data = [],
  filteredData = [],
  columns = [],
  fileNamePrefix = 'export',
  showToast
}) {
  const [exportFormat, setExportFormat] = useState('xlsx'); // 'xlsx', 'csv', 'xml', 'json', 'yaml'
  const [exportScope, setExportScope] = useState('all'); // 'all' or 'filtered'

  if (!isOpen) return null;

  const datasetToExport = exportScope === 'filtered' && filteredData.length > 0 ? filteredData : data;

  const handleExport = () => {
    if (!datasetToExport || datasetToExport.length === 0) {
      showToast && showToast('No records found to export.', 'error');
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `${fileNamePrefix}_${exportScope}_${timestamp}.${exportFormat}`;

    if (exportFormat === 'xlsx') {
      const excelBlob = arrayToExcelBlob(datasetToExport, columns, type.toUpperCase());
      downloadFile(excelBlob, fileName);
    } else if (exportFormat === 'csv') {
      const csvString = arrayToCsv(datasetToExport, columns);
      downloadFile(csvString, fileName, 'text/csv;charset=utf-8;');
    } else if (exportFormat === 'xml') {
      const rootTag = type;
      const itemTag = type === 'products' ? 'product' : (type === 'customers' ? 'customer' : (type === 'orders' ? 'order' : 'item'));
      const xmlString = arrayToXml(datasetToExport, rootTag, itemTag, columns);
      downloadFile(xmlString, fileName, 'application/xml;charset=utf-8;');
    } else if (exportFormat === 'yaml') {
      const yamlString = yamlDump(datasetToExport);
      downloadFile(yamlString, fileName, 'text/yaml;charset=utf-8;');
    } else {
      const jsonString = JSON.stringify(datasetToExport, null, 2);
      downloadFile(jsonString, fileName, 'application/json;charset=utf-8;');
    }

    showToast && showToast(`Exported ${datasetToExport.length} ${type} records to ${fileName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-pop-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/30 text-red-400 border border-red-500/40">
                <Download size={18} />
              </div>
              <div>
                <h3 className="text-base font-black capitalize">
                  Export {type} Data
                </h3>
                <p className="text-[11px] text-slate-400">
                  Export in Excel, CSV, XML, JSON, or YAML format
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
          <div className="p-6 space-y-6">
            {/* Format Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                1. Select File Format
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFormat('xlsx')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    exportFormat === 'xlsx'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileSpreadsheet size={20} className="mb-1 text-emerald-600" />
                  <span className="text-xs font-black">Excel</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">.xlsx</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    exportFormat === 'csv'
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Download size={20} className="mb-1 text-teal-600" />
                  <span className="text-xs font-black">CSV</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">.csv</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('xml')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    exportFormat === 'xml'
                      ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileCode size={20} className="mb-1 text-amber-600" />
                  <span className="text-xs font-black">XML</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">.xml</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('json')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    exportFormat === 'json'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileType size={20} className="mb-1 text-blue-600" />
                  <span className="text-xs font-black">JSON</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">.json</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('yaml')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    exportFormat === 'yaml'
                      ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileCode size={20} className="mb-1 text-purple-600" />
                  <span className="text-xs font-black">YAML</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">.yaml</span>
                </button>
              </div>
            </div>

            {/* Scope Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                2. Export Record Scope
              </label>
              <div className="space-y-2">
                <label
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                    exportScope === 'all'
                      ? 'border-red-600 bg-red-50/40 text-red-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <input
                      type="radio"
                      name="exportScope"
                      value="all"
                      checked={exportScope === 'all'}
                      onChange={() => setExportScope('all')}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>All Available Records</span>
                  </div>
                  <span className="text-xs font-mono font-black text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {data.length} items
                  </span>
                </label>

                {filteredData.length > 0 && filteredData.length !== data.length && (
                  <label
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                      exportScope === 'filtered'
                        ? 'border-red-600 bg-red-50/40 text-red-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs">
                      <input
                        type="radio"
                        name="exportScope"
                        value="filtered"
                        checked={exportScope === 'filtered'}
                        onChange={() => setExportScope('filtered')}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>Current Filtered Search View</span>
                    </div>
                    <span className="text-xs font-mono font-black text-red-600 bg-white px-2 py-0.5 rounded-md border border-red-200">
                      {filteredData.length} items
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Included Fields Info */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
              <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Included Export Columns ({columns.length})
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {columns.map((c) => (
                  <span
                    key={c.key}
                    className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
                  >
                    {c.label || c.key}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-red-900/20 transition"
            >
              <Download size={14} />
              Download {datasetToExport.length} Records ({exportFormat.toUpperCase()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
