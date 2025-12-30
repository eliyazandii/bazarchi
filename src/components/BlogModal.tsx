import React from 'react';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800">بلاگ بازارچی</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-8">
            {/* Blog Post 1 */}
            <article className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📈</span>
                <h3 className="text-xl font-bold text-gray-800">چرا قیمت طلا امروز بالا رفت؟</h3>
              </div>
              <p className="text-gray-600 mb-4">
                تحلیل کاملی از عوامل تأثیرگذار بر قیمت طلا در بازار ایران و جهانی. از نوسانات دلار تا اخبار اقتصادی بین‌المللی.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">۱۴۰۳/۱۰/۰۴</span>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium">ادامه خواندن →</button>
              </div>
            </article>

            {/* Blog Post 2 */}
            <article className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💰</span>
                <h3 className="text-xl font-bold text-gray-800">راهنمای سرمایه‌گذاری در رمزارزها</h3>
              </div>
              <p className="text-gray-600 mb-4">
                نکات مهم برای شروع سرمایه‌گذاری در بیت‌کوین و سایر رمزارزها. ریسک‌ها، فرصت‌ها و استراتژی‌های مناسب بازار ایران.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">۱۴۰۳/۰۹/۲۸</span>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium">ادامه خواندن →</button>
              </div>
            </article>

            {/* Blog Post 3 */}
            <article className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏛️</span>
                <h3 className="text-xl font-bold text-gray-800">تفاوت نرخ ارز دولتی و آزاد چیست؟</h3>
              </div>
              <p className="text-gray-600 mb-4">
                توضیح کامل تفاوت بین نرخ‌های مختلف ارز در ایران، مزایا و معایب هر کدام و تأثیر آنها بر اقتصاد کشور.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">۱۴۰۳/۰۹/۲۰</span>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium">ادامه خواندن →</button>
              </div>
            </article>

            {/* Coming Soon */}
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
              <span className="text-4xl mb-4 block">📝</span>
              <h3 className="text-lg font-bold text-gray-600 mb-2">مقاله‌های بیشتر به زودی...</h3>
              <p className="text-gray-400">تحلیل‌های روزانه قیمت‌ها و اخبار اقتصادی</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};