import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// 稀有度徽章预览（探店卡用）
const RARITY_BADGES = [
  { label: 'UR', cls: 'bg-zinc-900 text-amber-400 border border-zinc-700' },
  { label: 'SSR', cls: 'bg-gradient-to-br from-red-500 to-red-700 text-white' },
  { label: 'SR', cls: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' },
  { label: 'R', cls: 'bg-gradient-to-br from-green-400 to-green-600 text-white' },
  { label: 'N', cls: 'bg-gradient-to-br from-zinc-400 to-zinc-500 text-white' },
];

// 青铜时期色块预览（青铜馆卡用）
const PERIOD_COLORS = [
  '#8B7355', '#A0845C', '#B8860B', '#4A7A6A', '#5C7A9E', '#7A6E8A', '#8E7A6B',
];

export const HomeView: React.FC = () => {
  // 注入 Noto Serif SC 字体
  useEffect(() => {
    const id = 'noto-serif-sc-link';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden"
      style={{ background: '#13120f' }}
    >
      {/* 背景噪点纹理 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* 品牌区 */}
      <header className="text-center mb-14 sm:mb-20 relative z-10">
        <p className="text-[11px] tracking-[0.35em] font-light text-white/30 uppercase mb-4">
          Star&apos;s Notes
        </p>
        <h1
          className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          季星辰的笔记
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/35 tracking-widest font-light">
          记录生活里值得被记住的一切
        </p>
      </header>

      {/* 模块卡片区 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 w-full max-w-4xl relative z-10">
        {/* ── 探店笔记卡 ── */}
        <Link
          to="/explore"
          className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.6)] focus:outline-none"
        >
          <div className="flex h-full bg-white rounded-2xl overflow-hidden">
            {/* 左侧装饰条 */}
            <div
              className="w-1 flex-shrink-0"
              style={{
                background: 'linear-gradient(to bottom, #111, #555, #aaa)',
              }}
            />
            <div className="flex flex-col flex-1 p-6 sm:p-8">
              {/* 顶部标签 */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl leading-none">🍜</span>
                <span className="text-xs font-bold tracking-[0.18em] uppercase text-gray-400">
                  探店笔记
                </span>
              </div>

              {/* 主标题 */}
              <div className="mb-1">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none">
                  探店笔记
                </h2>
                <p className="text-xl font-serif text-gray-300 font-bold mt-1">Yumrate.</p>
              </div>

              {/* 描述 */}
              <p className="text-sm text-gray-500 font-medium mt-4 leading-relaxed">
                一起来做美食评论家 — 从路边小馆到米其林，用五维打分和稀有度等级，记录每一次值得被记住的用餐。
              </p>

              {/* 稀有度徽章 */}
              <div className="flex flex-wrap gap-1.5 mt-5">
                {RARITY_BADGES.map((b) => (
                  <span
                    key={b.label}
                    className={`px-2 py-0.5 text-[10px] font-black tracking-widest rounded ${b.cls}`}
                  >
                    {b.label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg group-hover:bg-black transition-colors">
                  进入
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* ── 青铜馆卡 ── */}
        <a
          href="/museum/index.html"
          className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(74,122,106,0.35)] focus:outline-none"
        >
          <div className="flex h-full rounded-2xl overflow-hidden" style={{ background: '#FAF7F2' }}>
            {/* 左侧装饰条：青铜绿 */}
            <div className="w-1 flex-shrink-0" style={{ background: '#4A7A6A' }} />
            <div className="flex flex-col flex-1 p-6 sm:p-8">
              {/* 顶部标签 */}
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="text-2xl leading-none font-bold"
                  style={{ color: '#C9A227' }}
                >
                  ⊕
                </span>
                <span
                  className="text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: '#4A7A6A' }}
                >
                  上博青铜馆
                </span>
              </div>

              {/* 主标题 */}
              <div className="mb-1">
                <h2
                  className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    color: '#2C2416',
                  }}
                >
                  青铜馆
                  <br />
                  学习笔记
                </h2>
                <p className="text-xs mt-2" style={{ color: '#9E8E78', letterSpacing: '0.12em' }}>
                  上海博物馆 · 青铜器馆
                </p>
              </div>

              {/* 描述 */}
              <p className="text-sm font-medium mt-4 leading-relaxed" style={{ color: '#6B5D4A' }}>
                系统梳理 3000 年青铜文明 — 从夏代萌芽到古滇国，20 件预置藏品，时间轴 + 分类筛选，支援讲解员备课专用。
              </p>

              {/* 时期色块 */}
              <div className="flex gap-1.5 mt-5">
                {PERIOD_COLORS.map((c) => (
                  <div
                    key={c}
                    className="w-5 h-5 rounded-sm flex-shrink-0"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-bold rounded-lg transition-colors group-hover:opacity-90"
                  style={{ background: '#4A7A6A' }}
                >
                  进入
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* 底部署名 */}
      <footer className="mt-16 text-center relative z-10">
        <p className="text-[11px] text-white/15 tracking-widest">
          © 季星辰 · Built with React &amp; Supabase
        </p>
      </footer>
    </div>
  );
};
