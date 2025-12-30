
import React from 'react';
import { PriceData } from '../types';

interface TopAssetsProps {
  assets: PriceData[];
}

export const TopAssets: React.FC<TopAssetsProps> = ({ assets }) => {
  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mb-12">
      {assets.slice(0, 2).map((asset) => (
        <div key={asset.id} className="relative overflow-hidden bg-emerald-600 text-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl">
          <div className="absolute -right-2 md:-right-4 -top-2 md:-top-4 w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <span className="text-xl md:text-3xl">{asset.icon}</span>
              <h3 className="text-xs md:text-lg opacity-80 font-medium">{asset.name}</h3>
            </div>
            <div className="flex items-baseline gap-2 md:gap-3">
              <span className="text-xl md:text-4xl font-black tracking-tight">{formatNumber(asset.price)}</span>
              <span className="text-[10px] md:text-sm opacity-60">{asset.unit}</span>
            </div>
            <div className="mt-3 md:mt-4 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
              {asset.change !== 0 && (
                <span className={`text-[10px] md:text-sm font-medium ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change >= 0 ? '▲' : '▼'} {Math.abs(asset.change).toFixed(2)}%
                </span>
              )}
              <span className="text-[9px] md:text-xs opacity-60">تغییرات ۲۴ ساعت گذشته</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
