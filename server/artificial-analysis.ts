
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
  private baseUrl = "https://api.artificialanalysis.ai";

  constructor() {
    this.apiKey = process.env.ARTIFICIAL_ANALYSIS_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("ARTIFICIAL_ANALYSIS_API_KEY environment variable is required");
    }
  }

  async getModels(): Promise<ArtificialAnalysisModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: ArtificialAnalysisResponse = await response.json();
      return data.models || [];
    } catch (error) {
      console.error("Error fetching models from Artificial Analysis API:", error);
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
