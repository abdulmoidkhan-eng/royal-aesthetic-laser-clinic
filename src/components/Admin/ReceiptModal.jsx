import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import Button from '../UI/Button.jsx';

export const ReceiptModal = ({ isOpen, onClose, imageUrl, orderNumber }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#F4E4DE] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4E4DE] bg-[#FBF3F0]/60">
          <div>
            <h3 className="font-serif font-semibold text-lg text-[#3A3A3A]">
              Payment Receipt Screenshot
            </h3>
            <p className="text-xs text-[#6B5B55]">
              Order Reference: <span className="font-mono font-medium text-[#D9A38F]">{orderNumber}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6B5B55] hover:text-[#3A3A3A] hover:bg-white rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Container */}
        <div className="p-4 overflow-auto flex items-center justify-center bg-zinc-900 min-h-[300px]">
          <img
            src={imageUrl}
            alt={`Payment receipt for ${orderNumber}`}
            className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-md"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#F4E4DE] bg-white flex items-center justify-between text-xs text-[#6B5B55]">
          <span>Review transaction ID on receipt before verifying order.</span>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F4E4DE] text-[#3A3A3A] hover:bg-[#FBF3F0] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D9A38F]" />
              Open Original
            </a>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
