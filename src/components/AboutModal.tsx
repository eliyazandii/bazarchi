import React from 'react';
import logo from '../assets/logo.png';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] p-4 md:flex md:items-center md:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh] md:max-h-[85vh] animate-in zoom-in-95 duration-300 mt-4 md:mt-0">
        <div className="p-6 md:p-12">
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <img src={logo} alt="Bazarchi Logo" className="w-12 h-12 md:w-14 md:h-14 rounded-2xl shadow-lg shadow-emerald-200 object-cover" />
              <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">درباره بازارچی</h2>
                <p className="text-gray-500 text-xs md:text-sm">شفافیت در بازارهای مالی</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 md:space-y-6 text-gray-600 leading-relaxed md:leading-loose">
            <p className="text-sm md:text-base">
              <strong className="text-gray-900">بازارچی</strong> یک پلتفرم مستقل و غیرانتفاعی برای رصد هوشمند قیمت‌های لحظه‌ای در بازار ایران است. ما با هدف حذف واسطه‌های خبری و ارائه مستقیم نرخ‌های واقعی از کف بازار، این سیستم را طراحی کرده‌ایم.
            </p>

            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
              <h3 className="font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <span className="text-emerald-500">●</span> منابع اطلاعاتی و اعتبار
              </h3>
              <p className="text-xs md:text-sm">
                تمامی قیمت‌های نمایش داده شده در بازارچی، به صورت مستقیم از <strong className="text-emerald-700">منابع معتبر داخلی</strong>، صرافی‌های تایید شده و بازارهای فیزیکی تهران استخراج می‌شوند. فرآیند بروزرسانی هر ۲ دقیقه یک‌بار به صورت کاملاً خودکار انجام می‌گردد تا صحت و سرعت در اطلاع‌رسانی تضمین شود.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">اهداف و ارزش‌های ما:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  اتکا به منابع دست اول داخلی
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  رابط کاربری مینیمال و حرفه‌ای
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  دسترسی رایگان و عمومی
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  پایش مستمر نوسانات بازار
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-emerald-100 text-center">
              <p className="text-gray-700 font-medium text-sm md:text-base">
                💎 نبض بازار در جیب شما<br />
                قیمت‌های لحظه‌ای طلا، سکه و ارز بر اساس معاملات بازار آزاد و منابع معتبر بانکی<br />
                <svg className="w-4 h-4 md:w-5 md:h-5 fill-current inline mr-2" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
                </svg>
                کانال رسمی تلگرام
              </p>
            </div>

            <div className="pt-3 md:pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
              <p className="text-xs text-gray-400">
                طراحی شده با ❤️ برای کاربران هوشمند ایرانی
              </p>
              <a
                href="https://t.me/BazarChiR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-sky-500 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-base md:text-lg">$</span>
                <span>عضویت در کانال تلگرام</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
