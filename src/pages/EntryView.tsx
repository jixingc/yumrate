import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { saveEntry } from '../lib/api';
import type { Restaurant, VisitRecord } from '../types';

interface Dish {
  id: string;
  name: string;
  review: string;
}

const ScoreSlider = ({ label, weight, val, setter, onOverride }: { label: string, weight: string, val: number, setter: (v: number) => void, onOverride: () => void }) => (
  <div className="mb-6">
    <div className="flex justify-between items-end mb-3">
      <label className="text-sm font-bold text-gray-800">
        {label} <span className="text-gray-400 font-normal text-xs ml-2 tracking-wider">权重 {weight}</span>
      </label>
      <span className="font-sans text-xl font-bold text-gray-900">{val.toFixed(1)}</span>
    </div>
    <input
      type="range"
      min="0"
      max="10"
      step="0.1"
      value={val}
      onInput={(e) => {
        setter(parseFloat(e.currentTarget.value));
        onOverride();
      }}
      onChange={(e) => {
        setter(parseFloat(e.target.value));
        onOverride();
      }}
      onTouchMove={(e) => e.stopPropagation()}
      className="w-full cursor-pointer accent-gray-900 py-2"
      style={{ touchAction: 'pan-y' }}
    />
  </div>
);

export const EntryView: React.FC = () => {
  const locationState = useLocation();
  const navigate = useNavigate();
  const editState = locationState.state as { restaurant?: Restaurant, record?: VisitRecord } | null;
  const initialRest = editState?.restaurant;
  const initialRec = editState?.record;

  // 阶段 2.2: 维度评分 State
  const [taste, setTaste] = useState<number>(initialRec?.scores?.taste ?? 7.0);
  const [value, setValue] = useState<number>(initialRec?.scores?.value ?? 7.0);
  const [env, setEnv] = useState<number>(initialRec?.scores?.env ?? 7.0);
  const [unique, setUnique] = useState<number>(initialRec?.scores?.unique ?? 7.0);

  const [totalScore, setTotalScore] = useState<number>(initialRec?.scores?.total ?? 7.0);
  const [scoreDisplay, setScoreDisplay] = useState<string>((initialRec?.scores?.total ?? 7.0).toString());
  const [isManualOverride, setIsManualOverride] = useState<boolean>(!!initialRec?.scores);

  // 阶段 2.3: 图片压缩 State
  const [coverImage, setCoverImage] = useState<string | null>(initialRec?.coverImage ?? null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 阶段 2.4: 动态菜品清单 State
  const defaultDishes = initialRec?.dishes?.length ? initialRec.dishes : [{ id: 'initial-1', name: '', review: '' }];
  const [dishes, setDishes] = useState<Dish[]>(defaultDishes as Dish[]);

  // 阶段 2.5: 标签和总评 State
  const [shortReview, setShortReview] = useState(initialRec?.overallExperience ?? '');
  const [cuisine, setCuisine] = useState(initialRest?.tags?.[0] ?? '');
  const [customTags, setCustomTags] = useState<string[]>(initialRest?.tags?.slice(1) ?? []);
  const [tagInput, setTagInput] = useState('');

  // 阶段 3.4: 打分者个人信息
  const [reviewerName, setReviewerName] = useState(initialRec?.reviewerName ?? '');
  const [visitDate, setVisitDate] = useState(initialRec?.date ?? new Date().toISOString().split('T')[0]);
  const [totalCost, setTotalCost] = useState(initialRec?.totalCost?.toString() ?? '');

  // 基础信息 State
  const [restaurantName, setRestaurantName] = useState(initialRest?.name ?? '');
  const [location, setLocation] = useState(initialRest?.location ?? '');
  const price = initialRest?.pricePerPerson?.toString() ?? '';

  // 自动计算加权平均分
  useEffect(() => {
    if (!isManualOverride) {
      const calculated = (taste * 0.5) + (value * 0.2) + (env * 0.2) + (unique * 0.1);
      const rounded = Number(calculated.toFixed(1));
      setTotalScore(rounded);
      setScoreDisplay(rounded.toString());
    }
  }, [taste, value, env, unique, isManualOverride]);

  // 根据分数实时预览稀有度
  const getPreviewRarity = (score: number) => {
    if (score >= 9.1) return { label: 'UR 级', color: 'text-amber-500', bg: 'bg-amber-50' };
    if (score >= 8.6) return { label: 'SSR 级', color: 'text-red-500', bg: 'bg-red-50' };
    if (score >= 8.1) return { label: 'SR 级', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (score >= 6.6) return { label: 'R 级', color: 'text-green-600', bg: 'bg-green-50' };
    return { label: 'N 级', color: 'text-zinc-500', bg: 'bg-zinc-100' };
  };

  const preview = getPreviewRarity(totalScore);

  // 图片压缩处理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCoverImage(compressedDataUrl);
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 菜品列表操作函数
  const handleAddDish = () => {
    setDishes([...dishes, { id: Math.random().toString(), name: '', review: '' }]);
  };

  const handleRemoveDish = (id: string) => {
    setDishes(dishes.filter(dish => dish.id !== id));
  };

  const handleUpdateDish = (id: string, field: keyof Dish, value: string) => {
    setDishes(dishes.map(dish => dish.id === id ? { ...dish, [field]: value } : dish));
  };

  // 动态标签处理
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(',', '');
      if (val && !customTags.includes(val) && customTags.length < 2) {
        setCustomTags([...customTags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter(t => t !== tagToRemove));
  };

  const handleSave = async () => {
    setIsCompressing(true); // 使用这个状态当做 loading

    const finalTags = [cuisine, ...customTags].filter(Boolean);

    const result = await saveEntry({
      restaurantId: editState?.restaurant?.id,
      restaurantName,
      location,
      pricePerPerson: Number(price) || (totalCost ? Number(totalCost) : 0),
      tags: finalTags,
      shortReview,
      reviewerName: reviewerName || '匿名馆长',
      date: visitDate,
      totalCost: Number(totalCost),
      overallExperience: shortReview,
      coverImage,
      scores: { taste, value, env, unique, total: totalScore },
      dishes: dishes.map(d => ({ name: d.name, review: d.review })),
      recordId: editState?.record?.id
    });

    setIsCompressing(false);

    if (result.success) {
      navigate('/');
    } else {
      alert('保存失败，请检查控制台网络请求');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans pb-32">
      <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-premium border border-gray-100 p-4 sm:p-12">

        {/* 导航头 */}
        <header className="flex items-center justify-between mb-12 pb-6 border-b border-gray-100">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-900 font-medium transition-colors flex items-center gap-2"
          >
            <span className="text-xl leading-none -mt-1">←</span> 返回画廊
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            {editState?.record ? '编辑探店记录' : '录入探店'}
          </h1>
        </header>

        {/* 基础信息区 & 标签输入 */}
        <section className="mb-10 space-y-6">
          <input
            type="text"
            placeholder="餐厅名称 (如：鮨·天本)"
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            className="w-full text-3xl font-black text-gray-900 placeholder-gray-300 border-none outline-none focus:ring-0 px-0"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="地点 (如：徐汇区 · 湖南路)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-gray-900 transition-colors"
            />
            <input
              type="text"
              placeholder="*餐饮类型 (如：Omakase、川菜) - 必填"
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          {/* 动态标签输入区 */}
          <div className="flex flex-wrap gap-2 items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 min-h-[50px]">
            {customTags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-400 hover:text-white leading-none outline-none focus:outline-none"
                  title="删除标签"
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={customTags.length === 0 ? "添加自定义标签 (最多2个，回车确定，选填)" : "继续添加..."}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={customTags.length >= 2}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder-gray-400 focus:ring-0 min-w-[80px] py-1 disabled:opacity-50"
            />
          </div>
        </section>

        <div className="w-full border-t border-gray-100 mb-10"></div>

        {/* 探店记录元数据 */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">本次探店档案</h2>
              <p className="text-sm text-gray-500 mt-1">记录本次就餐的具体信息</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="打分者昵称"
              value={reviewerName}
              onChange={e => setReviewerName(e.target.value)}
              className="col-span-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-gray-900 transition-colors"
            />
            <input
              type="date"
              value={visitDate}
              onChange={e => setVisitDate(e.target.value)}
              className="col-span-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 outline-none focus:border-gray-900 transition-colors"
            />
            <input
              type="number"
              placeholder="人均花费 ¥"
              value={totalCost}
              onChange={e => setTotalCost(e.target.value)}
              className="col-span-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </section>

        {/* 镇楼图上传区 (Canvas压缩) */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-1">镇楼图</h2>
          <p className="text-sm text-gray-500 mb-6">极致压缩，长边自动控制在 1200px</p>

          <div
            className={`relative w-full h-72 rounded-[1.5rem] border-2 border-dashed overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-colors group
              ${coverImage ? 'border-transparent bg-gray-900' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            {isCompressing ? (
              <div className="text-gray-500 font-medium flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-3"></div>
                正在极限压缩图片...
              </div>
            ) : coverImage ? (
              <>
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black/80 text-white px-5 py-2.5 rounded-full text-sm font-bold backdrop-blur-md">
                    更换图片
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 group-hover:text-gray-600 transition-colors">
                <div className="text-4xl mb-2 font-light">+</div>
                <div className="font-bold tracking-wide">点击上传图片</div>
              </div>
            )}
          </div>
        </section>

        {/* 四维计分系统 */}
        <section className="mb-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">核心评价</h2>
              <p className="text-sm text-gray-500 mt-1">拖动滑块打分，系统将自动加权计算</p>
            </div>

            {/* 实时总分预览区 */}
            <div className={`px-6 py-4 rounded-2xl flex flex-col items-center border border-white/50 shadow-sm transition-colors duration-300 ${preview.bg}`}>
              <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${preview.color}`}>
                {preview.label}
              </span>
              <div className="flex items-baseline gap-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={scoreDisplay}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setScoreDisplay(raw);
                    const val = parseFloat(raw);
                    if (!isNaN(val) && val >= 0 && val <= 10) {
                      setTotalScore(Number(val.toFixed(1)));
                      setIsManualOverride(true);
                    }
                  }}
                  className={`w-20 text-center text-4xl font-black bg-transparent border-b-2 outline-none focus:border-gray-900 ${preview.color}`}
                />
              </div>
              {isManualOverride && (
                <span className="text-[10px] text-gray-400 mt-1">已手动微调</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <ScoreSlider label="👄 口味表现" weight="50%" val={taste} setter={setTaste} onOverride={() => setIsManualOverride(false)} />
            <ScoreSlider label="💰 性价比" weight="20%" val={value} setter={setValue} onOverride={() => setIsManualOverride(false)} />
            <ScoreSlider label="🌿 环境服务" weight="20%" val={env} setter={setEnv} onOverride={() => setIsManualOverride(false)} />
            <ScoreSlider label="✨ 独特性" weight="10%" val={unique} setter={setUnique} onOverride={() => setIsManualOverride(false)} />
          </div>
        </section>

        {/* 动态菜品清单 */}
        <section className="mb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">点菜清单</h2>
              <p className="text-sm text-gray-500 mt-1">记录令人印象深刻的菜品（红黑榜皆可）</p>
            </div>
          </div>

          <div className="space-y-4">
            {dishes.map((dish) => (
              <div key={dish.id} className="relative group bg-gray-50/50 border border-gray-100 rounded-2xl p-5 transition-colors hover:border-gray-300 hover:bg-gray-50">
                {/* 悬浮删除按钮 */}
                {dishes.length > 1 && (
                  <button
                    onClick={() => handleRemoveDish(dish.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 font-bold transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50"
                    title="删除菜品"
                  >
                    ✕
                  </button>
                )}

                <div className="flex flex-col gap-4 pr-6">
                  <input
                    type="text"
                    placeholder="菜品名称 (如：招牌脆皮烤肉)"
                    value={dish.name}
                    onChange={(e) => handleUpdateDish(dish.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-200 pb-2 text-gray-900 font-bold placeholder-gray-400 outline-none focus:border-gray-900 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="一句短评 (如：外酥里嫩，肥而不腻，必点！)"
                    value={dish.review}
                    onChange={(e) => handleUpdateDish(dish.id, 'review', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-200 pb-2 text-gray-600 text-sm placeholder-gray-400 outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddDish}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-all"
            >
              + 添加一行菜品
            </button>
          </div>
        </section>

        {/* 总评区域 */}
        <section className="mb-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">一句话总评</h2>
              <p className="text-sm text-gray-500 mt-1">这段评价将展示在首页卡片的最下方</p>
            </div>
          </div>
          <textarea
            rows={3}
            placeholder="这顿饭给你留下的最深印象是？（如：传统江户前寿司的完美演绎，舍利酸度克制且回味悠长。）"
            value={shortReview}
            onChange={(e) => setShortReview(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium placeholder-gray-400 outline-none focus:border-gray-900 transition-colors resize-none leading-relaxed"
          />
        </section>

        {/* 提交按钮区域 */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isCompressing || !restaurantName || !cuisine}
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold tracking-widest shadow-premium hover:bg-gray-800 hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {isCompressing ? '保存中...' : '保存记录'}
          </button>
        </div>

      </div>
    </div>
  );
};
