
import React from 'react';

interface GovernmentRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

import { fetchGovernmentRates } from '../services/marketService';

interface GovernmentRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export const GovernmentRatesModal: React.FC<GovernmentRatesModalProps> = ({ isOpen, onClose }) => {
  const [govRates, setGovRates] = React.useState<{ name: string; price: number; type: string }[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const fetchData = () => {
        fetchGovernmentRates().then(data => {
          setGovRates(data);
          setLoading(false);
        });
      };

      fetchData(); // Initial fetch

      const interval = setInterval(fetchData, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100">
                🏛️
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">نرخ ارزهای دولتی</h2>
                <p className="text-gray-500 text-sm">مرکز مبادله و سامانه‌های رسمی (نیما/سنا)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
              <p className="text-[11px] text-indigo-700 leading-relaxed text-center">
                نرخ‌های زیر بر اساس آخرین اعلام بانک مرکزی و مرکز مبادله ارز و طلای ایران می‌باشد.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {govRates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${rate.type === 'ارز دولتی' ? 'bg-indigo-500' : 'bg-sky-500'}`}></span>
                    <span className="text-gray-800 font-bold text-sm">{rate.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-gray-900">{formatNumber(rate.price)}</span>
                    <span className="text-[10px] text-gray-400">تومان</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-400 mb-6">
              توجه: نرخ‌های دولتی صرفاً جهت مصارف وارداتی، مسافرتی (طبق بخشنامه) و آماری منتشر می‌شوند.
            </p>
            <button
              onClick={onClose}
              className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              بستن پنجره
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
