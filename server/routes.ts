import type { Express } from "express";
import { storage } from "./storage";
import { insertNewsArticleSchema, insertMetricsSchema, insertPredictionSchema, insertNewsletterSubscriptionSchema, insertCommunityPredictionSchema } from "@shared/schema";
import { MLPredictor } from "./ml-predictor";
import { ArtificialAnalysisService } from "./artificial-analysis";
import path from "path";

export async function registerRoutes(app: Express): Promise<void> {

  // Serve sitemap.xml (dynamic generation)
  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const currentDate = new Date().toISOString();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/dashboard</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/ai-models</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    res.send(sitemap);
  });

  // Serve robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    const robotsTxt = `# Block AI training bots except Google Search
User-agent: ChatGPT-User
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Bard
Disallow: /

User-agent: BingBot
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Google-Extended
Disallow: /

# Allow Google Search bot
User-agent: Googlebot
Allow: /

# Allow all other crawlers by default
User-agent: *
Allow: /

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`;
    res.send(robotsTxt);
  });

  // Serve favicon
  app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.resolve(import.meta.dirname, "..", "public", "favicon.svg"));
  });

  app.get("/favicon.svg", (req, res) => {
    res.type("image/svg+xml");
    res.sendFile(path.resolve(import.meta.dirname, "..", "public", "favicon.svg"));
  });
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
      if (!metrics) {
        // Return default metrics if none exist
        return res.json({
          id: 1,
          gpuPerformance: 94587,
          neuralCapacity: 847,
          processingSpeed: 21,
          aiBenchmarks: 9458,
          timestamp: new Date(),
        });
      }
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
      if (!prediction) {
        // Return default prediction if none exist
        return res.json({
          id: 1,
          modelVersion: "v1.0-gpt5",
          predictedDate: new Date("2031-06-15"),
          confidenceScore: 75,
          analysisFactors: ["Neuromorphic chip scalability", "Exponential GPU performance growth", "Increased AI research funding", "Transformer model scaling", "Biological computation integration"],
          rawAnalysis: "The technological singularity is predicted to occur in the early 2030s based on exponential AI capability growth.",
          trendData: JSON.stringify({ gpuGrowthRate: 1.5, aiCapabilityGrowth: 1.7, researchVelocity: 2, investmentTrends: 1.8, technicalBreakthroughs: 1.6 }),
          createdAt: new Date(),
        });
      }
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prediction" });
    }
  });

  // Get frontier models from Artificial Analysis API (with caching)
  app.get("/api/frontier-models", async (req, res) => {
    try {
      if (!process.env.ARTIFICIAL_ANALYSIS_API_KEY) {
        // Return fallback data if API key is not configured
        const fallbackModels = [
          {
            name: "GPT-5",
            company: "OpenAI",
            releaseDate: "2025-01-15",
            singularityProximity: 87,
            capabilities: ["Advanced Reasoning", "Multimodal", "Code Generation", "Scientific Research"],
            benchmarkScores: { reasoning: 95, creativity: 89, coding: 93, multimodal: 91 },
            status: "active",
            pricing: { inputPrice: 0.010, outputPrice: 0.030 },
            performance: { speed: 150, latency: 0.8, contextLength: 200000, throughput: 9000 }
          },
          {
            name: "Claude 3.5 Sonnet",
            company: "Anthropic",
            releaseDate: "2024-10-22",
            singularityProximity: 82,
            capabilities: ["Long Context", "Code Analysis", "Creative Writing", "Tool Use"],
            benchmarkScores: { reasoning: 91, creativity: 94, coding: 89, multimodal: 85 },
            status: "active",
            pricing: { inputPrice: 0.003, outputPrice: 0.015 },
            performance: { speed: 120, latency: 1.2, contextLength: 200000, throughput: 7200 }
          },
          {
            name: "Gemini 2.0 Flash",
            company: "Google",
            releaseDate: "2024-12-11",
            singularityProximity: 84,
            capabilities: ["Real-time Processing", "Multimodal", "Agent Actions", "Live API"],
            benchmarkScores: { reasoning: 88, creativity: 86, coding: 91, multimodal: 96 },
            status: "active",
            pricing: { inputPrice: 0.002, outputPrice: 0.008 },
            performance: { speed: 180, latency: 0.6, contextLength: 100000, throughput: 10800 }
          },
          {
            name: "Gemini 2.5 Pro",
            company: "Google",
            releaseDate: "2025-01-25",
            singularityProximity: 91,
            capabilities: ["Ultra Long Context", "Advanced Multimodal", "Scientific Research", "Agent Actions", "Code Generation"],
            benchmarkScores: { reasoning: 97, creativity: 89, coding: 95, multimodal: 98 },
            status: "preview",
            pricing: { inputPrice: 0.012, outputPrice: 0.035 },
            performance: { speed: 160, latency: 1.0, contextLength: 1000000, throughput: 9600 }
          },
          {
            name: "Grok 4",
            company: "xAI",
            releaseDate: "2025-01-18",
            singularityProximity: 85,
            capabilities: ["Real-time Information", "Wit & Humor", "Advanced Reasoning", "Multimodal", "X Integration"],
            benchmarkScores: { reasoning: 90, creativity: 95, coding: 87, multimodal: 86 },
            status: "active",
            pricing: { inputPrice: 0.005, outputPrice: 0.020 },
            performance: { speed: 130, latency: 1.1, contextLength: 150000, throughput: 7800 }
          }
        ];

        res.json(fallbackModels);
        return;
      }

      const artificialAnalysis = new ArtificialAnalysisService();
      const apiModels = await artificialAnalysis.getModels();
      const frontierModels = artificialAnalysis.transformToFrontierModels(apiModels);

      res.json(frontierModels);
    } catch (error: any) {
      console.error("Error fetching frontier models:", error);

      // Return fallback data on error
      const fallbackModels = [
        {
          name: "GPT-5",
          company: "OpenAI", 
          releaseDate: "2025-01-15",
          singularityProximity: 87,
          capabilities: ["Advanced Reasoning", "Multimodal", "Code Generation", "Scientific Research"],
          benchmarkScores: { reasoning: 95, creativity: 89, coding: 93, multimodal: 91 },
          status: "active",
          pricing: { inputPrice: 0.010, outputPrice: 0.030 }
        }
      ];

      res.json(fallbackModels);
    }
  });

  // AI Models endpoint
  app.get("/api/ai-models", async (req, res) => {
    try {
      const artificialAnalysis = new ArtificialAnalysisService();
      const models = await artificialAnalysis.getFrontierModels();
      res.json(models);
    } catch (error: any) {
      console.error("Error fetching AI models:", error);
      res.status(500).json({ 
        message: "Failed to fetch AI models",
        error: error.message 
      });
    }
  });

  // Test AI API connection
  app.get("/api/test-ai-api", async (req, res) => {
    try {
      const artificialAnalysis = new ArtificialAnalysisService();
      const models = await artificialAnalysis.getModels();
      res.json({ 
        success: true, 
        modelCount: models.length,
        sampleModel: models[0] || null 
      });
    } catch (error: any) {
      console.error("API test failed:", error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Generate new ML prediction (with 24-hour caching)
  app.post("/api/predictions/generate", async (req, res) => {
    try {
      // Check for force refresh parameter
      const forceRefresh = req.body?.forceRefresh === true;
      
      // Check if we have a recent prediction (less than 24 hours old)
      if (!forceRefresh) {
        const latestPrediction = await storage.getLatestPrediction();
        if (latestPrediction && latestPrediction.createdAt) {
          const predictionAge = Date.now() - new Date(latestPrediction.createdAt).getTime();
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (predictionAge < twentyFourHours) {
            // Return cached prediction
            const trendData = typeof latestPrediction.trendData === 'string' 
              ? JSON.parse(latestPrediction.trendData) 
              : latestPrediction.trendData;
              
            return res.json({
              prediction: latestPrediction,
              analysis: {
                predictedDate: latestPrediction.predictedDate,
                confidenceScore: latestPrediction.confidenceScore,
                analysisFactors: latestPrediction.analysisFactors,
                rawAnalysis: latestPrediction.rawAnalysis,
                trendData: trendData
              },
              cached: true,
              cacheExpiresAt: new Date(new Date(latestPrediction.createdAt).getTime() + twentyFourHours)
            });
          }
        }
      }
      
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
        modelVersion: "v1.0-gpt5",
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
        analysis: analysis,
        cached: false
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

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validation = insertNewsletterSubscriptionSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid email address", errors: validation.error.errors });
        return;
      }

      const subscription = await storage.subscribeToNewsletter(validation.data);
      res.json({ message: "Successfully subscribed to newsletter!", subscription: { email: subscription.email } });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Community Predictions endpoints
  app.get("/api/community-predictions", async (req, res) => {
    try {
      const predictions = await storage.getCommunityPredictions(50);
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching community predictions:", error);
      res.status(500).json({ message: "Failed to fetch community predictions" });
    }
  });

  app.get("/api/community-predictions/stats", async (req, res) => {
    try {
      const stats = await storage.getCommunityPredictionStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching community prediction stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.post("/api/community-predictions", async (req, res) => {
    try {
      const validation = insertCommunityPredictionSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid prediction data", errors: validation.error.errors });
        return;
      }

      const prediction = await storage.createCommunityPrediction(validation.data);
      res.json(prediction);
    } catch (error) {
      console.error("Error creating community prediction:", error);
      res.status(500).json({ message: "Failed to create prediction" });
    }
  });

  app.post("/api/community-predictions/:id/upvote", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid prediction ID" });
        return;
      }

      const updated = await storage.upvoteCommunityPrediction(id);
      if (!updated) {
        res.status(404).json({ message: "Prediction not found" });
        return;
      }

      res.json(updated);
    } catch (error) {
      console.error("Error upvoting prediction:", error);
      res.status(500).json({ message: "Failed to upvote prediction" });
    }
  });

}