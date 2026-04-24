import React from 'react';
import type { Restaurant, RarityLevel } from '../types';

interface Props {
  restaurant: Restaurant;
}

// 对应 UR, SSR, SR, R, N 五个等级的UI配置
const rarityConfig: Record<RarityLevel, {
  label: string;
  themeColor: string;
  starColor: string;
  wrapperClass: string;
  badgeClass: string;
  scoreClass: string;
  pillClass: string;
  innerBorderClass: string;
}> = {
  ur: {
    label: 'UR 殿堂神作',
    themeColor: '#fcd34d',
    starColor: '#fcd34d',
    wrapperClass: 'bg-zinc-900 border-zinc-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] shadow-amber-500/20',
    innerBorderClass: 'border-[3px] border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent',
    badgeClass: 'bg-gradient-to-br from-zinc-800 to-black text-amber-400 border border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-md',
    pillClass: 'bg-zinc-800 text-amber-400 border-zinc-700'
  },
  ssr: {
    label: 'SSR 此生必吃',
    themeColor: '#f97316',
    starColor: '#f97316',
    wrapperClass: 'bg-zinc-50 border-orange-200 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.3)]',
    innerBorderClass: 'border-[3px] border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent',
    badgeClass: 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md shadow-orange-500/30 border border-orange-300/50',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 drop-shadow-sm',
    pillClass: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  sr: {
    label: 'SR 宝藏店铺',
    themeColor: '#8b5cf6',
    starColor: '#8b5cf6',
    wrapperClass: 'bg-zinc-50 border-violet-200 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.2)]',
    innerBorderClass: 'border-[3px] border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-transparent',
    badgeClass: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-purple-500/20',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-violet-500 to-purple-700',
    pillClass: 'bg-violet-50 text-violet-700 border-violet-200'
  },
  r: {
    label: 'R 日常口粮',
    themeColor: '#3b82f6',
    starColor: '#3b82f6',
    wrapperClass: 'bg-white border-blue-100 shadow-[0_10px_20px_-10px_rgba(59,130,246,0.15)]',
    innerBorderClass: 'border-transparent',
    badgeClass: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
    scoreClass: 'text-blue-500',
    pillClass: 'bg-blue-50 text-blue-700 border-blue-100'
  },
  n: {
    label: 'N 避雷踩坑',
    themeColor: '#71717a',
    starColor: '#71717a',
    wrapperClass: 'bg-zinc-100 border-zinc-200 shadow-sm opacity-80 hover:opacity-100',
    innerBorderClass: 'border-transparent',
    badgeClass: 'bg-gradient-to-br from-zinc-400 to-zinc-500 text-white',
    scoreClass: 'text-zinc-500',
    pillClass: 'bg-zinc-200 text-zinc-600 border-zinc-300'
  }
};

export const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  const config = rarityConfig[restaurant.rarity];
  const isUR = restaurant.rarity === 'ur';

  return (
    <div className={`
      relative flex flex-col rounded-2xl min-h-[300px] sm:h-[340px] w-full
      border overflow-hidden p-6
      ${config.wrapperClass}
    `}
      style={{ borderTopWidth: '6px', borderTopColor: config.themeColor }}
    >
      {/* 实体卡片内框（模拟厚度和金属边框反射） */}
      <div className={`absolute inset-1 border rounded-xl pointer-events-none z-10 ${config.innerBorderClass}`}></div>

      {/* 顶部栏：等级标签 & 馆长标志 */}
      <div className="flex justify-between items-start mb-4 shrink-0 relative z-20">
        <div className={`px-3.5 py-1.5 text-[13px] font-black tracking-widest uppercase rounded-lg ${config.badgeClass}`}>
          {config.label}
        </div>

        {restaurant.isCuratorOriginal && (
          <div className="w-7 h-7 flex-shrink-0 drop-shadow-xl" title="馆长首创">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform hover:scale-110 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]" style={{ fill: config.starColor }}>
              <path d="M10 0C10 6 14 10 20 10C14 10 10 14 10 20C10 14 6 10 0 10C6 10 10 6 10 0Z" />
              <path d="M19 14C19 16.4 20.6 18 23 18C20.6 18 19 19.6 19 22C19 19.6 17.4 18 15 18C17.4 18 19 16.4 19 14Z" />
            </svg>
          </div>
        )}
      </div>

      {/* 卡片内容区 */}
      <div className="flex flex-col flex-grow z-20 relative">
        {/* 标题 & 分数区域 */}
        <div className="flex justify-between items-start gap-2 mt-2 shrink-0">
          <div className="flex flex-col overflow-hidden pr-2">
            <h3 className={`text-2xl font-black font-sans leading-tight tracking-tight truncate ${isUR ? 'text-white' : 'text-gray-900'}`}>
              {restaurant.name}
            </h3>
            <span className={`text-sm font-bold tracking-widest uppercase mt-1.5 truncate ${isUR ? 'text-zinc-500' : 'text-gray-400'}`}>
              {restaurant.location}
            </span>
          </div>

          <div className="flex-shrink-0 text-right -mt-2">
            <div className={`text-[2.5rem] sm:text-[3.5rem] font-black tracking-tighter leading-none ${config.scoreClass}`} style={{ WebkitTextStroke: isUR ? '1px rgba(251,191,36,0.3)' : '' }}>
              {restaurant.score.toFixed(1)}
            </div>
          </div>
        </div>

        {/* 价格 & 胶囊标签区 */}
        <div className="mt-4 sm:mt-8 flex flex-col gap-3 shrink-0">
          <div className={`text-lg font-black font-sans tracking-tighter ${isUR ? 'text-amber-400' : 'text-gray-900'}`}>
            <span className="text-[12px] uppercase opacity-60 mr-1 tracking-wider">¥</span>{restaurant.pricePerPerson}
            <span className={`text-[12px] uppercase opacity-50 ml-1 tracking-wider ${isUR ? 'text-zinc-400' : 'text-gray-500'}`}>/人</span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-[52px] sm:max-h-[26px] overflow-hidden">
            {restaurant.tags.map((tag, idx) => (
              <span key={idx} className={`px-2.5 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap uppercase tracking-wider ${config.pillClass}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 底部短评 */}
        <div className="mt-auto pt-6 overflow-hidden">
          <div className={`w-full border-t border-dashed mb-4 ${isUR ? 'border-zinc-700' : 'border-gray-200'}`}></div>
          <p className={`text-[15px] leading-snug font-medium line-clamp-2 ${isUR ? 'text-zinc-400' : 'text-gray-500'}`} title={restaurant.shortReview}>
            {restaurant.shortReview}
          </p>
        </div>
      </div>

    </div>
  );
};
