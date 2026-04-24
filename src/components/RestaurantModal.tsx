import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteVisitRecord } from '../lib/api';
import type { Restaurant, RarityLevel, VisitRecord } from '../types';

interface Props {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const rarityConfig: Record<RarityLevel, {
  label: string;
  themeColor: string;
  badgeClass: string;
  scoreClass: string;
  headerBgClass: string;
  pillClass: string;
  watermarkClass: string;
}> = {
  ur: {
    label: 'UR',
    themeColor: '#0f172a',
    badgeClass: 'bg-gradient-to-br from-slate-900 via-black to-slate-800 text-amber-400 shadow-sm border border-amber-500/40',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600',
    headerBgClass: 'bg-zinc-900 text-white',
    pillClass: 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700',
    watermarkClass: 'text-amber-400'
  },
  ssr: {
    label: 'SSR',
    themeColor: '#dc2626', // 餐饮红 (red-600)
    badgeClass: 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-sm',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-700',
    headerBgClass: 'bg-gradient-to-b from-red-50 to-white text-zinc-900',
    pillClass: 'bg-red-50 text-red-800 border border-red-200',
    watermarkClass: 'text-red-400'
  },
  sr: {
    label: 'SR',
    themeColor: '#f59e0b', // 偏橙黄 (amber-500)
    badgeClass: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm',
    scoreClass: 'text-transparent bg-clip-text bg-gradient-to-b from-amber-500 to-orange-600',
    headerBgClass: 'bg-gradient-to-b from-amber-50 to-white text-zinc-900',
    pillClass: 'bg-amber-100 text-amber-800 border border-amber-200',
    watermarkClass: 'text-amber-400'
  },
  r: {
    label: 'R',
    themeColor: '#16a34a', // 餐饮绿 (green-600)
    badgeClass: 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm',
    scoreClass: 'text-green-600',
    headerBgClass: 'bg-gradient-to-b from-green-50 to-white text-zinc-900',
    pillClass: 'bg-green-100 text-green-800 border border-green-200',
    watermarkClass: 'text-green-400'
  },
  n: {
    label: 'N',
    themeColor: '#a1a1aa',
    badgeClass: 'bg-gradient-to-br from-zinc-400 to-zinc-500 text-white shadow-sm',
    scoreClass: 'text-zinc-500',
    headerBgClass: 'bg-gradient-to-b from-zinc-50 to-white text-zinc-900',
    pillClass: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
    watermarkClass: 'text-zinc-400'
  }
};

export const RestaurantModal: React.FC<Props> = ({ restaurant, isOpen, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !restaurant) return null;

  const config = rarityConfig[restaurant.rarity];
  const isUR = restaurant.rarity === 'ur';

  const handleRecordClick = (record: VisitRecord) => {
    onClose();
    navigate('/entry', { state: { restaurant, record } });
  };

  const handleDeleteRecord = async (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation(); // 阻止触发卡片的点击事件(编辑)
    if (window.confirm('确定要删除这条探店记录吗？')) {
      const res = await deleteVisitRecord(recordId, restaurant.id);
      if (res.success) {
        if (res.restaurantDeleted) {
          // 如果卡片被删除了，关闭弹窗并刷新外层列表
          onClose();
          if (onUpdate) onUpdate();
        } else {
          // 如果只是删除了记录，餐厅还在，需要重新刷新数据
          // 这里最简单的做法是也关闭弹窗刷新（或者由上层重新传restaurant过来）
          // 为了简单，我们关闭并刷新
          onClose();
          if (onUpdate) onUpdate();
        }
      } else {
        alert('删除失败，请重试');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:py-12" aria-modal="true" role="dialog">

      {/* 沉浸式模糊背景遮罩 - 更深的Vault风格 */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* 弹窗主体容器 - 就像一张巨大的实体收藏卡 */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-full animate-in fade-in zoom-in-95 duration-300 overflow-hidden"
        style={{ boxShadow: `0 20px 60px -10px ${config.themeColor}40` }}
      >

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition-colors z-50"
        >
          <span className="text-2xl font-bold leading-none -mt-1 drop-shadow-md">×</span>
        </button>

        {/* 全局滚动容器：允许头部和日志一起向上滚动 */}
        <div className="overflow-y-auto w-full flex flex-col">

          {/* 1. Poster Header (海报级头部) */}
          <div className={`relative shrink-0 flex flex-col ${config.headerBgClass}`}>

          {/* 超巨大炫耀性水印背景 (The Flex Factor) */}
          <div className={`absolute top-0 right-0 bottom-0 overflow-hidden pointer-events-none flex items-center justify-end pr-8 ${config.watermarkClass}`}>
            <span
              className="text-[180px] sm:text-[220px] font-bold italic leading-none tracking-tighter select-none opacity-30"
              style={{
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '2px currentColor',
                WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
                maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
              }}
            >
              {config.label}
            </span>
          </div>

          {/* 镇楼图被移除，恢复极简排版 */}
          {/* 内容区 */}
          <div className="relative z-10 px-8 pb-8 mt-4">

            {/* 炫耀级徽章 & 地点 */}
            <div className="flex flex-col items-start gap-2 mb-4 mt-2">
              <span className={`px-4 py-1.5 text-[15px] font-black tracking-widest uppercase rounded-lg shadow-xl inline-block ${config.badgeClass}`}>
                {config.label}
              </span>
              <span className={`text-sm font-bold tracking-widest uppercase pl-1 ${isUR ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {restaurant.location}
              </span>
            </div>

            {/* 标题 & 分数 */}
            <div className="flex items-end justify-between gap-6 mb-6 mt-2">
              <h2 className={`text-4xl sm:text-[2.75rem] font-black font-sans tracking-tight leading-none ${isUR ? 'text-white' : 'text-zinc-900'}`}>
                {restaurant.name}
              </h2>
              <div className="flex flex-col items-end pt-4">
                <div className={`text-7xl font-black tracking-tighter leading-none ${config.scoreClass}`} style={{ WebkitTextStroke: isUR ? '1px rgba(251,191,36,0.3)' : '' }}>
                  {restaurant.score.toFixed(1)}
                </div>
              </div>
            </div>

            {/* 胶囊标签 */}
            <div className="flex flex-wrap gap-2 items-center">
              {restaurant.tags.map(tag => (
                <span key={tag} className={`px-3.5 py-1.5 text-[12px] font-bold rounded-md uppercase tracking-wider ${config.pillClass}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Body (探店记录日志) */}
        <div className="flex-1 p-8 bg-zinc-50 rounded-b-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-zinc-900">探店档案 <span className="text-zinc-400 font-normal">Logs</span></h3>
            <span className="text-sm font-bold text-zinc-400">{restaurant.visitRecords.length} 份记录</span>
          </div>

          <div className="space-y-6">
            {restaurant.visitRecords.map((record, index) => (
              <div
                key={record.id}
                onClick={() => handleRecordClick(record)}
                className="relative bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-zinc-300 transition-all cursor-pointer group overflow-hidden"
              >
                {/* 记录专属的镇楼图 (如果存在) */}
                {record.coverImage && (
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40">
                    <img src={record.coverImage} alt="Cover" className="w-full h-full object-cover rounded-bl-3xl mask-image-gradient" style={{ WebkitMaskImage: 'radial-gradient(circle at top right, black 30%, transparent 70%)' }} />
                  </div>
                )}

                {/* 如果是 SR 以上等级的记录，右上角显示小徽章 */}
                {(restaurant.rarity === 'ur' || restaurant.rarity === 'ssr' || restaurant.rarity === 'sr') && (
                  <div className={`absolute top-0 left-6 px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-b-md shadow-sm ${config.badgeClass}`}>
                    {config.label} LOG
                  </div>
                )}

                {/* 右上角操作区：编辑提示(PC悬停可见) + 删除按钮(常驻) */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block pointer-events-none">
                    点击编辑 ↗
                  </span>
                  <button
                    onClick={(e) => handleDeleteRecord(e, record.id)}
                    className="flex items-center justify-center p-2.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 bg-zinc-100/80 rounded-full transition-all shadow-sm"
                    title="删除记录"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* 记录元数据 */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 mb-6 pb-6 border-b border-zinc-100 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                      {record.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900">{record.reviewerName}</div>
                      <div className="text-xs text-zinc-400 font-medium">{record.date}</div>
                    </div>
                  </div>
                  <div className="text-right pr-8 sm:pr-24">
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">总花费</div>
                    <div className="text-xl font-black font-sans text-zinc-900 tracking-tight">¥{record.totalCost}</div>
                  </div>
                </div>

                {/* 点菜清单 */}
                {record.dishes.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">点菜点评</h4>
                    <ul className="space-y-3">
                      {record.dishes.map(dish => (
                        <li key={dish.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 leading-relaxed">
                          <span className="font-bold text-zinc-900 whitespace-nowrap">「{dish.name}」</span>
                          <span className="text-zinc-600 text-[14px]">{dish.review}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 整体体验文本 */}
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">整体体验</h4>
                  <p className="text-[15px] leading-relaxed text-zinc-700 font-serif whitespace-pre-wrap">
                    {record.overallExperience}
                  </p>
                </div>

                {/* 记录编号标记 */}
                <div className="absolute -left-3 top-8 text-[10px] font-bold text-zinc-300 -rotate-90 tracking-widest uppercase hidden sm:block">
                  LOG #{String(index + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>

        </div>

      </div>
    </div>
  );
};
