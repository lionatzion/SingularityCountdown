import { storage } from "./storage";
import { insertFrontierModelSchema } from "@shared/schema";

interface ArtificialAnalysisModel {
  model: string;
  company: string;
  release_date?: string;
  input_price?: number;
  output_price?: number;
  context_length?: number;
  speed_tokens_per_second?: number;
  latency_seconds?: number;
  quality_score?: number;
  throughput_tokens_per_minute?: number;
}

interface ArtificialAnalysisResponse {
  models: ArtificialAnalysisModel[];
}

export class ArtificialAnalysisService {
  private apiKey: string;
  private baseUrl = "https://artificialanalysis.ai";

  constructor() {
    this.apiKey = process.env.ARTIFICIAL_ANALYSIS_API_KEY || "";
  }

  async getFrontierModels() {
    const models = await this.getModels();
    return this.transformToFrontierModels(models);
  }

  async getCachedModels() {
    return await this.getFrontierModels();
  }

  async getModels(): Promise<ArtificialAnalysisModel[]> {
    try {
      // Check cache first
      const cachedModels = await storage.getAllFrontierModels();
      if (cachedModels && cachedModels.length > 0) {
        console.log("Returning models from cache.");
        return cachedModels;
      }

      console.log("Making API request to:", `${this.baseUrl}/api/v2/data/llms/models`);
      console.log("API key present:", !!this.apiKey);
      
      const response = await fetch(`${this.baseUrl}/api/v2/data/llms/models`, {
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
      });

      console.log("API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: ArtificialAnalysisResponse = await response.json();
      const modelsToStore = data.models || [];

      // Store data in Replit database
      if (modelsToStore.length > 0) {
        console.log(`Storing ${modelsToStore.length} models in the database.`);
        await storage.insertFrontierModels(modelsToStore);
      }

      return modelsToStore;
    } catch (error) {
      console.error("Error fetching or storing models:", error);
      // Fallback to cached data if API call fails
      try {
        const cachedModels = await storage.getAllFrontierModels();
        if (cachedModels && cachedModels.length > 0) {
          console.warn("API call failed, returning cached models.");
          return cachedModels;
        }
      } catch (cacheError) {
        console.error("Error accessing cache after API failure:", cacheError);
      }
      throw error;
    }
  }

  // Transform API data to match our frontend interface
  transformToFrontierModels(apiModels: ArtificialAnalysisModel[]) {
    return apiModels
      .filter(model => this.isFrontierModel(model))
      .map(model => ({
        name: model.model,
        company: model.company,
        releaseDate: model.release_date || "Unknown",
        singularityProximity: this.calculateSingularityProximity(model),
        capabilities: this.inferCapabilities(model),
        benchmarkScores: {
          reasoning: this.calculateReasoningScore(model),
          creativity: this.calculateCreativityScore(model),
          coding: this.calculateCodingScore(model),
          multimodal: this.calculateMultimodalScore(model),
        },
        status: this.determineStatus(model),
        pricing: {
          inputPrice: model.input_price,
          outputPrice: model.output_price,
        },
        performance: {
          speed: model.speed_tokens_per_second,
          latency: model.latency_seconds,
          contextLength: model.context_length,
          throughput: model.throughput_tokens_per_minute,
        },
        qualityScore: model.quality_score,
      }));
  }

  private isFrontierModel(model: ArtificialAnalysisModel): boolean {
    const frontierModels = [
      "gpt-4", "gpt-4o", "gpt-5", "o1", "o3",
      "claude-3", "claude-3.5", "claude-4",
      "gemini", "gemini-2.0", "gemini-pro",
      "llama-3", "llama-4", "command-r"
    ];

    return frontierModels.some(frontier =>
      model.model.toLowerCase().includes(frontier.toLowerCase())
    );
  }

  private calculateSingularityProximity(model: ArtificialAnalysisModel): number {
    // Calculate based on quality score, context length, and speed
    let score = 0;

    if (model.quality_score) {
      score += model.quality_score * 0.4; // Quality is 40% of proximity
    }

    if (model.context_length) {
      // Normalize context length (1M tokens = 30 points)
      score += Math.min((model.context_length / 1000000) * 30, 30);
    }

    if (model.speed_tokens_per_second) {
      // Normalize speed (100 tokens/sec = 20 points)
      score += Math.min((model.speed_tokens_per_second / 100) * 20, 20);
    }

    return Math.min(Math.round(score), 100);
  }

  private inferCapabilities(model: ArtificialAnalysisModel): string[] {
    const capabilities = ["Text Generation"];

    if (model.context_length && model.context_length > 100000) {
      capabilities.push("Long Context");
    }

    if (model.model.toLowerCase().includes("code") ||
        model.model.toLowerCase().includes("coding")) {
      capabilities.push("Code Generation");
    }

    if (model.model.toLowerCase().includes("vision") ||
        model.model.toLowerCase().includes("multimodal")) {
      capabilities.push("Multimodal");
    }

    if (model.quality_score && model.quality_score > 80) {
      capabilities.push("Advanced Reasoning");
    }

    return capabilities;
  }

  private calculateReasoningScore(model: ArtificialAnalysisModel): number {
    return model.quality_score ? Math.round(model.quality_score * 0.9) : 75;
  }

  private calculateCreativityScore(model: ArtificialAnalysisModel): number {
    return model.quality_score ? Math.round(model.quality_score * 0.8) : 70;
  }

  private calculateCodingScore(model: ArtificialAnalysisModel): number {
    const baseScore = model.quality_score ? model.quality_score * 0.85 : 72;
    return model.model.toLowerCase().includes("code") ?
      Math.min(Math.round(baseScore * 1.1), 100) : Math.round(baseScore);
  }

  private calculateMultimodalScore(model: ArtificialAnalysisModel): number {
    const baseScore = model.quality_score ? model.quality_score * 0.75 : 65;
    return model.model.toLowerCase().includes("vision") ||
           model.model.toLowerCase().includes("multimodal") ?
      Math.min(Math.round(baseScore * 1.2), 100) : Math.round(baseScore);
  }

  private determineStatus(model: ArtificialAnalysisModel): "active" | "preview" | "deprecated" {
    if (model.model.toLowerCase().includes("preview") ||
        model.model.toLowerCase().includes("beta")) {
      return "preview";
    }

    if (model.release_date) {
      const releaseYear = new Date(model.release_date).getFullYear();
      const currentYear = new Date().getFullYear();

      if (currentYear - releaseYear > 2) {
        return "deprecated";
      }
    }

    return "active";
  }
}