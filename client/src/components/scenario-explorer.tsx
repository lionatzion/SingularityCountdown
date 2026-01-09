import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sliders, TrendingUp, Calendar, RotateCcw } from "lucide-react";

interface ScenarioParams {
  gpuGrowthRate: number;
  aiResearchFunding: number;
  breakthroughProbability: number;
  regulatoryFriction: number;
  talentAvailability: number;
}

const defaultParams: ScenarioParams = {
  gpuGrowthRate: 50,
  aiResearchFunding: 60,
  breakthroughProbability: 40,
  regulatoryFriction: 30,
  talentAvailability: 55
};

function calculatePrediction(params: ScenarioParams): { year: number; month: number; confidence: number } {
  const baseYear = 2031;
  const baseMonth = 6;
  
  const gpuImpact = (params.gpuGrowthRate - 50) * -0.03;
  const fundingImpact = (params.aiResearchFunding - 50) * -0.025;
  const breakthroughImpact = (params.breakthroughProbability - 50) * -0.04;
  const regulatoryImpact = (params.regulatoryFriction - 50) * 0.035;
  const talentImpact = (params.talentAvailability - 50) * -0.02;
  
  const totalYearShift = gpuImpact + fundingImpact + breakthroughImpact + regulatoryImpact + talentImpact;
  
  let predictedYear = baseYear + totalYearShift;
  let predictedMonth = baseMonth + Math.round((totalYearShift % 1) * 12);
  
  if (predictedMonth > 12) {
    predictedYear += 1;
    predictedMonth -= 12;
  } else if (predictedMonth < 1) {
    predictedYear -= 1;
    predictedMonth += 12;
  }
  
  const extremityPenalty = Object.values(params).reduce((acc, val) => {
    const deviation = Math.abs(val - 50);
    return acc + (deviation > 30 ? (deviation - 30) * 0.5 : 0);
  }, 0);
  
  const baseConfidence = 75;
  const confidence = Math.max(30, Math.min(95, baseConfidence - extremityPenalty));
  
  return {
    year: Math.round(predictedYear),
    month: Math.round(predictedMonth),
    confidence: Math.round(confidence)
  };
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ScenarioExplorer() {
  const [params, setParams] = useState<ScenarioParams>(defaultParams);
  
  const prediction = useMemo(() => calculatePrediction(params), [params]);
  
  const handleSliderChange = (key: keyof ScenarioParams, value: number[]) => {
    setParams(prev => ({ ...prev, [key]: value[0] }));
  };
  
  const resetToDefaults = () => {
    setParams(defaultParams);
  };
  
  const sliderConfigs = [
    {
      key: "gpuGrowthRate" as const,
      label: "GPU Performance Growth",
      description: "Rate of compute capability improvement",
      lowLabel: "Slow",
      highLabel: "Exponential"
    },
    {
      key: "aiResearchFunding" as const,
      label: "AI Research Funding",
      description: "Global investment in AI research",
      lowLabel: "Declining",
      highLabel: "Booming"
    },
    {
      key: "breakthroughProbability" as const,
      label: "Breakthrough Likelihood",
      description: "Probability of paradigm-shifting discoveries",
      lowLabel: "Unlikely",
      highLabel: "Likely"
    },
    {
      key: "regulatoryFriction" as const,
      label: "Regulatory Friction",
      description: "Government restrictions on AI development",
      lowLabel: "Minimal",
      highLabel: "Strict"
    },
    {
      key: "talentAvailability" as const,
      label: "Talent Availability",
      description: "AI researcher and engineer supply",
      lowLabel: "Scarce",
      highLabel: "Abundant"
    }
  ];

  return (
    <section className="mb-12">
      <Card className="glow-border gradient-bg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sliders className="w-6 h-6 text-neon-green" />
              <div>
                <CardTitle className="text-xl font-orbitron text-white dark:text-white">
                  What If? Scenario Explorer
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Adjust variables to see how they impact the singularity prediction
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="border-tech-purple/50 text-tech-purple hover:bg-tech-purple/20"
              data-testid="reset-scenario-button"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {sliderConfigs.map(config => (
                <div key={config.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        {config.label}
                      </label>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-tech-purple/20 text-tech-purple border-tech-purple/50 font-jetbrains">
                      {params[config.key]}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-20">{config.lowLabel}</span>
                    <Slider
                      value={[params[config.key]]}
                      onValueChange={(value) => handleSliderChange(config.key, value)}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                      data-testid={`slider-${config.key}`}
                    />
                    <span className="text-xs text-muted-foreground w-20 text-right">{config.highLabel}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="p-6 rounded-xl bg-gradient-to-br from-tech-purple/20 to-bright-pink/20 border border-tech-purple/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-bright-pink" />
                    <h3 className="font-semibold text-foreground">Predicted Date</h3>
                  </div>
                  <div className="text-4xl font-bold font-jetbrains text-foreground mb-2">
                    {monthNames[prediction.month - 1]} {prediction.year}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on your scenario parameters
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-br from-neon-green/20 to-tech-purple/20 border border-neon-green/30">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-neon-green" />
                    <h3 className="font-semibold text-foreground">Confidence Score</h3>
                  </div>
                  <div className="text-4xl font-bold font-jetbrains text-neon-green mb-2">
                    {prediction.confidence}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {prediction.confidence >= 70 
                      ? "High confidence scenario"
                      : prediction.confidence >= 50 
                        ? "Moderate uncertainty"
                        : "Highly speculative scenario"}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <p className="text-xs text-muted-foreground">
                    This interactive model demonstrates how different factors might influence AI development timelines. 
                    Extreme settings reduce prediction confidence as they represent less likely scenarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
