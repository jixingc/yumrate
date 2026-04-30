import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RestaurantCard } from '../components/RestaurantCard';
import { RestaurantModal } from '../components/RestaurantModal';
import { fetchRestaurants } from '../lib/api';
import type { Restaurant } from '../types';

export const DeckView: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // FAB 菜单与选择弹窗
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectSearchTerm, setSelectSearchTerm] = useState('');

  // 搜索与过滤排序 State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [sortBy, setSortBy] = useState('score_desc');

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchRestaurants();
    setRestaurants(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCardClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRestaurant(null), 300); // Wait for transition
  };

  const handleDataChange = () => {
    loadData();
  };

  // 提取唯一的选项供筛选器使用
  const uniqueCuisines = Array.from(new Set(restaurants.map(r => r.tags[0]).filter(Boolean)));
  const uniqueRegions = Array.from(new Set(restaurants.map(r => r.location.split('·')[0].trim()).filter(Boolean)));

  // 应用过滤与排序
  const filteredAndSorted = restaurants.filter(r => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!r.name.toLowerCase().includes(term) && !r.shortReview.toLowerCase().includes(term)) {
        return false;
      }
    }
    if (filterRarity && r.rarity !== filterRarity) return false;
    if (filterCuisine && r.tags[0] !== filterCuisine) return false;
    if (filterRegion && !r.location.includes(filterRegion)) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'score_desc': return b.score - a.score;
      case 'score_asc': return a.score - b.score;
      case 'price_desc': return b.pricePerPerson - a.pricePerPerson;
      case 'price_asc': return a.pricePerPerson - b.pricePerPerson;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 恢复极简高级的浅色背景，带极轻微的网格或渐变增加质感 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f8f9fa] to-gray-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto pb-24 relative z-10">
        <header className="mb-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-4">
              <span>探店笔记</span>
              <span className="text-2xl md:text-3xl font-serif text-gray-400 font-bold tracking-normal">Yumrate.</span>
            </h1>
            <p className="mt-4 sm:mt-3 text-gray-500 tracking-widest text-sm sm:text-base font-bold">
              一起来做美食评论家
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end">
          </div>
        </header>

        {/* 筛选与搜索控制栏 */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-gray-200/50 shadow-sm relative z-20">
          <input
            type="text"
            placeholder="搜索餐厅名称或点评..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-gray-900 transition-colors"
          />

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-gray-900 cursor-pointer"
            >
              <option value="">所有等级</option>
              <option value="ur">UR 殿堂</option>
              <option value="ssr">SSR 必吃</option>
              <option value="sr">SR 宝藏</option>
              <option value="r">R 日常</option>
              <option value="n">N 避雷</option>
            </select>

            <select
              value={filterCuisine}
              onChange={(e) => setFilterCuisine(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-gray-900 cursor-pointer"
            >
              <option value="">所有类型</option>
              {uniqueCuisines.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-gray-900 cursor-pointer"
            >
              <option value="">所有地区</option>
              {uniqueRegions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 text-white border border-transparent rounded-xl px-3 py-2 text-sm font-bold outline-none cursor-pointer shadow-sm ml-auto"
            >
              <option value="score_desc">评分从高到低</option>
              <option value="score_asc">评分从低到高</option>
              <option value="price_desc">人均从贵到便宜</option>
              <option value="price_asc">人均从便宜到贵</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-32 text-gray-400 font-medium">
            没有找到符合条件的餐厅。
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-10">
            {filteredAndSorted.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleCardClick(restaurant)}
                className="cursor-pointer perspective-[1000px] group"
              >
                <div className="transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-y-[-2deg] group-hover:rotate-x-[2deg]">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 悬浮新增按钮 (FAB) 及菜单 */}
      <div className="fixed bottom-10 right-10 z-40 flex flex-col items-end">
        {/* 菜单项 */}
        <div className={`relative z-40 flex flex-col items-end gap-4 mb-5 transition-all duration-300 origin-bottom ${isFabMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          <button
            onClick={() => {
              setIsFabMenuOpen(false);
              setIsSelectModalOpen(true);
              setSelectSearchTerm('');
            }}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-premium border border-gray-100 hover:bg-gray-50 transition-all hover:scale-105"
          >
            <span className="font-bold text-gray-700 text-sm tracking-widest">在原有笔记跟评</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm shadow-inner">✍️</div>
          </button>

          <Link
            to="/entry"
            onClick={() => setIsFabMenuOpen(false)}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-premium border border-gray-100 hover:bg-gray-50 transition-all hover:scale-105"
          >
            <span className="font-bold text-gray-700 text-sm tracking-widest">新建餐厅档案</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm shadow-inner">✨</div>
          </Link>
        </div>

        {/* 主按钮 */}
        <button
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          className={`w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl shadow-premium hover:shadow-premium-hover transition-all duration-300 relative z-50 ${isFabMenuOpen ? 'bg-black rotate-45' : 'hover:-translate-y-1'}`}
          title="新增记录"
        >
          <span className="leading-none -mt-2">+</span>
        </button>

        {/* 全局透明遮罩（点击外部关闭菜单） */}
        {isFabMenuOpen && (
          <div className="fixed inset-0 z-30" onClick={() => setIsFabMenuOpen(false)}></div>
        )}
      </div>

      {/* 沉浸式详情弹窗 */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleDataChange}
      />

      {/* 选择要跟评的餐厅弹窗 */}
      {isSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6" aria-modal="true" role="dialog">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSelectModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">选择要跟评的餐厅</h3>
                <button onClick={() => setIsSelectModalOpen(false)} className="text-gray-400 hover:text-gray-900 text-3xl leading-none">&times;</button>
              </div>
              <input
                type="text"
                placeholder="搜索餐厅名称..."
                value={selectSearchTerm}
                onChange={(e) => setSelectSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-gray-900 focus:bg-white transition-colors"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50/50 rounded-b-3xl">
              {restaurants.filter(r => r.name.toLowerCase().includes(selectSearchTerm.toLowerCase())).map(rest => (
                <button
                  key={rest.id}
                  onClick={() => {
                    setIsSelectModalOpen(false);
                    navigate('/entry', { state: { restaurant: rest } });
                  }}
                  className="text-left w-full p-4 rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-100 transition-all flex justify-between items-center group active:scale-[0.98]"
                >
                  <div className="flex flex-col gap-1 pr-4 overflow-hidden">
                    <div className="font-black text-gray-900 text-lg truncate">{rest.name}</div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate">
                      {rest.location} · {rest.tags[0] || '综合'}
                    </div>
                  </div>
                  <div className="text-gray-300 group-hover:text-gray-900 transition-colors shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
              {restaurants.filter(r => r.name.toLowerCase().includes(selectSearchTerm.toLowerCase())).length === 0 && (
                <div className="py-12 text-center text-gray-400 font-bold text-sm">
                  没有找到相关餐厅
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
