import type { Restaurant } from './types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '鮨·天本 (Sushi Amamoto)',
    location: '徐汇区 · 湖南路',
    score: 9.8,
    pricePerPerson: 2000,
    tags: ['Omakase', '极难预约'],
    shortReview: '传统江户前寿司的完美演绎，舍利酸度克制且回味悠长。',
    isCuratorOriginal: true,
    rarity: 'ur',
    visitRecords: [
      {
        id: 'v1-1',
        reviewerName: '馆长',
        date: '2023-11-15',
        totalCost: 2200,
        coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop',
        dishes: [
          { id: 'd1', name: '小肌', review: '酸度完美，鱼肉的油脂和醋的香气融合得极好。' },
          { id: 'd2', name: '金枪鱼大腹', review: '入口即化，毫无筋膜感。' }
        ],
        overallExperience: '这是我在上海吃过最接近东京本店水准的 Omakase。主厨对面子的把控，舍利的温度，以及酒水搭配都无可挑剔。绝对值得反复造访（如果能预约到的话）。'
      },
      {
        id: 'v1-2',
        reviewerName: '老饕朋友',
        date: '2024-01-20',
        totalCost: 1980,
        dishes: [
          { id: 'd3', name: '海胆手卷', review: '海胆极其清甜，海苔脆度惊人。' }
        ],
        overallExperience: '被馆长疯狂安利后终于吃到。虽然价格昂贵，但整套流程下来确实感觉物有所值，特别是酒肴部分令人惊艳。'
      }
    ]
  },
  {
    id: '2',
    name: '甬府小鲜',
    location: '浦东新区 · 陆家嘴中心',
    score: 8.8,
    pricePerPerson: 350,
    tags: ['宁波菜', '米其林指南'],
    shortReview: '十八斩名不虚传，海鲜食材极其新鲜，性价比极高。',
    isCuratorOriginal: false,
    rarity: 'ssr',
    visitRecords: [
      {
        id: 'v2-1',
        reviewerName: '美食探索家',
        date: '2024-03-05',
        totalCost: 400,
        coverImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
        dishes: [
          { id: 'd4', name: '甬府十八斩', review: '必点！蟹肉晶莹剔透，调汁绝了。' },
          { id: 'd5', name: '家烧黄鱼', review: '肉质鲜嫩，汤汁拌饭一绝。' }
        ],
        overallExperience: '作为米其林一星甬府的平替版，这里完全保留了核心菜品的精髓，但价格却亲民很多。环境不错，服务也在线。'
      }
    ]
  },
  {
    id: '3',
    name: '老王牛肉面',
    location: '静安区 · 巨鹿路',
    score: 7.5,
    pricePerPerson: 45,
    tags: ['面食', '打工人食堂'],
    shortReview: '汤底偏咸但肉块分量很足，适合工作日午餐。',
    isCuratorOriginal: true,
    rarity: 'sr',
    visitRecords: [
      {
        id: 'v3-1',
        reviewerName: '馆长',
        date: '2024-04-10',
        totalCost: 45,
        coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?q=80&w=1200&auto=format&fit=crop',
        dishes: [
          { id: 'd6', name: '半筋半肉面', review: '牛筋炖得很烂，牛肉入味。' },
          { id: 'd7', name: '卤豆腐', review: '很入味，配面吃刚刚好。' }
        ],
        overallExperience: '每个月总有几天想吃重口味的时候就会来这里。汤底稍微偏咸，建议让老板少放点盐，但肉的份量在静安区这个价位绝对是良心了。'
      }
    ]
  },
  {
    id: '4',
    name: '某网红 Brunch',
    location: '黄浦区 · 新天地',
    score: 5.5,
    pricePerPerson: 180,
    tags: ['西餐', '出片'],
    shortReview: '只有松饼勉强能吃，咖啡像白开水，适合拍照不适合吃。',
    isCuratorOriginal: false,
    rarity: 'r',
    visitRecords: [
      {
        id: 'v4-1',
        reviewerName: '路人甲',
        date: '2024-02-14',
        totalCost: 220,
        dishes: [
          { id: 'd8', name: '莓果舒芙蕾', review: '太甜了，吃两口就腻。' },
          { id: 'd9', name: '拿铁', review: '奶泡很粗糙，豆子风味全无。' }
        ],
        overallExperience: '被小红书骗来的。装修确实很美，随便拍都很出片。但食物真的是灾难级别，排队两小时吃了一肚子气。'
      }
    ]
  },
  {
    id: '5',
    name: '景点正宗烤鸭',
    location: '黄浦区 · 豫园',
    score: 2.1,
    pricePerPerson: 258,
    tags: ['景区刺客', '避雷'],
    shortReview: '鸭皮不脆，荷叶饼粘牙，服务态度极差，快逃。',
    isCuratorOriginal: true,
    rarity: 'n',
    visitRecords: [
      {
        id: 'v5-1',
        reviewerName: '馆长',
        date: '2023-10-01',
        totalCost: 300,
        dishes: [
          { id: 'd10', name: '所谓精品烤鸭', review: '鸭皮是软的，肉有腥味。' }
        ],
        overallExperience: '带外地朋友去踩的巨大天坑。强制消费茶水，服务员全程黑脸，烤鸭不仅难吃而且明显不是现烤的。坚决抵制这种专门坑游客的店。'
      }
    ]
  }
];
