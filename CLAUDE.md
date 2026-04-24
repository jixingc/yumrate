# Yumrate (美食家探店档案) 项目指南

## 项目定位
一个极简、高级、具有“实体典藏卡”质感的协作式探店打分 Web App。
UI 拒绝平庸的美食图平铺，采用大字重排版、霓虹虚化描边、极简背景，强调收集成就感（分为 UR, SSR, SR, R, N 五个稀有度等级）。

## 技术栈
- **前端框架**: React 18 + TypeScript + Vite
- **路由**: React Router v6
- **样式**: Tailwind CSS (大量使用 custom gradients, drop-shadows, text-stroke, mask-image)
- **后端 & 数据库**: Supabase (PostgreSQL) 
- **图片存储**: Supabase Storage
- **部署**: Cloudflare Pages / Vercel

## 核心机制与开发规约
1. **图片处理**: 用户上传的镇楼图必须在客户端使用 Canvas 强行压缩（长边限制 1200px）后再转 base64 上传到 Supabase，以节省流量。
2. **打分与稀有度**:
   - 分数通过 4 个维度加权计算：口味(50%)、性价比(20%)、环境(20%)、独特性(10%)。
   - 稀有度阈值：UR(≥9.1), SSR(≥8.6), SR(≥8.1), R(≥6.6), N(<6.6)。
3. **数据流 (Supabase)**:
   - 包含三张核心表：`restaurants` (主表), `visit_records` (探店记录), `dishes` (菜品点评)。
   - 更新或新增探店记录时，会自动重新聚合计算该餐厅的平均分和人均花费，并同步更新主表。
   - 注意：这三张表在 Supabase 中目前关闭了 RLS（行级安全）限制以便于公开读写。
4. **UI/UX 准则**:
   - 移动端优先，注意防止手势冲突（如滑块需保留 `touch-action: pan-y`）。
   - 详情页弹窗 (`RestaurantModal`) 右侧的超大等级水印采用了 `mask-image` 实现由上至下的渐隐，不要破坏这个结构。
   - 画廊页 (`DeckView`) 的卡片没有配图，纯粹靠精美的字体排版、动态边框颜色与胶囊标签撑起视觉。

## 常用命令
- 本地启动: `npm run dev`
- 打包: `npm run build`
