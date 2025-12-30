
import React, { useState } from 'react';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

// Expanded mock historical data for better visualization
const archiveData = [
  { date: '۱۴۰۳/۱۲/۰۸', usd: 62400, gold: 3510000, emami: 43200000 },
  { date: '۱۴۰۳/۱۲/۰۷', usd: 62100, gold: 3490000, emami: 42900000 },
  { date: '۱۴۰۳/۱۲/۰۶', usd: 61800, gold: 3470000, emami: 42500000 },
  { date: '۱۴۰۳/۱۲/۰۵', usd: 61500, gold: 3460000, emami: 42200000 },
  { date: '۱۴۰۳/۱۲/۰۴', usd: 61200, gold: 3450000, emami: 42100000 },
  { date: '۱۴۰۳/۱۲/۰۳', usd: 61500, gold: 3420000, emami: 41900000 },
  { date: '۱۴۰۳/۱۲/۰۲', usd: 60800, gold: 3380000, emami: 41200000 },
  { date: '۱۴۰۳/۱۲/۰۱', usd: 60200, gold: 3350000, emami: 40800000 },
];

const MiniTrend: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const ArchiveModal: React.FC<ArchiveModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'usd' | 'gold'>('all');

  if (!isOpen) return null;

  const stats = {
    usdMax: Math.max(...archiveData.map(d => d.usd)),
    usdMin: Math.min(...archiveData.map(d => d.usd)),
    goldMax: Math.max(...archiveData.map(d => d.gold)),
    goldMin: Math.min(...archiveData.map(d => d.gold)),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl shadow-emerald-100">
                📉
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">تحلیل و آرشیو قیمت‌ها</h2>
                <p className="text-gray-500 text-sm">بررسی هوشمند روند تغییرات بازار در ۱۰ روز اخیر</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <span className="text-xs font-bold text-gray-400 block mb-1">بیشترین دلار (۱۰ روز)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-emerald-600">{formatNumber(stats.usdMax)}</span>
                <span className="text-[10px] text-gray-400">تومان</span>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <span className="text-xs font-bold text-gray-400 block mb-1">کمترین دلار (۱۰ روز)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-rose-500">{formatNumber(stats.usdMin)}</span>
                <span className="text-[10px] text-gray-400">تومان</span>
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 block mb-1">روند کلی بازار</span>
                <span className="text-sm font-black text-emerald-800">صعودی (ملایم)</span>
              </div>
              <div className="bg-emerald-500/10 p-2 rounded-xl">
                <MiniTrend data={archiveData.map(d => d.usd).reverse()} color="#10b981" />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-grow overflow-y-auto px-8 pb-8">
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-right border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-500 text-xs">تاریخ معاملات</th>
                  <th className="px-6 py-4 font-bold text-gray-500 text-xs">دلار آمریکا</th>
                  <th className="px-6 py-4 font-bold text-gray-500 text-xs">طلای ۱۸ عیار</th>
                  <th className="px-6 py-4 font-bold text-gray-500 text-xs">سکه امامی</th>
                  <th className="px-6 py-4 font-bold text-gray-500 text-xs text-center">وضعیت نوسان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {archiveData.map((row, index) => {
                  const prevRow = archiveData[index + 1];
                  const diff = prevRow ? row.usd - prevRow.usd : 0;
                  
                  return (
                    <tr key={index} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-6 py-5 text-gray-900 font-bold text-sm">{row.date}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-black text-sm">{formatNumber(row.usd)}</span>
                          <span className="text-[10px] text-gray-400">تومان</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-gray-600 font-bold text-sm">{formatNumber(row.gold)}</span>
                          <span className="text-[10px] text-gray-400">هر گرم</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-600 text-sm font-medium">{formatNumber(row.emami)}</td>
                      <td className="px-6 py-5 text-center">
                        {diff > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg text-[10px] font-bold">
                            <span>▲</span>
                            <span>{formatNumber(diff)}</span>
                          </span>
                        ) : diff < 0 ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-100 px-2 py-1 rounded-lg text-[10px] font-bold">
                            <span>▼</span>
                            <span>{formatNumber(Math.abs(diff))}</span>
                          </span>
                        ) : (
                          <span className="text-gray-300 text-[10px]">بدون تغییر</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <span>📘</span> نکته آموزشی
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                فاصله قیمت خرید و فروش (Spread) در روزهای پرنوسان افزایش می‌یابد. آرشیو بازارچی میانگین نرخ قطعی معاملات را نمایش می‌دهد.
              </p>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl text-white">
              <h4 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                <span>🚀</span> نسخه پیشرفته
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                برای دسترسی به نمودارهای تکنیکال و آرشیو ۱ ساله، به پنل حرفه‌ای ما در تلگرام مراجعه کنید.
              </p>
              <a 
                href="https://t.me/bazarchiR_" 
                target="_blank" 
                className="inline-block text-[10px] font-bold bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors"
              >
                مشاهده در تلگرام
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
