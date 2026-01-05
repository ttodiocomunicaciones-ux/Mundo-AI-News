export interface NewsArticle {
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedTime: string;
  imageKeyword: string; // Used to fetch a relevant placeholder if real image fails
  url?: string;
}

export enum NewsCategory {
  WORLD = 'Mundo',
  TECHNOLOGY = 'Tecnología',
  BUSINESS = 'Negocios',
  SCIENCE = 'Ciencia',
  SPORTS = 'Deportes',
  ENTERTAINMENT = 'Entretenimiento'
}

export interface FetchNewsResponse {
  articles: NewsArticle[];
}