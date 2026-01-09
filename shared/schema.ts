import { pgTable, text, serial, integer, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
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

export const frontierModels = pgTable("frontier_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  releaseDate: text("release_date"),
  singularityProximity: integer("singularity_proximity").notNull(),
  capabilities: text("capabilities").array().notNull(),
  benchmarkScores: text("benchmark_scores").notNull(), // JSON string
  status: text("status").notNull(),
  pricing: text("pricing"), // JSON string
  performance: text("performance"), // JSON string
  qualityScore: integer("quality_score"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
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

export const insertFrontierModelSchema = createInsertSchema(frontierModels).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertMetrics = z.infer<typeof insertMetricsSchema>;
export type Metrics = typeof metrics.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertFrontierModel = z.infer<typeof insertFrontierModelSchema>;
export type FrontierModel = typeof frontierModels.$inferSelect;

// Newsletter subscription schema
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertNewsletterSubscriptionSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

// Community predictions schema
export const communityPredictions = pgTable("community_predictions", {
  id: serial("id").primaryKey(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  predictedYear: integer("predicted_year").notNull(),
  predictedMonth: integer("predicted_month").notNull(),
  reasoning: text("reasoning").notNull(),
  confidenceLevel: varchar("confidence_level", { length: 20 }).notNull(),
  upvotes: integer("upvotes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommunityPredictionSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(100),
  predictedYear: z.number().min(2025).max(2100),
  predictedMonth: z.number().min(1).max(12),
  reasoning: z.string().min(10, "Please provide more detail").max(500),
  confidenceLevel: z.enum(["low", "medium", "high", "very_high"]),
});

export type InsertCommunityPrediction = z.infer<typeof insertCommunityPredictionSchema>;
export type CommunityPrediction = typeof communityPredictions.$inferSelect;
