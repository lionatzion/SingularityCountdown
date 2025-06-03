import { newsArticles, metrics, type NewsArticle, type InsertNewsArticle, type Metrics, type InsertMetrics } from "@shared/schema";

export interface IStorage {
  getLatestNews(limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getLatestMetrics(): Promise<Metrics | undefined>;
  createMetrics(metricsData: InsertMetrics): Promise<Metrics>;
}

export class MemStorage implements IStorage {
  private news: Map<number, NewsArticle>;
  private metricsData: Map<number, Metrics>;
  private newsId: number;
  private metricsId: number;

  constructor() {
    this.news = new Map();
    this.metricsData = new Map();
    this.newsId = 1;
    this.metricsId = 1;
  }

  async getLatestNews(limit: number = 10): Promise<NewsArticle[]> {
    const newsArray = Array.from(this.news.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
    return newsArray;
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const id = this.newsId++;
    const article: NewsArticle = {
      ...insertArticle,
      id,
      imageUrl: insertArticle.imageUrl || null,
      createdAt: new Date(),
    };
    this.news.set(id, article);
    return article;
  }

  async getLatestMetrics(): Promise<Metrics | undefined> {
    const metricsArray = Array.from(this.metricsData.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return metricsArray[0];
  }

  async createMetrics(insertMetrics: InsertMetrics): Promise<Metrics> {
    const id = this.metricsId++;
    const metrics: Metrics = {
      ...insertMetrics,
      id,
      timestamp: new Date(),
    };
    this.metricsData.set(id, metrics);
    return metrics;
  }
}

export const storage = new MemStorage();
