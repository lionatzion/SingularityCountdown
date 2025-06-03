import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsArticleSchema, insertMetricsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get latest AI news
  app.get("/api/news", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const news = await storage.getLatestNews(limit);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Fetch AI news from external API
  app.post("/api/news/fetch", async (req, res) => {
    try {
      const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;
      
      if (!NEWS_API_KEY) {
        res.status(500).json({ message: "News API key not configured" });
        return;
      }

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=artificial+intelligence+OR+machine+learning+OR+GPU+OR+neural+networks&sortBy=publishedAt&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const data = await response.json();
      const articles = data.articles || [];

      // Process and store articles
      const processedArticles = [];
      for (const article of articles.slice(0, 10)) {
        if (article.title && article.description && article.source?.name) {
          const newsArticle = {
            title: article.title,
            summary: article.description,
            source: article.source.name,
            url: article.url || "",
            imageUrl: article.urlToImage || null,
            category: "AI Research",
            impact: "Medium",
            publishedAt: new Date(article.publishedAt),
          };

          const validation = insertNewsArticleSchema.safeParse(newsArticle);
          if (validation.success) {
            const stored = await storage.createNewsArticle(validation.data);
            processedArticles.push(stored);
          }
        }
      }

      res.json({ message: `Fetched and stored ${processedArticles.length} articles`, articles: processedArticles });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch external news" });
    }
  });

  // Get latest metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getLatestMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Update metrics
  app.post("/api/metrics", async (req, res) => {
    try {
      const validation = insertMetricsSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid metrics data", errors: validation.error.errors });
        return;
      }

      const metrics = await storage.createMetrics(validation.data);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to create metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
