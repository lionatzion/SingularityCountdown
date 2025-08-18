import OpenAI from "openai";
import { type NewsArticle, type Metrics } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface PredictionAnalysis {
  predictedDate: Date;
  confidenceScore: number;
  analysisFactors: string[];
  rawAnalysis: string;
  trendData: {
    gpuGrowthRate: number;
    aiCapabilityGrowth: number;
    researchVelocity: number;
    investmentTrends: number;
    technicalBreakthroughs: number;
  };
}

export class MLPredictor {
  async analyzeSingularityPrediction(
    metrics: Metrics[],
    newsArticles: NewsArticle[]
  ): Promise<PredictionAnalysis> {
    const metricsData = this.prepareMetricsData(metrics);
    const newsAnalysis = await this.analyzeNewsData(newsArticles);
    
    const prompt = `You are an advanced AI system specializing in technological singularity prediction. Analyze the following data to predict when artificial intelligence will surpass human cognitive capabilities across all domains.

CURRENT METRICS DATA:
${JSON.stringify(metricsData, null, 2)}

NEWS ANALYSIS:
${newsAnalysis}

ANALYSIS REQUIREMENTS:
1. Predict the most likely singularity date based on exponential growth patterns
2. Provide confidence score (0-100) based on data quality and trend consistency
3. Identify key analysis factors influencing the prediction
4. Calculate growth rates for different technological domains
5. Consider breakthrough potential and research acceleration

IMPORTANT CONTEXT:
- Current GPU performance is growing exponentially (Moore's Law acceleration)
- AI research funding has increased 10x in the past 3 years
- Transformer models show consistent capability scaling with compute
- AGI research timelines from leading labs suggest 2027-2035 range
- Post-training techniques are rapidly improving model capabilities

Respond with JSON in this exact format:
{
  "predictedYear": number,
  "predictedMonth": number,
  "predictedDay": number,
  "confidenceScore": number,
  "analysisFactors": [
    "Primary factor 1",
    "Primary factor 2",
    "Primary factor 3",
    "Primary factor 4",
    "Primary factor 5"
  ],
  "rawAnalysis": "Detailed analysis explanation of prediction reasoning and methodology",
  "trendData": {
    "gpuGrowthRate": number,
    "aiCapabilityGrowth": number,
    "researchVelocity": number,
    "investmentTrends": number,
    "technicalBreakthroughs": number
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert AI researcher and technological forecasting specialist. Provide precise, data-driven predictions based on current technological trends and breakthrough patterns."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      predictedDate: new Date(result.predictedYear, result.predictedMonth - 1, result.predictedDay),
      confidenceScore: result.confidenceScore,
      analysisFactors: result.analysisFactors,
      rawAnalysis: result.rawAnalysis,
      trendData: result.trendData
    };
  }

  private prepareMetricsData(metrics: Metrics[]): any {
    if (metrics.length === 0) {
      // Use realistic baseline metrics for analysis
      return {
        currentGpuPerformance: 94587,
        neuralCapacity: 847,
        processingSpeed: 21,
        aiBenchmarks: 9458,
        dataPoints: 1,
        trend: "Insufficient historical data - using current baseline"
      };
    }

    const sorted = metrics.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const latest = sorted[sorted.length - 1];
    
    let growthRate = 0;
    if (sorted.length > 1) {
      const earliest = sorted[0];
      const timeSpan = (new Date(latest.timestamp).getTime() - new Date(earliest.timestamp).getTime()) / (1000 * 60 * 60 * 24 * 365); // years
      growthRate = timeSpan > 0 ? Math.pow(latest.gpuPerformance / earliest.gpuPerformance, 1 / timeSpan) - 1 : 0;
    }

    return {
      currentGpuPerformance: latest.gpuPerformance,
      neuralCapacity: latest.neuralCapacity,
      processingSpeed: latest.processingSpeed,
      aiBenchmarks: latest.aiBenchmarks,
      dataPoints: sorted.length,
      growthRate: growthRate,
      trend: growthRate > 0 ? "exponential_growth" : "stable"
    };
  }

  private async analyzeNewsData(articles: NewsArticle[]): Promise<string> {
    if (articles.length === 0) {
      return "No recent news data available for analysis";
    }

    const recentArticles = articles.slice(0, 10);
    const newsText = recentArticles.map(article => 
      `${article.title}: ${article.summary}`
    ).join('\n');

    const prompt = `Analyze these recent AI news articles and extract key insights for singularity prediction:

${newsText}

Summarize the key technological developments, breakthroughs, and trends that would impact AI capability growth and singularity timeline prediction.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an AI research analyst. Extract key insights from news that impact AI development timelines."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 500
    });

    return response.choices[0].message.content || "No analysis available";
  }
}