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
    shadowClass: 'shadow-[0_8px_20px_-8px_rgba(245,158,11,0.15)]',
    starColor: '#eab308',
    // 极其微弱的浅金白底色，大幅降低了不透明度和色彩浓度
    innerBgClass: 'bg-gradient-to-br from-white via-[#fffdf0] to-[#fffbed]',
    badgeClass: 'bg-zinc-900 text-amber-400 border border-zinc-800',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-amber-500 to-amber-700',
    pillClass: 'bg-zinc-900 text-amber-400 border-zinc-800'
  },
  ssr: {
    label: 'SSR 此生必吃',
    borderGradient: 'from-red-200 via-[#dc2626] to-red-800', // 餐饮红 (red-600)
    shadowClass: 'shadow-[0_8px_20px_-8px_rgba(220,38,38,0.1)]',
    starColor: '#ef4444', // red-500
    innerBgClass: 'bg-white',
    badgeClass: 'bg-gradient-to-br from-red-500 to-red-700 text-white',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-700',
    pillClass: 'bg-red-50 text-red-700 border-red-100'
  },
  sr: {
    label: 'SR 宝藏店铺',
    borderGradient: 'from-amber-200 via-[#f59e0b] to-orange-500', // 偏橙黄 (amber-500)
    shadowClass: 'shadow-[0_8px_20px_-8px_rgba(245,158,11,0.1)]',
    starColor: '#f59e0b', // amber-500
    innerBgClass: 'bg-white',
    badgeClass: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white', // 文字恢复白色
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-amber-500 to-orange-600',
    pillClass: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  r: {
    label: 'R 日常口粮',
    borderGradient: 'from-green-300 via-[#16A34A] to-green-800', // 餐饮绿 (更具食欲的鲜亮绿色)
    shadowClass: 'shadow-[0_8px_20px_-8px_rgba(22,163,74,0.08)]',
    starColor: '#16a34a',
    innerBgClass: 'bg-white',
    badgeClass: 'bg-gradient-to-br from-green-400 to-green-600 text-white',
    scoreClass: 'text-green-600',
    pillClass: 'bg-green-50 text-green-700 border-green-100'
  },
  n: {
    label: 'N 避雷踩坑',
    borderGradient: 'from-zinc-200 via-[#a1a1aa] to-zinc-600', // 恢复为灰色系
    shadowClass: 'shadow-[0_8px_20px_-8px_rgba(161,161,170,0.05)]',
    starColor: '#71717a',
    innerBgClass: 'bg-zinc-50',
    badgeClass: 'bg-gradient-to-br from-zinc-400 to-zinc-500 text-white',
    scoreClass: 'text-zinc-500',
    pillClass: 'bg-zinc-100 text-zinc-600 border-zinc-200'
  }
};

export const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  const config = rarityConfig[restaurant.rarity];
  const isUR = restaurant.rarity === 'ur';

  return (
    <div
      className={`relative flex flex-col rounded-[10px] sm:rounded-2xl min-h-[160px] sm:min-h-[300px] sm:h-[340px] w-full overflow-hidden bg-gradient-to-br ${config.borderGradient} p-[1.5px] ${config.shadowClass}`}
    >
      {/* 内部卡牌主体：通过极细的 1.5px padding 漏出底层渐变，形成高级金属丝边效果 */}
      <div className={`relative flex flex-col flex-grow rounded-[8.5px] sm:rounded-[14.5px] p-2.5 sm:p-6 overflow-hidden ${config.innerBgClass}`}>

        {/* 顶部栏：等级标签 & 馆长标志 */}
        <div className="flex justify-between items-start mb-2 sm:mb-4 shrink-0 relative z-20">
          <div className={`px-1.5 sm:px-3 py-0.5 sm:py-1.5 text-[8px] sm:text-[12px] font-black tracking-widest uppercase rounded sm:rounded-md shadow-sm ${config.badgeClass}`}>
            {config.label.split(' ')[0]} {/* 手机端只显示英文缩写 */}
            <span className="hidden sm:inline"> {config.label.split(' ')[1]}</span>
          </div>

          {restaurant.isCuratorOriginal && (
            <div className="w-4 h-4 sm:w-7 sm:h-7 flex-shrink-0" title="馆长首创">
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mt-1 sm:mt-2 shrink-0">
            <div className="flex flex-col overflow-hidden">
              <h3 className="text-sm sm:text-2xl font-black font-sans leading-tight tracking-tight truncate text-gray-900">
                {restaurant.name}
              </h3>
              <span className="text-[9px] sm:text-sm font-bold tracking-widest uppercase mt-0.5 sm:mt-1.5 truncate text-gray-500">
                {restaurant.location}
              </span>
            </div>

            <div className="flex-shrink-0 text-left sm:text-right mt-1 sm:-mt-2">
              <div className={`text-2xl sm:text-[3.5rem] font-black tracking-tighter leading-none ${config.scoreClass}`}>
                {restaurant.score.toFixed(1)}
              </div>
            </div>
          </div>

          {/* 价格 & 胶囊标签区 */}
          <div className="mt-2 sm:mt-8 flex flex-col gap-1.5 sm:gap-3 shrink-0">
            <div className="text-xs sm:text-lg font-black font-sans tracking-tighter text-gray-900">
              <span className="text-[8px] sm:text-[12px] uppercase opacity-60 mr-0.5 sm:mr-1 tracking-wider">¥</span>{restaurant.pricePerPerson}
              <span className="hidden sm:inline text-[12px] uppercase opacity-50 ml-1 tracking-wider text-gray-500">/人</span>
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2 max-h-[36px] sm:max-h-[26px] overflow-hidden">
              {restaurant.tags.map((tag, idx) => (
                <span key={idx} className={`px-1 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] sm:rounded-[4px] text-[8px] sm:text-[11px] font-bold border whitespace-nowrap uppercase tracking-wider ${config.pillClass}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 底部短评 */}
          <div className="mt-auto pt-2 sm:pt-6 overflow-hidden">
            <div className={`w-full border-t border-dashed mb-1.5 sm:mb-4 ${isUR ? 'border-amber-200' : 'border-gray-200'}`}></div>
            <p className="text-[10px] sm:text-[15px] leading-snug font-medium line-clamp-2 text-gray-500" title={restaurant.shortReview}>
              {restaurant.shortReview}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
