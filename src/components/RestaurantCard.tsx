import React from 'react';
import type { Restaurant, RarityLevel } from '../types';

interface Props {
  restaurant: Restaurant;
}

// 对应 UR, SSR, SR, R, N 五个等级的UI配置 (TCG 卡牌风格)
const rarityConfig: Record<RarityLevel, {
  label: string;
  themeColor: string; // 主色 (用于条纹)
  darkColor: string;  // 暗色 (用于条纹间隔)
  starColor: string;
  innerBgClass: string;
  badgeClass: string;
  scoreClass: string;
  pillClass: string;
  nameplateClass: string;
  textColor: string;
  subtextColor: string;
}> = {
  ur: {
    label: 'UR 殿堂神作',
    themeColor: '#fbbf24', // amber-400
    darkColor: '#b45309',  // amber-700
    starColor: '#fcd34d',
    innerBgClass: 'bg-zinc-900',
    badgeClass: 'bg-gradient-to-br from-amber-200 to-amber-500 text-amber-900',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600',
    pillClass: 'bg-zinc-800 text-amber-400 border-zinc-700',
    nameplateClass: 'bg-gradient-to-r from-zinc-800 via-amber-900/30 to-zinc-800 border-t border-amber-500/30',
    textColor: 'text-white',
    subtextColor: 'text-zinc-400'
  },
  ssr: {
    label: 'SSR 此生必吃',
    themeColor: '#f97316', // orange-500
    darkColor: '#c2410c',  // orange-700
    starColor: '#f97316',
    innerBgClass: 'bg-zinc-50',
    badgeClass: 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md shadow-orange-500/30',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600',
    pillClass: 'bg-orange-100 text-orange-700 border-orange-200',
    nameplateClass: 'bg-gradient-to-r from-orange-50 via-white to-orange-50 border-t border-orange-200',
    textColor: 'text-gray-900',
    subtextColor: 'text-gray-500'
  },
  sr: {
    label: 'SR 宝藏店铺',
    themeColor: '#a78bfa', // violet-400
    darkColor: '#6d28d9',  // violet-700
    starColor: '#8b5cf6',
    innerBgClass: 'bg-zinc-50',
    badgeClass: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-purple-500/20',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-violet-500 to-purple-700',
    pillClass: 'bg-violet-100 text-violet-700 border-violet-200',
    nameplateClass: 'bg-gradient-to-r from-violet-50 via-white to-violet-50 border-t border-violet-200',
    textColor: 'text-gray-900',
    subtextColor: 'text-gray-500'
  },
  r: {
    label: 'R 日常口粮',
    themeColor: '#60a5fa', // blue-400
    darkColor: '#1d4ed8',  // blue-700
    starColor: '#3b82f6',
    innerBgClass: 'bg-white',
    badgeClass: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
    scoreClass: 'text-blue-500',
    pillClass: 'bg-blue-50 text-blue-700 border-blue-100',
    nameplateClass: 'bg-gray-50 border-t border-blue-100',
    textColor: 'text-gray-900',
    subtextColor: 'text-gray-500'
  },
  n: {
    label: 'N 避雷踩坑',
    themeColor: '#a1a1aa', // zinc-400
    darkColor: '#3f3f46',  // zinc-700
    starColor: '#71717a',
    innerBgClass: 'bg-zinc-100',
    badgeClass: 'bg-gradient-to-br from-zinc-400 to-zinc-500 text-white',
    scoreClass: 'text-zinc-500',
    pillClass: 'bg-zinc-200 text-zinc-600 border-zinc-300',
    nameplateClass: 'bg-zinc-200 border-t border-zinc-300',
    textColor: 'text-zinc-600',
    subtextColor: 'text-zinc-500'
  }
};

export const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  const config = rarityConfig[restaurant.rarity];
  const isUR = restaurant.rarity === 'ur';

  return (
    <div
      className="relative flex flex-col rounded-2xl min-h-[300px] sm:h-[340px] w-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.25)] overflow-hidden transition-transform duration-300"
      style={{
        // TCG 斜纹边框效果
        background: `repeating-linear-gradient(
          -45deg,
          ${config.themeColor},
          ${config.themeColor} 12px,
          ${config.darkColor} 12px,
          ${config.darkColor} 24px
        )`,
        padding: '8px' // 边框厚度
      }}
    >
      {/* 内部卡牌主体 */}
      <div className={`relative flex flex-col flex-grow rounded-xl overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.1)] ${config.innerBgClass}`}>

        {/* 卡牌上半部分：内容区 */}
        <div className="flex-grow p-5 flex flex-col relative z-20">

          {/* 顶部标签 & 图标 */}
          <div className="flex justify-between items-start mb-4 shrink-0">
            <div className={`px-3 py-1 text-[12px] font-black tracking-widest uppercase rounded-sm border border-white/30 ${config.badgeClass}`}>
              {config.label}
            </div>

            {restaurant.isCuratorOriginal && (
              <div className="w-8 h-8 flex-shrink-0 drop-shadow-lg" title="馆长首创">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_6px_rgba(252,211,77,0.6)]" style={{ fill: config.starColor }}>
                  <path d="M10 0C10 6 14 10 20 10C14 10 10 14 10 20C10 14 6 10 0 10C6 10 10 6 10 0Z" />
                  <path d="M19 14C19 16.4 20.6 18 23 18C20.6 18 19 19.6 19 22C19 19.6 17.4 18 15 18C17.4 18 19 16.4 19 14Z" />
                </svg>
              </div>
            )}
          </div>

          {/* 分数 */}
          <div className="flex justify-end mb-2">
            <div className={`text-[3.5rem] font-black tracking-tighter leading-none drop-shadow-sm ${config.scoreClass}`} style={{ WebkitTextStroke: isUR ? '1px rgba(251,191,36,0.3)' : '1px rgba(0,0,0,0.05)' }}>
              {restaurant.score.toFixed(1)}
            </div>
          </div>

          {/* 价格 & 标签 */}
          <div className="mt-auto flex flex-col gap-3">
            <div className={`text-lg font-black font-sans tracking-tighter ${isUR ? 'text-amber-400' : 'text-gray-900'}`}>
              <span className="text-[12px] uppercase opacity-60 mr-1 tracking-wider">¥</span>{restaurant.pricePerPerson}
              <span className={`text-[12px] uppercase opacity-50 ml-1 tracking-wider ${isUR ? 'text-zinc-400' : 'text-gray-500'}`}>/人</span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[52px] sm:max-h-[26px] overflow-hidden">
              {restaurant.tags.map((tag, idx) => (
                <span key={idx} className={`px-2 py-1 rounded-[4px] text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider ${config.pillClass}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 卡牌下半部分：铭牌区域 (Nameplate) */}
        <div className={`px-5 py-4 shrink-0 flex flex-col justify-center min-h-[90px] ${config.nameplateClass}`}>
          <h3 className={`text-2xl font-black font-sans leading-tight tracking-tight truncate ${config.textColor}`}>
            {restaurant.name}
          </h3>
          <span className={`text-xs font-bold tracking-widest uppercase mt-1 truncate ${config.subtextColor}`}>
            {restaurant.location}
          </span>
          <p className={`text-[13px] leading-snug font-medium line-clamp-1 mt-2 opacity-80 ${config.subtextColor}`} title={restaurant.shortReview}>
            {restaurant.shortReview}
          </p>
        </div>

      </div>
    </div>
  );
};
