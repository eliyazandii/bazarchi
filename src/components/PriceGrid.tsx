import React from 'react';
import { PriceData } from '../types';

interface PriceGridProps {
  title: string;
  items: PriceData[];
  isCurrency?: boolean;
  lastUpdated?: string;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fa-IR').format(num);
};

export const PriceGrid: React.FC<PriceGridProps> = ({ title, items, isCurrency, lastUpdated }) => {
  return (
    <div className="mb-10">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800 border-r-4 border-emerald-500 pr-3 flex items-center gap-2">
        {title}
      </h2>
      <div className={`grid gap-3 md:gap-4 ${title.includes('سکه') || title.includes('طلا') || title.includes('ارزهای بین‌المللی') ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 md:p-3 lg:p-4 rounded-xl md:rounded-2xl shadow-sm border hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[100px] md:min-h-[110px] lg:min-h-[120px]
              ${item.id === 'gold_bubble'
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 col-span-2'
                : 'bg-white border-gray-100'
              }`}
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <span className="text-gray-500 text-xs md:text-sm font-medium truncate flex-1">{item.name}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 md:gap-2 mb-2">
              <span className={`${title.includes('سکه') ? 'text-lg md:text-2xl' : 'text-xl md:text-2xl'} font-black text-gray-900`}>{formatNumber(item.price)}</span>
              {item.change !== 0 && item.id !== 'gold_bubble' && (
                <span className={`text-xs md:text-sm font-medium ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
                </span>
              )}
              {item.id === 'gold_bubble' && (
                <span className={`text-xs md:text-sm font-medium ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change >= 0 ? '▲' : '▼'}
                </span>
              )}
              <span className="text-gray-400 text-xs font-light">{item.unit}</span>
            </div>
            {lastUpdated && (
              <div className="border-t border-gray-50 pt-2 flex justify-between items-center w-full">
                <span className="text-[10px] text-gray-300">بروزرسانی:</span>
                <span className="text-[10px] text-gray-400 font-medium">{lastUpdated}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
