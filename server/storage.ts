import { newsArticles, metrics, predictions, frontierModels, type NewsArticle, type InsertNewsArticle, type Metrics, type InsertMetrics, type Prediction, type InsertPrediction, type FrontierModel, type InsertFrontierModel } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getLatestNews(limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getLatestMetrics(): Promise<Metrics | undefined>;
  getAllMetrics(): Promise<Metrics[]>;
  createMetrics(metricsData: InsertMetrics): Promise<Metrics>;
  getLatestPrediction(): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getFrontierModels(): Promise<FrontierModel[]>;
  upsertFrontierModel(model: InsertFrontierModel): Promise<FrontierModel>;
  clearOldFrontierModels(): Promise<void>;
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

  async getAllMetrics(): Promise<Metrics[]> {
    const result = await db
      .select()
      .from(metrics)
      .orderBy(desc(metrics.timestamp));
    return result;
  }

  async createMetrics(insertMetrics: InsertMetrics): Promise<Metrics> {
    const [metricsData] = await db
      .insert(metrics)
      .values(insertMetrics)
      .returning();
    return metricsData;
  }

  async getLatestPrediction(): Promise<Prediction | undefined> {
    const [result] = await db
      .select()
      .from(predictions)
      .orderBy(desc(predictions.createdAt))
      .limit(1);
    return result || undefined;
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db
      .insert(predictions)
      .values(insertPrediction)
      .returning();
    return prediction;
  }

  async getFrontierModels(): Promise<FrontierModel[]> {
    const result = await db
      .select()
      .from(frontierModels)
      .orderBy(desc(frontierModels.lastUpdated));
    return result;
  }

  async upsertFrontierModel(insertModel: InsertFrontierModel): Promise<FrontierModel> {
    // Check if model exists
    const existing = await db
      .select()
      .from(frontierModels)
      .where(eq(frontierModels.name, insertModel.name))
      .limit(1);

    if (existing.length > 0) {
      // Update existing model
      const [updated] = await db
        .update(frontierModels)
        .set({
          ...insertModel,
          lastUpdated: new Date(),
        })
        .where(eq(frontierModels.name, insertModel.name))
        .returning();
      return updated;
    } else {
      // Insert new model
      const [created] = await db
        .insert(frontierModels)
        .values(insertModel)
        .returning();
      return created;
    }
  }

  async getAllFrontierModels(): Promise<any[]> {
    try {
      const models = await db
        .select()
        .from(frontierModels)
        .orderBy(frontierModels.lastUpdated);
      
      return models.map(model => ({
        model: model.name,
        company: model.company,
        release_date: model.releaseDate,
        input_price: model.inputPrice,
        output_price: model.outputPrice,
        context_length: model.contextLength,
        speed_tokens_per_second: model.speed,
        latency_seconds: model.latency,
        quality_score: model.qualityScore,
        throughput_tokens_per_minute: model.throughput
      }));
    } catch (error) {
      console.error("Error fetching frontier models from database:", error);
      return [];
    }
  }

  async insertFrontierModels(models: any[]): Promise<void> {
    try {
      for (const model of models) {
        await this.upsertFrontierModel({
          name: model.model,
          company: model.company,
          releaseDate: model.release_date || "Unknown",
          singularityProximity: 75,
          capabilities: ["Text Generation"],
          reasoning: 75,
          creativity: 75,
          coding: 75,
          multimodal: 75,
          status: "active",
          inputPrice: model.input_price,
          outputPrice: model.output_price,
          speed: model.speed_tokens_per_second,
          latency: model.latency_seconds,
          contextLength: model.context_length,
          throughput: model.throughput_tokens_per_minute,
          qualityScore: model.quality_score
        });
      }
    } catch (error) {
      console.error("Error inserting frontier models:", error);
    }
  }

  async clearOldFrontierModels(): Promise<void> {
    // Clear models older than 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await db
      .delete(frontierModels)
      .where(eq(frontierModels.lastUpdated, oneDayAgo));
  }
}

export const storage = new DatabaseStorage();
