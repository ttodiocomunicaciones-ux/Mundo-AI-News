export interface NewsArticle {
  id: string; // Unique ID for filtering
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedTime: string;
  imageKeyword: string;
  url?: string;
  timestamp: number; // Unix timestamp when it was fetched
  fullAnalysis?: string; // Optional field for the detailed report
}

export enum NewsCategory {
  WORLD = 'Mundo',
  TECHNOLOGY = 'Tecnología',
  BUSINESS = 'Negocios',
  SCIENCE = 'Ciencia',
  SPORTS = 'Deportes',
  ENTERTAINMENT = 'Cultura'
}

export interface FetchNewsResponse {
  articles: Omit<NewsArticle, 'id' | 'timestamp' | 'fullAnalysis'>[];
}