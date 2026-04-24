export type RarityLevel = 'ur' | 'ssr' | 'sr' | 'r' | 'n';

export interface DishReview {
  id: string;
  name: string;
  review: string;
}

export interface VisitRecord {
  id: string;
  reviewerName: string;
  date: string;
  totalCost: number;
  dishes: DishReview[];
  overallExperience: string;
  scores?: {
    taste: number;
    value: number;
    env: number;
    unique: number;
    total: number;
  };
  coverImage?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  score: number;
  pricePerPerson: number;
  tags: string[];
  shortReview: string;
  isCuratorOriginal: boolean;
  rarity: RarityLevel;
  visitRecords: VisitRecord[]; // 记录多次探店
}
