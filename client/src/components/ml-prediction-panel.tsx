import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Brain, TrendingUp, Calendar, Target } from "lucide-react";
import { type Prediction } from "@shared/schema";

interface PredictionAnalysis {
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

interface GeneratePredictionResponse {
  prediction: Prediction;
  analysis: PredictionAnalysis;
}

export default function MLPredictionPanel() {
  const { toast } = useToast();
  const [showAnalysis, setShowAnalysis] = useState(false);

  const { data: latestPrediction, isLoading } = useQuery({
    queryKey: ["/api/predictions/latest"],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { mutate: generatePrediction, isPending } = useMutation({
    mutationFn: () => apiRequest("POST", "/api/predictions/generate"),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions/latest"] });
      toast({
        title: "ML Prediction Generated",
        description: `New prediction: ${new Date(data.prediction.predictedDate).toLocaleDateString()} (${data.prediction.confidenceScore}% confidence)`,
      });
    },
    onError: (error) => {
      console.error("Failed to generate prediction:", error);
      toast({
        title: "Prediction Generation Failed",
        description: "Unable to generate ML prediction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const parseTrendData = (trendDataString: string) => {
    try {
      return JSON.parse(trendDataString);
    } catch {
      return {
        gpuGrowthRate: 0,
        aiCapabilityGrowth: 0,
        researchVelocity: 0,
        investmentTrends: 0,
        technicalBreakthroughs: 0
      };
    }
  };

  return (
    <section className="mb-12">
      <Card className="glow-border gradient-bg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-bright-pink" />
              <div>
                <CardTitle className="text-xl font-orbitron text-white">
                  AI-Powered Singularity Prediction
                </CardTitle>
                <CardDescription className="text-light-grey/70">
                  Machine learning analysis of technological trends and breakthrough patterns
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => generatePrediction()}
              disabled={isPending}
              className="bg-bright-pink hover:bg-bright-pink/80 text-dark-space font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate New Prediction
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-tech-purple mb-4" />
              <p className="text-light-grey/60">Loading ML prediction...</p>
            </div>
          ) : latestPrediction && typeof latestPrediction === 'object' && 'predictedDate' in latestPrediction ? (
            <>
              {/* Main Prediction Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-tech-purple/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-tech-purple" />
                    <h3 className="font-inter font-semibold text-white">Predicted Date</h3>
                  </div>
                  <div className="text-2xl font-jetbrains font-bold text-white">
                    {formatDate((latestPrediction as any).predictedDate)}
                  </div>
                  <div className="text-xs text-light-grey mt-1">
                    Model: {(latestPrediction as any).modelVersion}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-neon-green/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-neon-green" />
                    <h3 className="font-inter font-semibold text-white">Confidence Score</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-jetbrains font-bold text-neon-green">
                      {(latestPrediction as any).confidenceScore}%
                    </div>
                    <Progress 
                      value={(latestPrediction as any).confidenceScore} 
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-bright-pink/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-bright-pink" />
                    <h3 className="font-inter font-semibold text-white">Analysis Factors</h3>
                  </div>
                  <div className="text-lg font-jetbrains font-bold text-white mb-2">
                    {(latestPrediction as any).analysisFactors?.length || 0} Key Factors
                  </div>
                  <div className="text-xs text-light-grey">
                    Generated {new Date((latestPrediction as any).createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Analysis Factors */}
              <div>
                <h3 className="text-lg font-inter font-semibold text-white mb-3">Key Analysis Factors</h3>
                <div className="flex flex-wrap gap-2">
                  {((latestPrediction as any).analysisFactors || []).map((factor: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-slate-800/50 text-white border-slate-600/50 hover:bg-slate-700/50"
                    >
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Trend Analysis */}
              {(latestPrediction as any).trendData && (
                <div>
                  <h3 className="text-lg font-inter font-semibold text-white mb-3">Trend Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(parseTrendData((latestPrediction as any).trendData)).map(([key, value]) => (
                      <div key={key} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50">
                        <div className="text-sm text-light-grey mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-lg font-jetbrains font-bold text-white">
                          {typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Analysis */}
              <div>
                <Button
                  variant="outline"
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="mb-3 border-slate-600/50 text-white hover:bg-slate-800/50 hover:text-white"
                >
                  {showAnalysis ? 'Hide' : 'Show'} Detailed Analysis
                </Button>
                
                {showAnalysis && (
                  <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-600/30">
                    <div className="text-sm text-white leading-relaxed whitespace-pre-wrap font-inter">
                      {(latestPrediction as any).rawAnalysis}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto text-bright-pink mb-4" />
              <h3 className="text-lg font-inter font-semibold text-white mb-2">
                No ML Predictions Available
              </h3>
              <p className="text-light-grey/70 mb-4">
                Generate your first AI-powered singularity prediction based on current data trends
              </p>
              <Button
                onClick={() => generatePrediction()}
                disabled={isPending}
                className="bg-bright-pink hover:bg-bright-pink/80 text-dark-space font-semibold"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate First Prediction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}