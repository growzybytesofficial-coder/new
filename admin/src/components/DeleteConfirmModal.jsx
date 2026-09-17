import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  itemDetail = ''
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-pop-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-red-100 bg-red-50/70 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">{title}</h3>
                <span className="text-[11px] font-bold text-red-700">Irreversible Action</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {message}
            </p>

            {(itemName || itemDetail) && (
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-1">
                {itemName && (
                  <div className="text-xs font-black text-slate-900 truncate">
                    {itemName}
                  </div>
                )}
                {itemDetail && (
                  <div className="text-[11px] font-mono text-slate-500">
                    {itemDetail}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-red-900/20 transition hover:scale-105 active:scale-95"
            >
              <Trash2 size={14} />
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
