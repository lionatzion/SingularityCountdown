import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsArticleSchema, insertMetricsSchema, insertPredictionSchema } from "@shared/schema";
import { MLPredictor } from "./ml-predictor";

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
  // Add cache for rate limiting
  let lastFetchTime = 0;
  const FETCH_COOLDOWN = 30000; // 30 seconds between fetches

  app.post("/api/news/fetch", async (req, res) => {
    try {
      const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;
      
      if (!NEWS_API_KEY) {
        res.status(500).json({ message: "News API key not configured" });
        return;
      }

      const now = Date.now();
      if (now - lastFetchTime < FETCH_COOLDOWN) {
        // Return existing articles if within cooldown period
        const existingArticles = await storage.getLatestNews(10);
        res.json({ 
          message: "Using cached articles (rate limit protection)", 
          articlesStored: 0,
          duplicatesSkipped: 0,
          articles: existingArticles 
        });
        return;
      }

      lastFetchTime = now;

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=artificial+intelligence+OR+machine+learning+OR+GPU+OR+neural+networks&sortBy=publishedAt&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - return existing articles
          const existingArticles = await storage.getLatestNews(10);
          res.json({ 
            message: "Rate limited - using existing articles", 
            articlesStored: 0,
            duplicatesSkipped: 0,
            articles: existingArticles 
          });
          return;
        }
        throw new Error(`News API error: ${response.status}`);
      }

      const data = await response.json();
      const articles = data.articles || [];

      // Process and store articles
      const processedArticles = [];
      const skippedDuplicates = [];
      
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
            try {
              const stored = await storage.createNewsArticle(validation.data);
              processedArticles.push(stored);
            } catch (error: any) {
              // Handle duplicate articles gracefully
              if (error.message?.includes('duplicate') || error.code === '23505') {
                skippedDuplicates.push(article.title);
              } else {
                console.error('Error storing article:', error);
              }
            }
          }
        }
      }

      const message = processedArticles.length > 0 
        ? `Fetched and stored ${processedArticles.length} new articles` 
        : "No new articles found (all were duplicates)";
      
      res.json({ 
        message, 
        newArticles: processedArticles.length,
        duplicatesSkipped: skippedDuplicates.length,
        articles: processedArticles 
      });
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

  // Get latest ML prediction
  app.get("/api/predictions/latest", async (req, res) => {
    try {
      const prediction = await storage.getLatestPrediction();
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prediction" });
    }
  });

  // Generate new ML prediction
  app.post("/api/predictions/generate", async (req, res) => {
    try {
      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        res.status(500).json({ 
          message: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." 
        });
        return;
      }

      const predictor = new MLPredictor();
      
      // Get all available data for analysis
      const allMetrics = await storage.getAllMetrics();
      const recentNews = await storage.getLatestNews(20);
      
      // Generate ML prediction
      const analysis = await predictor.analyzeSingularityPrediction(allMetrics, recentNews);
      
      // Store the prediction
      const predictionData = {
        modelVersion: "v1.0-gpt4o",
        predictedDate: analysis.predictedDate,
        confidenceScore: analysis.confidenceScore,
        analysisFactors: analysis.analysisFactors,
        rawAnalysis: analysis.rawAnalysis,
        trendData: JSON.stringify(analysis.trendData)
      };

      const validation = insertPredictionSchema.safeParse(predictionData);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid prediction data", errors: validation.error.errors });
        return;
      }

      const storedPrediction = await storage.createPrediction(validation.data);
      
      res.json({
        prediction: storedPrediction,
        analysis: analysis
      });
    } catch (error: any) {
      console.error("Error generating prediction:", error);
      
      let errorMessage = "Failed to generate prediction";
      let statusCode = 500;
      
      // Handle OpenAI API specific errors
      if (error?.status === 401 || error?.message?.includes("API key")) {
        errorMessage = "OpenAI API key is invalid or not configured";
        statusCode = 401;
      } else if (error?.status === 429) {
        errorMessage = "OpenAI API rate limit exceeded";
        statusCode = 429;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      res.status(statusCode).json({ message: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
