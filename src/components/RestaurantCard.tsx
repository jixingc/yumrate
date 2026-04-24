import React from 'react';
import type { Restaurant, RarityLevel } from '../types';

interface Props {
  restaurant: Restaurant;
}

// 对应 UR, SSR, SR, R, N 五个等级的UI配置 (高级简约细边框渐变)
const rarityConfig: Record<RarityLevel, {
  label: string;
  borderGradient: string;
  shadowClass: string;
  starColor: string;
  innerBgClass: string;
  badgeClass: string;
  scoreClass: string;
  pillClass: string;
}> = {
  ur: {
    label: 'UR 殿堂神作',
    borderGradient: 'from-amber-200 via-yellow-500 to-amber-700',
    shadowClass: 'shadow-[0_15px_40px_-10px_rgba(245,158,11,0.25)]',
    starColor: '#eab308',
    // 浅金白底色，配合极其微妙的质感
    innerBgClass: 'bg-gradient-to-br from-white via-amber-50/50 to-amber-100/50',
    badgeClass: 'bg-zinc-900 text-amber-400 border border-zinc-800',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-amber-500 to-amber-700',
    pillClass: 'bg-zinc-900 text-amber-400 border-zinc-800'
  },
  ssr: {
    label: 'SSR 此生必吃',
    borderGradient: 'from-orange-200 via-orange-500 to-red-600',
    shadowClass: 'shadow-[0_15px_35px_-10px_rgba(249,115,22,0.15)]',
    starColor: '#f97316',
    innerBgClass: 'bg-white',
    badgeClass: 'bg-gradient-to-br from-orange-400 to-red-500 text-white',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600',
    pillClass: 'bg-orange-50 text-orange-700 border-orange-100'
  },
  sr: {
    label: 'SR 宝藏店铺',
    borderGradient: 'from-purple-200 via-[#7E57C2] to-purple-800',
    shadowClass: 'shadow-[0_15px_35px_-10px_rgba(126,87,194,0.15)]',
    starColor: '#8b5cf6',
    innerBgClass: 'bg-white',
    badgeClass: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-violet-500 to-purple-700',
    pillClass: 'bg-violet-50 text-violet-700 border-violet-100'
  },
  r: {
    label: 'R 日常口粮',
    borderGradient: 'from-green-200 via-[#69A541] to-green-800',
    shadowClass: 'shadow-[0_10px_30px_-10px_rgba(105,165,65,0.1)]',
    starColor: '#22c55e',
    innerBgClass: 'bg-white',
    badgeClass: 'bg-gradient-to-br from-green-400 to-green-600 text-white',
    scoreClass: 'text-green-500',
    pillClass: 'bg-green-50 text-green-700 border-green-100'
  },
  n: {
    label: 'N 避雷踩坑',
    borderGradient: 'from-blue-200 via-[#4A90E2] to-blue-800',
    shadowClass: 'shadow-[0_10px_30px_-10px_rgba(74,144,226,0.1)]',
    starColor: '#3b82f6',
    innerBgClass: 'bg-zinc-50',
    badgeClass: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
    scoreClass: 'text-blue-500',
    pillClass: 'bg-blue-50 text-blue-700 border-blue-100'
  }
};

export const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  const config = rarityConfig[restaurant.rarity];
  const isUR = restaurant.rarity === 'ur';

  return (
    <div
      className={`relative flex flex-col rounded-2xl min-h-[300px] sm:h-[340px] w-full overflow-hidden bg-gradient-to-br ${config.borderGradient} p-[1.5px] ${config.shadowClass}`}
    >
      {/* 内部卡牌主体：通过极细的 1.5px padding 漏出底层渐变，形成高级金属丝边效果 */}
      <div className={`relative flex flex-col flex-grow rounded-[14.5px] p-6 overflow-hidden ${config.innerBgClass}`}>

        {/* 顶部栏：等级标签 & 馆长标志 */}
        <div className="flex justify-between items-start mb-4 shrink-0 relative z-20">
          <div className={`px-3 py-1.5 text-[12px] font-black tracking-widest uppercase rounded-md shadow-sm ${config.badgeClass}`}>
            {config.label}
          </div>

          {restaurant.isCuratorOriginal && (
            <div className="w-7 h-7 flex-shrink-0" title="馆长首创">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform hover:scale-110" style={{ fill: config.starColor }}>
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
              <h3 className="text-2xl font-black font-sans leading-tight tracking-tight truncate text-gray-900">
                {restaurant.name}
              </h3>
              <span className="text-sm font-bold tracking-widest uppercase mt-1.5 truncate text-gray-500">
                {restaurant.location}
              </span>
            </div>

            <div className="flex-shrink-0 text-right -mt-2">
              <div className={`text-[2.5rem] sm:text-[3.5rem] font-black tracking-tighter leading-none ${config.scoreClass}`}>
                {restaurant.score.toFixed(1)}
              </div>
            </div>
          </div>

          {/* 价格 & 胶囊标签区 */}
          <div className="mt-4 sm:mt-8 flex flex-col gap-3 shrink-0">
            <div className="text-lg font-black font-sans tracking-tighter text-gray-900">
              <span className="text-[12px] uppercase opacity-60 mr-1 tracking-wider">¥</span>{restaurant.pricePerPerson}
              <span className="text-[12px] uppercase opacity-50 ml-1 tracking-wider text-gray-500">/人</span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[52px] sm:max-h-[26px] overflow-hidden">
              {restaurant.tags.map((tag, idx) => (
                <span key={idx} className={`px-2.5 py-1 rounded-[4px] text-[11px] font-bold border whitespace-nowrap uppercase tracking-wider ${config.pillClass}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 底部短评 */}
          <div className="mt-auto pt-6 overflow-hidden">
            <div className={`w-full border-t border-dashed mb-4 ${isUR ? 'border-amber-200' : 'border-gray-200'}`}></div>
            <p className="text-[15px] leading-snug font-medium line-clamp-2 text-gray-500" title={restaurant.shortReview}>
              {restaurant.shortReview}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
