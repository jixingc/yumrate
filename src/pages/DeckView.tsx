import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RestaurantCard } from '../components/RestaurantCard';
import { RestaurantModal } from '../components/RestaurantModal';
import { fetchRestaurants } from '../lib/api';
import type { Restaurant } from '../types';

export const DeckView: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 搜索与过滤排序 State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [sortBy, setSortBy] = useState('score_desc');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchRestaurants();
      setRestaurants(data);
      setIsLoading(false);
    };
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
            <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 tracking-tight">
              Yumrate.
            </h1>
            <p className="mt-3 text-lg text-gray-500 uppercase tracking-[0.2em] text-sm font-bold">
              The Deck Collection
            </p>
          </div>
          <div className="mt-8 md:mt-0 text-gray-400 font-serif italic text-sm text-right max-w-xs">
            "A meticulously curated archive of culinary experiences."
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
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-8">
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

      {/* 悬浮新增按钮 (FAB) - 恢复深色高质感 */}
      <Link
        to="/entry"
        className="fixed bottom-10 right-10 w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 z-40"
        title="新增探店记录"
      >
        <span className="leading-none -mt-2">+</span>
      </Link>

      {/* 沉浸式详情弹窗 */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
