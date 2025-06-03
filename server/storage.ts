import { newsArticles, metrics, type NewsArticle, type InsertNewsArticle, type Metrics, type InsertMetrics } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getLatestNews(limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getLatestMetrics(): Promise<Metrics | undefined>;
  createMetrics(metricsData: InsertMetrics): Promise<Metrics>;
}

export class DatabaseStorage implements IStorage {
  async getLatestNews(limit: number = 10): Promise<NewsArticle[]> {
    const result = await db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
    return result;
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    // Check if article with same title or URL already exists
    const existing = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.title, insertArticle.title))
      .limit(1);

    if (existing.length > 0) {
      return existing[0]; // Return existing article instead of creating duplicate
    }

    const [article] = await db
      .insert(newsArticles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async getLatestMetrics(): Promise<Metrics | undefined> {
    const [result] = await db
      .select()
      .from(metrics)
      .orderBy(desc(metrics.timestamp))
      .limit(1);
    return result || undefined;
  }

  async createMetrics(insertMetrics: InsertMetrics): Promise<Metrics> {
    const [metricsData] = await db
      .insert(metrics)
      .values(insertMetrics)
      .returning();
    return metricsData;
  }
}

export const storage = new DatabaseStorage();
