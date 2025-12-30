
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { PriceGrid } from './components/PriceGrid';
import { TopAssets } from './components/TopAssets';
import { AboutModal } from './components/AboutModal';
import { GovernmentRatesModal } from './components/GovernmentRatesModal';
import { BlogModal } from './components/BlogModal';
import { MarketState } from './types';
import { fetchMarketData } from './services/marketService';
import logo from './assets/logo.png'; 

const REFRESH_INTERVAL = 120000; // 2 minutes in milliseconds

const App: React.FC = () => {
  const [market, setMarket] = useState<MarketState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextUpdate, setNextUpdate] = useState<number>(REFRESH_INTERVAL);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isGovRatesOpen, setIsGovRatesOpen] = useState<boolean>(false);
  const [isBlogOpen, setIsBlogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  const updateData = useCallback(async () => {
    setIsUpdating(true);
    const data = await fetchMarketData();
    if (data) {
      setMarket(data);
      localStorage.setItem('marketData', JSON.stringify(data));
    }
    setLoading(false);
    setIsUpdating(false);
    setNextUpdate(REFRESH_INTERVAL);
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem('marketData');
    if (cached) {
      setMarket(JSON.parse(cached));
      setLoading(false);
    }
    updateData();
    const interval = setInterval(() => {
      updateData();
    }, REFRESH_INTERVAL);

    const timerInterval = setInterval(() => {
      setNextUpdate(prev => Math.max(0, prev - 1000));
    }, 1000);

    // Show welcome message after every refresh
    if (!loading) {
      setTimeout(() => setShowWelcome(true), 2000); // Show after 2 seconds
    }

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
    };
  }, [updateData, loading]);

  // Filtering Logic
  const filteredCurrencies = useMemo(() => {
    if (!market) return [];
    return market.currencies.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [market, searchTerm]);

  const filteredGold = useMemo(() => {
    if (!market) return [];
    return market.gold.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [market, searchTerm]);

  const filteredCoins = useMemo(() => {
    if (!market) return [];
    return market.coins
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [market, searchTerm]);




  const hasResults = filteredCurrencies.length > 0 || filteredGold.length > 0 || filteredCoins.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-gray-700 font-['Vazirmatn']">در حال دریافت قیمت‌های لحظه‌ای بازار...</h1>
        </div>
      </div>
    );
  }

  const secondsRemaining = Math.ceil(nextUpdate / 1000);
  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

  return (
    <React.Fragment>
    <Helmet>
        <title>بازارچی - قیمت لحظه‌ای طلا و ارز</title>
        <meta name="description" content="بازارچی - پلتفرم رایگان قیمت لحظه‌ای طلا، سکه، ارز و رمزارزها بر اساس منابع معتبر بازار ایران. دسترسی سریع به نرخ‌های واقعی بازار آزاد." />
        <meta name="keywords" content="قیمت طلا, قیمت ارز, قیمت سکه, نرخ لحظه‌ای, بازار ایران, دلار, یورو, بیت‌کوین, طلا 18عیار, نرخ ارز آزاد, قیمت سکه امامی, قیمت دلار آمریکا" />
        <meta name="author" content="بازارچی" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#10b981" />
        <meta property="og:title" content="بازارچی - قیمت لحظه‌ای طلا و ارز" />
        <meta property="og:description" content="پلتفرم رایگان قیمت لحظه‌ای طلا، سکه، ارز و رمزارزها بر اساس منابع معتبر بازار ایران." />
        <meta property="og:image" content="/favicon.png" />
        <meta property="og:image:alt" content="لوگو بازارچی - قیمت لحظه‌ای طلا و ارز" />
        <meta property="og:url" content="https://bazarchi.ir" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:site_name" content="بازارچی" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="بازارچی - قیمت لحظه‌ای طلا و ارز" />
        <meta name="twitter:description" content="پلتفرم رایگان قیمت لحظه‌ای طلا، سکه، ارز و رمزارزها بر اساس منابع معتبر بازار ایران." />
        <meta name="twitter:image" content="/favicon.png" />
        <meta name="twitter:image:alt" content="لوگو بازارچی - قیمت لحظه‌ای طلا و ارز" />
        <link rel="canonical" href="https://bazarchir.ir/" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="manifest" href="/manifest.json" />
      </Helmet>
      <div className="min-h-screen bg-slate-50 flex flex-col font-['Vazirmatn']">
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <GovernmentRatesModal isOpen={isGovRatesOpen} onClose={() => setIsGovRatesOpen(false)} />
      <BlogModal isOpen={isBlogOpen} onClose={() => setIsBlogOpen(false)} />

      {/* Header - Centered Search Layout */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">

          {/* Top Row: Brand + Search (Mobile) / Brand (Desktop) */}
          <div className="flex items-center gap-3 md:justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img src={logo} alt="Bazarchi Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-200 object-cover" />
              <h1 className="text-xl font-black text-gray-800 tracking-tight">بازارچی</h1>
            </div>

            {/* Search Box - Next to logo on mobile */}
            <div className="relative flex-1 max-w-lg md:hidden">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-lg opacity-40">🔍</span>
              </div>
              <input
                type="text"
                placeholder="جستجو..."
                className="w-full bg-slate-100/50 border border-transparent py-2.5 pr-11 pl-10 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium text-sm text-gray-700 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-300 hover:text-rose-500"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Search (Desktop) + Update Info */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Center: Search Box - Desktop only */}
            <div className="relative w-full max-w-lg hidden md:block">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-lg opacity-40">🔍</span>
              </div>
              <input
                type="text"
                placeholder="جستجوی سریع..."
                className="w-full bg-slate-100/50 border border-transparent py-2.5 pr-11 pl-10 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium text-sm text-gray-700 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-300 hover:text-rose-500"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Update Info */}
            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-0 w-full md:w-auto justify-between md:justify-center">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                به‌روزرسانی بعدی در <span className="text-emerald-600 font-black">{secondsRemaining}</span> ثانیه
              </div>
              <div className="text-xs font-medium text-gray-500">
                آخرین بروزرسانی: <span className="text-gray-900 font-bold">{market?.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">

        {/* Hero & Telegram Section (Side-by-Side on Desktop) */}
        {!searchTerm && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-14">

            {/* Right: Hero Text */}
            <div className="flex-1 text-center md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black mb-4 uppercase tracking-widest border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                بازار زنده تهران
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-800 mb-4 leading-tight">💎 نبض بازار در جیب شما</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-lg">به‌روزرسانی لحظه‌ای قیمت‌ها بر اساس معاملات واقعی بازار آزاد و منابع معتبر بانکی</p>
            </div>

            {/* Left: Premium Telegram Banner */}
            <div className="flex-1 w-full max-w-md">
              <a
                href="https://t.me/BazarChiR"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white border border-sky-100 shadow-xl shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="flex items-center gap-2 md:gap-4 lg:gap-5 p-3 md:p-5 lg:p-6 relative z-10">
                  {/* Icon with Glowing Effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-sky-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl lg:text-3xl shadow-lg shadow-sky-200 relative z-10 group-hover:rotate-12 transition-transform duration-500">
                      ✈️
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-gray-900 font-black text-xs md:text-base lg:text-lg mb-1 flex items-center gap-2">
                      کانال رسمی تلگرام
                      <span className="inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                    </h3>
                    <p className="text-gray-500 text-[9px] md:text-[11px] lg:text-xs font-bold leading-relaxed">
                      ارسال منظم و خودکار قیمت‌ها <br />
                      <span className="text-sky-600">بدون پیام‌های تبلیغاتی و اضافی</span>
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                      <span className="font-black text-xs md:text-base lg:text-lg">←</span>
                    </div>
                  </div>
                </div>

                {/* Bottom decorative bar */}
                <div className="h-1 w-full md:h-1.5 bg-gradient-to-l from-sky-400 to-sky-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500"></div>
              </a>
            </div>
          </div>
        )}

        {/* Top Assets (Pinned) - Only show if not searching */}
        {market && !searchTerm && (
          <TopAssets
            assets={[
              ...market.currencies.filter(c => c.id === 'USD'),
              ...market.gold.filter(g => g.id === 'gold_18k'),
              ...market.gold.filter(g => g.id === 'gold_ounce')
            ]}
          />
        )}



        {/* Dynamic Results */}
        {market && hasResults ? (
          <div className="space-y-12">
            {filteredGold.length > 0 && (
              <PriceGrid
                title="⚜️ طلا"
                items={filteredGold}
                lastUpdated={market.lastUpdated}
              />
            )}
            {filteredCoins.length > 0 && (
              <PriceGrid
                title="💰 سکه"
                items={filteredCoins}
                lastUpdated={market.lastUpdated}
              />
            )}
            {filteredCurrencies.length > 0 && (
              <PriceGrid
                title="💵 ارزهای بین‌المللی"
                items={filteredCurrencies}
                isCurrency
                lastUpdated={market.lastUpdated}
              />
            )}
          </div>
        ) : market && (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">نتیجه‌ای پیدا نکردیم!</h3>
            <p className="text-gray-400 font-medium">نام ارز یا مسکوکات را به فارسی یا انگلیسی جستجو کنید.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-95"
            >
              نمایش لیست کامل قیمت‌ها
            </button>
          </div>
        )}
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Column 1: Brand */}
            <div className="flex flex-col gap-4 text-center md:text-right">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <img src={logo} alt="Bazarchi Logo" className="w-10 h-10 rounded-lg shadow-md object-cover" />
                <span className="text-xl font-black text-gray-800">بازارچی</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                بازارچی پلتفرمی هوشمند برای رصد لحظه‌ای تحولات بازار مالی ایران است. هدف ما ارائه شفاف‌ترین و سریع‌ترین اطلاعات به کاربران فارسی‌زبان است.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="text-center md:text-right">
              <h4 className="text-gray-900 font-black mb-6 text-sm">دسترسی سریع</h4>
              <ul className="flex flex-col gap-3 text-gray-500 text-sm font-bold">
                <li><button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setSearchTerm(''); }} className="hover:text-emerald-600 transition-colors text-center md:text-right">قیمت زنده بازار</button></li>
                <li><button onClick={() => setIsGovRatesOpen(true)} className="hover:text-emerald-600 transition-colors text-center md:text-right">نرخ ارزهای دولتی</button></li>
                <li><button onClick={() => setIsAboutOpen(true)} className="hover:text-emerald-600 transition-colors text-center md:text-right">درباره ما</button></li>
                <li><button onClick={() => alert('بلاگ بازارچی به زودی راه‌اندازی می‌شود!')} className="hover:text-emerald-600 transition-colors text-center md:text-right">بلاگ</button></li>
              </ul>
            </div>

            {/* Column 3: Social & Communication */}
            <div className="text-center md:text-right">
              <h4 className="text-gray-900 font-black mb-6 text-sm">ارتباطات و شبکه‌ها</h4>
              <div className="flex flex-col gap-3 items-center md:items-start">
                {/* Enhanced Telegram Card for Footer */}
                <a
                  href="https://t.me/BazarChiR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full group flex items-center justify-between p-3.5 bg-sky-50/50 border border-sky-100/50 rounded-2xl hover:bg-sky-500 hover:border-sky-500 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                      ✈️
                    </div>
                    <div className="text-right">
                      <span className="block text-gray-900 font-black text-[11px] group-hover:text-white transition-colors">کانال تلگرام</span>
                      <span className="text-sky-600 text-[10px] font-bold group-hover:text-sky-100 transition-colors">@BazarChiR</span>
                    </div>
                  </div>
                  <div className="text-sky-300 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </a>

                {/* Support Contact */}
                <a
                  href="https://t.me/BazarChiR"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                >
                  <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">💬</span>
                  <span className="text-slate-500 font-bold text-[10px] group-hover:text-slate-900 transition-colors">تماس با پشتیبانی بازارچی</span>
                </a>
              </div>
            </div>

            {/* Column 4: Status */}
            <div className="text-center md:text-right">
              <h4 className="text-gray-900 font-black mb-6 text-sm">وضعیت سرویس</h4>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-emerald-800 font-bold text-xs">سرویس فعال است</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">اتصال به شبکه صرافی‌های معتبر برقرار است.</div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[11px] text-gray-400 text-center md:text-right">
              <p className="mb-1 font-bold">© ۱۴۰۳ بازارچی. تمامی حقوق محفوظ است.</p>
              <p>قیمت‌ها صرفاً جهت اطلاع‌رسانی بوده و بازارچی مسئولیتی در قبال معاملات ندارد.</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
                <span className="text-[10px] text-gray-300 font-bold">نسخه ۱.۵.۲</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mini Update Indicator */}
      {isUpdating && (
        <div className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white shadow-2xl rounded-2xl px-5 py-2.5 flex items-center gap-3 border border-gray-800 animate-in slide-in-from-bottom-10">
          <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[11px] font-black uppercase tracking-widest">در حال بروزرسانی قیمت‌ها...</span>
        </div>
      )}
    </div>
    </React.Fragment>
  );
};

export default App;
