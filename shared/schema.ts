import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  impact: text("impact").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  gpuPerformance: integer("gpu_performance").notNull(),
  neuralCapacity: integer("neural_capacity").notNull(),
  processingSpeed: integer("processing_speed").notNull(),
  aiBenchmarks: integer("ai_benchmarks").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  modelVersion: text("model_version").notNull(),
  predictedDate: timestamp("predicted_date").notNull(),
  confidenceScore: integer("confidence_score").notNull(), // 0-100
  analysisFactors: text("analysis_factors").array().notNull(),
  rawAnalysis: text("raw_analysis").notNull(),
  trendData: text("trend_data").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export const insertMetricsSchema = createInsertSchema(metrics).omit({
  id: true,
  timestamp: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertMetrics = z.infer<typeof insertMetricsSchema>;
export type Metrics = typeof metrics.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;
