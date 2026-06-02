import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const RARITY_BARS = [
  { label: 'UR',  color: '#b8922a', height: 56 },
  { label: 'SSR', color: '#c0303a', height: 44 },
  { label: 'SR',  color: '#c06818', height: 32 },
  { label: 'R',   color: '#288040', height: 20 },
  { label: 'N',   color: '#484848', height: 10 },
];

// Heights as % of 48px container, representing each dynasty's relative weight
const PERIOD_BARS = [
  { color: '#8B7355', pct: 55 },
  { color: '#A0845C', pct: 65 },
  { color: '#B8860B', pct: 100 },
  { color: '#4A7A6A', pct: 85 },
  { color: '#5C7A9E', pct: 72 },
  { color: '#7A6E8A', pct: 60 },
  { color: '#8E7A6B', pct: 44 },
];

export const HomeView: React.FC = () => {
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
      style={{ background: '#0e0d0b' }}
    >
      {/* 背景噪点 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
          opacity: 0.035,
        }}
      />

      {/* 品牌区 */}
      <header className="text-center mb-16 relative z-10">
        <p className="text-[10px] tracking-[0.45em] font-light text-white/20 uppercase mb-5">
          Star&apos;s Notes
        </p>
        <h1
          className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-none"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          季星辰的笔记
        </h1>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px w-10 bg-white/10" />
          <p className="text-xs text-white/20 tracking-[0.3em]">记录生活里值得被记住的一切</p>
          <div className="h-px w-10 bg-white/10" />
        </div>
      </header>

      {/* 模块卡片区 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-3xl relative z-10">

        {/* ── 探店笔记卡（暗色） ── */}
        <Link
          to="/explore"
          className="group block focus:outline-none"
          style={{ minHeight: 380 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-[0_28px_60px_rgba(0,0,0,0.7)]"
            style={{ background: '#161412' }}
          >
            {/* 顶部稀有度光谱细线 */}
            <div
              className="h-px w-full flex-shrink-0"
              style={{
                background:
                  'linear-gradient(to right, #48484840, #28804040, #c0681840, #c0303a40, #b8922a80)',
              }}
            />

            <div className="flex flex-col flex-1 p-8 sm:p-9">
              {/* 眼线标签 */}
              <p className="text-[9px] tracking-[0.45em] text-white/20 uppercase font-medium">
                Food · Rating · Discovery
              </p>

              {/* 主品牌名 */}
              <div className="mt-auto pt-10">
                <h2 className="text-[56px] sm:text-[64px] font-black text-white tracking-tight leading-none">
                  Yumrate
                </h2>
                <p className="text-sm text-white/25 mt-2.5 tracking-[0.2em] font-light">
                  探店笔记
                </p>
              </div>

              {/* 稀有度柱状图 */}
              <div className="mt-8 flex items-end gap-1.5" style={{ height: 64 }}>
                {RARITY_BARS.map((b) => (
                  <div key={b.label} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                    <span
                      className="text-[8px] font-black tracking-widest"
                      style={{ color: b.color }}
                    >
                      {b.label}
                    </span>
                    <div
                      className="w-full rounded-t-[3px] transition-opacity duration-300 group-hover:opacity-100"
                      style={{ height: b.height, background: b.color, opacity: 0.65 }}
                    />
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-7 pt-5 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] text-white/15 tracking-[0.2em]">五维评分系统</span>
                <span
                  className="text-sm font-bold text-white/40 group-hover:text-white/80 transition-colors flex items-center gap-1.5"
                >
                  进入
                  <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* ── 青铜馆卡（暖纸色） ── */}
        <a
          href="/museum/index.html"
          className="group block focus:outline-none"
          style={{ minHeight: 380 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-[0_28px_60px_rgba(74,122,106,0.25)]"
            style={{ background: '#F4EFE5' }}
          >
            {/* 左侧青铜绿色条 */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: '#3d6b5c' }} />

            <div className="flex flex-col flex-1 pl-9 pr-8 py-8 sm:py-9">
              {/* 眼线标签 */}
              <p
                className="text-[9px] tracking-[0.45em] font-bold uppercase"
                style={{ color: '#3d6b5c' }}
              >
                上海博物馆 · 青铜器馆
              </p>

              {/* 主标题 */}
              <div className="mt-auto pt-10">
                <h2
                  className="text-[56px] sm:text-[64px] font-bold leading-none tracking-tight"
                  style={{ fontFamily: "'Noto Serif SC', serif", color: '#1e1408' }}
                >
                  青铜馆
                </h2>
                <p className="text-sm mt-2.5 tracking-[0.15em] font-medium" style={{ color: '#7a6448' }}>
                  3000 年 · 7 大时期 · 20 件藏品
                </p>
              </div>

              {/* 时期柱状图 */}
              <div className="mt-8 flex items-end gap-1.5" style={{ height: 64 }}>
                {PERIOD_BARS.map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-[3px] transition-opacity duration-300 group-hover:opacity-80"
                    style={{
                      height: `${c.pct}%`,
                      background: c.color,
                      opacity: 0.55,
                    }}
                  />
                ))}
              </div>

              {/* CTA */}
              <div
                className="mt-7 pt-5 border-t flex items-center justify-between"
                style={{ borderColor: 'rgba(120,96,64,0.12)' }}
              >
                <span className="text-[10px] tracking-[0.2em] font-medium" style={{ color: '#b09878' }}>
                  学习笔记
                </span>
                <span
                  className="text-sm font-bold flex items-center gap-1.5 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ color: '#3d6b5c' }}
                >
                  进入
                  <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* 底部署名 */}
      <footer className="mt-16 text-center relative z-10">
        <p className="text-[10px] text-white/10 tracking-widest">
          © 季星辰 · Built with React &amp; Supabase
        </p>
      </footer>
    </div>
  );
};
