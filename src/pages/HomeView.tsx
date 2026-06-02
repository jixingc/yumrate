import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const RARITY_BARS = [
  { label: 'UR',  color: '#b8922a', height: 52 },
  { label: 'SSR', color: '#c0303a', height: 40 },
  { label: 'SR',  color: '#c06818', height: 30 },
  { label: 'R',   color: '#288040', height: 18 },
  { label: 'N',   color: '#909090', height: 9 },
];

const PERIOD_BARS = [
  { color: '#8B7355', pct: 52 },
  { color: '#A0845C', pct: 65 },
  { color: '#B8860B', pct: 100 },
  { color: '#4A7A6A', pct: 82 },
  { color: '#5C7A9E', pct: 70 },
  { color: '#7A6E8A', pct: 58 },
  { color: '#8E7A6B', pct: 42 },
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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-24"
      style={{ background: '#f5f4f0' }}
    >
      {/* 品牌区 */}
      <header className="text-center mb-16">
        <p className="text-[10px] tracking-[0.45em] font-medium text-black/25 uppercase mb-4">
          Star&apos;s Notes
        </p>
        <h1
          className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tight leading-none"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          季星辰的笔记
        </h1>
        <p className="mt-5 text-sm text-black/30 tracking-[0.25em]">
          记录生活里值得被记住的一切
        </p>
      </header>

      {/* 模块卡片区 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-3xl">

        {/* ── 探店笔记卡（白色） ── */}
        <Link to="/explore" className="group block" style={{ minHeight: 380 }}>
          <div
            className="relative h-full rounded-2xl overflow-hidden flex flex-col bg-white border border-black/[0.07] transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)] group-hover:-translate-y-1"
            style={{ minHeight: 380 }}
          >
            {/* 左侧黑色细线 */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gray-900" />

            <div className="flex flex-col flex-1 pl-9 pr-8 py-8 sm:py-9">
              <p className="text-[9px] tracking-[0.45em] text-black/20 uppercase font-medium">
                Food · Rating · Discovery
              </p>

              <div className="mt-auto pt-10">
                <h2 className="text-[56px] sm:text-[62px] font-black text-gray-900 tracking-tight leading-none">
                  Yumrate
                </h2>
                <p className="text-sm text-black/28 mt-2.5 tracking-[0.2em] font-light">
                  探店笔记
                </p>
              </div>

              {/* 稀有度柱状图 */}
              <div className="mt-8 flex items-end gap-2" style={{ height: 64 }}>
                {RARITY_BARS.map((b) => (
                  <div key={b.label} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                    <span
                      className="text-[8px] font-black tracking-widest"
                      style={{ color: b.color }}
                    >
                      {b.label}
                    </span>
                    <div
                      className="w-full rounded-t-[3px]"
                      style={{ height: b.height, background: b.color, opacity: 0.75 }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-7 pt-5 border-t border-black/[0.06] flex items-center justify-between">
                <span className="text-[10px] text-black/18 tracking-[0.2em]">五维评分系统</span>
                <span className="text-sm font-bold text-black/30 group-hover:text-black/70 transition-colors flex items-center gap-1.5">
                  进入
                  <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* ── 青铜馆卡（暖奶色） ── */}
        <a href="/museum/index.html" className="group block" style={{ minHeight: 380 }}>
          <div
            className="relative h-full rounded-2xl overflow-hidden flex flex-col border border-black/[0.05] transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(61,107,92,0.15)] group-hover:-translate-y-1"
            style={{ background: '#ede8de', minHeight: 380 }}
          >
            {/* 左侧青铜绿细线 */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: '#3d6b5c' }} />

            <div className="flex flex-col flex-1 pl-9 pr-8 py-8 sm:py-9">
              <p
                className="text-[9px] tracking-[0.45em] font-bold uppercase"
                style={{ color: '#3d6b5c' }}
              >
                上海博物馆 · 青铜器馆
              </p>

              <div className="mt-auto pt-10">
                <h2
                  className="text-[56px] sm:text-[62px] font-bold leading-none tracking-tight"
                  style={{ fontFamily: "'Noto Serif SC', serif", color: '#1e1408' }}
                >
                  青铜馆
                </h2>
                <p className="text-sm mt-2.5 tracking-[0.15em] font-medium" style={{ color: '#7a6448' }}>
                  3000 年 · 7 大时期 · 20 件藏品
                </p>
              </div>

              {/* 时期柱状图 */}
              <div className="mt-8 flex items-end gap-2" style={{ height: 64 }}>
                {PERIOD_BARS.map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-[3px]"
                    style={{ height: `${c.pct}%`, background: c.color, opacity: 0.65 }}
                  />
                ))}
              </div>

              <div
                className="mt-7 pt-5 border-t flex items-center justify-between"
                style={{ borderColor: 'rgba(120,96,64,0.12)' }}
              >
                <span
                  className="text-[10px] tracking-[0.2em] font-medium"
                  style={{ color: '#b09878' }}
                >
                  学习笔记
                </span>
                <span
                  className="text-sm font-bold flex items-center gap-1.5 transition-opacity group-hover:opacity-50"
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

      <footer className="mt-16 text-center">
        <p className="text-[10px] text-black/15 tracking-widest">
          © 季星辰 · Built with React &amp; Supabase
        </p>
      </footer>
    </div>
  );
};
