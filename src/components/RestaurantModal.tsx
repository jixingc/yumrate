import React, { useEffect, useRef, useState } from 'react';
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
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);

  // 当弹窗关闭或打开新的餐厅时，重置 activeRecordId
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setActiveRecordId(null), 300); // 配合动画延迟重置
    }
  }, [isOpen, restaurant]);

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

  const activeRecord = restaurant.visitRecords.find(r => r.id === activeRecordId) || null;

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
          // 如果只是删除了记录，餐厅还在，重置激活记录，并刷新外层
          setActiveRecordId(null);
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

        <div className="flex-1 p-4 sm:p-8 bg-zinc-50 rounded-b-3xl min-h-[400px]">
          {!activeRecord ? (
            // === 列表视图 ===
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-zinc-900">探店档案 <span className="text-zinc-400 font-normal">Logs</span></h3>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/entry', { state: { restaurant } });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
                  >
                    <span className="text-base leading-none -mt-0.5">+</span> 新增跟评
                  </button>
                </div>
                <span className="text-sm font-bold text-zinc-400">{restaurant.visitRecords.length} 份记录</span>
              </div>

              <div className="space-y-4">
                {restaurant.visitRecords.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => setActiveRecordId(record.id)}
                    className="bg-white border border-zinc-200 rounded-2xl p-5 cursor-pointer hover:border-zinc-300 hover:shadow-md transition-all flex justify-between items-center group relative overflow-hidden"
                  >
                    {record.coverImage && (
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.08]">
                        <img src={record.coverImage} className="w-full h-full object-cover rounded-bl-full" style={{ WebkitMaskImage: 'radial-gradient(circle at top right, black 30%, transparent 70%)' }} />
                      </div>
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold shadow-inner">
                        {record.reviewerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900">{record.reviewerName}</div>
                        <div className="text-xs text-zinc-400">{record.date}</div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4 sm:gap-8 relative z-10">
                      <div className="hidden sm:block text-right">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">花费</div>
                        <div className="font-bold text-zinc-900 font-sans">¥{record.totalCost}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">评分</div>
                        <div className={`font-black text-xl font-sans ${config.scoreClass}`}>
                          {record.scores?.total?.toFixed(1) || '0.0'}
                        </div>
                      </div>
                      <div className="text-zinc-300 group-hover:text-zinc-500 transition-colors ml-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // === 详情阅读视图 ===
            <div className="animate-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setActiveRecordId(null)}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors px-2"
              >
                <span className="text-xl leading-none -mt-0.5">←</span> 返回所有记录
              </button>

              <div className="relative bg-white border border-zinc-100 rounded-[2rem] p-6 sm:p-10 shadow-sm overflow-hidden">

                {/* 镇楼图：以极简、高质感的海报图形式展示在最上方 */}
                {activeRecord.coverImage && (
                  <div className="w-full h-64 sm:h-80 mb-8 rounded-2xl overflow-hidden shadow-sm relative group">
                    <img
                      src={activeRecord.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-8 pb-6 border-b border-zinc-100 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xl shadow-inner">
                      {activeRecord.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 text-lg flex items-center gap-2">
                        {activeRecord.reviewerName}
                      </div>
                      <div className="text-sm text-zinc-400 font-medium tracking-wide">{activeRecord.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/entry', { state: { restaurant } });
                      }}
                      className="flex items-center justify-center p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
                      title="在此餐厅添加新跟评"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRecordClick(activeRecord)}
                      className="flex items-center justify-center p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
                      title="进入编辑模式"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteRecord(e, activeRecord.id)}
                      className="flex items-center justify-center p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="删除记录"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-8 relative z-10">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4 px-6 bg-zinc-50 rounded-2xl items-center">
                    <div className="col-span-2 sm:col-span-1 border-b sm:border-b-0 sm:border-r border-zinc-200 pb-4 sm:pb-0 sm:pr-4 flex flex-col items-center">
                      <div className={`text-3xl font-black font-sans tracking-tighter ${config.scoreClass}`}>
                        {activeRecord.scores?.total?.toFixed(1) || '0.0'}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">综合评分</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-xl font-bold text-zinc-700 font-sans">{activeRecord.scores?.taste?.toFixed(1) || '-'}</div>
                      <div className="text-[10px] text-zinc-400 font-bold tracking-widest mt-1">口味</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-bold text-zinc-700 font-sans">{activeRecord.scores?.value?.toFixed(1) || '-'}</div>
                      <div className="text-[10px] text-zinc-400 font-bold tracking-widest mt-1">性价比</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-bold text-zinc-700 font-sans">{activeRecord.scores?.env?.toFixed(1) || '-'}</div>
                      <div className="text-[10px] text-zinc-400 font-bold tracking-widest mt-1">环境</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-bold text-zinc-700 font-sans">{activeRecord.scores?.unique?.toFixed(1) || '-'}</div>
                      <div className="text-[10px] text-zinc-400 font-bold tracking-widest mt-1">独特</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></span>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">人均花费</span>
                    </div>
                    <div className="text-xl font-black font-sans text-zinc-900 tracking-tight">¥{activeRecord.totalCost}</div>
                  </div>

                  <div className="w-full h-[1px] bg-zinc-100"></div>

                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-zinc-300"></span> 整体体验
                    </h4>
                    <p className="text-[15px] sm:text-base leading-loose text-zinc-700 font-serif whitespace-pre-wrap">
                      {activeRecord.overallExperience}
                    </p>
                  </div>

                  {activeRecord.dishes && activeRecord.dishes.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-zinc-300"></span> 印象菜品
                      </h4>
                      <ul className="space-y-4">
                        {activeRecord.dishes.map(dish => (
                          <li key={dish.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 leading-relaxed bg-zinc-50/50 p-3 sm:p-4 rounded-xl">
                            <span className="font-bold text-zinc-900 whitespace-nowrap text-[15px]">「{dish.name}」</span>
                            <span className="text-zinc-600 text-sm">{dish.review}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
