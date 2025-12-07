import { db } from "./db";
import { newsArticles, metrics, predictions, frontierModels } from "@shared/schema";

async function migrate() {
  try {
    console.log("Running database migrations...");
    console.log("Database URL:", process.env.DATABASE_URL ? "✓ Set" : "✗ Missing");

    // Test database connection first
    await db.execute(`SELECT 1`);
    console.log("Database connection successful");

    // Check if tables already exist to avoid unnecessary console output
    const tableExists = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'news_articles'
      );
    `);
    
    const tablesExist = (tableExists.rows[0] as any).exists;
    
    if (tablesExist) {
      console.log("Database tables already exist, skipping migration...");
      return;
    }

    // Create tables using Drizzle's CREATE TABLE IF NOT EXISTS functionality
    // This is a simple approach - in production you'd use proper migrations

    console.log("Creating frontier_models table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS frontier_models (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        release_date TEXT,
        singularity_proximity INTEGER NOT NULL,
        capabilities TEXT[] NOT NULL,
        benchmark_scores TEXT NOT NULL,
        status TEXT NOT NULL,
        pricing TEXT,
        performance TEXT,
        quality_score INTEGER,
        last_updated TIMESTAMP DEFAULT NOW() NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("Creating news_articles table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS news_articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        source TEXT NOT NULL,
        url TEXT NOT NULL,
        image_url TEXT,
        category TEXT NOT NULL,
        impact TEXT NOT NULL,
        published_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("Creating metrics table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS metrics (
        id SERIAL PRIMARY KEY,
        gpu_performance INTEGER NOT NULL,
        neural_capacity INTEGER NOT NULL,
        processing_speed INTEGER NOT NULL,
        ai_benchmarks INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("Creating predictions table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        model_version TEXT NOT NULL,
        predicted_date TIMESTAMP NOT NULL,
        confidence_score INTEGER NOT NULL,
        analysis_factors TEXT[] NOT NULL,
        raw_analysis TEXT NOT NULL,
        trend_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("Creating newsletter_subscriptions table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL
      );
    `);

    console.log("Database migration completed successfully!");

  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

export { migrate };